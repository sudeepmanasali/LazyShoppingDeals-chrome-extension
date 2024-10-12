export const couponCodes = [
  'DISCOUNT10',
  'NEW3003',
  'NEW300',
  'FREEDEL',
  'NEW100',
  'FREESHIP',
  'FREESHIP3'
];


// Helper functions to find elements
export function findCouponInput(): Element | null {
  const selectors = [
    'input[id="couponCodeInput"]'
  ];

  try {
    for (let selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
  } catch (error) {
    console.error('Coupon input element not found.', error);
  }
  return null;
}

export function findApplyButton(): Element | null {
  const selectors = [
    'button[class*="apply"]'
  ];

  try {
    for (let selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
  } catch (error) {
    console.error('Apply button not found.', error);
  }
  return null;
}

export function findDiscountElement(): Element | null {
  try {
    const selectors = [
      '.you-save-text'
    ];

    for (let selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
  } catch (error) {
    console.error('Discount amount element not found.', error);
  }

  return null;
}

// Function to clear the coupon input field
export function clearCoupon(): void {
  const selectors = [
    'span[class*="delete"]'
  ];

  try {
    let element: HTMLElement | null = null;

    for (let selector of selectors) {
      element = document.querySelector(selector);
    }

    if (element) {
      element?.click();
    } else {
      console.error('Coupon input or apply button not found.');
    }
  } catch (error) {
    console.log(error)
  }

}


export function fetchCouponsData(price: number): Promise<any> {
  return fetch(`http://localhost:8080/coupons?price=${price}`)
}


// Function to wait for elements to become available
export async function waitForElements() {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      if (findCouponInput() && findApplyButton()) {
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


export function getElementByIdSafe(id: string): HTMLElement | null {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with id "${id}" not found.`);
  }
  return element;
}



export function getPriceValue(amountString: String): number {
  try {
    let [price] = amountString.match(/[\d,]+(\.\d+)?/) || ['0'];

    if (price) {
      return parseFloat(price.replace(/,/g, ''))
    }
  } catch (error) {
    console.log(error)
  }
  return 0;
}


export function storeSuccessfullyAppliedcoupon(couponData: any) {
  try {
    localStorage.setItem('LSDCoupon', JSON.stringify(couponData));
  } catch (error) {
    console.log(error)
  }
}


export function getLastUsedCoupon() {
  try {
    let couponData = JSON.parse(localStorage.getItem('LSDCoupon') || '')
    console.log(couponData)
  } catch (error) {

  }
}