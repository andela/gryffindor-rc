import { SimpleSchema } from "meteor/aldeed:simple-schema";

/**
 * Reviews Schema
 */
export const Reviews = new SimpleSchema({
  productId: {
    type: String,
    optional: false
  },
  username: {
    type: String,
    optional: false
  },
  rating: {
    type: Number,
    optional: false
  },
  comment: {
    type: String,
    optional: false
  },
  dateCreated: {
    type: Date,
    optional: false
  }
});
