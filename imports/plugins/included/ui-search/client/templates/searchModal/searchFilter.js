import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import _ from "underscore";

Template.searchFilter.helpers({
  getBrands(products) {
    return _.uniq(_.pluck(products, "vendor"));
  }
});

Template.searchFilter.events({
  "change #filter-by-price": function (event) {
    Session.set("filterPrice", event.target.value);
  },
  "change #filter-by-brand": function (event) {
    Session.set("filterBrand", event.target.value);
  },
  "change #filter-by-latest": function (event) {
    Session.set("filterLatest", event.target.value);
  }
});

Template.sortByRange.events({
  "change #sort-value": function (event) {
    Session.set("sortValue", event.target.value);
  }
});
