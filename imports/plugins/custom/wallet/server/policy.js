import { BrowserPolicy } from "meteor/browser-policy-common";

BrowserPolicy.content.allowOriginForAll("paystack.com");
BrowserPolicy.content.allowOriginForAll("*.paystack.co");
