import { createAndShowModal } from "./popUpModal";
import { fetchCouponsData, getPriceValue } from "./utils";
import $ from 'jquery';

// Show the modal after the page is completely loaded
window.addEventListener("load", () => {
  if (window.location.href.includes("cart")) {
    let cartTotal = $('#orderTotal .price-value').first().text() ?? '0';
    if (!$('.empty-cart').length && cartTotal) {

      let amt = getPriceValue(cartTotal)
      fetchCouponsData(amt).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
        .then((data) => {
          console.log(data);
          createAndShowModal(amt);
        })
        .catch((error) => {
          console.log('Fetch error:', error);
        });
    }
  }
});