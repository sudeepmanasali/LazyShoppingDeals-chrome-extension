import $ from 'jquery';
import { couponCodes } from './utils';
import { ApplyCouponsAndFindBestOfIt } from './autoApplyCouponsModal';
import "./popUpModal.css"

export function createAndShowModal(totalAmt: number): void {
  const modalHTML = `
    <div id="LSD-coupon-modal-popup" style="display: none; border: 1px solid #ffc043;">
      <div id="LSD-modal-content">
        <div class="LSD-header">
          <div class="LSD-title">
            <h2>lazyShopDeals.com</h2>
          </div>
          <div id="LSD-close-modal"><i class="fa-solid fa-xmark"></i></div>
        </div>
        <div class="LSD-body-content">
          <div>
            <img class="LSD-animated-image" src="https://i.pinimg.com/originals/66/22/ab/6622ab37c6db6ac166dfec760a2f2939.gif" />
          </div>
          <div class="LSD-content">
            <p class="LSD-coupons-number">${couponCodes.length} Coupons Discovered!</p>
            <p class="LSD-description">We'll test and apply coupons in seconds</p>
            <button id="LSD-apply-coupons">Apply Coupons</button>
          </div>
        </div>
      </div>
    </div>
  `;

  if ($("#LSD-my-custom-font-awesome-icons").length === 0) {
    const fontLink = $('<link>', {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
      id: 'LSD-my-custom-font-awesome-icons',
    });
    $('head').append(fontLink);
  }

  const modalContainer = $('<div>').html(modalHTML);
  $('body').append(modalContainer);

  const couponModalPopUP = $('#LSD-coupon-modal-popup');
  const closeModal = $('#LSD-close-modal');
  const applyButton = $('#LSD-apply-coupons');

  couponModalPopUP.fadeIn();

  closeModal.on('click', () => {
    couponModalPopUP.fadeOut();
  });

  applyButton.on('click', async () => {
    couponModalPopUP.fadeOut(function (this: HTMLElement) {
      $(this).remove();
    });

    ApplyCouponsAndFindBestOfIt(totalAmt);
  });
}
