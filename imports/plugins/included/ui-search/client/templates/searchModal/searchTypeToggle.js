import { Template } from "meteor/templating";
import { Session } from "meteor/session";

Template.searchTypeToggle.events({
  "click .search-type-option": (event) => {
    const tab = event.target.dataset.eventValue;
    Session.set("currentTab", tab);
    console.log("Current tab:", Session.get("currentTab"));
  }
});

