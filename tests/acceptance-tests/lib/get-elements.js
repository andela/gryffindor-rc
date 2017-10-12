"use strict";

module.exports = {
  getElementByXpath: function (path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  },
  getElementById: function (ele) {
    const grabElement = browser.execute(function (ele) {
      const elementStr = ele;
      const elementId = '[id^="' + elementStr + '-"]';
      return "#" + document.querySelector(elementId).id;
    }, ele);
    return grabElement;
  },
  retId: function (element) {
    return this.getElementById(element).value;
  },
  customGetElementById: function (element) {
    const grabElement = browser.execute(function (element) {
      const elementStr = element;
      return "#" + elementStr;
    }, element);
    return grabElement;
  },
  customRetId: function (element) {
    return this.customGetElementById(element).value;
  }
};
