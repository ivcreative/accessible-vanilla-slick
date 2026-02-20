/**
 * CSS Animation and Transform Utilities
 */

/**
 * Detect CSS transition support
 */
export function supportsTransitions() {
  const element = document.createElement('div');
  return (
    'transition' in element.style ||
    'WebkitTransition' in element.style ||
    'MozTransition' in element.style ||
    'OTransition' in element.style ||
    'msTransition' in element.style
  );
}

/**
 * Detect CSS transform support
 */
export function supportsTransforms() {
  const element = document.createElement('div');
  return (
    'transform' in element.style ||
    'WebkitTransform' in element.style ||
    'MozTransform' in element.style ||
    'OTransform' in element.style ||
    'msTransform' in element.style
  );
}

/**
 * Get transform property name with vendor prefix
 */
export function getTransformProperty() {
  const element = document.createElement('div');
  const properties = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
  for (const prop of properties) {
    if (prop in element.style) {
      return prop;
    }
  }
  return 'transform';
}

/**
 * Get transition property name with vendor prefix
 */
export function getTransitionProperty() {
  const element = document.createElement('div');
  const properties = ['transition', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
  for (const prop of properties) {
    if (prop in element.style) {
      return prop;
    }
  }
  return 'transition';
}

/**
 * Apply CSS transition
 */
export function applyTransition(element, duration, easing = 'ease') {
  const transitionProp = getTransitionProperty();
  element.style[transitionProp] = `all ${duration}ms ${easing}`;
}

/**
 * Remove CSS transition
 */
export function removeTransition(element) {
  const transitionProp = getTransitionProperty();
  element.style[transitionProp] = 'none';
}

/**
 * Apply CSS transform
 */
export function applyTransform(element, transform) {
  const transformProp = getTransformProperty();
  element.style[transformProp] = transform;
}

/**
 * Translate element using transforms
 */
export function translate(element, x, y = 0) {
  const transformProp = getTransformProperty();
  element.style[transformProp] = `translate(${x}px, ${y}px)`;
}

/**
 * Translate3d element using transforms (GPU accelerated)
 */
export function translate3d(element, x, y = 0, z = 0) {
  const transformProp = getTransformProperty();
  element.style[transformProp] = `translate3d(${x}px, ${y}px, ${z}px)`;
}

/**
 * Scale element
 */
export function scale(element, x, y = x) {
  const transformProp = getTransformProperty();
  element.style[transformProp] = `scale(${x}, ${y})`;
}

/**
 * Rotate element
 */
export function rotate(element, degrees) {
  const transformProp = getTransformProperty();
  element.style[transformProp] = `rotate(${degrees}deg)`;
}

/**
 * Set z-index
 */
export function setZIndex(element, index) {
  element.style.zIndex = index;
}

/**
 * Get all vendor prefixes
 */
export const vendorPrefixes = ['webkit', 'moz', 'ms', 'o'];

/**
 * Get CSS property with vendor prefixes
 */
export function getCSSProperty(property) {
  const element = document.createElement('div');
  const camelCase = property.replace(/-([a-z])/g, g => g[1].toUpperCase());
  
  if (camelCase in element.style) return property;
  
  for (const prefix of vendorPrefixes) {
    const prefixed = `-${prefix}-${property}`;
    const camelPrefixed = prefix + camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    if (camelPrefixed in element.style) return prefixed;
  }
  
  return property;
}

/**
 * Check if element has 3D transforms
 */
export function supports3DTransforms() {
  const element = document.createElement('div');
  const props = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
  
  for (const prop of props) {
    if (prop in element.style) {
      element.style[prop] = 'translate3d(1px,1px,1px)';
      const computed = window.getComputedStyle(element);
      const transformValue = computed[prop];
      return transformValue && transformValue !== 'none';
    }
  }
  
  return false;
}

/**
 * Get animation frame timing
 */
export function getAnimationDuration(element) {
  const style = window.getComputedStyle(element);
  const duration = style.animationDuration || '0s';
  const delay = style.animationDelay || '0s';
  
  const parseDuration = (value) => {
    if (value.endsWith('ms')) return parseFloat(value);
    return parseFloat(value) * 1000;
  };
  
  return parseDuration(duration) + parseDuration(delay);
}

/**
 * Animate element using CSS transitions
 */
export function animateCSS(element, properties, duration, easing = 'ease') {
  return new Promise((resolve) => {
    const transitionProp = getTransitionProperty();
    const originalTransition = element.style[transitionProp];
    
    // Set transition
    element.style[transitionProp] = `all ${duration}ms ${easing}`;
    
    // Apply properties
    Object.entries(properties).forEach(([key, value]) => {
      if (key === 'transform') {
        applyTransform(element, value);
      } else {
        element.style[key] = typeof value === 'number' ? `${value}px` : value;
      }
    });
    
    // Wait for transition to complete
    const onTransitionEnd = () => {
      element.removeEventListener('transitionend', onTransitionEnd);
      element.removeEventListener('webkittransitionend', onTransitionEnd);
      element.style[transitionProp] = originalTransition;
      resolve();
    };
    
    element.addEventListener('transitionend', onTransitionEnd);
    element.addEventListener('webkittransitionend', onTransitionEnd);
    
    // Fallback timeout
    setTimeout(onTransitionEnd, duration + 50);
  });
}

/**
 * Get transform matrix values
 */
export function getTransformMatrix(element) {
  const style = window.getComputedStyle(element);
  const transform = style.transform || style.webkitTransform || style.mozTransform;
  
  if (!transform || transform === 'none') {
    return { x: 0, y: 0, z: 0 };
  }
  
  const values = transform.match(/matrix3d?\(([^)]+)\)/);
  if (!values) return { x: 0, y: 0, z: 0 };
  
  const matrix = values[1].split(',').map(v => parseFloat(v.trim()));
  
  if (matrix.length === 16) {
    // matrix3d
    return { x: matrix[12], y: matrix[13], z: matrix[14] };
  } else if (matrix.length === 6) {
    // matrix
    return { x: matrix[4], y: matrix[5], z: 0 };
  }
  
  return { x: 0, y: 0, z: 0 };
}

/**
 * Check if element is visible
 */
export function isVisible(element) {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
}

/**
 * Force hardware acceleration
 */
export function enableHardwareAcceleration(element) {
  const transformProp = getTransformProperty();
  element.style[transformProp] = 'translateZ(0)';
}

/**
 * Disable hardware acceleration
 */
export function disableHardwareAcceleration(element) {
  const transformProp = getTransformProperty();
  element.style[transformProp] = 'none';
}
