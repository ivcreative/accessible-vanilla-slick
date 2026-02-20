var slickModule = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // slick/src/index.js
  var src_exports = {};
  __export(src_exports, {
    SlickSlider: () => SlickSlider_default,
    default: () => Slick
  });

  // slick/src/utils/events.js
  var EventDispatcher = class {
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
          (listener) => listener.callback !== callback
        );
      }
      return this;
    }
    /**
     * Emit/trigger an event
     */
    emit(event, data = null) {
      if (!this.listeners[event])
        return this;
      this.listeners[event].forEach((listener) => {
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
  };

  // slick/src/utils/helpers.js
  function extend(target, ...sources) {
    if (!sources.length)
      return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key])
            Object.assign(target, { [key]: {} });
          extend(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    return extend(target, ...sources);
  }
  function isObject(obj) {
    return obj && typeof obj === "object" && !Array.isArray(obj) && obj.constructor === Object;
  }
  function debounce(func, wait = 0) {
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
  var idCounter = 0;
  function uniqueId(prefix = "slick") {
    return `${prefix}-${++idCounter}`;
  }
  function parseHTML(htmlString) {
    const temp = document.createElement("div");
    temp.innerHTML = htmlString.trim();
    return temp.firstElementChild;
  }
  var requestAnimFrame = window.requestAnimationFrame || function(callback) {
    return setTimeout(callback, 1e3 / 60);
  };
  var cancelAnimFrame = window.cancelAnimationFrame || function(id) {
    clearTimeout(id);
  };
  function getWindowDimensions() {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight
    };
  }

  // slick/src/utils/dom.js
  function select(selector, context = document) {
    return context.querySelector(selector);
  }
  function selectAll(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }
  function addClass(element, className) {
    if (!element)
      return;
    if (Array.isArray(element)) {
      element.forEach((el) => addClass(el, className));
    } else {
      element.classList.add(...className.split(" "));
    }
  }
  function removeClass(element, className) {
    if (!element)
      return;
    if (Array.isArray(element)) {
      element.forEach((el) => removeClass(el, className));
    } else {
      element.classList.remove(...className.split(" "));
    }
  }
  function hasClass(element, className) {
    return element ? element.classList.contains(className) : false;
  }
  function setAttribute(element, name, value) {
    if (!element)
      return;
    if (Array.isArray(element)) {
      element.forEach((el) => setAttribute(el, name, value));
    } else if (typeof name === "object") {
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
  function getAttribute(element, name) {
    return element ? element.getAttribute(name) : null;
  }
  function removeAttribute(element, name) {
    if (!element)
      return;
    if (Array.isArray(element)) {
      element.forEach((el) => removeAttribute(el, name));
    } else {
      element.removeAttribute(name);
    }
  }
  function setStyle(element, name, value) {
    if (!element)
      return;
    if (Array.isArray(element)) {
      element.forEach((el) => setStyle(el, name, value));
    } else if (typeof name === "object") {
      Object.entries(name).forEach(([key, val]) => {
        element.style[key] = val;
      });
    } else {
      element.style[name] = value;
    }
  }
  function getDimensions(element) {
    const rect = element.getBoundingClientRect();
    return {
      width: element.offsetWidth || rect.width,
      height: element.offsetHeight || rect.height,
      top: element.offsetTop || rect.top,
      left: element.offsetLeft || rect.left
    };
  }
  function getInnerWidth(element) {
    const styles = window.getComputedStyle(element);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    return element.clientWidth - paddingLeft - paddingRight;
  }
  function getOuterWidth(element, includeMargin = false) {
    let width = element.offsetWidth;
    if (includeMargin) {
      const style = window.getComputedStyle(element);
      width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }
    return width;
  }
  function getOuterHeight(element, includeMargin = false) {
    let height = element.offsetHeight;
    if (includeMargin) {
      const style = window.getComputedStyle(element);
      height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    }
    return height;
  }
  function appendChild(parent, child) {
    if (!parent)
      return;
    if (typeof child === "string") {
      parent.insertAdjacentHTML("beforeend", child);
    } else {
      parent.appendChild(child);
    }
  }
  function insertBefore(target, element) {
    if (!target)
      return;
    if (typeof element === "string") {
      target.insertAdjacentHTML("beforebegin", element);
    } else {
      target.parentNode.insertBefore(element, target);
    }
  }
  function remove(element) {
    if (!element)
      return;
    if (Array.isArray(element)) {
      element.forEach((el) => remove(el));
    } else if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
  function empty(element) {
    if (!element)
      return;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  function getChildren(element, selector = null) {
    if (!element)
      return [];
    if (selector) {
      return Array.from(element.children).filter((child) => child.matches(selector));
    }
    return Array.from(element.children);
  }

  // slick/src/utils/css.js
  function supportsTransforms() {
    const element = document.createElement("div");
    return "transform" in element.style || "WebkitTransform" in element.style || "MozTransform" in element.style || "OTransform" in element.style || "msTransform" in element.style;
  }
  function getTransformProperty() {
    const element = document.createElement("div");
    const properties = ["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"];
    for (const prop of properties) {
      if (prop in element.style) {
        return prop;
      }
    }
    return "transform";
  }
  function getTransitionProperty() {
    const element = document.createElement("div");
    const properties = ["transition", "WebkitTransition", "MozTransition", "OTransition", "msTransition"];
    for (const prop of properties) {
      if (prop in element.style) {
        return prop;
      }
    }
    return "transition";
  }
  function applyTransition(element, duration, easing = "ease") {
    const transitionProp = getTransitionProperty();
    element.style[transitionProp] = `all ${duration}ms ${easing}`;
  }
  function removeTransition(element) {
    const transitionProp = getTransitionProperty();
    element.style[transitionProp] = "none";
  }
  function translate3d(element, x, y = 0, z = 0) {
    const transformProp = getTransformProperty();
    element.style[transformProp] = `translate3d(${x}px, ${y}px, ${z}px)`;
  }

  // slick/src/SlickSlider.js
  var SlickSlider = class _SlickSlider {
    static INSTANCES = /* @__PURE__ */ new Map();
    constructor(element, options = {}) {
      this.element = element;
      this.instanceId = uniqueId("slick");
      this.constructor.INSTANCES.set(this.instanceId, this);
      const dataSlickAttr = getAttribute(element, "data-slick");
      let dataSlickOptions = {};
      if (dataSlickAttr) {
        try {
          const jsonStr = dataSlickAttr.replace(/&quot;/g, '"');
          dataSlickOptions = JSON.parse(jsonStr);
        } catch (e) {
          console.warn("Invalid data-slick JSON:", dataSlickAttr, e);
        }
      }
      this.options = extend({}, this.constructor.DEFAULTS, dataSlickOptions, options);
      this.originalOptions = extend({}, this.options);
      this.state = extend({}, this.constructor.INITIAL_STATE);
      this.dispatcher = new EventDispatcher();
      this.boundMethods = {};
      this.init();
    }
    /**
     * Default configuration options
     */
    static DEFAULTS = {
      // Slider behavior
      accessibility: true,
      adaptiveHeight: false,
      appendArrows: null,
      appendDots: null,
      arrows: true,
      arrowsPlacement: null,
      // 'before', 'after', 'split'
      asNavFor: null,
      autoplay: false,
      autoplaySpeed: 3e3,
      centerMode: false,
      centerPadding: "50px",
      cssEase: "ease",
      customPaging: null,
      dots: false,
      dotsClass: "slick-dots",
      draggable: true,
      edge: false,
      easing: "linear",
      edgeFriction: 0.35,
      fade: false,
      focusOnSelect: false,
      focusOnChange: false,
      infinite: true,
      initialSlide: 0,
      instructionsText: null,
      lazyLoad: "ondemand",
      // 'ondemand', 'progressive', or false
      mobileFirst: false,
      nextArrow: '<button class="slick-next" aria-label="Next slide"><span class="slick-next-icon" aria-hidden="true"></span></button>',
      pauseIcon: '<span class="slick-pause-icon" aria-hidden="true"></span>',
      pauseOnFocus: true,
      pauseOnHover: true,
      playIcon: '<span class="slick-play-icon" aria-hidden="true"></span>',
      prevArrow: '<button class="slick-prev" aria-label="Previous slide"><span class="slick-prev-icon" aria-hidden="true"></span></button>',
      respondTo: "window",
      // 'window', 'slider', or 'min'
      responsive: null,
      rows: 1,
      rtl: false,
      slide: "",
      slidesPerRow: 1,
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 500,
      swipe: true,
      swipeToSlide: false,
      touchMove: true,
      touchThreshold: 5,
      useAutoplayToggleButton: true,
      useCSS: true,
      useGroupRole: true,
      useTransform: true,
      variableWidth: false,
      vertical: false,
      verticalSwiping: false,
      waitForAnimate: true,
      zIndex: 1e3,
      // Accessibility
      regionLabel: "slider"
    };
    /**
     * Initial state
     */
    static INITIAL_STATE = {
      activeBreakpoint: null,
      animating: false,
      autoPlayTimer: null,
      currentDirection: 0,
      currentLeft: 0,
      currentSlide: 0,
      direction: 1,
      dotListElement: null,
      dotSlidesToScroll: 1,
      dots: null,
      dragging: false,
      edgeHit: false,
      slidesCache: null,
      gestureEndTime: 0,
      gestureStartTime: 0,
      instructionsText: null,
      interrupted: false,
      listHeight: 0,
      listWidth: 0,
      loadIndex: 0,
      nextArrowElement: null,
      pauseButton: null,
      postSlideDelay: 0,
      prevArrowElement: null,
      scrolling: false,
      slideCount: 0,
      slideHeight: 0,
      slideOffset: 0,
      slideWidth: 0,
      slideTrack: null,
      slides: [],
      sliding: false,
      slideList: null,
      swipeLeft: 0,
      swiping: false,
      suppressNavSync: false,
      swipeDirection: null,
      targetSlide: 0,
      touchObject: {},
      touchStartTime: 0,
      transformsEnabled: false,
      unslicked: false,
      windowHeight: 0,
      windowWidth: 0,
      yeti: null
    };
    /**
     * Key codes for keyboard navigation
     */
    static KEYS = {
      ENTER: 13,
      SPACE: 32,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      TAB: 9,
      HOME: 36,
      END: 35,
      ESCAPE: 27
    };
    /**
     * Initialize slider
     */
    init() {
      this.element.setAttribute("data-slick-slider", this.instanceId);
      addClass(this.element, "slick-slider");
      this.state.transformsEnabled = supportsTransforms();
      this.setProps();
      this.state.currentSlide = this.options.initialSlide;
      this.state.currentDirection = 1;
      this.state.rtl = this.options.rtl;
      this.state.rows = this.options.rows;
      this.state.slideCount = 0;
      this.loadSlider();
      this.buildOut();
      this.setupInfinite();
      if (this.options.accessibility) {
        setAttribute(this.element, "role", "region");
        setAttribute(this.element, "aria-label", this.options.regionLabel);
      }
      if (this.options.arrows && this.state.slideCount > this.options.slidesToShow) {
        this.buildArrows();
      }
      if (this.options.dots && this.state.slideCount > this.options.slidesToShow) {
        this.buildDots();
      }
      if (this.options.autoplay && this.options.useAutoplayToggleButton && this.state.slideCount > 1) {
        this.buildAutoplayButton();
      }
      this.updateNavigationVisibility();
      addClass(this.element, "slick-initialized");
      if (this.options.variableWidth) {
        window.requestAnimationFrame(() => {
          this.setPosition();
        });
      } else {
        this.setPosition();
      }
      this.initializeEvents();
      if (this.options.autoplay) {
        this.autoPlay();
      }
      if (this.options.responsive && this.options.responsive.length) {
        this.checkResponsive(true);
      }
      if (this.options.lazyLoad) {
        if (this.options.lazyLoad === "progressive") {
          this.progressiveLazyLoad();
        } else {
          this.lazyLoad();
        }
        this.dispatcher.addEventListener("afterChange", () => {
          if (this.options.lazyLoad === "progressive") {
            this.progressiveLazyLoad();
          } else {
            this.lazyLoad();
          }
        });
      }
      this.emit("init", { instance: this });
    }
    /**
     * Set properties matching jQuery setProps()
     */
    setProps() {
      this.state.positionProp = this.options.vertical ? "top" : "left";
      if (this.options.fade) {
        this.options.centerMode = false;
        this.options.slidesToShow = 1;
        this.options.slidesToScroll = 1;
      }
      const style = document.body.style;
      if (style.transform !== void 0) {
        this.state.animType = "transform";
      } else if (style.webkitTransform !== void 0) {
        this.state.animType = "webkitTransform";
      } else if (style.MozTransform !== void 0) {
        this.state.animType = "MozTransform";
      } else if (style.msTransform !== void 0) {
        this.state.animType = "msTransform";
      } else if (style.OTransform !== void 0) {
        this.state.animType = "OTransform";
      } else {
        this.state.animType = false;
      }
    }
    /**
     * Setup infinite mode - CRITICAL for infinite scrolling
     * Clones the first and last slides to enable seamless wrapping
     */
    setupInfinite() {
      if (!this.options.infinite || this.options.fade || this.state.slideCount <= this.options.slidesToShow) {
        return;
      }
      const infiniteCount = this.options.centerMode ? this.options.slidesToShow + 1 : this.options.slidesToShow;
      for (let i = this.state.slideCount; i > this.state.slideCount - infiniteCount; i -= 1) {
        const slideIndex = i - 1;
        const clone2 = this.state.slides[slideIndex].cloneNode(true);
        addClass(clone2, "slick-cloned");
        setAttribute(clone2, "aria-hidden", "true");
        setAttribute(clone2, "tabindex", "-1");
        setAttribute(clone2, "data-slick-index", String(slideIndex - this.state.slideCount));
        this.state.slideTrack.insertBefore(clone2, this.state.slideTrack.firstChild);
      }
      const appendCount = Math.max(
        this.state.slideCount,
        this.options.slidesToShow + this.options.slidesToScroll
      );
      for (let i = 0; i < appendCount; i += 1) {
        const slideIndex = i % this.state.slideCount;
        const clone2 = this.state.slides[slideIndex].cloneNode(true);
        addClass(clone2, "slick-cloned");
        setAttribute(clone2, "aria-hidden", "true");
        setAttribute(clone2, "tabindex", "-1");
        setAttribute(clone2, "data-slick-index", String(i + this.state.slideCount));
        appendChild(this.state.slideTrack, clone2);
      }
      void this.state.slideTrack.offsetWidth;
    }
    /**
     * Load slides from DOM
     */
    loadSlider() {
      const slides = this.options.slide ? selectAll(this.options.slide, this.element) : getChildren(this.element);
      this.state.slides = Array.from(slides);
      this.state.slideCount = this.state.slides.length;
      this.state.slides.forEach((slide, index) => {
        addClass(slide, "slick-slide");
        setAttribute(slide, "data-slick-index", index);
        if (this.options.useGroupRole) {
          setAttribute(slide, "role", "group");
          setAttribute(slide, "aria-label", `slide ${index + 1}`);
        }
      });
      this.wrapSlideContent();
      this.emit("loaded", { slideCount: this.state.slideCount });
    }
    /**
     * Wrap slide content with inline-block div for proper layout
     * Matches jQuery Slick behavior: wraps immediate children in div with display: inline-block
     */
    wrapSlideContent() {
      this.state.slides.forEach((slide) => {
        const children = Array.from(getChildren(slide));
        if (children.length === 1 && children[0].tagName === "DIV") {
          const innerDiv = children[0];
          if (innerDiv.style.display !== "inline-block") {
            setStyle(innerDiv, "width", "100%");
            setStyle(innerDiv, "display", "inline-block");
          }
          return;
        }
        const hasInlineBlockWrapper = children.length === 1 && getComputedStyle(children[0]).display === "inline-block";
        if (hasInlineBlockWrapper) {
          return;
        }
        const wrapper = document.createElement("div");
        setStyle(wrapper, "width", "100%");
        setStyle(wrapper, "display", "inline-block");
        children.forEach((child) => {
          appendChild(wrapper, child);
        });
        appendChild(slide, wrapper);
      });
    }
    /**
     * Build slider DOM structure
     */
    buildOut() {
      const track = select(".slick-track", this.element);
      const list = select(".slick-list", this.element);
      if (!track || !list) {
        const listDiv = document.createElement("div");
        addClass(listDiv, "slick-list");
        const trackDiv = document.createElement("div");
        addClass(trackDiv, "slick-track");
        this.state.slides.forEach((slide) => {
          appendChild(trackDiv, slide);
        });
        appendChild(listDiv, trackDiv);
        appendChild(this.element, listDiv);
        this.state.slideTrack = trackDiv;
        this.state.slideList = listDiv;
      } else {
        this.state.slideTrack = track;
        this.state.slideList = list;
      }
      if (this.options.accessibility) {
        setAttribute(this.element, "role", "region");
        setAttribute(this.element, "aria-label", this.options.regionLabel);
      }
    }
    /**
     * Build navigation arrows
     */
    buildArrows() {
      const prevArrowHTML = this.options.prevArrow;
      const prevArrow = parseHTML(prevArrowHTML);
      addClass(prevArrow, "slick-arrow");
      this.state.prevArrowElement = prevArrow;
      prevArrow.addEventListener("click", (e) => this.prevClick(e));
      const nextArrowHTML = this.options.nextArrow;
      const nextArrow = parseHTML(nextArrowHTML);
      addClass(nextArrow, "slick-arrow");
      this.state.nextArrowElement = nextArrow;
      nextArrow.addEventListener("click", (e) => this.nextClick(e));
      const appendTarget = this.options.appendArrows || this.element;
      const slideList = this.state.slideList;
      if (slideList && slideList.parentNode === appendTarget) {
        insertBefore(slideList, prevArrow);
        appendChild(appendTarget, nextArrow);
      } else {
        appendChild(appendTarget, prevArrow);
        appendChild(appendTarget, nextArrow);
      }
      this.emit("arrowsBuilt");
    }
    /**
     * Build navigation dots
     */
    buildDots() {
      const dotContainer = document.createElement("ul");
      addClass(dotContainer, this.options.dotsClass);
      addClass(this.element, "slick-dotted");
      const dotCount = Math.ceil(this.state.slideCount / this.options.slidesToScroll);
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement("li");
        const button = document.createElement("button");
        const icon = document.createElement("span");
        addClass(icon, "slick-dot-icon");
        setAttribute(button, "aria-label", `Go to slide ${i + 1}`);
        setAttribute(button, "data-slide-index", i);
        if (i === 0)
          addClass(dot, "slick-active");
        button.addEventListener("click", (e) => this.dotClick(e));
        appendChild(button, icon);
        appendChild(dot, button);
        appendChild(dotContainer, dot);
      }
      this.state.dots = dotContainer;
      this.state.dotListElement = dotContainer;
      const appendTarget = this.options.appendDots || this.element;
      appendChild(appendTarget, dotContainer);
      this.updateDots();
      this.emit("dotsBuilt");
    }
    /**
     * Update dot active state
     */
    updateDots() {
      if (!this.state.dots)
        return;
      const dotIndex = Math.floor(this.state.currentSlide / this.options.slidesToScroll);
      const dots = Array.from(this.state.dots.children);
      dots.forEach((dot, index) => {
        if (index === dotIndex) {
          addClass(dot, "slick-active");
        } else {
          removeClass(dot, "slick-active");
        }
      });
    }
    /**
     * Build autoplay toggle button
     */
    buildAutoplayButton() {
      const button = document.createElement("button");
      addClass(button, "slick-autoplay-toggle-button");
      setAttribute(button, "aria-label", "Play/Pause slider autoplay");
      this.state.pauseButton = button;
      button.addEventListener("click", () => this.autoPlayToggleHandler());
      this.setAutoplayButtonState(Boolean(this.state.paused));
      if (this.state.slideList) {
        this.element.insertBefore(button, this.state.slideList);
      } else {
        appendChild(this.element, button);
      }
    }
    /**
     * Update autoplay button icon and state
     */
    setAutoplayButtonState(isPaused) {
      if (!this.state.pauseButton)
        return;
      setAttribute(this.state.pauseButton, "aria-pressed", isPaused ? "true" : "false");
      empty(this.state.pauseButton);
      const iconMarkup = isPaused ? this.options.playIcon : this.options.pauseIcon;
      if (typeof iconMarkup === "string") {
        appendChild(this.state.pauseButton, parseHTML(iconMarkup));
      } else if (iconMarkup) {
        appendChild(this.state.pauseButton, iconMarkup);
      }
    }
    /**
     * Setup event listeners
     */
    initializeEvents() {
      this.boundMethods.handleResize = debounce(() => this.checkResponsive(), 250);
      window.addEventListener("resize", this.boundMethods.handleResize);
      this.boundMethods.handleVisibilityChange = () => this.handleVisibilityChange();
      document.addEventListener("visibilitychange", this.boundMethods.handleVisibilityChange);
      this.boundMethods.handleKeydown = (e) => this.handleKeydown(e);
      this.element.addEventListener("keydown", this.boundMethods.handleKeydown);
      if (this.options.draggable && this.state.slideList) {
        this.boundMethods.handleMouseDown = (e) => this.startDrag(e);
        this.state.slideList.addEventListener("mousedown", this.boundMethods.handleMouseDown);
      }
      if (this.options.swipe && this.state.slideList && "ontouchstart" in window) {
        this.boundMethods.handleTouchStart = (e) => this.startDrag(e);
        this.boundMethods.handleTouchEnd = (e) => this.endDrag(e);
        this.boundMethods.handleTouchMove = (e) => this.trackDrag(e);
        this.state.slideList.addEventListener("touchstart", this.boundMethods.handleTouchStart, { passive: true });
        this.state.slideList.addEventListener("touchend", this.boundMethods.handleTouchEnd, { passive: true });
        this.state.slideList.addEventListener("touchmove", this.boundMethods.handleTouchMove, { passive: false });
      }
      this.boundMethods.handleFocus = () => this.handleFocus();
      this.boundMethods.handleBlur = () => this.handleBlur();
      this.element.addEventListener("focusin", this.boundMethods.handleFocus, true);
      this.element.addEventListener("focusout", this.boundMethods.handleBlur, true);
      if (this.options.focusOnSelect && this.state.slideTrack) {
        this.boundMethods.handleSlideClick = (e) => this.handleSlideClick(e);
        this.state.slideTrack.addEventListener("click", this.boundMethods.handleSlideClick);
      }
    }
    /**
     * Resolve slide index into range [0, slideCount - 1]
     */
    normalizeSlideIndex(index) {
      if (this.state.slideCount <= 0 || !Number.isFinite(index)) {
        return 0;
      }
      const count = this.state.slideCount;
      let normalized = index % count;
      if (normalized < 0) {
        normalized += count;
      }
      return normalized;
    }
    /**
     * Resolve asNavFor option to slider instances
     */
    getNavTargetInstances() {
      const asNavFor = this.options.asNavFor;
      if (!asNavFor) {
        return [];
      }
      const targets = [];
      if (typeof asNavFor === "string") {
        const elements = Array.from(document.querySelectorAll(asNavFor));
        elements.forEach((element) => {
          const instanceId = element.getAttribute("data-slick-slider");
          if (!instanceId)
            return;
          const instance = this.constructor.INSTANCES.get(instanceId);
          if (instance && instance !== this) {
            targets.push(instance);
          }
        });
        return targets;
      }
      if (asNavFor instanceof _SlickSlider) {
        return asNavFor === this ? [] : [asNavFor];
      }
      if (asNavFor instanceof Element) {
        const instanceId = asNavFor.getAttribute("data-slick-slider");
        const instance = instanceId ? this.constructor.INSTANCES.get(instanceId) : null;
        return instance && instance !== this ? [instance] : [];
      }
      return [];
    }
    /**
     * Sync current slide to linked sliders (asNavFor)
     */
    syncAsNavFor(index, dontAnimate = false) {
      const targets = this.getNavTargetInstances();
      if (!targets.length) {
        return;
      }
      targets.forEach((target) => {
        if (!target || target.state.unslicked) {
          return;
        }
        const targetIndex = target.normalizeSlideIndex(index);
        if (target.state.currentSlide === targetIndex) {
          return;
        }
        target.state.suppressNavSync = true;
        target.goTo(targetIndex, dontAnimate);
        target.state.suppressNavSync = false;
      });
    }
    /**
     * Handle click-to-select on slide track
     */
    handleSlideClick(e) {
      const targetSlide = e.target.closest(".slick-slide");
      if (!targetSlide || !this.state.slideTrack || !this.state.slideTrack.contains(targetSlide)) {
        return;
      }
      const rawIndex = parseInt(getAttribute(targetSlide, "data-slick-index"), 10);
      if (Number.isNaN(rawIndex)) {
        return;
      }
      const index = this.normalizeSlideIndex(rawIndex);
      this.goTo(index);
    }
    /**
     * Public API: Go to next slide
     */
    next() {
      this.changeSlide({ data: { message: "next" } });
    }
    /**
     * Public API: Go to previous slide
     */
    prev() {
      this.changeSlide({ data: { message: "prev" } });
    }
    /**
     * Public API: Go to specific slide
     */
    goTo(index, dontAnimate = false) {
      if (index < 0 || index >= this.state.slideCount)
        return;
      this.changeSlide({ data: { message: "index", index } }, dontAnimate);
    }
    /**
     * Public API: Play autoplay
     */
    play() {
      if (!this.options.autoplay)
        return;
      this.state.paused = false;
      this.autoPlay();
      this.setAutoplayButtonState(false);
      this.emit("play");
    }
    /**
     * Public API: Pause autoplay
     */
    pause() {
      if (!this.options.autoplay)
        return;
      this.autoPlayClear();
      this.state.paused = true;
      this.setAutoplayButtonState(true);
      this.emit("pause");
    }
    /**
     * Public API: Get current slide index
     */
    getCurrentSlide() {
      return this.state.currentSlide;
    }
    /**
     * Public API: Get configuration option
     */
    getOption(option) {
      return this.options[option];
    }
    /**
     * Public API: Set configuration option
     */
    setOption(option, value) {
      this.options[option] = value;
      this.emit("setOption", { option, value });
    }
    /**
     * Public API: Add slide(s)
     * Adds new slide(s) to the carousel
     */
    addSlide(markup, index = null, addBefore = false) {
      if (!markup)
        return false;
      if (typeof index === "boolean") {
        addBefore = index;
        index = null;
      }
      if (index !== null && (index < 0 || index >= this.state.slideCount)) {
        return false;
      }
      this.unloadClones();
      let newSlide;
      if (typeof markup === "string") {
        newSlide = parseHTML(markup);
      } else {
        newSlide = markup;
      }
      if (typeof index === "number") {
        if (index === 0 && this.state.slides.length === 0) {
          appendChild(this.state.slideTrack, newSlide);
        } else if (addBefore) {
          const targetSlide = this.state.slides[index];
          if (targetSlide && targetSlide.parentNode) {
            insertBefore(targetSlide, newSlide);
          } else {
            appendChild(this.state.slideTrack, newSlide);
          }
        } else {
          const targetSlide = this.state.slides[index];
          if (targetSlide && targetSlide.nextSibling) {
            insertBefore(targetSlide.nextSibling, newSlide);
          } else if (targetSlide && targetSlide.parentNode) {
            appendChild(this.state.slideTrack, newSlide);
          }
        }
      } else {
        if (addBefore === true) {
          if (this.state.slideTrack.firstChild) {
            insertBefore(this.state.slideTrack.firstChild, newSlide);
          } else {
            appendChild(this.state.slideTrack, newSlide);
          }
        } else {
          appendChild(this.state.slideTrack, newSlide);
        }
      }
      addClass(newSlide, "slick-slide");
      this.state.slides = getChildren(this.state.slideTrack).filter((el) => !hasClass(el, "slick-cloned"));
      this.state.slideCount = this.state.slides.length;
      this.reinit();
      this.emit("addSlide");
      return true;
    }
    /**
     * Public API: Remove slide
     * Removes a slide from the carousel
     */
    removeSlide(index, removeBefore = false, removeAll = false) {
      if (this.state.slideCount < 1 || index < 0 || index > this.state.slideCount - 1) {
        return false;
      }
      this.unloadClones();
      if (removeAll === true) {
        while (this.state.slideTrack.firstChild) {
          const child = this.state.slideTrack.firstChild;
          if (!hasClass(child, "slick-cloned")) {
            remove(child);
          }
        }
      } else {
        const slideToRemove = this.state.slides[index];
        if (slideToRemove) {
          remove(slideToRemove);
        }
      }
      this.state.slides = getChildren(this.state.slideTrack).filter((el) => !hasClass(el, "slick-cloned"));
      this.state.slideCount = this.state.slides.length;
      if (this.state.currentSlide >= this.state.slideCount && this.state.currentSlide !== 0) {
        this.state.currentSlide = this.state.currentSlide - this.options.slidesToScroll;
      }
      this.reinit();
      this.emit("removeSlide");
      return true;
    }
    /**
     * Alias for addSlide (jQuery Slick compatibility)
     */
    slickAdd(markup, index = null, addBefore = false) {
      return this.addSlide(markup, index, addBefore);
    }
    /**
     * Alias for removeSlide (jQuery Slick compatibility)
     */
    slickRemove(index, removeBefore = false, removeAll = false) {
      return this.removeSlide(index, removeBefore, removeAll);
    }
    /**
     * Alias for slickFilter (jQuery Slick compatibility)
     */
    filterSlides(filter) {
      return this.slickFilter(filter);
    }
    /**
     * Public API: Filter slides (jQuery Slick compatibility)
     */
    slickFilter(filter) {
      if (filter == null || !this.state.slideTrack) {
        return false;
      }
      if (!this.state.slidesCache) {
        this.state.slidesCache = this.state.slides.slice();
      }
      this.unloadClones();
      const filteredSlides = this.state.slidesCache.filter(
        (slide, index) => this.matchesSlideFilter(slide, filter, index)
      );
      empty(this.state.slideTrack);
      filteredSlides.forEach((slide) => appendChild(this.state.slideTrack, slide));
      this.state.currentSlide = 0;
      this.reinit();
      this.emit("filter");
      return true;
    }
    /**
     * Alias for slickUnfilter (jQuery Slick compatibility)
     */
    unfilterSlides() {
      return this.slickUnfilter();
    }
    /**
     * Public API: Remove active filter and restore all slides (jQuery Slick compatibility)
     */
    slickUnfilter() {
      if (!this.state.slideTrack || !this.state.slidesCache) {
        return false;
      }
      this.unloadClones();
      empty(this.state.slideTrack);
      this.state.slidesCache.forEach((slide) => appendChild(this.state.slideTrack, slide));
      this.state.slidesCache = null;
      this.state.currentSlide = 0;
      this.reinit();
      this.emit("unfilter");
      return true;
    }
    /**
     * Match slide against a jQuery-like filter selector or callback
     */
    matchesSlideFilter(slide, filter, index) {
      if (typeof filter === "function") {
        return Boolean(filter.call(slide, index, slide));
      }
      if (typeof filter !== "string") {
        return false;
      }
      const hasEvenPseudo = /:even\b/.test(filter);
      const hasOddPseudo = /:odd\b/.test(filter);
      const selector = filter.replace(/:even\b|:odd\b/g, "").trim();
      const parityMatch = hasEvenPseudo ? index % 2 === 0 : hasOddPseudo ? index % 2 === 1 : true;
      if (!parityMatch) {
        return false;
      }
      if (!selector) {
        return true;
      }
      try {
        return slide.matches(selector);
      } catch (e) {
        return false;
      }
    }
    /**
     * Public API: Destroy slider
     */
    destroy() {
      removeEventListener(window, "resize", this.boundMethods.handleResize);
      removeEventListener(document, "visibilitychange", this.boundMethods.handleVisibilityChange);
      removeEventListener(this.element, "keydown", this.boundMethods.handleKeydown);
      this.dispatcher.clear();
      if (this.state.pauseButton)
        remove(this.state.pauseButton);
      if (this.state.prevArrowElement)
        remove(this.state.prevArrowElement);
      if (this.state.nextArrowElement)
        remove(this.state.nextArrowElement);
      if (this.state.dots)
        remove(this.state.dots);
      this.state.unslicked = true;
      this.constructor.INSTANCES.delete(this.instanceId);
      this.emit("destroy");
    }
    /**
     * Handle slide change
     */
    changeSlide(e, dontAnimate = false) {
      const message = e?.data?.message;
      const previousSlide = this.normalizeSlideIndex(this.state.currentSlide);
      let targetSlide = previousSlide;
      if (message === "next") {
        targetSlide = previousSlide + this.options.slidesToScroll;
      } else if (message === "prev") {
        targetSlide = previousSlide - this.options.slidesToScroll;
      } else if (message === "index" && Number.isInteger(e?.data?.index)) {
        targetSlide = e.data.index;
      }
      if (this.options.fade) {
        if (!this.options.infinite) {
          targetSlide = Math.max(0, Math.min(targetSlide, this.state.slideCount - 1));
        } else {
          targetSlide = this.normalizeSlideIndex(targetSlide);
        }
        if (targetSlide === previousSlide)
          return;
        if (this.state.animating && this.options.waitForAnimate)
          return;
        this.emit("beforeChange", { previousSlide, nextSlide: targetSlide });
        const shouldAnimate2 = this.options.useCSS && !dontAnimate && this.options.speed > 0;
        this.state.currentSlide = targetSlide;
        if (!this.state.suppressNavSync && this.options.asNavFor) {
          this.syncAsNavFor(targetSlide, dontAnimate);
        }
        if (shouldAnimate2) {
          this.state.animating = true;
          this.fadeSlideTransition(previousSlide, targetSlide, () => {
            this.state.animating = false;
            this.setPosition();
            this.emit("afterChange", { currentSlide: this.state.currentSlide });
          });
        } else {
          this.state.animating = false;
          this.setPosition();
          this.emit("afterChange", { currentSlide: this.state.currentSlide });
        }
        return;
      }
      if (!this.options.infinite) {
        targetSlide = Math.max(0, Math.min(targetSlide, this.state.slideCount - 1));
      }
      if (targetSlide === previousSlide)
        return;
      if (this.state.animating && this.options.waitForAnimate)
        return;
      this.emit("beforeChange", { previousSlide, nextSlide: targetSlide });
      const shouldAnimate = this.options.useCSS && !dontAnimate && this.options.speed > 0;
      this.state.animating = shouldAnimate;
      if (shouldAnimate) {
        applyTransition(this.state.slideTrack, this.options.speed, this.options.cssEase);
        this.animateHeight();
      } else {
        removeTransition(this.state.slideTrack);
      }
      this.state.currentSlide = targetSlide;
      const normalizedTarget = this.normalizeSlideIndex(targetSlide);
      if (!this.state.suppressNavSync && this.options.asNavFor) {
        this.syncAsNavFor(normalizedTarget, dontAnimate);
      }
      this.setPosition();
      if (shouldAnimate) {
        window.setTimeout(() => {
          if (this.options.infinite) {
            let repositionSlide = targetSlide;
            if (targetSlide >= this.state.slideCount) {
              repositionSlide = targetSlide % this.state.slideCount;
            } else if (targetSlide < 0) {
              repositionSlide = this.state.slideCount + targetSlide % this.state.slideCount;
            }
            if (repositionSlide !== targetSlide) {
              removeTransition(this.state.slideTrack);
              this.state.currentSlide = repositionSlide;
              this.setPosition();
            } else {
              removeTransition(this.state.slideTrack);
            }
          } else {
            removeTransition(this.state.slideTrack);
          }
          this.state.animating = false;
        }, this.options.speed);
      } else {
        this.state.animating = false;
      }
      this.emit("afterChange", { currentSlide: this.state.currentSlide });
    }
    /**
     * Quick reposition for infinite wrap - minimal calculations, no forced reflows
     * Used when wrapping from last slide to first (or vice versa) to maintain 60fps
     */
    quickReposition() {
      if (!this.state.slideList || !this.state.slideTrack)
        return;
      if (!this.state.slideWidth) {
        const listWidth = this.state.listWidth || getInnerWidth(this.state.slideList) || 400;
        this.state.slideWidth = Math.ceil(listWidth / this.options.slidesToShow);
      }
      let targetLeft = 0;
      if (this.options.variableWidth) {
        const allSlidesInDOM = selectAll(".slick-slide", this.state.slideTrack);
        let slideIndex = this.state.currentSlide;
        const cloneOffset = this.options.infinite && this.state.slideCount > this.options.slidesToShow ? this.options.centerMode ? this.options.slidesToShow + 1 : this.options.slidesToShow : 0;
        slideIndex = this.state.currentSlide + cloneOffset;
        if (slideIndex < 0 || slideIndex >= allSlidesInDOM.length) {
          slideIndex = Math.max(0, Math.min(slideIndex, allSlidesInDOM.length - 1));
        }
        const targetSlide = allSlidesInDOM[slideIndex];
        if (targetSlide) {
          const slideOffsetLeft = targetSlide.offsetLeft || 0;
          targetLeft = -slideOffsetLeft;
          if (this.options.centerMode && this.state.listWidth) {
            const slideWidth = getOuterWidth(targetSlide);
            targetLeft += (this.state.listWidth - slideWidth) / 2;
          }
        }
      } else {
        const allSlidesInDOM = selectAll(".slick-slide", this.state.slideTrack);
        const totalSlideCount = allSlidesInDOM.length;
        const trackWidth = Math.ceil(this.state.slideWidth * totalSlideCount);
        setStyle(this.state.slideTrack, "width", `${trackWidth}px`);
        let slideOffset = 0;
        if (this.options.infinite && this.state.slideCount > this.options.slidesToShow) {
          slideOffset = this.state.slideWidth * this.options.slidesToShow * -1;
        }
        if (this.state.slideCount <= this.options.slidesToShow) {
          slideOffset = 0;
        }
        if (this.options.centerMode && this.state.slideCount <= this.options.slidesToShow) {
          slideOffset = this.state.slideWidth * Math.floor(this.options.slidesToShow) / 2 - this.state.slideWidth * this.state.slideCount / 2;
        } else if (this.options.centerMode && this.options.infinite) {
          slideOffset += this.state.slideWidth * Math.floor(this.options.slidesToShow / 2) - this.state.slideWidth;
        } else if (this.options.centerMode) {
          slideOffset = 0;
          slideOffset += this.state.slideWidth * Math.floor(this.options.slidesToShow / 2);
        }
        targetLeft = this.state.currentSlide * this.state.slideWidth * -1 + slideOffset;
      }
      if (this.options.useTransform && this.state.transformsEnabled) {
        translate3d(this.state.slideTrack, targetLeft, 0, 0);
      } else {
        setStyle(this.state.slideTrack, "left", `${targetLeft}px`);
      }
      this.updateSlideVisibility();
      this.updateArrows();
      this.updateDots();
    }
    /**
     * Fade transition between slides (jQuery Slick parity)
     */
    fadeSlideTransition(fromIndex, toIndex, callback) {
      const fromSlide = this.state.slides[this.normalizeSlideIndex(fromIndex)];
      const toSlide = this.state.slides[this.normalizeSlideIndex(toIndex)];
      if (!toSlide) {
        if (callback)
          callback();
        return;
      }
      const transitionValue = `opacity ${this.options.speed}ms ${this.options.cssEase}`;
      if (fromSlide) {
        setStyle(fromSlide, "transition", transitionValue);
        setStyle(fromSlide, "opacity", "0");
        setStyle(fromSlide, "z-index", String(this.options.zIndex - 2));
      }
      setStyle(toSlide, "transition", transitionValue);
      setStyle(toSlide, "opacity", "1");
      setStyle(toSlide, "z-index", String(this.options.zIndex - 1));
      const newHeight = getOuterHeight(toSlide);
      if (newHeight > 0 && this.state.slideTrack) {
        setStyle(this.state.slideTrack, "height", `${newHeight}px`);
      }
      window.setTimeout(() => {
        if (fromSlide) {
          setStyle(fromSlide, "transition", "");
        }
        setStyle(toSlide, "transition", "");
        if (callback)
          callback();
      }, this.options.speed);
    }
    /**
     * Position slides for fade mode (jQuery Slick parity)
     * Uses absolute positioning so all slides overlap at the same location
     */
    setFade() {
      if (!this.state.slideTrack)
        return;
      const slides = selectAll(".slick-slide", this.state.slideTrack);
      if (!slides.length)
        return;
      let maxHeight = 0;
      slides.forEach((slide) => {
        const slideHeight = getOuterHeight(slide);
        if (slideHeight > maxHeight) {
          maxHeight = slideHeight;
        }
      });
      if (maxHeight > 0) {
        setStyle(this.state.slideTrack, "height", `${maxHeight}px`);
      }
      slides.forEach((slide, index) => {
        setStyle(slide, "position", "absolute");
        setStyle(slide, "left", "0");
        setStyle(slide, "top", "0");
        setStyle(slide, "width", "100%");
        setStyle(slide, "opacity", "0");
        setStyle(slide, "z-index", String(this.options.zIndex - 2));
        setStyle(slide, "transition", "");
      });
      const currentIndex = Math.max(0, Math.min(this.state.currentSlide, slides.length - 1));
      if (slides[currentIndex]) {
        setStyle(slides[currentIndex], "opacity", "1");
        setStyle(slides[currentIndex], "z-index", String(this.options.zIndex - 1));
      }
    }
    /**
     * Set slide position
     */
    setPosition() {
      if (!this.state.slideList || !this.state.slideTrack)
        return;
      if (this.options.centerMode) {
        if (this.options.vertical) {
          setStyle(this.state.slideList, "padding", `${this.options.centerPadding} 0px`);
        } else {
          setStyle(this.state.slideList, "padding", `0px ${this.options.centerPadding}`);
        }
      } else {
        setStyle(this.state.slideList, "padding", "0px");
      }
      void this.state.slideList.offsetWidth;
      let listWidth = getInnerWidth(this.state.slideList) || getDimensions(this.state.slideList).width;
      if (!listWidth || listWidth <= 0) {
        const containerWidth = getDimensions(this.state.slideList).width;
        if (containerWidth && containerWidth > 0) {
          listWidth = containerWidth;
        } else {
          const parentWidth = this.element.offsetWidth || window.innerWidth;
          listWidth = parentWidth > 0 ? parentWidth : 300;
        }
      }
      this.state.listWidth = listWidth;
      if (this.options.fade) {
        this.state.slideWidth = listWidth;
        setStyle(this.state.slideTrack, "width", `${listWidth}px`);
        setStyle(this.state.slideTrack, "position", "relative");
        setStyle(this.state.slideTrack, "left", "0");
        setStyle(this.state.slideTrack, "top", "0");
        setStyle(this.state.slideTrack, "transform", "none");
        this.setFade();
        this.updateSlideVisibility();
        this.updateDots();
        this.updateArrows();
        this.updateNavigationVisibility();
        this.setHeight();
        return;
      }
      let trackWidth = 0;
      let targetLeft = 0;
      let slideOffset = 0;
      if (this.options.variableWidth) {
        const allSlidesInDOM = selectAll(".slick-slide", this.state.slideTrack);
        const totalSlideCount = allSlidesInDOM.length;
        trackWidth = 5e3 * totalSlideCount;
        setStyle(this.state.slideTrack, "width", `${trackWidth}px`);
        allSlidesInDOM.forEach((slide) => {
          if (slide.style.display === "none") {
            setStyle(slide, "display", "block");
          }
        });
        void this.state.slideTrack.offsetHeight;
        void this.state.slideTrack.getBoundingClientRect();
        allSlidesInDOM.forEach((slide) => void slide.offsetLeft);
        let slideIndex = this.state.currentSlide;
        const cloneOffset = this.options.infinite && this.state.slideCount > this.options.slidesToShow ? this.options.centerMode ? this.options.slidesToShow + 1 : this.options.slidesToShow : 0;
        slideIndex = this.state.currentSlide + cloneOffset;
        if (slideIndex < 0 || slideIndex >= allSlidesInDOM.length) {
          slideIndex = Math.max(0, Math.min(slideIndex, allSlidesInDOM.length - 1));
        }
        const targetSlide = allSlidesInDOM[slideIndex];
        if (targetSlide) {
          const slideOffsetLeft = targetSlide.offsetLeft || 0;
          if (this.options.rtl && !this.options.vertical) {
            const slideWidth = getOuterWidth(targetSlide);
            targetLeft = -(trackWidth - slideOffsetLeft - slideWidth);
          } else {
            targetLeft = -slideOffsetLeft;
          }
          if (this.options.centerMode) {
            const slideWidth = getOuterWidth(targetSlide);
            targetLeft += (listWidth - slideWidth) / 2;
          }
        }
        this.state.slideWidth = listWidth;
      } else {
        this.state.slideWidth = Math.ceil(listWidth / this.options.slidesToShow);
        const allSlidesInDOM = selectAll(".slick-slide", this.state.slideTrack);
        const slidesToStyle = allSlidesInDOM && allSlidesInDOM.length > 0 ? allSlidesInDOM : this.state.slides;
        const totalSlideCount = slidesToStyle.length;
        trackWidth = Math.ceil(this.state.slideWidth * totalSlideCount);
        setStyle(this.state.slideTrack, "width", `${trackWidth}px`);
        let offset = 0;
        const firstSlide = this.state.slides[0];
        if (firstSlide) {
          const styles = window.getComputedStyle(firstSlide);
          const marginLeft = parseFloat(styles.marginLeft) || 0;
          const marginRight = parseFloat(styles.marginRight) || 0;
          const paddingLeft = parseFloat(styles.paddingLeft) || 0;
          const paddingRight = parseFloat(styles.paddingRight) || 0;
          const borderLeft = parseFloat(styles.borderLeft) || 0;
          const borderRight = parseFloat(styles.borderRight) || 0;
          offset = marginLeft + marginRight + paddingLeft + paddingRight + borderLeft + borderRight;
        }
        const slideWidthToSet = Math.max(0, this.state.slideWidth - offset);
        slidesToStyle.forEach((slide) => {
          setStyle(slide, "width", `${slideWidthToSet}px`);
        });
        slideOffset = 0;
        if (this.options.infinite) {
          if (this.state.slideCount > this.options.slidesToShow) {
            slideOffset = this.state.slideWidth * this.options.slidesToShow * -1;
          }
        } else {
          if (this.state.currentSlide + this.options.slidesToShow > this.state.slideCount) {
            slideOffset = (this.state.currentSlide + this.options.slidesToShow - this.state.slideCount) * this.state.slideWidth;
          }
        }
        if (this.state.slideCount <= this.options.slidesToShow) {
          slideOffset = 0;
        }
        if (this.options.centerMode && this.state.slideCount <= this.options.slidesToShow) {
          slideOffset = this.state.slideWidth * Math.floor(this.options.slidesToShow) / 2 - this.state.slideWidth * this.state.slideCount / 2;
        } else if (this.options.centerMode && this.options.infinite) {
          slideOffset += this.state.slideWidth * Math.floor(this.options.slidesToShow / 2) - this.state.slideWidth;
        } else if (this.options.centerMode) {
          slideOffset = 0;
          slideOffset += this.state.slideWidth * Math.floor(this.options.slidesToShow / 2);
        }
        targetLeft = this.state.currentSlide * this.state.slideWidth * -1 + slideOffset;
      }
      setStyle(this.state.slideTrack, "width", `${trackWidth}px`);
      if (this.options.rtl && !this.options.vertical && !this.options.fade) {
        targetLeft = -targetLeft;
      }
      if (this.options.fade) {
        this.setFade();
      } else if (this.options.useTransform && this.state.transformsEnabled) {
        translate3d(this.state.slideTrack, targetLeft, 0, 0);
      } else {
        setStyle(this.state.slideTrack, "left", `${targetLeft}px`);
      }
      this.updateSlideVisibility();
      this.updateDots();
      this.updateArrows();
      this.updateNavigationVisibility();
      this.setHeight();
    }
    /**
     * Get total margin width (left + right) of a slide
     */
    getSlideMargins(slide) {
      const styles = window.getComputedStyle(slide);
      const marginLeft = parseFloat(styles.marginLeft) || 0;
      const marginRight = parseFloat(styles.marginRight) || 0;
      return marginLeft + marginRight;
    }
    /**
     * Update slide ARIA hidden states and active classes
     */
    updateSlideVisibility() {
      if (!this.state.slideTrack)
        return;
      const allSlides = selectAll(".slick-slide", this.state.slideTrack);
      if (this.options.fade) {
        allSlides.forEach((slide) => {
          removeClass(slide, "slick-active");
          removeClass(slide, "slick-current");
          removeClass(slide, "slick-center");
        });
        if (allSlides[this.state.currentSlide]) {
          addClass(allSlides[this.state.currentSlide], "slick-active");
          addClass(allSlides[this.state.currentSlide], "slick-current");
        }
        if (this.options.lazyLoad === "ondemand" || this.options.lazyLoad === "anticipated") {
          this.lazyLoad();
        }
        return;
      }
      allSlides.forEach((slide) => {
        removeClass(slide, "slick-active");
        removeClass(slide, "slick-current");
        removeClass(slide, "slick-center");
        setAttribute(slide, "aria-hidden", "true");
      });
      const hasClones = selectAll(".slick-cloned", this.state.slideTrack).length > 0;
      const offsetForClones = hasClones && this.options.infinite && this.state.slideCount > this.options.slidesToShow ? this.options.centerMode ? this.options.slidesToShow + 1 : this.options.slidesToShow : 0;
      const centerOffset = this.options.centerMode ? Math.floor(this.options.slidesToShow / 2) : 0;
      const visibleStart = offsetForClones + this.state.currentSlide - centerOffset;
      const visibleEnd = visibleStart + this.options.slidesToShow;
      const centerIndex = offsetForClones + this.state.currentSlide;
      allSlides.forEach((slide, index) => {
        if (index >= visibleStart && index < visibleEnd) {
          addClass(slide, "slick-active");
          removeAttribute(slide, "aria-hidden");
        }
        if (index === centerIndex) {
          addClass(slide, "slick-current");
          if (this.options.centerMode) {
            addClass(slide, "slick-center");
          }
        }
      });
      if (this.options.lazyLoad === "ondemand" || this.options.lazyLoad === "anticipated") {
        this.lazyLoad();
      }
    }
    /**
     * Update arrow disabled states
     */
    updateArrows() {
      if (!this.options.arrows)
        return;
      if (!this.state.prevArrowElement || !this.state.nextArrowElement)
        return;
      const maxIndex = Math.max(0, this.state.slideCount - this.options.slidesToShow);
      const disablePrev = !this.options.infinite && this.state.currentSlide === 0;
      const disableNext = !this.options.infinite && this.state.currentSlide >= maxIndex;
      if (disablePrev) {
        addClass(this.state.prevArrowElement, "slick-disabled");
        setAttribute(this.state.prevArrowElement, "disabled", "disabled");
      } else {
        removeClass(this.state.prevArrowElement, "slick-disabled");
        removeAttribute(this.state.prevArrowElement, "disabled");
      }
      if (disableNext) {
        addClass(this.state.nextArrowElement, "slick-disabled");
        setAttribute(this.state.nextArrowElement, "disabled", "disabled");
      } else {
        removeClass(this.state.nextArrowElement, "slick-disabled");
        removeAttribute(this.state.nextArrowElement, "disabled");
      }
    }
    /**
     * Update navigation visibility based on slide count
     * Hide arrows and dots if there aren't enough slides
     */
    updateNavigationVisibility() {
      const shouldShowNav = this.state.slideCount > this.options.slidesToShow;
      if (this.state.prevArrowElement) {
        if (shouldShowNav) {
          removeClass(this.state.prevArrowElement, "slick-hidden");
          removeAttribute(this.state.prevArrowElement, "aria-hidden");
        } else {
          addClass(this.state.prevArrowElement, "slick-hidden");
          setAttribute(this.state.prevArrowElement, "aria-hidden", "true");
        }
      }
      if (this.state.nextArrowElement) {
        if (shouldShowNav) {
          removeClass(this.state.nextArrowElement, "slick-hidden");
          removeAttribute(this.state.nextArrowElement, "aria-hidden");
        } else {
          addClass(this.state.nextArrowElement, "slick-hidden");
          setAttribute(this.state.nextArrowElement, "aria-hidden", "true");
        }
      }
      if (this.state.dots) {
        if (shouldShowNav) {
          removeClass(this.state.dots, "slick-hidden");
          removeAttribute(this.state.dots, "aria-hidden");
        } else {
          addClass(this.state.dots, "slick-hidden");
          setAttribute(this.state.dots, "aria-hidden", "true");
        }
      }
    }
    /**
     * Set list height to match current slide height (for adaptive height)
     */
    setHeight() {
      if (this.options.slidesToShow === 1 && this.options.adaptiveHeight === true && !this.options.vertical && this.state.slideList) {
        let slideIndex = this.state.currentSlide;
        if (this.options.infinite && slideIndex >= this.state.slideCount) {
          slideIndex = slideIndex % this.state.slideCount;
        } else if (this.options.infinite && slideIndex < 0) {
          slideIndex = this.state.slideCount + slideIndex % this.state.slideCount;
        }
        const currentSlide = this.state.slides[slideIndex];
        if (currentSlide) {
          const targetHeight = getOuterHeight(currentSlide);
          setStyle(this.state.slideList, "height", `${targetHeight}px`);
        }
      }
    }
    /**
     * Animate list height to match slide height when changing slides
     */
    animateHeight() {
      if (this.options.slidesToShow === 1 && this.options.adaptiveHeight === true && !this.options.vertical && this.state.slideList) {
        let slideIndex = this.state.currentSlide;
        if (this.options.infinite && slideIndex >= this.state.slideCount) {
          slideIndex = slideIndex % this.state.slideCount;
        } else if (this.options.infinite && slideIndex < 0) {
          slideIndex = this.state.slideCount + slideIndex % this.state.slideCount;
        }
        const currentSlide = this.state.slides[slideIndex];
        if (currentSlide) {
          const targetHeight = getOuterHeight(currentSlide);
          if (this.state.animating) {
            applyTransition(this.state.slideList, this.options.speed, this.options.cssEase);
            setStyle(this.state.slideList, "height", `${targetHeight}px`);
            window.setTimeout(() => {
              removeTransition(this.state.slideList);
            }, this.options.speed);
          } else {
            setStyle(this.state.slideList, "height", `${targetHeight}px`);
          }
        }
      }
    }
    /**
     * Handle previous arrow click
     */
    prevClick() {
      this.prev();
    }
    /**
     * Handle next arrow click
     */
    nextClick() {
      this.next();
    }
    /**
     * Handle dot click
     */
    dotClick(e) {
      const index = parseInt(getAttribute(e.currentTarget, "data-slide-index"));
      this.goTo(index);
    }
    /**
     * Start drag/swipe
     */
    startDrag(e) {
      const touch = e.type === "touchstart" ? e.touches[0] : e;
      this.state.touchObject = {
        startX: touch.pageX,
        startY: touch.pageY,
        curX: touch.pageX,
        curY: touch.pageY
      };
      this.state.dragging = true;
      this.state.touchStartTime = (/* @__PURE__ */ new Date()).getTime();
      if (e.type === "mousedown") {
        this.boundMethods.handleMouseMove = (e2) => this.trackDrag(e2);
        this.boundMethods.handleMouseUp = (e2) => this.endDrag(e2);
        document.addEventListener("mousemove", this.boundMethods.handleMouseMove);
        document.addEventListener("mouseup", this.boundMethods.handleMouseUp);
      }
    }
    /**
     * Track drag/swipe movement
     */
    trackDrag(e) {
      if (!this.state.dragging)
        return;
      const touch = e.type.indexOf("touch") !== -1 ? e.touches[0] : e;
      this.state.touchObject.curX = touch.pageX;
      this.state.touchObject.curY = touch.pageY;
      const swipeLength = Math.round(Math.sqrt(
        Math.pow(this.state.touchObject.curX - this.state.touchObject.startX, 2) + Math.pow(this.state.touchObject.curY - this.state.touchObject.startY, 2)
      ));
      if (swipeLength > this.options.touchThreshold) {
        this.state.swiping = true;
        const swipeAngle = Math.atan2(
          this.state.touchObject.curY - this.state.touchObject.startY,
          this.state.touchObject.curX - this.state.touchObject.startX
        ) * 180 / Math.PI;
        const horizontalSwipe = Math.abs(swipeAngle) < 45 || Math.abs(swipeAngle) > 135;
        const verticalSwipe = Math.abs(swipeAngle) >= 45 && Math.abs(swipeAngle) <= 135;
        if (this.options.vertical && verticalSwipe) {
          if (e.type === "touchmove" && this.options.touchMove) {
            e.preventDefault();
          }
          const swipeDistance = this.state.touchObject.curY - this.state.touchObject.startY;
          this.swipeHandler(swipeDistance);
        } else if (!this.options.vertical && horizontalSwipe) {
          if (e.type === "touchmove" && this.options.touchMove) {
            e.preventDefault();
          }
          const swipeDistance = this.state.touchObject.curX - this.state.touchObject.startX;
          this.swipeHandler(swipeDistance);
        }
      }
    }
    /**
     * End drag/swipe
     */
    endDrag(e) {
      if (!this.state.dragging)
        return;
      this.state.dragging = false;
      if (e.type === "mouseup") {
        document.removeEventListener("mousemove", this.boundMethods.handleMouseMove);
        document.removeEventListener("mouseup", this.boundMethods.handleMouseUp);
      }
      if (this.state.swiping) {
        this.state.swiping = false;
        const swipeTime = (/* @__PURE__ */ new Date()).getTime() - this.state.touchStartTime;
        const swipeDistance = this.options.vertical ? this.state.touchObject.curY - this.state.touchObject.startY : this.state.touchObject.curX - this.state.touchObject.startX;
        const referenceWidth = this.options.variableWidth ? this.state.listWidth : this.state.slideWidth;
        const minSwipe = referenceWidth / (this.options.touchThreshold || 5);
        if (Math.abs(swipeDistance) > minSwipe) {
          if (swipeDistance > 0) {
            this.prev();
          } else {
            this.next();
          }
        } else {
          this.setPosition();
        }
      }
      this.state.touchObject = {};
    }
    /**
     * Handle swipe movement
     */
    swipeHandler(swipeDistance) {
      if (this.options.variableWidth)
        return;
      const currentLeft = this.state.currentSlide * -this.state.slideWidth;
      const targetLeft = currentLeft + swipeDistance;
      let adjustedDistance = swipeDistance;
      if (!this.options.infinite) {
        const maxLeft = 0;
        const minLeft = -(this.state.slideCount - this.options.slidesToShow) * this.state.slideWidth;
        if (targetLeft > maxLeft) {
          adjustedDistance = swipeDistance * this.options.edgeFriction;
        } else if (targetLeft < minLeft) {
          adjustedDistance = swipeDistance * this.options.edgeFriction;
        }
      }
      const newLeft = currentLeft + adjustedDistance;
      translate3d(this.state.slideTrack, newLeft, 0, 0);
    }
    /**
     * Handle keyboard navigation
     */
    handleKeydown(e) {
    }
    /**
     * Handle focus
     */
    handleFocus() {
      this.state.focussed = true;
      if (this.options.pauseOnFocus && this.options.autoplay) {
        this.pause();
      }
    }
    /**
     * Handle blur
     */
    handleBlur() {
      this.state.focussed = false;
      if (this.options.autoplay && !this.state.paused) {
        this.play();
      }
    }
    /**
     * Handle visibility change (tab switch)
     */
    handleVisibilityChange() {
      if (document.hidden) {
        this.state.interrupted = true;
        if (this.options.autoplay) {
          this.autoPlayClear();
        }
      } else {
        this.state.interrupted = false;
        if (this.options.autoplay && !this.state.paused) {
          this.autoPlay();
        }
      }
    }
    /**
     * Start autoplay
     */
    autoPlay() {
      this.state.paused = false;
      this.state.autoPlayTimer = setInterval(() => {
        if (!this.state.paused && !this.state.interrupted && !this.state.focussed) {
          this.next();
        }
      }, this.options.autoplaySpeed);
    }
    /**
     * Clear autoplay timer
     */
    autoPlayClear() {
      if (this.state.autoPlayTimer) {
        clearInterval(this.state.autoPlayTimer);
        this.state.autoPlayTimer = null;
      }
    }
    /**
     * Handle autoplay button toggle
     */
    autoPlayToggleHandler() {
      if (this.state.paused) {
        this.play();
      } else {
        this.pause();
      }
    }
    /**
     * Check responsive breakpoints
     */
    checkResponsive(initial = false) {
      if (!this.options.responsive || !Array.isArray(this.options.responsive)) {
        return;
      }
      const windowWidth = getWindowDimensions().width;
      let targetBreakpoint = null;
      let targetSettings = null;
      let respondToWidth = windowWidth;
      if (this.options.respondTo === "window") {
        respondToWidth = windowWidth;
      } else if (this.options.respondTo === "slider") {
        respondToWidth = getDimensions(this.element).width;
      } else if (this.options.respondTo === "min") {
        respondToWidth = Math.min(windowWidth, getDimensions(this.element).width);
      }
      this.originalOptions.responsive.forEach((breakpoint) => {
        if (breakpoint.breakpoint) {
          if (this.originalOptions.mobileFirst) {
            if (respondToWidth >= breakpoint.breakpoint) {
              targetBreakpoint = breakpoint.breakpoint;
              targetSettings = breakpoint.settings;
            }
          } else {
            if (respondToWidth < breakpoint.breakpoint) {
              if (targetBreakpoint === null || breakpoint.breakpoint < targetBreakpoint) {
                targetBreakpoint = breakpoint.breakpoint;
                targetSettings = breakpoint.settings;
              }
            }
          }
        }
      });
      if (targetSettings) {
        if (targetSettings === "unslick") {
          this.unslick();
        } else {
          const optionsChanged = this.state.activeBreakpoint !== targetBreakpoint;
          if (optionsChanged) {
            this.state.activeBreakpoint = targetBreakpoint;
            const currentSlide = this.state.currentSlide;
            const newOptions = extend({}, this.originalOptions, targetSettings);
            this.options = newOptions;
            this.refresh();
            if (currentSlide < this.state.slideCount) {
              this.state.currentSlide = currentSlide;
              this.setPosition();
            }
            this.emit("breakpoint", { breakpoint: targetBreakpoint });
          }
        }
      } else if (this.state.activeBreakpoint !== null) {
        this.state.activeBreakpoint = null;
        const currentSlide = this.state.currentSlide;
        this.options = extend({}, this.originalOptions);
        this.refresh();
        if (currentSlide < this.state.slideCount) {
          this.state.currentSlide = currentSlide;
          this.setPosition();
        }
        this.emit("breakpoint", { breakpoint: null });
      }
    }
    /**
     * Refresh slider without destroying/recreating
     */
    refresh() {
      if (this.state.dots) {
        remove(this.state.dots);
        this.state.dots = null;
        removeClass(this.element, "slick-dotted");
      }
      if (this.options.dots) {
        this.buildDots();
      }
      if (this.options.arrows && (!this.state.prevArrowElement || !this.state.nextArrowElement)) {
        this.buildArrows();
      } else if (!this.options.arrows) {
        if (this.state.prevArrowElement) {
          remove(this.state.prevArrowElement);
          this.state.prevArrowElement = null;
        }
        if (this.state.nextArrowElement) {
          remove(this.state.nextArrowElement);
          this.state.nextArrowElement = null;
        }
      }
      this.setPosition();
    }
    /**
     * Reinitialize slider after slides have been added/removed
     */
    reinit() {
      const allSlides = getChildren(this.state.slideTrack);
      this.state.slides = allSlides.filter((slide) => !hasClass(slide, "slick-cloned"));
      this.state.slideCount = this.state.slides.length;
      if (this.state.currentSlide >= this.state.slideCount && this.state.currentSlide !== 0) {
        this.state.currentSlide = this.state.currentSlide - this.options.slidesToScroll;
      }
      if (this.state.slideCount <= this.options.slidesToShow) {
        this.state.currentSlide = 0;
      }
      this.state.slides.forEach((slide, index) => {
        addClass(slide, "slick-slide");
        setAttribute(slide, "data-slick-index", index);
      });
      if (this.options.infinite) {
        this.setupInfinite();
      }
      if (this.options.arrows && this.state.slideCount > this.options.slidesToShow) {
        if (!this.state.prevArrowElement) {
          this.buildArrows();
        }
      }
      if (this.options.dots && this.state.slideCount > this.options.slidesToShow) {
        if (!this.state.dots) {
          this.buildDots();
        } else {
          const dotCount = Math.ceil(this.state.slideCount / this.options.slidesToScroll);
          const dotContainer = this.state.dots;
          empty(dotContainer);
          for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement("li");
            const button = document.createElement("button");
            const icon = document.createElement("span");
            addClass(icon, "slick-dot-icon");
            setAttribute(button, "aria-label", `Go to slide ${i + 1}`);
            setAttribute(button, "data-slide-index", i);
            if (i === 0)
              addClass(dot, "slick-active");
            button.addEventListener("click", (e) => this.dotClick(e));
            appendChild(button, icon);
            appendChild(dot, button);
            appendChild(dotContainer, dot);
          }
        }
      }
      this.setPosition();
      this.updateSlideVisibility();
      this.updateNavigationVisibility();
      this.emit("reInit");
    }
    /**
     * Unload cloned slides (used by addSlide/removeSlide)
     */
    unloadClones() {
      const clones = selectAll(".slick-cloned", this.state.slideTrack);
      clones.forEach((clone2) => remove(clone2));
    }
    /**
     * Unload slider elements
     */
    unload() {
      if (this.boundMethods.handleResize) {
        window.removeEventListener("resize", this.boundMethods.handleResize);
      }
      if (this.boundMethods.handleVisibilityChange) {
        document.removeEventListener("visibilitychange", this.boundMethods.handleVisibilityChange);
      }
      if (this.boundMethods.handleKeydown) {
        this.element.removeEventListener("keydown", this.boundMethods.handleKeydown);
      }
      if (this.boundMethods.handleMouseDown && this.state.slideList) {
        this.state.slideList.removeEventListener("mousedown", this.boundMethods.handleMouseDown);
      }
      if (this.boundMethods.handleTouchStart && this.state.slideList) {
        this.state.slideList.removeEventListener("touchstart", this.boundMethods.handleTouchStart);
        this.state.slideList.removeEventListener("touchend", this.boundMethods.handleTouchEnd);
        this.state.slideList.removeEventListener("touchmove", this.boundMethods.handleTouchMove);
      }
      if (this.boundMethods.handleFocus) {
        this.element.removeEventListener("focusin", this.boundMethods.handleFocus, true);
      }
      if (this.boundMethods.handleBlur) {
        this.element.removeEventListener("focusout", this.boundMethods.handleBlur, true);
      }
      if (this.boundMethods.handleSlideClick && this.state.slideTrack) {
        this.state.slideTrack.removeEventListener("click", this.boundMethods.handleSlideClick);
      }
      if (this.state.autoPlayTimer) {
        clearInterval(this.state.autoPlayTimer);
        this.state.autoPlayTimer = null;
      }
      if (this.state.prevArrowElement && this.state.prevArrowElement.parentNode) {
        remove(this.state.prevArrowElement);
        this.state.prevArrowElement = null;
      }
      if (this.state.nextArrowElement && this.state.nextArrowElement.parentNode) {
        remove(this.state.nextArrowElement);
        this.state.nextArrowElement = null;
      }
      if (this.state.dots && this.state.dots.parentNode) {
        remove(this.state.dots);
        this.state.dots = null;
      }
      if (this.state.pauseButton && this.state.pauseButton.parentNode) {
        remove(this.state.pauseButton);
        this.state.pauseButton = null;
      }
      if (this.state.slideTrack && this.state.slideTrack.parentNode) {
        const slides = getChildren(this.state.slideTrack);
        slides.forEach((slide) => {
          appendChild(this.state.slideList, slide);
        });
        remove(this.state.slideTrack);
        this.state.slideTrack = null;
      }
    }
    /**
     * Load lazy images - handles data-lazy attribute on images
     * Supports 'ondemand' and 'anticipated' lazy loading modes
     */
    lazyLoad() {
      if (!this.options.lazyLoad)
        return;
      let rangeStart, rangeEnd, slideRange = [];
      if (this.options.centerMode === true) {
        if (this.options.infinite === true) {
          rangeStart = this.state.currentSlide + (Math.floor(this.options.slidesToShow / 2) + 1);
          rangeEnd = rangeStart + this.options.slidesToShow + 2;
        } else {
          rangeStart = Math.max(0, this.state.currentSlide - (Math.floor(this.options.slidesToShow / 2) + 1));
          rangeEnd = 2 + Math.floor(this.options.slidesToShow / 2) + this.state.currentSlide;
        }
      } else {
        rangeStart = this.options.infinite ? this.options.slidesToShow + this.state.currentSlide : this.state.currentSlide;
        rangeEnd = Math.ceil(rangeStart + this.options.slidesToShow);
        if (this.options.fade === true) {
          if (rangeStart > 0)
            rangeStart--;
          if (rangeEnd < this.state.slideCount)
            rangeEnd++;
        }
      }
      const allSlides = selectAll(".slick-slide", this.state.slideTrack);
      for (let i = rangeStart; i < rangeEnd; i++) {
        if (allSlides[i]) {
          slideRange.push(allSlides[i]);
        }
      }
      if (this.options.lazyLoad === "anticipated") {
        let prevSlide = rangeStart - 1;
        let nextSlide = rangeEnd;
        for (let i = 0; i < this.options.slidesToScroll; i++) {
          if (prevSlide < 0)
            prevSlide = this.state.slideCount - 1;
          if (allSlides[prevSlide]) {
            slideRange.unshift(allSlides[prevSlide]);
          }
          if (allSlides[nextSlide]) {
            slideRange.push(allSlides[nextSlide]);
          }
          prevSlide--;
          nextSlide++;
        }
      }
      slideRange.forEach((slide) => {
        this.loadImages(slide);
      });
      if (this.state.slideCount <= this.options.slidesToShow) {
        const clonedSlides = selectAll(".slick-cloned", this.state.slideTrack);
        clonedSlides.forEach((slide) => {
          this.loadImages(slide);
        });
      } else if (this.state.currentSlide >= this.state.slideCount - this.options.slidesToShow) {
        const clonedSlides = selectAll(".slick-cloned", this.state.slideTrack);
        clonedSlides.slice(0, this.options.slidesToShow).forEach((slide) => {
          this.loadImages(slide);
        });
      } else if (this.state.currentSlide === 0) {
        const clonedSlides = selectAll(".slick-cloned", this.state.slideTrack);
        clonedSlides.slice(this.options.slidesToShow * -1).forEach((slide) => {
          this.loadImages(slide);
        });
      }
    }
    /**
     * Load all unloaded images in a given scope
     */
    loadImages(imagesScope) {
      const lazyImages = selectAll("img[data-lazy]", imagesScope);
      lazyImages.forEach((img) => {
        const imageSource = getAttribute(img, "data-lazy");
        const imageSrcSet = getAttribute(img, "data-srcset");
        const imageSizes = getAttribute(img, "data-sizes") || getAttribute(this.state.slideTrack, "data-sizes");
        if (!imageSource)
          return;
        const imageToLoad = new Image();
        imageToLoad.onload = () => {
          const currentOpacity = window.getComputedStyle(img).opacity || "1";
          const fadeDuration = 100;
          const startTime = Date.now();
          const fadeOutInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / fadeDuration, 1);
            setStyle(img, "opacity", String(1 - progress));
            if (progress >= 1) {
              clearInterval(fadeOutInterval);
              if (imageSrcSet) {
                setAttribute(img, "srcset", imageSrcSet);
              }
              if (imageSizes) {
                setAttribute(img, "sizes", imageSizes);
              }
              setAttribute(img, "src", imageSource);
              const fadeInStart = Date.now();
              const fadeInDuration = 200;
              const fadeInInterval = setInterval(() => {
                const inElapsed = Date.now() - fadeInStart;
                const inProgress = Math.min(inElapsed / fadeInDuration, 1);
                setStyle(img, "opacity", String(inProgress));
                if (inProgress >= 1) {
                  clearInterval(fadeInInterval);
                  removeAttribute(img, "data-lazy");
                  removeAttribute(img, "data-srcset");
                  removeAttribute(img, "data-sizes");
                  removeClass(img, "slick-loading");
                  this.emit("lazyLoaded", { image: img, imageSource });
                }
              });
            }
          });
        };
        imageToLoad.onerror = () => {
          removeAttribute(img, "data-lazy");
          removeClass(img, "slick-loading");
          addClass(img, "slick-lazyload-error");
          this.emit("lazyLoadError", { image: img, imageSource });
        };
        addClass(img, "slick-loading");
        imageToLoad.src = imageSource;
      });
    }
    /**
     * Progressive lazy load - loads images one at a time as they appear
     */
    progressiveLazyLoad(tryCount = 1) {
      if (!this.options.lazyLoad || this.options.lazyLoad !== "progressive")
        return;
      const allLazyImages = selectAll("img[data-lazy]", this.state.slideTrack);
      if (allLazyImages.length === 0)
        return;
      const img = allLazyImages[0];
      const imageSource = getAttribute(img, "data-lazy");
      const imageSrcSet = getAttribute(img, "data-srcset");
      const imageSizes = getAttribute(img, "data-sizes") || getAttribute(this.state.slideTrack, "data-sizes");
      const imageToLoad = new Image();
      imageToLoad.onload = () => {
        if (imageSrcSet) {
          setAttribute(img, "srcset", imageSrcSet);
        }
        if (imageSizes) {
          setAttribute(img, "sizes", imageSizes);
        }
        setAttribute(img, "src", imageSource);
        removeAttribute(img, "data-lazy");
        removeAttribute(img, "data-srcset");
        removeAttribute(img, "data-sizes");
        removeClass(img, "slick-loading");
        if (this.options.adaptiveHeight === true) {
          this.setPosition();
        }
        this.emit("lazyLoaded", { image: img, imageSource });
        this.progressiveLazyLoad(1);
      };
      imageToLoad.onerror = () => {
        if (tryCount < 3) {
          setTimeout(() => {
            this.progressiveLazyLoad(tryCount + 1);
          }, 500);
        } else {
          removeAttribute(img, "data-lazy");
          removeClass(img, "slick-loading");
          addClass(img, "slick-lazyload-error");
          this.emit("lazyLoadError", { image: img, imageSource });
          this.progressiveLazyLoad(1);
        }
      };
      imageToLoad.src = imageSource;
    }
    /**
     * On event - register listener
     */
    on(event, callback, context = null) {
      this.dispatcher.on(event, callback, context);
      return this;
    }
    /**
     * Once event - register one-time listener
     */
    once(event, callback, context = null) {
      this.dispatcher.once(event, callback, context);
      return this;
    }
    /**
     * Off event - remove listener
     */
    off(event, callback = null) {
      this.dispatcher.off(event, callback);
      return this;
    }
    /**
     * Emit custom event
     */
    emit(event, data = null) {
      this.dispatcher.emit(event, data);
      try {
        const customEvent = new CustomEvent(`slick:${event}`, {
          detail: data,
          bubbles: true,
          cancelable: true
        });
        this.element.dispatchEvent(customEvent);
      } catch (e) {
        try {
          const evt = document.createEvent("CustomEvent");
          evt.initCustomEvent(`slick:${event}`, true, true, data);
          this.element.dispatchEvent(evt);
        } catch (err) {
          console.warn("CustomEvent not supported");
        }
      }
      return this;
    }
  };
  var SlickSlider_default = SlickSlider;

  // slick/src/index.js
  function Slick(element, options = {}) {
    if (Array.isArray(element)) {
      return element.map((el) => new SlickSlider_default(el, options));
    }
    return new SlickSlider_default(element, options);
  }
  Slick.auto = function(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map((el) => new SlickSlider_default(el, options));
  };
  Slick.version = "2.0.0";
  if (typeof window !== "undefined") {
    window.Slick = Slick;
    window.SlickSlider = SlickSlider_default;
    window.slickModule = {
      Slick,
      SlickSlider: SlickSlider_default,
      default: Slick
    };
  }
  return __toCommonJS(src_exports);
})();
