import { Template } from "meteor/templating";
import { Session } from "meteor/session";

Template.searchInput.helpers({
  getCurrentTab() {
    let productTab;
    if (Session.get("currentTab") === "products") {
      productTab = true;
      console.log(productTab, "<------");
    }
  }
});

