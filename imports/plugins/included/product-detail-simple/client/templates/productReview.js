import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import { Reviews } from "/lib/collections";
import { Products } from "/lib/collections";
import "./productReview.html";

const review = {};
Template.submitReview.events({
  "click .stars": () => {
    const rating = $("#rating").data("userrating");
    review.rating = rating;
  },
  "click #submit": () => {
    review.comment = document.getElementById("comment").value;
    if (review.comment === "") {
      return Alerts.toast("Comment cannot be empty", "error");
    }
    this.productId = () => Reaction.Router.getParam("handle");
    review.productId = Products.findOne(this.productId)._id;
    try {
      review.username = Meteor.user().username || Meteor.user().emails[0].address;
      review.dateCreated = new Date;
      Meteor.call("insert/review", review, function (error) {
        if (error) {
          return error;
        }
      });
      document.getElementById("comment").value = "";
    } catch (error) {
      Alerts.toast("You need to sign in to post a review", "error");
    }
  }
});

Template.displayReviews.helpers({
  reviews: () => {
    this.productId = () => Reaction.Router.getParam("handle");
    const productId = Products.findOne(this.productId)._id;
    Meteor.subscribe("Reviews");
    return Reviews.find({ productId: productId }).fetch();
  }
});

