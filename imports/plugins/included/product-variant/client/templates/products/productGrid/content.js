/**
 * gridContent helpers
 */

Template.gridContent.helpers({
  displayPrice: function () {
    if (this.price && this.price.range) {
      return this.price.range;
    }
  },
  ratings: function (rating) {
    const countArr = Array(rating).fill({});
    return countArr;
  }
});
