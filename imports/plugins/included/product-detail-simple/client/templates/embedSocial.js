import { Template } from "meteor/templating";
import { Packages } from "/lib/collections";
import { ReactiveDict } from "meteor/reactive-dict";
import "./embedSocial.html";

Template.embedTwitter.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    feed: {}
  });

  this.autorun(() => {
    this.subscribe("Packages");
    const socialConfig = Packages.findOne({
      name: "reaction-social"
    });
    this.state.set("feed", socialConfig.settings.public.apps);
  });
});

Template.embedTwitter.helpers({
  /* eslint-disable consistent-return */
  twitter() {
    const twitterConfig = Template.instance().state.get("feed").twitter;
    if (twitterConfig.enabled && twitterConfig.profilePage) {
      return twitterConfig.profilePage;
    }
  }
});

Template.embedFacebook.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    feed: {}
  });

  this.autorun(() => {
    this.subscribe("Packages");
    const socialConfig = Packages.findOne({
      name: "reaction-social"
    });
    this.state.set("feed", socialConfig.settings.public.apps);
  });
});

Template.embedFacebook.helpers({
  facebook() {
    const facebookConfig = Template.instance().state.get("feed").facebook;
    if (facebookConfig.enabled && facebookConfig.appId &&
      facebookConfig.profilePage) {
      const baseUrl = "https://www.facebook.com/plugins/page.php?";
      const href = `href=${facebookConfig.profilePage}`;
      const dimensions = "&tabs=timeline&width=400&height=400&";
      const sHeader = "small_header=false&adapt_container_width=true";
      const remainder = "&hide_cover=false&show_facepile=false&";
      const appID = `appId=${facebookConfig.appId}`;
      url = `${baseUrl}${href}${dimensions}${sHeader}${remainder}${appID}`;
      return url;
    }
  }
});
