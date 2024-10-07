export const couponCodes = [
  'DISCOUNT10',
  'NEW3003',
  'NEW300',
  'FREESHIPO',
  'NEW100',
  'FREESHIPL',
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
    console.log(error);
  }
  console.error('Coupon input element not found.');
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
    console.log(error);
  }
  console.error('Apply button not found.');
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


export function fetchCouponsData(): void {
  let priceElement: HTMLElement | null = document.querySelector("#orderTotal .price-value");
  let price;
  if (priceElement) {
    price = priceElement.textContent?.slice(1) || '';

    const numericValue = parseFloat(price.split(',').join(''));

    fetch(`http://localhost:8080/coupons?price=${numericValue}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log('Fetch error:', error);
      });
  }

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
