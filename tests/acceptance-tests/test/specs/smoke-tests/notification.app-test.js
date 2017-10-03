"use strict";

const yaml = require("js-yaml");
const fs = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");
const dotenv = require("dotenv");

dotenv.config();
beforeEach(() => {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Ordering product test", () => {
  xit("should display success message to the user after successful order", () => {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const guestEmail = process.env.GUEST_EMAIL || 'wesumeh@gmail.com';
    const guestPw = process.env.GUEST_PASSWORD || 'derico';

    browser.waitForExist(".product-grid");
    browser.click(eleMap.login_dropdown_btn);
    browser.waitForExist(eleMap.login_btn);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), guestEmail);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), guestPw);
    browser.click(eleMap.login_btn);

    browser.click(".brand");
    browser.pause("6000");
    browser.click("#BCTMZ6HTxFSppJESk");
    browser.pause("6000");
    browser.scroll(0, 300);
    browser.pause("4000");
    browser.click(eleMap.red_option);
    browser.pause("1000");
    browser.click(".js-add-to-cart");
    browser.pause("2000");
    browser.click(".cart-alert-checkout");
    browser.pause("3000");
    browser.scroll(0, 500);
    browser.click(eleMap.free_shipping);
    browser.pause("4000");

    browser.waitForExist("//span[text()='Example Payment']");
    browser.click("//span[text()='Example Payment']");
    browser.pause(2000);
    browser.setValue("input[name='cardNumber']", 4242424242424242);
    browser.click("select[name='expireMonth']");
    browser.click("option[value='1']");
    browser.pause(2000);
    browser.click("select[name='expireYear']");
    browser.pause(2000);
    browser.click("option[value='2020']");
    browser.setValue("input[name='cvv']", 678);
    browser.pause(2000);
    browser.click("#btn-complete-order");
    browser.waitForExist("button[name='cancel']");
    
    // Cancel Order
    browser.click("button[name='cancel']");
    browser.waitForExist(eleMap.confirm_cancel_order);
    browser.click(eleMap.confirm_cancel_order);
    browser.pause("2000");
    expect(browser.getText("#order-status")).to.equal("Your order is now canceled.");
    expect(browser.getAttribute("div", "order-item")).to.exist;
  });
});