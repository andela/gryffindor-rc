const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");
const userDo = require("../../../lib/basic-user-actions.js");
const shopUser = require("../../../lib/user-shop-actions");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Paystack integration test", function () {
  it("should allow a user pay for goods using paystack", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));

    browser.windowHandleFullscreen();
    browser.pause(2000);
    browser.waitForExist(".product-grid");
    userDo.UserActions.refreshShop();
    browser.click(eleMap.product);
    browser.pause(5000);
    browser.scroll(0, 250);
    browser.waitForEnabled(eleMap.red_option, 5000);
    browser.click(eleMap.red_option);
    browser.waitForEnabled(".add-to-cart-text", 5000);
    browser.click(".add-to-cart-text");

    browser.waitForEnabled(eleMap.checkout_btn, 2000);
    browser.click(eleMap.checkout_btn);
    browser.pause(5000);
    browser.waitForEnabled(eleMap.continue_as_guest, 5000);
    browser.click(eleMap.continue_as_guest);
    shopUser.userAddress();

    // free shipping option
    browser.click(eleMap.free_shipping);
    browser.pause(5000);
    browser.waitForEnabled("//span[text()='Paystack']", 3000);
    browser.click("//span[text()='Paystack']");
    shopUser.paystackPaymentInfo();
    browser.pause(2000);
    browser.waitForEnabled(eleMap.paystack_complete_order_btn, 3000);
    browser.click(eleMap.paystack_complete_order_btn);
    browser.pause(5000);

    // paystack frame
    const frameName = browser.selectorExecuteAsync("//iframe", function (frames, message, callback) {
      const paystackIframe = document.getElementsByTagName("iframe");
      const IframeName = paystackIframe[0].name;
      callback(IframeName);
    }, " iframe on the page");
    browser.pause(5000);
    browser.frame(frameName);
    browser.pause(5000);

    browser.setValue(getId.customRetId(eleIds.cardnumber_id), "4084 0840 8408 4081");
    browser.setValue(getId.customRetId(eleIds.expire_id), "01 / 20");
    browser.setValue(getId.customRetId(eleIds.cvv_id), "408");
    browser.pause(5000);
    browser.click("#pay-btn");
    browser.pause(10000);
    expect(browser.getAttribute("div", "order-item")).to.exist;
  });
});
