"use strict";
const yaml = require("js-yaml");
const dotenv = require("dotenv");
const fs = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");

dotenv.config();

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("User", function () {
  it("Should be able to cancel order", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));


    // default to process env if we've got that
    const adminEmail = process.env.REACTION_EMAIL;
    const adminPassword = process.env.REACTION_AUTH;

    // LOGIN IN
    browser.waitForExist(eleMap.login_dropdown_btn);
    browser.click(eleMap.login_dropdown_btn);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), adminEmail);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), adminPassword);
    browser.click(eleMap.login_btn);

    // Make Order
    browser.waitForExist(".product-grid-item-images");
    browser.click(".product-grid-item-images");
    browser.waitForExist(".variant-select-option");
    browser.click(".variant-select-option");
    browser.pause("6000");
    browser.scroll(0, 300);
    browser.waitForExist(eleMap.red_option);
    browser.click(eleMap.red_option);
    browser.waitForExist(".js-add-to-cart");
    browser.click(".js-add-to-cart");
    browser.waitForExist(".cart-alert-checkout");
    browser.click(".cart-alert-checkout");
    browser.pause("6000");
    browser.scroll(0, 500);
    browser.click(eleMap.free_shipping);
    browser.waitForExist("//span[text()='Example Payment']");
    browser.click("//span[text()='Example Payment']");
    browser.pause(2000);
    browser.setValue("input[name='cardNumber']", process.env.VISA);
    browser.click("select[name='expireMonth']");
    browser.click("option[value='1']");
    browser.pause(2000);
    browser.click("select[name='expireYear']");
    browser.pause(2000);
    browser.click("option[value='2020']");
    browser.setValue("input[name='cvv']", process.env.CVV);
    browser.pause(2000);
    browser.click("#btn-complete-order");
    browser.waitForExist("button[name='cancel']");
    // Cancel Order
    browser.click("button[name='cancel']");
    browser.waitForExist(eleMap.confirm_cancel_order);
    browser.click(eleMap.confirm_cancel_order);
    browser.pause("2000");
    expect(browser.getText("#order-status")).to.equal("Your order is now canceled.");
  });
});