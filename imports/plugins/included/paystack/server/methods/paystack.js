import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";

Meteor.methods({
  "paystack/keys"() {
    const paystack = Collections.Packages.findOne({
      name: "paystack"
    });
    return {
      public: paystack.settings.publicKey,
      secret: paystack.settings.secretKey
    };
  }
});
