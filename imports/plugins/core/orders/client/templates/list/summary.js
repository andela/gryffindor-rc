import { Template } from "meteor/templating";
import { Logger } from "/client/api";
import { NumericInput } from "/imports/plugins/core/ui/client/components";
import { Streamy } from "meteor/yuukan:streamy";

Template.ordersListSummary.onCreated(function () {
  this.state = new ReactiveDict();
  this.autorun(() => {
    this.state.set("order", Template.currentData().order);
  });
});

/**
 * ordersListSummary helpers
 *
 * @returns paymentInvoice
 */
Template.ordersListSummary.helpers({
  invoice() {
    return this.invoice;
  },

  numericInputProps(value) {
    const { currencyFormat } = Template.instance().data;

    return {
      component: NumericInput,
      value,
      format: currencyFormat,
      isEditing: false
    };
  },
  showCancelButton() {
    return !(this.order.workflow.status === "canceled"
      || this.order.workflow.status === "coreOrderWorkflow/completed");
  }
});
/**
  * ordersListSummary events
  */
Template.ordersListSummary.events({
  /**
  * Submit form
  * @param  {Event} event - Event object
  * @param  {Template} instance - Blaze Template
  * @return {void}
  */
  "click button[name=cancel]"(event, instance) {
    event.stopPropagation();
    const order = instance.state.get("order");
    Alerts.alert({
      title: "Are you sure you want to cancel this order.",
      showCancelButton: true,
      confirmButtonText: "Cancel Order"
    }, (isConfirm) => {
      if (isConfirm) {
        Meteor.call("orders/cancelOrder", order, (error) => {
          if (error) {
            Logger.warn(error);
          }
        });
        Streamy.broadcast("cancel order", { data: "A user has cancelled an order" });
        const timeout = setTimeout(() => {
          Alerts.toast("You order was sussessfully cancelled", "success");
          clearTimeout(timeout);
        }, 3000);
      }
    });
  }
});
