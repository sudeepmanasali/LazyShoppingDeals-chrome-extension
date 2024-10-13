export const couponCodes = [
  'DISCOUNT10',
  'NEW3003',
  'NEW300',
  'FREEDEL',
  'NEW100',
  'FREESHIP',
  'FREESHIP3'
];

export const enum LOCAL_STORAGE_KEYS {
  COUPON_CODE_INPUT_SELECTOR = 'couponCodeInputSelector',
  COUPON_APPLY_BUTTON_SELECTOR = 'couponApplyButtonSelector',
  LSD_COUPON = 'LSDCoupon'
}


export const APPLY_BUTTON_ELEMENT_SELECTORS = [
  'button',
  'input[type="button"]',
  'input[type="submit"]'
];

export const COUPON_CODE_INPUT_ELEMENT_SELECTORS = [
  'input[type="text"]',
  'textarea'
];

export const APPLY_BUTTON_ELEMENT_TEXT_CONTENT = ["apply", "coupon"];
export const COUPON_CODE_INPUT_ELEMENT_TEXT_CONTENT = ["coupon", "promo", "voucher", "discount"];


export function findCouponInput(): Element | null {
  const elementSelector = localStorage.getItem(LOCAL_STORAGE_KEYS.COUPON_CODE_INPUT_SELECTOR) || '';
  const htmlElement = document.querySelector(elementSelector);

  try {
    if (htmlElement) return htmlElement;
  } catch (error) {
    console.error('Coupon input element not found.', error);
  }
  return null;
}

export function findApplyButton(): Element | null {
  const elementSelector = localStorage.getItem(LOCAL_STORAGE_KEYS.COUPON_APPLY_BUTTON_SELECTOR) || '';
  const htmlElement = document.querySelector(elementSelector);

  try {
    if (htmlElement) return htmlElement;
  } catch (error) {
    console.error('Coupon input element not found.', error);
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
    localStorage.setItem(LOCAL_STORAGE_KEYS.LSD_COUPON, JSON.stringify(couponData));
  } catch (error) {
    console.log(error)
  }
}

export function findHtmlElements(selectors: string[], searchText: string[]): string {
  try {
    for (let selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (let element of elements) {
        const elementText = element.textContent?.trim().toLowerCase();
        const placeholder = (element as HTMLInputElement).placeholder?.trim().toLowerCase();
        const id = element.id.trim().toLowerCase();
        const classList = element.className.trim().toLowerCase();

        if (searchText.some(text => elementText?.includes(text) || placeholder?.includes(text))) {


          let elementSelector = '';

          if (id) {
            elementSelector = `#${element.id.trim()}`;
          }

          if (!id && classList) {
            elementSelector = `.${element.className.trim().split(/\s+/).join('.')}`;
          }

          if (!id && !classList && placeholder) {
            elementSelector = `[placeholder="${(element as HTMLInputElement).placeholder?.trim()}"]`;
          }

          if (!elementSelector) {
            elementSelector = `${selector}[text="${element.textContent?.trim()}"]`;
          }

          return elementSelector;
        }
      }
    }
  } catch (error) {
    console.log('Element not found...!', error);
  }

  return '';
}
