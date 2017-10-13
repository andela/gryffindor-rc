const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");
const dotenv = require("dotenv");

dotenv.config();
beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Digital product", function () {
  it("should be downloaded once an authorized buyer click on 'Download'", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));

     // default to process env if we've got that
    const guestEmail = process.env.GUEST_EMAIL;
    const guestPw = process.env.GUEST_PW;

    browser.pause(5000);
    browser.click(eleMap.login_dropdown_btn);
    browser.pause(5000);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), guestEmail);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), guestPw);
    browser.click(eleMap.login_btn);
    browser.pause(3000);
    browser.waitForExist("//div[text()='Modern Famile']");
    browser.click("//div[text()='Modern Famile']");
    browser.pause(2000);
    browser.scroll(0, 250);
    browser.click(eleMap.add_to_cart);
    browser.pause(3000);
    browser.click("#btn-checkout");
    browser.scroll(0, 450);
    browser.pause(3000);
    browser.waitForExist("//span[text()='Free Shipping']");
    browser.click("//span[text()='Free Shipping']");
    browser.pause(2000);
    browser.waitForExist("//span[text()='Example Payment']");
    browser.click("//span[text()='Example Payment']");
    browser.pause(2000);
    browser.setValue("input[name='cardNumber']", process.env.VISA);
    browser.click("select[name='expireMonth']");
    browser.pause(2000);
    browser.click("option[value='1']");
    browser.pause(2000);
    browser.click("select[name='expireYear']");
    browser.pause(2000);
    browser.click("option[value='2020']");
    browser.setValue("input[name='cvv']", process.env.CVV);
    browser.pause(2000);
    browser.scroll(0, 1000);
    browser.click("[class='btn btn-lg btn-success btn-block btn-complete-order']");
    browser.pause(5000);
    browser.click("//a[text()='Download']");
    browser.pause(3000);
    browser.scroll(0, 950);
    expect(browser.getAttribute("a", "btn btn-success download-btn")).to.exist;
  });
});
