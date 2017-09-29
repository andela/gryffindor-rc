"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const expect = require("chai").expect;

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Real time search", function () {
  it("should narrow down search to two products that match the search term 'gionee'", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const searchTerm1 = "i";
    const searchTerm2 = "gionee";

    browser.click(eleMap.search_icon);
    browser.pause("5000");
    browser.setValue(eleMap.search_input, searchTerm1);
    browser.pause("5000");
    browser.click(eleMap.clear_search_term);
    browser.setValue(eleMap.search_input, searchTerm2);
    browser.pause("5000");
    expect(browser.getText("#searchItem")).to.contain("GIONEE A1");
    expect(browser.getText("#searchItem")).to.contain("GIONEE S6S");
    browser.click(eleMap.close_search_modal);
    browser.pause("1000");
  });
});
