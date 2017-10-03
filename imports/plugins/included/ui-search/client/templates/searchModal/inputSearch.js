import { Template } from "meteor/templating";
import { ProductSearch } from "/lib/collections";

Template.searchInput.helpers({
  settings() {
    return {
      position: "bottom",
      limit: 1,
      rules: [
        {
          token: "",
          collection: ProductSearch,
          field: "title",
          options: "i",
          matchAll: true,
          noMatchTemplate: Template.searchNotFound
        }
      ]
    };
  },
  productsTab() {
    return Session.get("currentTab") === "products";
  }
});
