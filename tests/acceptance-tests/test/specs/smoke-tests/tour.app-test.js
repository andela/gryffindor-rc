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

describe("Tour", function () {
  it("Should be done for Admin", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));

    const adminEmail = process.env.REACTION_EMAIL;
    const adminPassword = process.env.REACTION_AUTH;

    browser.pause(5000);
    browser.click(eleMap.login_dropdown_btn);
    browser.pause(5000);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), adminEmail);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), adminPassword);
    browser.click(eleMap.login_btn);
    browser.pause(3000);
    browser.click(eleMap.take_tour);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(10000);
    expect(browser.getAttribute("[class='introjs-button introjs-skipbutton introjs-donebutton']")).to.exist;
  });

  it("Should be done for user", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));

    const adminEmail = process.env.GUEST_EMAIL;
    const adminPassword = process.env.GUEST_PW;

    browser.pause(5000);
    browser.click(eleMap.login_dropdown_btn);
    browser.pause(5000);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), adminEmail);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), adminPassword);
    browser.click(eleMap.login_btn);
    browser.pause(3000);
    browser.click(eleMap.take_tour);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(3000);
    browser.click(eleMap.take_tour_next);
    browser.pause(10000);
    expect(browser.getAttribute("[class='introjs-button introjs-skipbutton introjs-donebutton']")).to.exist;
  });
});
