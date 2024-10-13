import { createAndShowModal } from "./popUpModal";
import { APPLY_BUTTON_ELEMENT_SELECTORS, APPLY_BUTTON_ELEMENT_TEXT_CONTENT, COUPON_CODE_INPUT_ELEMENT_SELECTORS, COUPON_CODE_INPUT_ELEMENT_TEXT_CONTENT, fetchCouponsData, findHtmlElements, getPriceValue, LOCAL_STORAGE_KEYS } from "./utils";
import $ from 'jquery';

// Show the modal after the page is completely loaded
window.addEventListener("load", () => {
  if (window.location.href.includes("cart")) {
    let cartTotal = $('#orderTotal .price-value').first().text() ?? '0';
    let couponApplyButtonSelector = findHtmlElements(APPLY_BUTTON_ELEMENT_SELECTORS, APPLY_BUTTON_ELEMENT_TEXT_CONTENT);
    let couponCodeInputSelector = findHtmlElements(COUPON_CODE_INPUT_ELEMENT_SELECTORS, COUPON_CODE_INPUT_ELEMENT_TEXT_CONTENT);

    localStorage.setItem(LOCAL_STORAGE_KEYS.COUPON_CODE_INPUT_SELECTOR, couponCodeInputSelector)
    localStorage.setItem(LOCAL_STORAGE_KEYS.COUPON_APPLY_BUTTON_SELECTOR, couponApplyButtonSelector)

    if (!$('.empty-cart').length && cartTotal) {
      let amt = getPriceValue(cartTotal)
      fetchCouponsData(amt).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
        .then((data) => {
          createAndShowModal(amt);
        })
        .catch((error) => {
          console.log('Fetch error:', error);
        });
    }
  }
});