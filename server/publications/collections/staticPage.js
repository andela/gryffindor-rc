import { StaticPages } from "../../../lib/collections/collections";
import { Meteor } from "meteor/meteor";

Meteor.publish("StaticPages", function () {
  return StaticPages.find({
    pageOwner: this.userId
  });
});

Meteor.publish("viewPages", function () {
  return StaticPages.find();
});
