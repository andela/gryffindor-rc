import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Accounts, Packages, Wallets } from "/lib/collections";
import "../lib/api/paystackApi";

let list = [];
let pageList = [];
const currentPage = 1;
const numberPerPage = 10;
let numberOfPages;

Template.wallet.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    details: { balance: 0, transactions: [] },
    transactions: [],
    transactionsList: [],
    currentPageNum: 1
  });
  this.autorun(() => {
    this.subscribe("transactionDetails", Meteor.userId());
    const transactionInfo = Wallets.find().fetch();
    if (transactionInfo.length > 0) {
      this.state.set("details", transactionInfo[0]);
      makeList();
    }
  });
});

function makeList() {
  const transactions = Template.instance().state.get("details").transactions;
  if (transactions.length > 0) {
    const newTranscationDetails = transactions.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    Template.instance().state.set("transactionsList", newTranscationDetails);
    numberOfPages = getNumberOfPages();
  }
}

function getNumberOfPages() {
  list = Template.instance().state.get("transactionsList");
  return list.length > 0 ? Math.ceil(list.length / numberPerPage) : 0;
}

function updateNavButtonState() {
  document.getElementById("previous").disabled = currentPage === 1;
  document.getElementById("first").disabled = currentPage === 1;
  document.getElementById("last").disabled = currentPage === numberOfPages;
}


function loadList() {
  list = Template.instance().state.get("transactionsList");
  const begin = (currentPage - 1) * numberPerPage;
  const end = begin + numberPerPage;
  pageList = list.slice(begin, end);
  Template.instance().state.set("transactions", pageList);
  updateNavButtonState();
}

// const getPaystackSettings = () => {
//   Packages.findOne({
//     name: "paystack",
//     shopId: Reaction.getShopId()
//   });
//   return {
//     public: "pk_test_c277fce81c44dcbcf966d52890be7e2cd1694252",
//     secret: "sk_test_03d41f4603278e768111c4b5afcff64be51a4445"
//   };
// };

const finalizeDeposit = paystackMethod => {
  Meteor.call(
    "wallet/transaction",
    Meteor.userId(),
    paystackMethod.transactions,
    (err, res) => {
      if (res) {
        document.getElementById("depositAmount").value = "";
        Alerts.toast("Your deposit was successful", "success");
      } else {
        Alerts.toast("An error occured, please try again", "error");
      }
    }
  );
};

function handlePayment(result) {
  const type = "deposit";
  const transactionId = result.reference;
  Meteor.call("paystack/keys", (err, keys) => {
    HTTP.call(
    "GET",
    `https://api.paystack.co/transaction/verify/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${keys.secret}`
        }
      },
    (error, response) => {
      if (error) {
        Alerts.toast("Unable to verify payment", "error");
      } else if (response.data.data.status !== "success") {
        Alerts.toast("Payment was unsuccessful", "error");
      } else {
        const paystackResponse = response.data.data;
        paystackMethod = {
          processor: "Paystack",
          storedCard: paystackResponse.authorization.last4,
          method: "Paystack",
          transactionId: paystackResponse.reference,
          currency: paystackResponse.currency,
          amount: parseInt(paystackResponse.amount, 10),
          status: paystackResponse.status,
          mode: "authorize",
          createdAt: new Date()
        };
        if (type === "deposit") {
          paystackMethod.transactions = {
            amount: paystackResponse.amount / 100,
            referenceId: paystackResponse.reference,
            date: new Date(),
            transactionType: "Credit"
          };
          finalizeDeposit(paystackMethod);
        }
      }
    }
  );
  });
}

// Paystack payment
const payWithPaystack = (email, amount) => {
  Meteor.call("paystack/keys", (err, keys) => {
    PaystackPop.setup({
      key: keys.public,
      email: email,
      amount: amount * 100,
      callback: handlePayment
    }).openIframe();
  });
};

Template.wallet.events({
  "submit #deposit": event => {
    event.preventDefault();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const amount = parseInt(document.getElementById("depositAmount").value, 10);
    const mailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (!mailRegex.test(userMail)) {
      Alerts.toast("Invalid email address", "error");
      return false;
    }
    if (amount < 0) {
      Alerts.toast("Amount cannot be negative", "error");
      return false;
    }
    if (amount === 0 || amount === "") {
      Alerts.toast("Please enter amount ", "error");
      return false;
    }
    payWithPaystack(userMail, amount);
  },
  "submit #transfer": (event) => {
    event.preventDefault();
    const amount = parseInt(document.getElementById("transferAmount").value, 10);
    if (amount > Template.instance().state.get("details").balance) {
      return Alerts.toast("Insufficient Balance", "error");
    }
    const recipient = document.getElementById("recipient").value;
    const transaction = { amount, to: recipient, date: new Date(), transactionType: "Debit" };
    Meteor.call("wallet/transaction", Meteor.userId(), transaction, (err, res) => {
      if (res === 2) {
        Alerts.toast(`No user with email ${recipient}`, "error");
      } else if (res === 1) {
        document.getElementById("recipient").value = "";
        document.getElementById("transferAmount").value = "";
        Alerts.toast("The transfer was successful", "success");
      } else {
        Alerts.toast("An error occured, please try again", "error");
      }
    });
  }
});

Template.wallet.helpers({
  balance() {
    return Template.instance().state.get("details").balance;
  },

  getTransactions() {
    makeList();
    loadList();
    return Template.instance().state.get("transactions");
  },
  getCurrentPage() {
    return Template.instance().state.get("currentPageNum");
  },
  formatDate(date) {
    return moment(date).format("dddd, MMMM Do YYYY, h:mm:ssa");
  }
});
