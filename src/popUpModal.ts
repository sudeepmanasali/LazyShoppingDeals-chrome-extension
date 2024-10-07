import { fetchCouponsData, couponCodes } from "./utils";
import { ApplyCouponsAndFindBestOfIt } from "./autoApplyCouponsModal";
import './popUpModal.css';
import animatedCouponGif from './AnimatedCoupon.gif';

export function createAndShowModal(totalAmt: string) {
  const modalHTML = `
    <div id="LSD-coupon-modal-popup" style="display: none;border: 1px solid #ffc043;">
      <div id="LSD-modal-content">
          <div class="LSD-header">
            <div class="LSD-title">
              <h2>lazyShopDeals.com</h2>
            </div>
            <div id="LSD-close-modal"><i class="fa-solid fa-xmark"></i></div>
          </div>
          <div class="LSD-body-content">
            <div>
              <img src=${animatedCouponGif}/>
            </div>
            <div class="LSD-content">
              <p class="LSD-coupons-number"> ${couponCodes.length} Coupons Discovered!</p>
              <p class="LSD-description">We'll test and apply coupons in seconds</p>
              <button id="LSD-apply-coupons">Apply Coupons</button>
            </div>
          </div>
      </div>
    </div>
  `;

  const fontLink = document.createElement('link')
  fontLink.setAttribute('rel', 'stylesheet')
  fontLink.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css')
  fontLink.setAttribute('id', 'LSD-my-custom-font-awesome-icons');
  document.head.appendChild(fontLink)

  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);

  const closeModal = document.getElementById('LSD-close-modal');
  const applyButton = document.getElementById('LSD-apply-coupons');
  const couponModalPopUP = document.getElementById('LSD-coupon-modal-popup');

  closeModal?.addEventListener('click', () => {
    if (couponModalPopUP) {
      couponModalPopUP.style.display = 'none';
    }
  });

  applyButton?.addEventListener('click', async () => {
    if (couponModalPopUP) {
      couponModalPopUP.remove();
    }

    ApplyCouponsAndFindBestOfIt(totalAmt);
  });

  fetchCouponsData();

  // Show the modal
  if (couponModalPopUP) {
    couponModalPopUP.style.display = 'block';
  }
}