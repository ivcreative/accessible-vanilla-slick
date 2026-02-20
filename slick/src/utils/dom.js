/**
 * DOM Manipulation Functions
 * Vanilla JS replacements for jQuery DOM operations
 */

import { isEmpty } from './helpers.js';

/**
 * Query selector - returns first matching element
 */
export function select(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query selector all - returns all matching elements
 */
export function selectAll(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Get parent element
 */
export function getParent(element) {
  return element.parentElement;
}

/**
 * Get closest ancestor matching selector
 */
export function closest(element, selector) {
  return element.closest(selector);
}

/**
 * Check if element matches selector
 */
export function matches(element, selector) {
  return element.matches(selector);
}

/**
 * Add class to element
 */
export function addClass(element, className) {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach(el => addClass(el, className));
  } else {
    element.classList.add(...className.split(' '));
  }
}

/**
 * Remove class from element
 */
export function removeClass(element, className) {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach(el => removeClass(el, className));
  } else {
    element.classList.remove(...className.split(' '));
  }
}

/**
 * Toggle class on element
 */
export function toggleClass(element, className, force) {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach(el => toggleClass(el, className, force));
  } else {
    element.classList.toggle(className, force);
  }
}

/**
 * Check if element has class
 */
export function hasClass(element, className) {
  return element ? element.classList.contains(className) : false;
}

/**
 * Set attribute on element
 */
export function setAttribute(element, name, value) {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach(el => setAttribute(el, name, value));
  } else if (typeof name === 'object') {
    Object.entries(name).forEach(([key, val]) => {
      setAttribute(element, key, val);
    });
  } else {
    if (value === null) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, value);
    }
  }
}

/**
 * Get attribute from element
 */
export function getAttribute(element, name) {
  return element ? element.getAttribute(name) : null;
}

/**
 * Remove attribute from element
 */
export function removeAttribute(element, name) {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach(el => removeAttribute(el, name));
  } else {
    element.removeAttribute(name);
  }
}

/**
 * Set property on element
 */
export function setProperty(element, name, value) {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach(el => setProperty(el, name, value));
  } else if (typeof name === 'object') {
    Object.entries(name).forEach(([key, val]) => {
      element[key] = val;
    });
  } else {
    element[name] = value;
  }
}

/**
 * Get property from element
 */
export function getProperty(element, name) {
  return element ? element[name] : null;
}

/**
 * Set CSS styles on element
 */
export function setStyle(element, name, value) {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach(el => setStyle(el, name, value));
  } else if (typeof name === 'object') {
    Object.entries(name).forEach(([key, val]) => {
      element.style[key] = val;
    });
  } else {
    element.style[name] = value;
  }
}

/**
 * Get CSS style value
 */
export function getStyle(element, name) {
  if (!element) return null;
  return window.getComputedStyle(element).getPropertyValue(name);
}

/**
 * Get element dimensions
 */
export function getDimensions(element) {
  const rect = element.getBoundingClientRect();
  return {
    width: element.offsetWidth || rect.width,
    height: element.offsetHeight || rect.height,
    top: element.offsetTop || rect.top,
    left: element.offsetLeft || rect.left
  };
}

/**
 * Get element inner width (excluding borders and padding based on box-sizing)
 */
export function getInnerWidth(element) {
  // Match jQuery .width() - returns content width excluding padding
  // clientWidth includes padding, so we need to subtract it
  const styles = window.getComputedStyle(element);
  const paddingLeft = parseFloat(styles.paddingLeft) || 0;
  const paddingRight = parseFloat(styles.paddingRight) || 0;
  return element.clientWidth - paddingLeft - paddingRight;
}

/**
 * Get element inner height
 */
export function getInnerHeight(element) {
  // Match jQuery .height() - returns content height excluding padding
  const styles = window.getComputedStyle(element);
  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const paddingBottom = parseFloat(styles.paddingBottom) || 0;
  return element.clientHeight - paddingTop - paddingBottom;
}

/**
 * Get element outer width (with margins)
 */
export function getOuterWidth(element, includeMargin = false) {
  let width = element.offsetWidth;
  if (includeMargin) {
    const style = window.getComputedStyle(element);
    width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }
  return width;
}

/**
 * Get element outer height (with margins)
 */
export function getOuterHeight(element, includeMargin = false) {
  let height = element.offsetHeight;
  if (includeMargin) {
    const style = window.getComputedStyle(element);
    height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
  }
  return height;
}

/**
 * Insert element as child
 */
export function appendChild(parent, child) {
  if (!parent) return;
  if (typeof child === 'string') {
    parent.insertAdjacentHTML('beforeend', child);
  } else {
    parent.appendChild(child);
  }
}

/**
 * Insert element at beginning
 */
export function prependChild(parent, child) {
  if (!parent) return;
  if (typeof child === 'string') {
    parent.insertAdjacentHTML('afterbegin', child);
  } else {
    parent.insertBefore(child, parent.firstChild);
  }
}

/**
 * Insert element after target
 */
export function insertAfter(target, element) {
  if (!target) return;
  if (typeof element === 'string') {
    target.insertAdjacentHTML('afterend', element);
  } else {
    target.parentNode.insertBefore(element, target.nextSibling);
  }
}

/**
 * Insert element before target
 */
export function insertBefore(target, element) {
  if (!target) return;
  if (typeof element === 'string') {
    target.insertAdjacentHTML('beforebegin', element);
  } else {
    target.parentNode.insertBefore(element, target);
  }
}

/**
 * Remove element from DOM
 */
export function remove(element) {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach(el => remove(el));
  } else if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Empty element (remove all children)
 */
export function empty(element) {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Replace element with new element
 */
export function replaceWith(target, replacement) {
  if (!target || !target.parentNode) return;
  target.parentNode.replaceChild(replacement, target);
}

/**
 * Clone element
 */
export function cloneElement(element, deep = true) {
  return element.cloneNode(deep);
}

/**
 * Get element's offset relative to document
 */
export function getOffset(element) {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
}

/**
 * Get element's position relative to nearest positioned ancestor
 */
export function getPosition(element) {
  return {
    top: element.offsetTop,
    left: element.offsetLeft
  };
}

/**
 * Get scroll position
 */
export function getScrollPosition() {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
}

/**
 * Set scroll position
 */
export function setScrollPosition(x, y) {
  window.scrollTo(x, y);
}

/**
 * Get element's children
 */
export function getChildren(element, selector = null) {
  if (!element) return [];
  if (selector) {
    return Array.from(element.children).filter(child => child.matches(selector));
  }
  return Array.from(element.children);
}

/**
 * Get elements by tag name
 */
export function getByTag(tagName, context = document) {
  return Array.from(context.getElementsByTagName(tagName));
}

/**
 * Get elements by class name
 */
export function getByClass(className, context = document) {
  return Array.from(context.getElementsByClassName(className));
}

/**
 * Check if element contains another element
 */
export function contains(parent, child) {
  return parent && child ? parent.contains(child) : false;
}

/**
 * Focus element
 */
export function focus(element) {
  if (element) element.focus();
}

/**
 * Blur element
 */
export function blur(element) {
  if (element) element.blur();
}

/**
 * Check if element is focused
 */
export function isFocused(element) {
  return element ? document.activeElement === element : false;
}
