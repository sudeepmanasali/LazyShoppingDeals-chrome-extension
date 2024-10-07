import { createAndShowModal } from "./popUpModal";

// Show the modal after the page is completely loaded
window.addEventListener("load", () => {
  if (window.location.href.includes("cart")) {
    let cartTotal = document.getElementById('orderTotal')?.getElementsByClassName('price-value')[0].textContent ?? '0';
    if (!document.getElementsByClassName("empty-cart")[0]) {
      createAndShowModal(cartTotal);
    }
  }
});
