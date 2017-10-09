import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Packages } from "/lib/collections";
import { PaystackPackageConfig } from "../../lib/collections/schemas";

import "./paystack.html";


Template.paystackPaymentSettings.helpers({
  PaystackPackageConfig() {
    return PaystackPackageConfig;
  },
  packageData() {
    return Packages.findOne({
      name: "paystack",
      shopId: Reaction.getShopId()
    });
  }
});


Template.paystack.helpers({
  packageData() {
    return Packages.findOne({
      name: "paystack",
      shopId: Reaction.getShopId()
    });
  }
});

Template.paystack.events({
  "click [data-event-action=showPaystackSettings]": function () {
    Reaction.showActionView();
  }
});

AutoForm.hooks({
  "paystack-update-form": {
    onSuccess() {
      Alerts.removeSeen();
      Alerts.add("Paystack Payment Method settings saved.", "success");
    },
    onError(operation, error) {
      Alerts.removeSeen();
      Alerts.add("Paystack Payment Method settings update failed. " + error, "danger");
    }
  }
});
