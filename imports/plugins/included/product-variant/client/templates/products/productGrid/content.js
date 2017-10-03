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
    const countArr = [];
    for (let i = 0; i < rating; ++i) {
      countArr.push({});
    }
    return countArr;
  }
});
