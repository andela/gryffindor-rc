import Reaction from "/server/api/core";
import {
  Accounts,
  Cart,
  Shops,
  Products,
  Orders,
  Inventory,
  Emails,
  Shipping,
  Discounts } from "/lib/collections/collections";

const isPermitted = (user, role) => {
  return user.roles[Reaction.getShopId()].includes(role);
};

export default () => {
  const api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true,
    defaultHeaders: {
      "Content-Type": "application/json"
    },
    version: "v1"
  });

  const apiOptions = (Collection) => {
    return {
      routeOptions: {
        authRequired: true
      },

      endpoints: {
        getAll: {
          action() {
            const allRecords = Collection.find().fetch();
            return {
              data: allRecords
            };
          }
        },

        get: {
          action() {
            if (isPermitted(this.user, "admin") ||
              isPermitted(this.user, "guest") ||
              isPermitted(this.user, "owner")) {
              const records = Collection.findOne({ _id: this.urlParams.id });
              if (!records) {
                return {
                  statusCode: 404,
                  message: "Record does not exist"
                };
              }
              return {
                data: records
              };
            }
          }
        },

        post: {
          action() {
            if (!(isPermitted(this.user, "admin")) ||
              isPermitted(this.user, "owner")) {
              return {
                statusCode: 401,
                message: "You do not have permission to add a record"
              };
            }
            if (isPermitted(this.user, "admin") ||
              isPermitted(this.user, "owner")) {
              const insertedData = Collection.insert(this.bodyParams);
              if (!insertedData) {
                return {
                  statusCode: 400,
                  message: "Record addition was not succesful"
                };
              }
              return {
                statusCode: 201,
                data: insertedData
              };
            }
          }
        },

        delete: {
          action() {
            if (!(isPermitted(this.user, "admin")) && isPermitted(this.user, "guest")) {
              return {
                statusCode: 401,
                message: "You do not have permission to delete a record"
              };
            }
            if (isPermitted(this.user, "admin") || isPermitted(this.user, "owner")) {
              if (Collection._name === "Products") {
                const item = Collection.findOne(this.urlParams.id);
                if (!item) {
                  return {
                    statusCode: 404,
                    message: "Record does not exist"
                  };
                }
                const updatedCollection = Collection.upsert({ _id: this.urlParams.id }, {
                  $set: { isDeleted: true }
                });
                return {
                  statusCode: 204,
                  message: "Product has been successfully archived",
                  data: updatedCollection
                };
              }
              const item = Collection.findOne(this.urlParams.id);
              if (!item) {
                return {
                  statusCode: 404,
                  message: "Record does not exist"
                };
              }
              const updatedCollection = Collection.remove({ _id: this.urlParams.id });
              return {
                statusCode: 204,
                message: "Record was successfully deleted",
                data: updatedCollection
              };
            }
          }
        }
      }
    };
  };

  api.addCollection(Accounts, apiOptions(Accounts));
  api.addCollection(Products, apiOptions(Products));
  api.addCollection(Shops, apiOptions(Shops));
  api.addCollection(Orders, apiOptions(Orders));
  api.addCollection(Inventory, apiOptions(Inventory));
  api.addCollection(Cart, apiOptions(Cart));
  api.addCollection(Shipping, apiOptions(Shipping));
  api.addCollection(Emails, apiOptions(Emails));
  api.addCollection(Discounts, apiOptions(Discounts));
};
