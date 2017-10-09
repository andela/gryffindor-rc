/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Random } from "meteor/random";
import { AutoForm } from "meteor/aldeed:autoform";
import { Cart } from "/lib/collections";
import { Paystack } from "../../lib/api";
import { PaystackPayment } from "../../lib/collections/schemas";

import "./paystack.html";
import "../../lib/api/paystackApi";

let submitting = false;

function uiEnd(template, buttonText) {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
}

function paymentAlert(errorMessage) {
  return $("#paystackPaymentForm").find(".alert").removeClass("hidden")
    .text(errorMessage || "There was an error. Please check the information you entered");
}

function hidePaymentAlert() {
  return $(".alert").addClass("hidden").text("");
}

function handlePaystackSubmitError(error) {
  const serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  } else if (error) {
    return paymentAlert("Oops! " + error, null, 4);
  }
}


Template.paystackPaymentForm.helpers({
  PaystackPayment() {
    return PaystackPayment;
  }
});

AutoForm.addHooks("paystack-payment-form", {
  onSubmit: function (doc) {
    submitting = true;
    hidePaymentAlert();
    const template = this.template;
    Meteor.call("paystack/keys", (err, keys) => {
      const cart = Cart.findOne();
      const amount = Math.round(cart.cartTotal()) * 100;
      const key = keys.public;
      const details = {
        key,
        name: doc.payerName,
        email: doc.payerEmail,
        reference: Random.id(),
        amount,
        currency: "NGN",
        callback(response) {
          const secret = keys.secret;
          const reference = response.reference;
          if (reference) {
            Paystack.verify(reference, secret, (error, res) => {
              if (!error) {
                const transaction = res.data;
                const paymentMethod = {
                  processor: "Paystack",
                  storedCard: transaction.authorization.card_type,
                  transactionId: transaction.reference,
                  currency: transaction.currency,
                  amount: transaction.amount / 100,
                  status: "passed",
                  mode: "authorize",
                  createdAt: new Date(),
                  transactions: []
                };
                Alerts.toast("Transaction successful");
                paymentMethod.transactions.push(transaction.authorization);
                Meteor.call("cart/submitPayment", paymentMethod);
              } else {
                handlePaystackSubmitError(error);
                uiEnd(template, "Please try again");
              }
            });
          }
        },
        onClose() {
          uiEnd(template, "Complete payment");
        }
      };
      try {
        PaystackPop.setup(details).openIframe();
      } catch (error) {
        handlePaystackSubmitError(template, error);
        uiEnd(template, "Complete payment");
      }
    });
  },
  beginSubmit: function () {
    this.template.$(":input").attr("disabled", true);
    this.template.$("#btn-complete-order").text("Submitting ");
    return this.template.$("#btn-processing").removeClass("hidden");
  },
  endSubmit: function () {
    if (!submitting) {
      return uiEnd(this.template, "Complete your order");
    }
  }
});
