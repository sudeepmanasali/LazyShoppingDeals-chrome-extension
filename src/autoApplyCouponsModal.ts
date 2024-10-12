import $ from 'jquery';
import { findCouponInput, getPriceValue, findApplyButton, waitForElements, couponCodes, findDiscountElement, getElementByIdSafe, storeSuccessfullyAppliedcoupon } from "./utils";
import { clearCoupon } from "./utils";
import './autoApplyCouponsModal.css';

let progress = 0;
let stopFlag = false;
let currentBoxIndex = 0;

async function findBestCoupon(couponCodes: string[]) {
  let bestCoupon = null;
  let maxDiscount = 0;
  let currentCoupon = 0;

  try {
    for (const couponCode of couponCodes) {
      let successFullCoupon = false;
      currentCoupon++;
      const box = document.getElementById('askme' + couponCode) as HTMLElement;
      try {
        scrollToRight(couponCode);
        addSpinner(box);
        const discount = await applyCouponAndGetDiscount(couponCode);
        console.log('>>>>>>> : ', discount);
        if (discount > maxDiscount) {
          maxDiscount = discount;
          bestCoupon = couponCode;
          successFullCoupon = true;
        }
      } catch (error) {
        console.error(`Error applying coupon ${couponCode}:`, error);
        successFullCoupon = false;
      } finally {
        removeSpinner(box, successFullCoupon);
        updateProgress((currentCoupon / couponCodes.length) * 100);
      }
    }

    if (bestCoupon) {
      await applyCouponAndGetDiscount(bestCoupon);
    } else {
      console.log('No valid coupon code found.');
    }

  } catch (error) {
    console.log('Error processing coupons:', error);
  }

  return {
    bestCoupon,
    maxDiscount
  };
}

async function createBoxes() {
  try {
    const dataArray = couponCodes;
    await waitForElementse(getContainerElement());
    let container = getContainerElement();
    const containerFragment = document.createDocumentFragment();

    dataArray.forEach((item, index) => {
      const box = document.createElement('div');
      box.className = 'LSD-cpnCode';
      box.id = 'askme' + item;

      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-money-bill';
      box.appendChild(icon);

      const content = document.createElement('div');
      content.textContent = item;

      box.appendChild(content);

      if (containerFragment) {
        containerFragment.appendChild(box);
      }
    });

    if (container) {
      container.appendChild(containerFragment);
    }
  } catch (error) {
    console.log(error);
  }
}


// Processing a coupons in the modal
export function ApplyCouponsAndFindBestOfIt(totalCartAmt: number) {
  const modalHTML = `
      <div id="LSD-coupon-processing-container">
        <div id="LSD-views">
          <div class="LSD-center-the-contents">
            <div class="LSD-coupon-processing" id="LSD-coupon-processing-view">
              <div class="LSD-header">
                <div class="LSD-title">
                  <h2>lazyShopDeals.com</h2>
                </div>
                <div id="LSD-close-modal-X"><i class="fa-solid fa-xmark"></i></div>
              </div>
              <div class="LSD-coupon-cards-container">
                <p class="LSD-message"> Processing ${couponCodes.length} great coupons</p>
                <div class="coupon-code-scanner">
                    <div class="barcode"><i class="fa-solid fa-barcode"></i></div>
                    <div class="barcode-line scanning"></div>
                </div>
                <div class="LSD-container" id="LSD-scrollable-container">
                </div>
              </div>

              <div class="LSD-progress-container" id="LSD-progress-indicator">
                <div id="LSD-progress-bar" class="LSD-progress-bar"></div>
              </div>
            </div>
            <div class="LSD-coupon-summary" id="LSD-coupon-summary-view" style="display:none;"> </div>
          </div>
        </div>
      </div>`;

  const modalContainer = $(modalHTML);
  $('body').append(modalContainer);

  createBoxes();

  const closeModal = $('#LSD-close-modal-X');

  function onModalAdded() {
    findBestCoupon(couponCodes).then((response) => {
      if (response.maxDiscount === 0) {
        clearCoupon();
      } else {
        storeSuccessfullyAppliedcoupon({
          couponCode: response.bestCoupon,
          discountPrice: response.maxDiscount
        });
      }
      displayTheSummary(response.maxDiscount, response.bestCoupon);
    }).catch(error => {
      console.log(error);
    });
  }

  onModalAdded();

  function displayTheSummary(discoutAmt: number, bestCoupon: string | null) {
    const couponModalBoxElement = $('#LSD-coupon-processing-view');
    const content = $('#LSD-coupon-summary-view');
    const cartTotal = $('#orderTotal .price-value').text() || '0';

    let SummaryComponent = createCouponSummaryElement(cartTotal, totalCartAmt, discoutAmt, bestCoupon, bestCoupon !== null, closeTheModal);
    couponModalBoxElement.hide();

    if (content) {
      const e = $('<div></div>').css({
        height: '100%',
        width: '100%'
      });

      e.html(SummaryComponent);
      content.append(e);
      content.show();
    }
  }

  const closeTheModal = () => {
    stopFlag = true;
    $('#LSD-coupon-processing-container').remove();
    $('#my-custom-style').remove();
    $('#LSD-my-custom-font-awesome-icons').remove();
  }

  closeModal.on('click', closeTheModal);

  $('#LSD-coupon-processing-container').fadeIn();
}

// Function to apply a coupon and get the discount amount
async function applyCouponAndGetDiscount(couponCode: string) {
  if (!stopFlag) {
    try {
      let inputElement: HTMLInputElement | null = findCouponInput() as HTMLInputElement;
      let applyButton: HTMLElement | null = findApplyButton() as HTMLElement;

      if (!inputElement || !applyButton) {
        clearCoupon()
        await waitForElements();
        inputElement = findCouponInput() as HTMLInputElement;
        applyButton = findApplyButton() as HTMLElement;
      }

      if (!inputElement || !applyButton) clearCoupon();

      if (inputElement && applyButton) {

        inputElement.value = couponCode;
        inputElement.dispatchEvent(new Event('input', {
          bubbles: true
        }));
        inputElement.dispatchEvent(new Event('change', {
          bubbles: true
        }));

        applyButton?.click();
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const discountElement = findDiscountElement();
      const discountText = discountElement ? discountElement.textContent || '' : '0';
      return getPriceValue(discountText);
    } catch (error) {
      console.log(error)
    }
  }
  return 0;
}

function updateProgress(percentage: number) {
  try {
    progress = percentage;

    if (progress > 100) {
      progress = 100;
    }

    const progressBar = $('#LSD-progress-bar').get(0);
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
  } catch (error) {
    console.log(error)
  }

  console.log(`Current progress: ${progress}%`);
}


function scrollToRight(elementId: string) {
  try {
    const box = document.getElementById('askme' + elementId) as HTMLElement;
    const boxes = Array.from(document.querySelectorAll('.LSD-cpnCode')) as HTMLElement[];

    let container = getContainerElement();
    if (container) {
      currentBoxIndex++;

      if (currentBoxIndex < boxes.length) {
        container.scrollLeft += box.offsetWidth + 10;
      } else {
        currentBoxIndex--;
      }
    }
  } catch (error) {
    console.warn(error);
  }
}


async function addSpinner(couponCodeBoxElement: HTMLElement) {
  try {
    await waitForElementse(couponCodeBoxElement);
    const couponCodeBox = $(couponCodeBoxElement);
    const spinnerIcon = $('<i></i>').addClass('fa-solid fa-spinner LSD-loading-icon');
    couponCodeBox.append(spinnerIcon);
    couponCodeBox.addClass('LSD-current-coupon-code-processing');
    console.log('inside spinner ', couponCodeBox[0]);
  } catch (error) {
    console.log(error);
  }
}

function removeSpinner(CouponCodeBoxElement: HTMLElement, successFullCoupon: boolean) {
  try {
    const couponCodeBox = $(CouponCodeBoxElement);
    couponCodeBox.removeClass('LSD-current-coupon-code-processing');
    couponCodeBox.addClass(successFullCoupon ? 'LSD-success-coupon' : 'LSD-failed-coupon');

    const spinnerElement = couponCodeBox.find('.fa-spinner').get(0);
    if (spinnerElement) {
      spinnerElement.remove();
    }

  } catch (error) {
    console.log(error)
  }
}


async function waitForElementse(func: any) {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      if (func) {
        observer.disconnect();
        resolve(1);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}


function getContainerElement(): Element | null {
  try {
    const container = $('#LSD-scrollable-container');
    return container[0] || null;
  } catch (error) {
    console.log(error);
  }
  return null;
}

function createCouponSummaryElement(
  cartTotalPrice: string,
  originalPrice: string | number,
  savingsAmount: number | number,
  couponCode: string | null,
  isCouponApplied: boolean,
  closeModal: any
) {

  let html = `<div class="LSD-split-container">
                <div class="${isCouponApplied ? 'LSD-left-box' : 'LSD-left-box failed-to-apply-coupon'}">
                  <div class="LSD-savings-title">
                       ${isCouponApplied ? "You're Saving" : 'You have the best price we found!'}
                  </div>
                  <div id="LSD-savings-value" style="display: ${isCouponApplied ? 'block' : 'none'}">${savingsAmount}!</div>
                  <div class="LSD-savings-description" style="color:${isCouponApplied ? '#2f6649' : '#ac1616'}">
                            ${isCouponApplied ?
      'We applied the best code we found to your cart. Enjoy your deal!'
      : 'None of the codes we applied beat your price. On to checkout!'}
                  </div>
                </div>
                <div class="LSD-right-box" style="background: ${isCouponApplied ? 'transparent' : 'white'}">
                  <div class="LSD-coupon-and-cart-summary">
                      <div class="LSD-cart-price-title">Final price</div>
                      <div class="LSD-cart-price-value" id="LSD-cart-price-value">${cartTotalPrice}</div>

                    <div class="LSD-cart-details" style="display: ${isCouponApplied ? 'block' : 'none'}">
                      <div class="LSD-cart-box">
                        <div class="LSD-cart-title"> Original Total</div>
                        <div class="LSD-cart-value"> ${originalPrice}</div>
                      </div>

                      <div class="LSD-cart-box">
                        <div class="LSD-cart-title LSD-savings-code" id="LSD-savings-code"> ${couponCode} <i class="fa-solid fa-money-bill"></i></div>
                        <div class="LSD-cart-title LSD-savings"> -${savingsAmount} </div>
                      </div>
                    </div>
                  </div>
                  <button class='LSD-continue-button' id="LSD-continue-button">Continue Shopping</button>
                </div>
              </div>`;

  $(document).on('click', '#LSD-continue-button', closeModal);

  return html;
}