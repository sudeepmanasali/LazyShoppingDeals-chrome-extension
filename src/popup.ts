import $ from 'jquery';

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
          $('#last-used-coupon').empty().append(createCouponCard(JSON.parse(succssfullyAppliedCoupon)));
        } else {
          $('#LSD-container-header').hide();
          $('#last-used-coupon').hide();
        }
      }
    });
  }
});

// To get the local storage key value pairs
function readLocalStorageKey(): string | null {
  const key = 'LSDCoupon';
  return localStorage.getItem(key);
}

const coupons = [
  { couponCode: "SAVE10", discoutPrice: 300 },
  { couponCode: "SAVE20", discoutPrice: 500 },
  { couponCode: "SAVE50", discoutPrice: 1000 }
];

function RenderCouponCards(coupons: any[]) {
  $('#coupon-container').empty();
  coupons.forEach((coupon) => {
    const couponCodeElement = createCouponCard(coupon);
    $('#coupon-container').append(couponCodeElement);
  });

  $('#coupons-count').text(coupons.length);
}

function createCouponCard(coupon: { couponCode: any; discoutPrice: any; }) {
  let couponDataHtml = `
  <div class="LSD-coupon-icon-box"> 
    <i class="fa fa-tags" aria-hidden="true"></i>
  </div>
  <div class="LSD-coupon-info-box">
    <div class="LSD-coupon-title">${coupon.couponCode}</div>
    <div class="LSD-coupon-when-used">You will be saving Rs. ${coupon.discoutPrice}</div>
  </div>`

  return $('<div>', { class: 'LSD-pop-up-coupon-card' }).html(couponDataHtml);
}

RenderCouponCards(coupons);