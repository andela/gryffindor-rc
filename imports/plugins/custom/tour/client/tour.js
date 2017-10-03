import introJs from "intro.js";
import { Reaction } from "/client/api";
// import { Meteor } from "meteor/meteor";
// import { Accounts } from "/lib/collections";

const gameTour = introJs.introJs();

const registeredCustomerTour = [
  {
    intro: `<h2>Welcome to <strong>Gryffindor</strong> Reaction Commerce</h2>
         <hr>
         <div class="tourcontainer">
           Tired of all the other ecommerce sites that are all hype no substance?<br>
           At <strong>Gryffindor RC</strong>, our services are so efficient, you'd think we use magic.
         </div>`
  },
  {
    intro: `<h2>Products</h2>
         <hr>
         <div>
           Available products are displayed in full view.<br/>
           Seen what you're looking for? Click on it to view it in detail.<br/>
           If you're satisfied with the product, proceed to add it to your cart.
         </div>`
  },
  {
    element: ".search",
    intro: `<h2>Search</h2>
         <hr>
         <div class="tourcontainer">
           Don't see what you're looking for at first glance? We have over 10,000 products in our database</br>
           Simply type in some information about the product and VOILA! Products that fit that search criteria are listed.
           If you're satisfied with the product, proceed to add it to your cart.
         </div>`
  },
  {
    element: ".cart",
    intro: `<h2>My Cart</h2>
         <hr>
         <div class="tourcontainer">
           This is your cart. All items you have added to it will be displayed here.
           Click on the cart icon to cash out. <br>
           You can then select your preferred means of payment.
         </div>`
  },
  {
    element: ".languages",
    intro: `<h2>Languages</h2>
         <hr>
         <div class="tourcontainer">
           We at gryffindor RC want you to have the best experience possible.<br/>
           Select from our list of almost ten international languages in order to make your shopping <br/>
           more pleasureable.
         </div>`
  },
  {
    element: ".accounts",
    intro: `<h2>Account Options</h2>
         <hr>
         <div class="tourcontainer">
           Manage your account here<br>
           You can perform tasks such as setting your prefered payment method and well as customizing your profile.
         </div>`
  },
  {
    element: ".tour",
    intro: `<h2>Tour</h2>
         <hr>
         <div class="tourcontainer">
           That's It! Need to take the tour again? you can always find me here.
         </div>`
  }
];

const adminTour = [
  {
    intro: `<h2>Welcome to <strong>Gryffindor</strong> Reaction Commerce</h2>
    <hr>
    <div class="tourcontainer">
      Tired of all the other ecommerce sites that are all hype no substance?<br>
      At <strong>Gryffindor RC</strong>, our services are so efficient, you'd think we use magic.
    </div>`
  },
  {
    intro: `<h2>Products</h2>
    <hr>
    <div>
      Available products are displayed in full view.<br/>
      Seen what you're looking for? Click on it to view it in detail.<br/>
      If you're satisfied with the product, proceed to add it to your cart.
    </div>`
  },
  {
    element: ".search",
    intro: `<h2>Search</h2>
         <hr>
         <div class="tourcontainer">
           Don't see what you're looking for at first glance? We have over 10,000 products in our database</br>
           Simply type in some information about the product and VOILA! Products that fit that search criteria are listed.
           If you're satisfied with the product, proceed to add it to your cart.
         </div>`
  },
  {
    element: ".cart",
    intro: `<h2>My Cart</h2>
    <hr>
    <div class="tourcontainer">
      This is your cart. All items you have added to it will be displayed here.
      Click on the cart icon to cash out. <br>
      You can then select your preferred means of payment.
    </div>`
  },
  {
    element: ".languages",
    intro: `<h2>Languages</h2>
    <hr>
    <div class="tourcontainer">
      We at gryffindor RC want you to have the best experience possible.<br/>
      Select from our list of almost ten international languages in order to make your shopping <br/>
      more pleasureable.
    </div>`
  },
  {
    element: ".accounts",
    intro: `<h3>Account Options</h>
    <hr>
    <div class="tourcontainer">Manage your account here<br>
    You can perform tasks such as editing your profile, processing orders made by customers and managing user accounts.
    </div>`
  },
  {
    element: ".admin-controls-menu",
    intro: `<h2>Admin Controls</h2>
    <hr>
    <div class="tourcontainer">
      We know that quick access to admin functionalities is important to increasing your productivity, <br/>
      we have included shortcuts to a few items here.
    </div>`
  },
  {
    element: ".tour",
    intro: `<h2>Tour</h2>
    <hr>
    <div class="tourcontainer">
      That's It! Need to take the tour again? you can always find me here.
    </div>`
  }
];

export const takeTour = () => {
  let tourSteps;
  if (Reaction.hasPermission("admin")) {
    tourSteps = adminTour;
  } else {
    tourSteps = registeredCustomerTour;
  }

  gameTour.setOptions({
    showBullets: true,
    showProgress: true,
    scrollToElement: true,
    showStepNumbers: false,
    tooltipPosition: "auto",
    steps: tourSteps
  });

  const timeout = setTimeout(() => {
    gameTour.start();
    clearTimeout(timeout);
  }, 500);
};

