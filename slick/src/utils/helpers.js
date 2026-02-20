/**
 * Utility Functions for Accessible Slick Carousel
 * Replacement for jQuery utility methods
 */

/**
 * Deep extend/merge objects
 */
export function extend(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        extend(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return extend(target, ...sources);
}

/**
 * Check if value is a plain object
 */
export function isObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj) && obj.constructor === Object;
}

/**
 * Get type of value
 */
export function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * Debounce function
 */
export function debounce(func, wait = 0) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle(func, wait = 0) {
  let timeout;
  let previous = 0;
  return function executedFunction(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
}

/**
 * Create a function bound to a context
 */
export function bind(fn, context) {
  return fn.bind(context);
}

/**
 * Proxy function - create a function that calls another with specific context
 */
export function proxy(fn, context) {
  return function(...args) {
    return fn.apply(context, args);
  };
}

/**
 * Get position in array
 */
export function inArray(value, array) {
  return array.indexOf(value);
}

/**
 * Generate unique ID
 */
let idCounter = 0;
export function uniqueId(prefix = 'slick') {
  return `${prefix}-${++idCounter}`;
}

/**
 * Check if value is empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if value is numeric
 */
export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Parse HTML string to element
 */
export function parseHTML(htmlString) {
  const temp = document.createElement('div');
  temp.innerHTML = htmlString.trim();
  return temp.firstElementChild;
}

/**
 * Get computed style value
 */
export function getComputedStyle(element, property) {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Request animation frame with fallback
 */
export const requestAnimFrame = window.requestAnimationFrame || function(callback) {
  return setTimeout(callback, 1000 / 60);
};

/**
 * Cancel animation frame with fallback
 */
export const cancelAnimFrame = window.cancelAnimationFrame || function(id) {
  clearTimeout(id);
};

/**
 * Sleep/delay promise
 */
export function sleep(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Deep clone object
 */
export function clone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => clone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = clone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * Normalize touch event coordinates
 */
export function getTouchCoordinates(touch) {
  return {
    x: touch.clientX || touch.pageX || touch.touches?.[0]?.clientX || 0,
    y: touch.clientY || touch.pageY || touch.touches?.[0]?.clientY || 0
  };
}

/**
 * Get document height
 */
export function getDocumentHeight() {
  return Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.documentElement.clientHeight,
    document.body.clientHeight
  );
}

/**
 * Get window dimensions
 */
export function getWindowDimensions() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
