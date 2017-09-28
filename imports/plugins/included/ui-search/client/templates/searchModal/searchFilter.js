import { Session } from "meteor/session";
import { Template } from "meteor/templating";

Template.sortByRange.events({
  "change #sort-value": function (event) {
    Session.set("sortValue", event.target.value);
  }
});
