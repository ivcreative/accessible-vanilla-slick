/**
 * Accessible Slick Slider
 * Modern vanilla JavaScript slider
 * 
 * Entry point - exports SlickSlider class and helper functions
 */

import SlickSlider from './SlickSlider.js';

/**
 * Initialize slider on all matching elements
 * Usage:
 *   Slick(document.querySelector('.slider'));
 *   Slick.auto('.slider'); // Initialize all matching elements
 */
export default function Slick(element, options = {}) {
  if (Array.isArray(element)) {
    return element.map(el => new SlickSlider(el, options));
  }
  return new SlickSlider(element, options);
}

/**
 * Initialize slider on all elements matching selector
 */
Slick.auto = function(selector, options = {}) {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements).map(el => new SlickSlider(el, options));
};

/**
 * Version
 */
Slick.version = '2.0.0';

/**
 * Expose SlickSlider class directly
 */
export { SlickSlider };

// For browser global usage
if (typeof window !== 'undefined') {
  window.Slick = Slick;
  window.SlickSlider = SlickSlider;
  
  // Also create slickModule namespace for examples.html compatibility
  window.slickModule = {
    Slick,
    SlickSlider,
    default: Slick
  };
}
