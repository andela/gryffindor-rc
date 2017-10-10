"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const expect = require("chai").expect;

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("sorting", function () {
  it("searches for Item and sort by highest or lowest price and filter by vendor or price", () => {
    const searchTerm = "e";
    browser.waitForExist(".navbar-items", "5000");
    browser.waitForExist(".search", "5000");
    browser.click(".search");
    browser.waitForExist("#search-input", "5000");
    browser.setValue("#search-input", searchTerm);
    browser.scroll(0, 200);
    browser.click(".filter-search");
    browser.waitForExist("#filter-by-price", "5000");
    browser.click("#filter-by-price");
    browser.waitForExist("#firstPrice", "5000");
    browser.click("#firstPrice");
    browser.waitForExist("#filter-by-latest", "5000");
    browser.click("#filter-by-latest");
    browser.waitForExist("#old", "5000");
    browser.click("#old");
    browser.waitForExist(".overlay", "5000");
    browser.waitForExist(".overlay-title", "5000");
    browser.waitForExist("#searchItem", "5000");
    expect(browser.getText("#searchItem")).to.contain("JEAN");
  });
});
