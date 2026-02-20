/**
 * Event Handling Utilities
 * Replacement for jQuery's event system and custom events
 */

/**
 * Event dispatcher for custom events (replaces $.fn.trigger)
 */
export class EventDispatcher {
  constructor() {
    this.listeners = {};
  }

  /**
   * Subscribe to an event
   */
  on(event, callback, context = null) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push({ callback, context });
    return this;
  }

  /**
   * Subscribe to an event once
   */
  once(event, callback, context = null) {
    const wrapper = (...args) => {
      callback.apply(context, args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper, context);
  }

  /**
   * Unsubscribe from an event
   */
  off(event, callback = null) {
    if (!event) {
      this.listeners = {};
      return this;
    }
    if (!callback) {
      delete this.listeners[event];
      return this;
    }
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        listener => listener.callback !== callback
      );
    }
    return this;
  }

  /**
   * Emit/trigger an event
   */
  emit(event, data = null) {
    if (!this.listeners[event]) return this;
    
    this.listeners[event].forEach(listener => {
      listener.callback.call(listener.context, data);
    });
    
    return this;
  }

  /**
   * Clear all listeners
   */
  clear() {
    this.listeners = {};
    return this;
  }
}

/**
 * Add event listener with auto cleanup
 */
export function addEventListener(element, eventName, handler, options = false) {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach(el => addEventListener(el, eventName, handler, options));
    return;
  }
  element.addEventListener(eventName, handler, options);
}

/**
 * Remove event listener
 */
export function removeEventListener(element, eventName, handler, options = false) {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach(el => removeEventListener(el, eventName, handler, options));
    return;
  }
  element.removeEventListener(eventName, handler, options);
}

/**
 * Trigger native event
 */
export function triggerEvent(element, eventName, detail = null) {
  if (!element) return;
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
}

/**
 * Create and dispatch custom event
 */
export function dispatchEvent(element, eventName, detail = {}) {
  if (!element) return;
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true,
    composed: true
  });
  return element.dispatchEvent(event);
}

/**
 * Listen to multiple events
 */
export function onMultiple(element, events, handler, options = false) {
  const eventList = events.split(' ');
  eventList.forEach(event => {
    addEventListener(element, event, handler, options);
  });
}

/**
 * Remove listener from multiple events
 */
export function offMultiple(element, events, handler, options = false) {
  const eventList = events.split(' ');
  eventList.forEach(event => {
    removeEventListener(element, event, handler, options);
  });
}

/**
 * Event delegation - handle events on children
 */
export function delegate(element, selector, eventName, handler, options = false) {
  const listener = (event) => {
    const target = event.target.closest(selector);
    if (target) {
      handler.call(target, event);
    }
  };
  addEventListener(element, eventName, listener, options);
  return listener;
}

/**
 * Undelegate events
 */
export function undelegate(element, eventName, handler) {
  removeEventListener(element, eventName, handler);
}

/**
 * Get event key for keyboard events
 */
export function getEventKey(event) {
  if (event.key) return event.key;
  if (event.keyCode) {
    const keyMap = {
      13: 'Enter',
      27: 'Escape',
      32: ' ',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      9: 'Tab'
    };
    return keyMap[event.keyCode];
  }
  return null;
}

/**
 * Prevent event default and propagation
 */
export function stopEvent(event) {
  event.preventDefault?.();
  event.stopPropagation?.();
  event.stopImmediatePropagation?.();
  return false;
}

/**
 * Prevent default action
 */
export function preventDefault(event) {
  event.preventDefault?.();
}

/**
 * Stop propagation
 */
export function stopPropagation(event) {
  event.stopPropagation?.();
}

/**
 * Check if event was stopped
 */
export function isEventStopped(event) {
  return event.defaultPrevented;
}

/**
 * Get event coordinates (mouse or touch)
 */
export function getEventCoordinates(event) {
  if (event.touches && event.touches[0]) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
      pageX: event.touches[0].pageX,
      pageY: event.touches[0].pageY
    };
  }
  return {
    x: event.clientX,
    y: event.clientY,
    pageX: event.pageX,
    pageY: event.pageY
  };
}

/**
 * Get touch delta (movement)
 */
export function getTouchDelta(startEvent, endEvent) {
  const start = getEventCoordinates(startEvent);
  const end = getEventCoordinates(endEvent);
  return {
    x: end.x - start.x,
    y: end.y - start.y,
    pageX: end.pageX - start.pageX,
    pageY: end.pageY - start.pageY
  };
}

/**
 * Check if element or ancestor has event listener
 */
export function hasEventListener(element, eventName) {
  const allListeners = window.getEventListeners?.(element) || {};
  return eventName in allListeners;
}

/**
 * Remove all event listeners of a type from element
 */
export function clearEventListeners(element, eventName = null) {
  if (!eventName) {
    element.replaceWith(element.cloneNode(true));
    return;
  }
  
  // Note: This is a limitation in JavaScript - we can't clear all listeners
  // without cloning the element or keeping a registry
  // The best approach is to use a custom EventDispatcher or keep event references
}

/**
 * Create a debounced event handler
 */
export function debounceEvent(handler, wait = 0) {
  let timeout;
  return function(event, ...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      handler.call(this, event, ...args);
    }, wait);
  };
}

/**
 * Create a throttled event handler
 */
export function throttleEvent(handler, wait = 0) {
  let timeout;
  let previous = 0;
  return function(event, ...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      handler.call(this, event, ...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        handler.call(this, event, ...args);
      }, remaining);
    }
  };
}

/**
 * Wait for event to trigger (returns promise)
 */
export function waitForEvent(element, eventName) {
  return new Promise((resolve) => {
    const handler = (event) => {
      removeEventListener(element, eventName, handler);
      resolve(event);
    };
    addEventListener(element, eventName, handler);
  });
}

/**
 * Monitor visibility changes
 */
export function onVisibilityChange(callback) {
  const handleVisibilityChange = () => {
    callback(!document.hidden);
  };
  addEventListener(document, 'visibilitychange', handleVisibilityChange);
  return () => removeEventListener(document, 'visibilitychange', handleVisibilityChange);
}

/**
 * Check if element is in focus mode (tab key)
 */
export function isKeyboardFocus(event) {
  return event.key === 'Tab' || event.keyCode === 9;
}
