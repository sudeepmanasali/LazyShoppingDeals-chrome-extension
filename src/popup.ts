import $ from 'jquery';

const popupElement = document.querySelector("h1");
if (popupElement) {
  popupElement.addEventListener("click", () => {
    alert("You clicked the popup!");
  });
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0] && tabs[0].url && tabs[0].url.includes("cart")) {
    $('#retry-coupon-button').show();
  } else {
    $('#retry-coupon-button').hide();
  }

  if (tabs[0]) {
    const currentTabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: currentTabId! },
      func: readLocalStorageKey,
    }, (result) => {
      if (result && result[0]) {

        const succssfullyAppliedCoupon: string | null = result[0].result;
        if (succssfullyAppliedCoupon) {
          $('#LSD-container-header').show();
          $('#last-used-coupon').empty().append(createCouponCard(JSON.parse(succssfullyAppliedCoupon)))
        } else {
          $('#LSD-container-header').hide();
          $('#last-used-coupon').hide();
        }
      }
    });
  }
});

function readLocalStorageKey(): string | null {
  const key = 'LSDCoupon';
  return localStorage.getItem(key);
}

const coupons = [
  { couponKey: "SAVE10", discountApplied: 300 },
  { couponKey: "SAVE20", discountApplied: 500 },
  { couponKey: "SAVE50", discountApplied: 1000 }
];

function createCouponElement(coupons: any[]) {
  $('#coupon-container').empty();
  coupons.forEach((coupon) => {
    const couponCodeElement = createCouponCard(coupon);
    $('#coupon-container').append(couponCodeElement);
  });
}

function createCouponCard(coupon: { couponKey: any; discountApplied: any; }) {
  let couponDataHtml = `
  <div class="LSD-coupon-icon-box"> 
    <i class="fa fa-tags" aria-hidden="true"></i>
  </div>
  <div class="LSD-coupon-info-box">
    <div class="LSD-coupon-title">${coupon.couponKey}</div>
    <div class="LSD-coupon-when-used">You will be saving Rs.${coupon.discountApplied}</div>
  </div>`

  return $('<div>', { class: 'LSD-pop-up-coupon-card' }).html(couponDataHtml);
}

createCouponElement(coupons);
