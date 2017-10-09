import request from "request";

export const Paystack = {};

const paystackHeaders = (secret) => {
  return {
    "Authorization": `Bearer ${secret}`,
    "Content-Type": "application/json"
  };
};

Paystack.verify = (reference, secret, callback) => {
  const headers = paystackHeaders(secret);
  const url = `https://api.paystack.co/transaction/verify/${reference}`;
  request.get(url, { headers }, (err, response, body) => {
    const result = JSON.parse(body);
    if (result.status) {
      callback(null, result);
    } else {
      callback(result, null);
    }
  });
};

