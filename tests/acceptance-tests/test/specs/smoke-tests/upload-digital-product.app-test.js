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
   it("should be uploadable", function () {
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
     browser.click(eleMap.open_create_product);
     browser.pause(2000);
     browser.click(eleMap.create_product);
     browser.pause(3000);
     browser.setValue(eleMap.title_input, "Digital Product");
     browser.setValue(eleMap.subtitle_input, "a digital product");
     browser.setValue(eleMap.vendor_input, "Digital Books");
     browser.setValue(eleMap.description_input, "E-books for reading");
     browser.pause(2000);
     browser.scroll(0, 250);
     browser.click("select[name='category']");
     browser.pause(3000);
     browser.click("option[value='digital']");
     browser.pause(3000);
     browser.setValue("#uploadFile", require("path").resolve("selenium-server-standalone-3.0.0-beta2.jar"));
     browser.pause(3000);
     browser.click("#upload-btn");
     browser.pause(10000);
     expect(browser.getAttribute("i", "upload-progress fa fa-gear fa-spin")).to.exist;
   });
 });
