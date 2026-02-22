/**
 *        (accessible)
 *     _ _      _       _
 * ___| (_) ___| | __  (_)___
 * / __| | |/ __| |/ /  | / __|
 * \__ \ | | (__|   < _ | \__ \
 * |___/_|_|\___|_|\_(_)/ |___/
 *                   |__/
 *
 * Version: 2.0.0
 * Author: Miguel Quintero
 * Accessible Slick Slider
 * Vanilla JavaScript replacement for jQuery Slick Slider
 * 
 * Fully accessible WCAG 2.0/2.1 compliant slider for all devices
 * 
 * Based on: Accessible Slick v1.8.1 by Accessible360
 * https://github.com/Accessible360/accessible-slick
 */

import { EventDispatcher } from './utils/events.js';
import {
  extend,
  clone,
  debounce,
  uniqueId,
  getWindowDimensions,
  parseHTML
} from './utils/helpers.js';
import {
  select,
  selectAll,
  getChildren,
  addClass,
  removeClass,
  hasClass,
  setAttribute,
  getAttribute,
  removeAttribute,
  getDimensions,
  getInnerWidth,
  getOuterWidth,
  getOuterHeight,
  setStyle,
  appendChild,
  insertBefore,
  remove,
  empty
} from './utils/dom.js';
import {
  supportsTransforms,
  translate3d,
  applyTransition,
  removeTransition
} from './utils/css.js';

export class SlickSlider {
  static INSTANCES = new Map();

  constructor(element, options = {}) {
    this.element = element;
    this.instanceId = uniqueId('slick');
    this.constructor.INSTANCES.set(this.instanceId, this);
    
    // Parse data-slick attribute if no options provided
    const dataSlickAttr = getAttribute(element, 'data-slick');
    let dataSlickOptions = {};
    
    if (dataSlickAttr) {
      try {
        // Parse JSON from data attribute
        // Handle HTML entities like &quot; being decoded by getAttribute
        const jsonStr = dataSlickAttr.replace(/&quot;/g, '"');
        dataSlickOptions = JSON.parse(jsonStr);
      } catch (e) {
        console.warn('Invalid data-slick JSON:', dataSlickAttr, e);
      }
    }
    
    // Merge: defaults -> data attribute -> passed options (later overrides earlier)
    this.options = extend({}, this.constructor.DEFAULTS, dataSlickOptions, options);
    
    // Store original options for responsive reversion
    this.originalOptions = extend({}, this.options);
    
    // Initialize state
    this.state = extend({}, this.constructor.INITIAL_STATE);
    
    // Event dispatcher for custom events
    this.dispatcher = new EventDispatcher();
    
    // Bound methods for event handlers (stored for later removal)
    this.boundMethods = {};
    
    // Initialize slider
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
    arrowsPlacement: null, // 'before', 'after', 'split'
    asNavFor: null,
    autoplay: false,
    autoplaySpeed: 3000,
    centerMode: false,
    centerPadding: '50px',
    cssEase: 'ease',
    customPaging: null,
    dots: false,
    dotsClass: 'slick-dots',
    draggable: true,
    edge: false,
    easing: 'linear',
    edgeFriction: 0.35,
    fade: false,
    focusOnSelect: false,
    focusOnChange: false,
    infinite: true,
    initialSlide: 0,
    instructionsText: null,
    lazyLoad: 'ondemand', // 'ondemand', 'progressive', or false
    lazyLoadErrorMessage: 'Image failed to load',
    lazyLoadErrorVisible: true,
    lazyLoadErrorAnnounce: true,
    lazyLoadLoadingIndicator: false,
    lazyLoadLoadingText: 'Loading image',
    lazyLoadParallelLimit: 3,
    lazyLoadUseIntersectionObserver: true,
    lazyLoadIntersectionRootMargin: '200px 0px',
    lazyLoadIntersectionThreshold: 0.01,
    enablePerformanceMetrics: false,
    performanceMetricsPrefix: 'slick',
    mobileFirst: false,
    nextArrow: '<button class="slick-next" aria-label="Next slide"><span class="slick-next-icon" aria-hidden="true"></span></button>',
    pauseIcon: '<span class="slick-pause-icon" aria-hidden="true"></span>',
    pauseOnFocus: true,
    pauseOnHover: true,
    playIcon: '<span class="slick-play-icon" aria-hidden="true"></span>',
    prevArrow: '<button class="slick-prev" aria-label="Previous slide"><span class="slick-prev-icon" aria-hidden="true"></span></button>',
    respondTo: 'window', // 'window', 'slider', or 'min'
    responsive: null,
    rows: 1,
    rtl: false,
    slide: '',
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
    zIndex: 1000,
    
    // Accessibility
    regionLabel: 'slider',
    respectReducedMotion: false,
    announceSlides: true,
    announceSlidePosition: true,
    announceSlideDescription: false,
    announcementLive: 'polite',
    announcementPrefix: 'Slide',
    useSkipLink: true,
    skipLinkText: 'Skip carousel',
    skipLinkVisible: false
  };

  /**
   * Initial state
   */
  static INITIAL_STATE = {
    activeBreakpoint: null,
    animating: false,
    autoPlayTimer: null,
    announcementElement: null,
    announcementTimer: null,
    skipLinkElement: null,
    skipLinkTarget: null,
    currentDirection: 0,
    currentLeft: 0,
    currentSlide: 0,
    direction: 1,
    dotListElement: null,
    dotSlidesToScroll: 1,
    dots: null,
    dragging: false,
    edgeHit: false,
    cssVarsSupported: false,
    slidesCache: null,
    gestureEndTime: 0,
    gestureStartTime: 0,
    instructionsText: null,
    interrupted: false,
    listHeight: 0,
    listWidth: 0,
    loadIndex: 0,
    lastAnnouncement: '',
    lazyLoadInFlight: 0,
    lazyLoadObserver: null,
    lazyLoadQueue: null,
    performanceMarkId: 0,
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
    resizeObserver: null,
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
    const perf = this.startPerformance('init');
    // Mark element as slider
    this.element.setAttribute('data-slick-slider', this.instanceId);
    addClass(this.element, 'slick-slider');
    
    // Check CSS support
    this.state.transformsEnabled = supportsTransforms();
    this.state.cssVarsSupported = this.supportsCSSVariables();
    
    // Setup props
    this.setProps();
    
    // Setup initial state
    this.state.currentSlide = this.options.initialSlide;
    this.state.currentDirection = 1;
    this.state.rtl = this.options.rtl;
    this.state.rows = this.options.rows;
    this.state.slideCount = 0;
    
    // Load the slider structure
    this.loadSlider();
    
    // Build UI elements
    this.buildOut();

    // Build screen-reader announcement region
    this.buildAnnouncement();

    // Build skip link for keyboard users
    this.buildSkipLink();
    
    // Setup infinite mode - MUST be called after buildOut() which puts slides in track
    this.setupInfinite();
    
    // Add accessibility role
    if (this.options.accessibility) {
      setAttribute(this.element, 'role', 'region');
      setAttribute(this.element, 'aria-label', this.options.regionLabel);
    }
    
    // Build arrows
    if (this.options.arrows && this.state.slideCount > this.options.slidesToShow) {
      this.buildArrows();
    }
    
    // Build dots
    if (this.options.dots && this.state.slideCount > this.options.slidesToShow) {
      this.buildDots();
    }
    
    // Build autoplay button
    if (this.options.autoplay && this.options.useAutoplayToggleButton && this.state.slideCount > 1) {
      this.buildAutoplayButton();
    }
    
    // Update navigation visibility (hide if not enough slides)
    this.updateNavigationVisibility();
    
    // Add initialized class first for variable width to ensure slides get proper layout
    addClass(this.element, 'slick-initialized');
    
    // For variable width, defer positioning until after browser layout
    if (this.options.variableWidth) {
      // Use requestAnimationFrame to ensure slides have their width from content
      window.requestAnimationFrame(() => {
        this.setPosition();
      });
    } else {
      // Set initial position immediately for fixed width
      this.setPosition();
    }
    
    // Setup event listeners
    this.initializeEvents();
    
    // Initialize autoplay if enabled
    if (this.options.autoplay) {
      this.autoPlay();
    }
    
    // Handle responsive breakpoints
    if (this.options.responsive && this.options.responsive.length) {
      this.checkResponsive(true);
    }
    
    // Initialize lazy loading if enabled
    if (this.options.lazyLoad) {
      const useObserver =
        this.options.lazyLoadUseIntersectionObserver &&
        this.options.lazyLoad === 'ondemand' &&
        this.initLazyLoadObserver();

      // For progressive mode, start loading immediately
      if (this.options.lazyLoad === 'progressive') {
        this.progressiveLazyLoad();
      } else if (!useObserver) {
        // For ondemand/anticipated modes, trigger lazyLoad to load visible slides
        this.lazyLoad();
      }

      // Load images when slides change
      this.dispatcher.on('afterChange', () => {
        if (this.options.lazyLoad === 'progressive') {
          this.progressiveLazyLoad();
        } else if (useObserver) {
          this.observeLazyImages();
        } else {
          this.lazyLoad();
        }
      });
    }
    
    this.emit('init', { instance: this });
    this.endPerformance(perf);
  }

  /**
   * Set properties matching jQuery setProps()
   */
  setProps() {
    this.state.positionProp = this.options.vertical ? 'top' : 'left';

    if (this.options.fade) {
      this.options.centerMode = false;
      this.options.slidesToShow = 1;
      this.options.slidesToScroll = 1;
    }

    // Detect transform property
    const style = document.body.style;
    if (style.transform !== undefined) {
      this.state.animType = 'transform';
    } else if (style.webkitTransform !== undefined) {
      this.state.animType = 'webkitTransform';
    } else if (style.MozTransform !== undefined) {
      this.state.animType = 'MozTransform';
    } else if (style.msTransform !== undefined) {
      this.state.animType = 'msTransform';
    } else if (style.OTransform !== undefined) {
      this.state.animType = 'OTransform';
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

    // Match jQuery: centerMode clones one extra slide
    const infiniteCount = this.options.centerMode
      ? this.options.slidesToShow + 1
      : this.options.slidesToShow;

    // Prepend clones of the ending slides (for reverse wrapping)
    for (let i = this.state.slideCount; i > (this.state.slideCount - infiniteCount); i -= 1) {
      const slideIndex = i - 1;
      const clone = this.state.slides[slideIndex].cloneNode(true);
      addClass(clone, 'slick-cloned');
      setAttribute(clone, 'aria-hidden', 'true');
      setAttribute(clone, 'data-slick-index', String(slideIndex - this.state.slideCount));
      this.state.slideTrack.insertBefore(clone, this.state.slideTrack.firstChild);
    }

    // Append clones of the beginning slides (for forward wrapping)
    // Ensure enough buffer for larger scroll steps (e.g. slidesToShow=3, slidesToScroll=3)
    const appendCount = Math.max(
      this.state.slideCount,
      this.options.slidesToShow + this.options.slidesToScroll
    );
    for (let i = 0; i < appendCount; i += 1) {
      const slideIndex = i % this.state.slideCount;
      const clone = this.state.slides[slideIndex].cloneNode(true);
      addClass(clone, 'slick-cloned');
      setAttribute(clone, 'aria-hidden', 'true');
      setAttribute(clone, 'data-slick-index', String(i + this.state.slideCount));
      appendChild(this.state.slideTrack, clone);
    }
    
    // Force layout reflow after adding clones to ensure offsetLeft is accurate
    void this.state.slideTrack.offsetWidth;
  }

  /**
   * Load slides from DOM
   */
  loadSlider() {
    const slides = this.options.slide
      ? selectAll(this.options.slide, this.element)
      : getChildren(this.element);
    
    this.state.slides = Array.from(slides);
    this.state.slideCount = this.state.slides.length;
    
    // Add data attributes and roles
    this.state.slides.forEach((slide, index) => {
      addClass(slide, 'slick-slide');
      setAttribute(slide, 'data-slick-index', index);
      if (this.options.useGroupRole) {
        setAttribute(slide, 'role', 'group');
        setAttribute(slide, 'aria-label', `slide ${index + 1}`);
      }
    });
    
    // Wrap slide content with inline-block div (matching original jQuery Slick behavior)
    this.wrapSlideContent();
    
    this.emit('loaded', { slideCount: this.state.slideCount });
  }

  /**
   * Wrap slide content with inline-block div for proper layout
   * Matches jQuery Slick behavior: wraps immediate children in div with display: inline-block
   */
  wrapSlideContent() {
    this.state.slides.forEach(slide => {
      const children = Array.from(getChildren(slide));
      
      // If slide has a single inner div, apply inline-block to it instead of double-wrapping
      if (children.length === 1 && children[0].tagName === 'DIV') {
        const innerDiv = children[0];
        // Apply inline-block style if not already present
        if (innerDiv.style.display !== 'inline-block') {
          setStyle(innerDiv, 'width', '100%');
          setStyle(innerDiv, 'display', 'inline-block');
        }
        return;
      }
      
      // Skip if already wrapped (all children are inside an inline-block wrapper)
      const hasInlineBlockWrapper = children.length === 1 && 
                                    getComputedStyle(children[0]).display === 'inline-block';
      if (hasInlineBlockWrapper) {
        return;
      }
      
      // Create wrapper with inline-block display for multiple or non-div children
      const wrapper = document.createElement('div');
      setStyle(wrapper, 'width', '100%');
      setStyle(wrapper, 'display', 'inline-block');
      
      // Move all children into the wrapper
      children.forEach(child => {
        appendChild(wrapper, child);
      });
      
      // Add wrapper to slide
      appendChild(slide, wrapper);
    });
  }

  /**
   * Build slider DOM structure
   */
  buildOut() {
    // Wrap slides in track and list if not already done
    const track = select('.slick-track', this.element);
    const list = select('.slick-list', this.element);
    
    if (!track || !list) {
      // Create wrapper structure
      const listDiv = document.createElement('div');
      addClass(listDiv, 'slick-list');
      
      const trackDiv = document.createElement('div');
      addClass(trackDiv, 'slick-track');
      
      // Move slides into track
      this.state.slides.forEach(slide => {
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
    
    // Add accessibility wrapper role
    if (this.options.accessibility) {
      setAttribute(this.element, 'role', 'region');
      setAttribute(this.element, 'aria-label', this.options.regionLabel);
    }
  }

  /**
   * Build aria-live announcement region
   */
  buildAnnouncement() {
    if (!this.options.accessibility || !this.options.announceSlides) return;
    if (this.state.announcementElement) return;

    const announcement = document.createElement('div');
    addClass(announcement, 'slick-sr-only');
    setAttribute(announcement, 'aria-live', this.options.announcementLive || 'polite');
    setAttribute(announcement, 'aria-atomic', 'true');
    setAttribute(announcement, 'role', 'status');
    setAttribute(announcement, 'data-slick-announcement', 'true');

    this.state.announcementElement = announcement;
    appendChild(this.element, announcement);
  }

  /**
   * Build skip link for keyboard users
   */
  buildSkipLink() {
    if (!this.options.accessibility || !this.options.useSkipLink) return;
    if (this.state.skipLinkElement || this.state.skipLinkTarget) return;
    if (!this.element || !this.element.parentNode) return;

    const parent = this.element.parentNode;
    const skipId = `slick-skip-${this.instanceId}`;

    const skipLink = document.createElement('a');
    addClass(skipLink, 'slick-skip-link');
    if (this.options.skipLinkVisible) {
      addClass(skipLink, 'slick-skip-link--visible');
    }
    setAttribute(skipLink, 'href', `#${skipId}`);
    setAttribute(skipLink, 'data-slick-skip-link', 'true');
    skipLink.textContent = this.options.skipLinkText || 'Skip carousel';

    const skipTarget = document.createElement('span');
    addClass(skipTarget, 'slick-skip-target');
    setAttribute(skipTarget, 'id', skipId);
    setAttribute(skipTarget, 'tabindex', '-1');
    setAttribute(skipTarget, 'data-slick-skip-target', 'true');

    insertBefore(this.element, skipLink);
    if (this.element.nextSibling) {
      parent.insertBefore(skipTarget, this.element.nextSibling);
    } else {
      appendChild(parent, skipTarget);
    }

    this.state.skipLinkElement = skipLink;
    this.state.skipLinkTarget = skipTarget;
  }

  /**
   * Public API: Announce a custom message in aria-live region
   */
  announce(message, force = false) {
    if (!this.options.accessibility || !this.options.announceSlides) return;
    if (!this.state.announcementElement) return;

    const nextMessage = typeof message === 'string' ? message.trim() : '';
    if (!nextMessage) return;
    if (!force && nextMessage === this.state.lastAnnouncement) return;

    this.state.lastAnnouncement = nextMessage;

    if (this.state.announcementTimer) {
      clearTimeout(this.state.announcementTimer);
      this.state.announcementTimer = null;
    }

    // Clear first so SRs detect repeated updates reliably
    this.state.announcementElement.textContent = '';
    this.state.announcementTimer = window.setTimeout(() => {
      if (this.state.announcementElement) {
        this.state.announcementElement.textContent = nextMessage;
      }
    }, 30);
  }

  /**
   * Resolve an announcement label from slide data attributes/content
   */
  getSlideAnnouncementLabel(slide) {
    if (!slide) return '';

    const explicitLabel = getAttribute(slide, 'data-announce') || getAttribute(slide, 'data-anounce');
    if (explicitLabel && explicitLabel.trim()) {
      return explicitLabel.trim();
    }

    const legacyLabel = getAttribute(slide, 'data-slide-title');
    if (legacyLabel && legacyLabel.trim()) {
      return legacyLabel.trim();
    }

    const imageWithAlt = slide.querySelector('img[alt]');
    const imageAlt = imageWithAlt ? imageWithAlt.getAttribute('alt') : '';
    if (imageAlt && imageAlt.trim()) {
      return imageAlt.trim();
    }

    return '';
  }

  /**
   * Resolve optional slide description for announcements
   */
  getSlideAnnouncementDescription(slide) {
    if (!slide) return '';

    const explicitDescription = getAttribute(slide, 'data-announce-description') || getAttribute(slide, 'data-anounce-description');
    if (explicitDescription && explicitDescription.trim()) {
      return explicitDescription.trim();
    }

    const legacyDescription = getAttribute(slide, 'data-slide-description');
    if (legacyDescription && legacyDescription.trim()) {
      return legacyDescription.trim();
    }

    return '';
  }

  /**
   * Announce current slide position and optional label
   */
  announceCurrentSlide(force = false) {
    if (!this.options.accessibility || !this.options.announceSlides) return;
    if (this.state.slideCount < 1) return;

    const normalizedIndex = this.normalizeSlideIndex(this.state.currentSlide);
    const currentSlide = this.state.slides[normalizedIndex];
    if (!currentSlide) return;

    const perSlidePrefix = getAttribute(currentSlide, 'data-announce-prefix') || getAttribute(currentSlide, 'data-anounce-prefix');
    const prefix = perSlidePrefix || this.options.announcementPrefix || 'Slide';
    const label = this.getSlideAnnouncementLabel(currentSlide);
    const description = this.options.announceSlideDescription
      ? this.getSlideAnnouncementDescription(currentSlide)
      : '';
    const shouldAnnouncePosition = this.options.announceSlidePosition !== false;

    const messageParts = [];
    if (shouldAnnouncePosition) {
      messageParts.push(`${prefix} ${normalizedIndex + 1} of ${this.state.slideCount}`);
    }
    if (label) {
      messageParts.push(label);
    }
    if (description) {
      messageParts.push(description);
    }

    if (messageParts.length === 0) {
      messageParts.push(`${prefix} ${normalizedIndex + 1} of ${this.state.slideCount}`);
    }

    let message = messageParts[0];
    if (messageParts.length > 1) {
      const details = messageParts.slice(1).join('. ');
      message += `: ${details}`;
    }

    this.announce(message, force);
  }

  /**
   * Build navigation arrows
   */
  buildArrows() {
    // Create prev arrow
    const prevArrowHTML = this.options.prevArrow;
    const prevArrow = parseHTML(prevArrowHTML);
    addClass(prevArrow, 'slick-arrow');
    this.state.prevArrowElement = prevArrow;
    prevArrow.addEventListener('click', (e) => this.prevClick(e));
    
    // Create next arrow
    const nextArrowHTML = this.options.nextArrow;
    const nextArrow = parseHTML(nextArrowHTML);
    addClass(nextArrow, 'slick-arrow');
    this.state.nextArrowElement = nextArrow;
    nextArrow.addEventListener('click', (e) => this.nextClick(e));
    
    // Determine where to insert arrows
    const appendTarget = this.options.appendArrows || this.element;
    const slideList = this.state.slideList;
    
    // Insert prev arrow before the list and next arrow after
    if (slideList && slideList.parentNode === appendTarget) {
      // Insert prev arrow before the list
      insertBefore(slideList, prevArrow);
      // Append next arrow after the list
      appendChild(appendTarget, nextArrow);
    } else {
      // Fallback if list structure not found
      appendChild(appendTarget, prevArrow);
      appendChild(appendTarget, nextArrow);
    }
    
    this.emit('arrowsBuilt');
  }

  /**
   * Build navigation dots
   */
  buildDots() {
    const dotContainer = document.createElement('ul');
    addClass(dotContainer, this.options.dotsClass);
    addClass(this.element, 'slick-dotted');
    
    const dotCount = Math.ceil(this.state.slideCount / this.options.slidesToScroll);
    
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('li');
      const button = document.createElement('button');
      const icon = document.createElement('span');
      addClass(icon, 'slick-dot-icon');
      setAttribute(button, 'aria-label', `Go to slide ${i + 1}`);
      setAttribute(button, 'data-slide-index', i);
      
      if (i === 0) addClass(dot, 'slick-active');
      
      button.addEventListener('click', (e) => this.dotClick(e));
      appendChild(button, icon);
      appendChild(dot, button);
      appendChild(dotContainer, dot);
    }
    
    this.state.dots = dotContainer;
    this.state.dotListElement = dotContainer;
    const appendTarget = this.options.appendDots || this.element;
    appendChild(appendTarget, dotContainer);
    
    this.updateDots();
    this.emit('dotsBuilt');
  }

  /**
   * Update dot active state
   */
  updateDots() {
    if (!this.state.dots) return;
    const dotIndex = Math.floor(this.state.currentSlide / this.options.slidesToScroll);
    const dots = Array.from(this.state.dots.children);
    dots.forEach((dot, index) => {
      const button = dot.querySelector('button');
      if (index === dotIndex) {
        addClass(dot, 'slick-active');
        if (button) {
          setAttribute(button, 'aria-current', 'true');
        }
      } else {
        removeClass(dot, 'slick-active');
        if (button) {
          removeAttribute(button, 'aria-current');
        }
      }
    });
  }

  /**
   * Build autoplay toggle button
   */
  buildAutoplayButton() {
    const button = document.createElement('button');
    addClass(button, 'slick-autoplay-toggle-button');
    setAttribute(button, 'aria-label', 'Play/Pause slider autoplay');
    
    this.state.pauseButton = button;
    button.addEventListener('click', () => this.autoPlayToggleHandler());
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
    if (!this.state.pauseButton) return;
    const label = isPaused ? 'Play autoplay' : 'Pause autoplay';
    setAttribute(this.state.pauseButton, 'aria-label', label);
    setAttribute(this.state.pauseButton, 'aria-pressed', isPaused ? 'true' : 'false');
    empty(this.state.pauseButton);
    const iconMarkup = isPaused ? this.options.playIcon : this.options.pauseIcon;
    if (typeof iconMarkup === 'string') {
      appendChild(this.state.pauseButton, parseHTML(iconMarkup));
    } else if (iconMarkup) {
      appendChild(this.state.pauseButton, iconMarkup);
    }
  }

  /**
   * Setup event listeners
   */
  initializeEvents() {
    // Window resize
    this.boundMethods.handleResize = debounce(() => this.checkResponsive(), 250);
    if ('ResizeObserver' in window) {
      this.state.resizeObserver = new ResizeObserver(() => {
        this.boundMethods.handleResize();
      });
      this.state.resizeObserver.observe(this.element);
      if (this.options.respondTo === 'window' || this.options.respondTo === 'min') {
        window.addEventListener('resize', this.boundMethods.handleResize);
      }
    } else {
      window.addEventListener('resize', this.boundMethods.handleResize);
    }
    
    // Visibility change
    this.boundMethods.handleVisibilityChange = () => this.handleVisibilityChange();
    document.addEventListener('visibilitychange', this.boundMethods.handleVisibilityChange);
    
    // Keyboard navigation
    this.boundMethods.handleKeydown = (e) => this.handleKeydown(e);
    this.element.addEventListener('keydown', this.boundMethods.handleKeydown);
    
    // Mouse events
    if (this.options.draggable && this.state.slideList) {
      this.boundMethods.handleMouseDown = (e) => this.startDrag(e);
      this.state.slideList.addEventListener('mousedown', this.boundMethods.handleMouseDown);
    }
    
    // Touch events
    if (this.options.swipe && this.state.slideList && 'ontouchstart' in window) {
      this.boundMethods.handleTouchStart = (e) => this.startDrag(e);
      this.boundMethods.handleTouchEnd = (e) => this.endDrag(e);
      this.boundMethods.handleTouchMove = (e) => this.trackDrag(e);
      
      this.state.slideList.addEventListener('touchstart', this.boundMethods.handleTouchStart, { passive: true });
      this.state.slideList.addEventListener('touchend', this.boundMethods.handleTouchEnd, { passive: true });
      this.state.slideList.addEventListener('touchmove', this.boundMethods.handleTouchMove, { passive: false });
    }
    
    // Focus events for accessibility
    this.boundMethods.handleFocus = () => this.handleFocus();
    this.boundMethods.handleBlur = () => this.handleBlur();
    this.element.addEventListener('focusin', this.boundMethods.handleFocus, true);
    this.element.addEventListener('focusout', this.boundMethods.handleBlur, true);

    // Slide click (for synced nav sliders)
    if (this.options.focusOnSelect && this.state.slideTrack) {
      this.boundMethods.handleSlideClick = (e) => this.handleSlideClick(e);
      this.state.slideTrack.addEventListener('click', this.boundMethods.handleSlideClick);
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

    if (typeof asNavFor === 'string') {
      const elements = Array.from(document.querySelectorAll(asNavFor));
      elements.forEach((element) => {
        const instanceId = element.getAttribute('data-slick-slider');
        if (!instanceId) return;
        const instance = this.constructor.INSTANCES.get(instanceId);
        if (instance && instance !== this) {
          targets.push(instance);
        }
      });
      return targets;
    }

    if (asNavFor instanceof SlickSlider) {
      return asNavFor === this ? [] : [asNavFor];
    }

    if (asNavFor instanceof Element) {
      const instanceId = asNavFor.getAttribute('data-slick-slider');
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
    const targetSlide = e.target.closest('.slick-slide');
    if (!targetSlide || !this.state.slideTrack || !this.state.slideTrack.contains(targetSlide)) {
      return;
    }

    const rawIndex = parseInt(getAttribute(targetSlide, 'data-slick-index'), 10);
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
    this.changeSlide({ data: { message: 'next' } });
  }

  /**
   * Public API: Go to previous slide
   */
  prev() {
    this.changeSlide({ data: { message: 'prev' } });
  }

  /**
   * Public API: Go to specific slide
   */
  goTo(index, dontAnimate = false) {
    if (index < 0 || index >= this.state.slideCount) return;
    this.changeSlide({ data: { message: 'index', index } }, dontAnimate);
  }

  /**
   * Public API: Play autoplay
   */
  play() {
    if (!this.options.autoplay) return;
    this.state.paused = false;
    this.autoPlay();
    this.setAutoplayButtonState(false);
    this.emit('play');
  }

  /**
   * Public API: Pause autoplay
   */
  pause() {
    if (!this.options.autoplay) return;
    this.autoPlayClear();
    this.state.paused = true;
    this.setAutoplayButtonState(true);
    this.emit('pause');
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
    this.emit('setOption', { option, value });
  }

  /**
   * Public API: Add slide(s)
   * Adds new slide(s) to the carousel
   */
  addSlide(markup, index = null, addBefore = false) {
    if (!markup) return false;
    
    // Handle boolean index parameter (addBefore)
    if (typeof index === 'boolean') {
      addBefore = index;
      index = null;
    }
    
    // Validate index if provided
    if (index !== null && (index < 0 || index >= this.state.slideCount)) {
      return false;
    }
    
    // Remove cloned slides temporarily
    this.unloadClones();
    
    // Create slide element from markup
    let newSlide;
    if (typeof markup === 'string') {
      newSlide = parseHTML(markup);
    } else {
      newSlide = markup;
    }
    
    // Add to track
    if (typeof index === 'number') {
      if (index === 0 && this.state.slides.length === 0) {
        // First slide
        appendChild(this.state.slideTrack, newSlide);
      } else if (addBefore) {
        // Insert before the slide at index
        const targetSlide = this.state.slides[index];
        if (targetSlide && targetSlide.parentNode) {
          insertBefore(targetSlide, newSlide);
        } else {
          appendChild(this.state.slideTrack, newSlide);
        }
      } else {
        // Insert after the slide at index
        const targetSlide = this.state.slides[index];
        if (targetSlide && targetSlide.nextSibling) {
          insertBefore(targetSlide.nextSibling, newSlide);
        } else if (targetSlide && targetSlide.parentNode) {
          appendChild(this.state.slideTrack, newSlide);
        }
      }
    } else {
      // Add to end
      if (addBefore === true) {
        // Prepend to beginning
        if (this.state.slideTrack.firstChild) {
          insertBefore(this.state.slideTrack.firstChild, newSlide);
        } else {
          appendChild(this.state.slideTrack, newSlide);
        }
      } else {
        // Append to end
        appendChild(this.state.slideTrack, newSlide);
      }
    }
    
    // Update slides array
    addClass(newSlide, 'slick-slide');
    this.state.slides = getChildren(this.state.slideTrack).filter(el => !hasClass(el, 'slick-cloned'));
    this.state.slideCount = this.state.slides.length;
    
    // Re-initialize the slider
    this.reinit();
    
    this.emit('addSlide');
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
    
    // Remove cloned slides temporarily
    this.unloadClones();
    
    // Remove the slide(s)
    if (removeAll === true) {
      // Remove all slides
      while (this.state.slideTrack.firstChild) {
        const child = this.state.slideTrack.firstChild;
        if (!hasClass(child, 'slick-cloned')) {
          remove(child);
        }
      }
    } else {
      // Remove specific slide
      const slideToRemove = this.state.slides[index];
      if (slideToRemove) {
        remove(slideToRemove);
      }
    }
    
    // Update slides array
    this.state.slides = getChildren(this.state.slideTrack).filter(el => !hasClass(el, 'slick-cloned'));
    this.state.slideCount = this.state.slides.length;
    
    // Adjust current slide if necessary
    if (this.state.currentSlide >= this.state.slideCount && this.state.currentSlide !== 0) {
      this.state.currentSlide = this.state.currentSlide - this.options.slidesToScroll;
    }
    
    // Re-initialize the slider
    this.reinit();
    
    this.emit('removeSlide');
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

    const filteredSlides = this.state.slidesCache.filter((slide, index) =>
      this.matchesSlideFilter(slide, filter, index)
    );

    empty(this.state.slideTrack);
    filteredSlides.forEach(slide => appendChild(this.state.slideTrack, slide));

    this.state.currentSlide = 0;
    this.reinit();
    this.emit('filter');

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
    this.state.slidesCache.forEach(slide => appendChild(this.state.slideTrack, slide));

    this.state.slidesCache = null;
    this.state.currentSlide = 0;
    this.reinit();
    this.emit('unfilter');

    return true;
  }

  /**
   * Match slide against a jQuery-like filter selector or callback
   */
  matchesSlideFilter(slide, filter, index) {
    if (typeof filter === 'function') {
      return Boolean(filter.call(slide, index, slide));
    }

    if (typeof filter !== 'string') {
      return false;
    }

    const hasEvenPseudo = /:even\b/.test(filter);
    const hasOddPseudo = /:odd\b/.test(filter);
    const selector = filter.replace(/:even\b|:odd\b/g, '').trim();

    const parityMatch = hasEvenPseudo
      ? index % 2 === 0
      : hasOddPseudo
        ? index % 2 === 1
        : true;

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
    // Remove event listeners
    removeEventListener(window, 'resize', this.boundMethods.handleResize);
    removeEventListener(document, 'visibilitychange', this.boundMethods.handleVisibilityChange);
    removeEventListener(this.element, 'keydown', this.boundMethods.handleKeydown);
    if (this.state.resizeObserver) {
      this.state.resizeObserver.disconnect();
      this.state.resizeObserver = null;
    }
    if (this.state.lazyLoadObserver) {
      this.state.lazyLoadObserver.disconnect();
      this.state.lazyLoadObserver = null;
    }
    
    // Remove all custom events
    this.dispatcher.clear();
    
    // Remove DOM elements
    if (this.state.pauseButton) remove(this.state.pauseButton);
    if (this.state.prevArrowElement) remove(this.state.prevArrowElement);
    if (this.state.nextArrowElement) remove(this.state.nextArrowElement);
    if (this.state.dots) remove(this.state.dots);
    if (this.state.announcementElement) {
      remove(this.state.announcementElement);
      this.state.announcementElement = null;
    }
    if (this.state.skipLinkElement) {
      remove(this.state.skipLinkElement);
      this.state.skipLinkElement = null;
    }
    if (this.state.skipLinkTarget) {
      remove(this.state.skipLinkTarget);
      this.state.skipLinkTarget = null;
    }
    if (this.state.announcementTimer) {
      clearTimeout(this.state.announcementTimer);
      this.state.announcementTimer = null;
    }
    
    // Clear state
    this.state.unslicked = true;
    this.constructor.INSTANCES.delete(this.instanceId);
    
    this.emit('destroy');
  }

  /**
   * Handle slide change
   */
  changeSlide(e, dontAnimate = false) {
    const perf = this.startPerformance('changeSlide');
    try {
      const message = e?.data?.message;
      const previousSlide = this.normalizeSlideIndex(this.state.currentSlide);
      let targetSlide = previousSlide;

      if (message === 'next') {
        targetSlide = previousSlide + this.options.slidesToScroll;
      } else if (message === 'prev') {
        targetSlide = previousSlide - this.options.slidesToScroll;
      } else if (message === 'index' && Number.isInteger(e?.data?.index)) {
        targetSlide = e.data.index;
      }

      if (this.options.fade) {
        if (!this.options.infinite) {
          targetSlide = Math.max(0, Math.min(targetSlide, this.state.slideCount - 1));
        } else {
          targetSlide = this.normalizeSlideIndex(targetSlide);
        }

        if (targetSlide === previousSlide) return;
        if (this.state.animating && this.options.waitForAnimate) return;

        this.emit('beforeChange', { previousSlide, nextSlide: targetSlide });

        const shouldAnimate = this.options.useCSS && !dontAnimate && this.options.speed > 0;
        this.state.currentSlide = targetSlide;

        if (!this.state.suppressNavSync && this.options.asNavFor) {
          this.syncAsNavFor(targetSlide, dontAnimate);
        }

        if (shouldAnimate) {
          this.state.animating = true;
          this.fadeSlideTransition(previousSlide, targetSlide, () => {
            this.state.animating = false;
            this.setPosition();
            this.emit('afterChange', { currentSlide: this.state.currentSlide });
            this.announceCurrentSlide();
          });
        } else {
          this.state.animating = false;
          this.setPosition();
          this.emit('afterChange', { currentSlide: this.state.currentSlide });
          this.announceCurrentSlide();
        }

        return;
      }

      // In infinite mode, allow going beyond boundaries (we'll use cloned slides)
      // The wrapping happens visually through cloned slides, not through logical wrapping
      if (!this.options.infinite) {
        // Non-infinite: clamp to valid range
        targetSlide = Math.max(0, Math.min(targetSlide, this.state.slideCount - 1));
      }
      // Infinite mode: we allow any slide index, positioning handles the cloned slides

      if (targetSlide === previousSlide) return;
      if (this.state.animating && this.options.waitForAnimate) return;

      this.emit('beforeChange', { previousSlide, nextSlide: targetSlide });
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
          // In infinite mode: after animation, check if we need to reposition back to equivalent real slide
          if (this.options.infinite) {
            let repositionSlide = targetSlide;
            
            // Wrap forward: if we've gone past the end, jump back to start
            if (targetSlide >= this.state.slideCount) {
              repositionSlide = targetSlide % this.state.slideCount;
            }
            // Wrap backward: if we've gone before the start, jump to end
            else if (targetSlide < 0) {
              repositionSlide = this.state.slideCount + (targetSlide % this.state.slideCount);
            }
            
            // If we need to reposition, do it instantly without animation
            if (repositionSlide !== targetSlide) {
              // Remove transition immediately
              removeTransition(this.state.slideTrack);
              
              // Update the current slide index
              this.state.currentSlide = repositionSlide;
              
              // Reposition with full calculations to ensure everything is correct
              // Use setPosition() for complete and accurate positioning
              this.setPosition();
            } else {
              // If we didn't wrap, just remove the transition
              removeTransition(this.state.slideTrack);
            }
          } else {
            // Non-infinite mode: just remove transition
            removeTransition(this.state.slideTrack);
          }
          
          this.state.animating = false;
        }, this.options.speed);
      } else {
        this.state.animating = false;
      }
      this.emit('afterChange', { currentSlide: this.state.currentSlide });
      this.announceCurrentSlide();
    } finally {
      this.endPerformance(perf);
    }
  }

  /**
   * Quick reposition for infinite wrap - minimal calculations, no forced reflows
   * Used when wrapping from last slide to first (or vice versa) to maintain 60fps
   */
  quickReposition() {
    if (!this.state.slideList || !this.state.slideTrack) return;

    // Ensure track width is set (needed for proper layout)
    if (!this.state.slideWidth) {
      // Fallback if slideWidth not cached - calculate it once
      const listWidth = this.state.listWidth || getInnerWidth(this.state.slideList) || 400;
      this.state.slideWidth = Math.ceil(listWidth / this.options.slidesToShow);
    }

    // Skip all reflow-causing operations - just recalculate position based on cached values
    let targetLeft = 0;
    
    if (this.options.variableWidth) {
      // For variable width, use the pre-calculated width from listWidth
      const allSlidesInDOM = selectAll('.slick-slide', this.state.slideTrack);
      let slideIndex = this.state.currentSlide;
      
      const cloneOffset = (this.options.infinite && this.state.slideCount > this.options.slidesToShow)
        ? (this.options.centerMode ? this.options.slidesToShow + 1 : this.options.slidesToShow)
        : 0;
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
      // Fixed width - recalculate with proper offset that matches setPosition()
      const allSlidesInDOM = selectAll('.slick-slide', this.state.slideTrack);
      const totalSlideCount = allSlidesInDOM.length;
      const trackWidth = Math.ceil(this.state.slideWidth * totalSlideCount);
      
      // Ensure track width is set
      setStyle(this.state.slideTrack, 'width', `${trackWidth}px`);
      
      // Calculate the exact same offset as setPosition() does
      let slideOffset = 0;
      
      if (this.options.infinite && this.state.slideCount > this.options.slidesToShow) {
        slideOffset = (this.state.slideWidth * this.options.slidesToShow) * -1;
      }
      
      // Clamp slideOffset for small slide counts
      if (this.state.slideCount <= this.options.slidesToShow) {
        slideOffset = 0;
      }

      // Apply center mode offset exactly as setPosition() does
      if (this.options.centerMode && this.state.slideCount <= this.options.slidesToShow) {
        slideOffset = ((this.state.slideWidth * Math.floor(this.options.slidesToShow)) / 2) - 
                     ((this.state.slideWidth * this.state.slideCount) / 2);
      } else if (this.options.centerMode && this.options.infinite) {
        slideOffset += this.state.slideWidth * Math.floor(this.options.slidesToShow / 2) - this.state.slideWidth;
      } else if (this.options.centerMode) {
        slideOffset = 0;
        slideOffset += this.state.slideWidth * Math.floor(this.options.slidesToShow / 2);
      }

      // Calculate target position using the exact same formula as setPosition()
      targetLeft = (this.state.currentSlide * this.state.slideWidth * -1) + slideOffset;
    }
    
    // Apply the position without transition - browser will render it instantly
    if (this.options.useTransform && this.state.transformsEnabled) {
      translate3d(this.state.slideTrack, targetLeft, 0, 0);
    } else {
      setStyle(this.state.slideTrack, 'left', `${targetLeft}px`);
    }
    
    // Update visibility and UI without forcing reflows
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
      if (callback) callback();
      return;
    }

    const transitionValue = `opacity ${this.options.speed}ms ${this.options.cssEase}`;

    if (fromSlide) {
      setStyle(fromSlide, 'transition', transitionValue);
      setStyle(fromSlide, 'opacity', '0');
      setStyle(fromSlide, 'z-index', String(this.options.zIndex - 2));
    }

    setStyle(toSlide, 'transition', transitionValue);
    setStyle(toSlide, 'opacity', '1');
    setStyle(toSlide, 'z-index', String(this.options.zIndex - 1));

    // Update track height to match the new current slide (for fade with varying heights)
    const newHeight = getOuterHeight(toSlide);
    if (newHeight > 0 && this.state.slideTrack) {
      setStyle(this.state.slideTrack, 'height', `${newHeight}px`);
    }

    window.setTimeout(() => {
      if (fromSlide) {
        setStyle(fromSlide, 'transition', '');
      }
      setStyle(toSlide, 'transition', '');
      if (callback) callback();
    }, this.options.speed);
  }

  /**
   * Position slides for fade mode (jQuery Slick parity)
   * Uses absolute positioning so all slides overlap at the same location
   */
  setFade() {
    if (!this.state.slideTrack) return;

    const slides = selectAll('.slick-slide', this.state.slideTrack);
    if (!slides.length) return;

    // For fade mode, we need to set track height to match the tallest slide
    // or the current slide to prevent container collapse
    let maxHeight = 0;
    slides.forEach(slide => {
      const slideHeight = getOuterHeight(slide);
      if (slideHeight > maxHeight) {
        maxHeight = slideHeight;
      }
    });

    // Set track height to prevent collapse with absolute positioning
    if (maxHeight > 0) {
      setStyle(this.state.slideTrack, 'height', `${maxHeight}px`);
    }

    // Position all slides absolutely at the same location
    // OPTIMIZATION: Batch style updates with cssText instead of individual setStyle() calls
    // This reduces reflows from ~7 per slide to ~1 per slide (6x improvement)
    const hiddenSlideCSS = `
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      opacity: 0;
      z-index: ${this.options.zIndex - 2};
      transition: none;
    `;

    slides.forEach((slide, index) => {
      // Use cssText to batch multiple style assignments into one reflow
      slide.style.cssText = hiddenSlideCSS;
    });

    // Show only the current slide
    const currentIndex = Math.max(0, Math.min(this.state.currentSlide, slides.length - 1));
    if (slides[currentIndex]) {
      slides[currentIndex].style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        opacity: 1;
        z-index: ${this.options.zIndex - 1};
        transition: none;
      `;
    }
  }

  /**
   * Set slide position
   */
  setPosition() {
    if (!this.state.slideList || !this.state.slideTrack) return;
    const perf = this.startPerformance('setPosition');
    const supportsCssVars = this.state.cssVarsSupported;

    // Apply centerPadding to list in center mode (like jQuery does)
    if (this.options.centerMode) {
      if (this.options.vertical) {
        setStyle(this.state.slideList, 'padding', `${this.options.centerPadding} 0px`);
      } else {
        setStyle(this.state.slideList, 'padding', `0px ${this.options.centerPadding}`);
      }
    } else {
      // Clear padding if not in center mode
      setStyle(this.state.slideList, 'padding', '0px');
    }

    // Force layout reflow after padding change to ensure accurate width calculation
    void this.state.slideList.offsetWidth;

    // Always recalculate listWidth fresh (don't use stale cached values)
    let listWidth = getInnerWidth(this.state.slideList) || getDimensions(this.state.slideList).width;
    
    // If listWidth is 0 or not available, try to get container dimensions
    if (!listWidth || listWidth <= 0) {
      const containerWidth = getDimensions(this.state.slideList).width;
      if (containerWidth && containerWidth > 0) {
        listWidth = containerWidth;
      } else {
        // Last resort: use parent container width
        const parentWidth = this.element.offsetWidth || window.innerWidth;
        listWidth = parentWidth > 0 ? parentWidth : 300; // Minimum fallback
      }
    }
    
    // Cache the listWidth for potential quick access
    this.state.listWidth = listWidth;

    // FADE MODE: simpler positioning - just position slides and control with opacity
    if (this.options.fade) {
      this.state.slideWidth = listWidth;
      if (supportsCssVars) {
        setStyle(this.state.slideTrack, '--slick-track-width', `${listWidth}px`);
        setStyle(this.state.slideTrack, '--slick-track-x', '0px');
        setStyle(this.state.slideTrack, '--slick-track-y', '0px');
        setStyle(this.state.slideTrack, '--slick-track-left', '0px');
        setStyle(this.state.slideTrack, '--slick-track-top', '0px');
      } else {
        setStyle(this.state.slideTrack, 'width', `${listWidth}px`);
      }
      setStyle(this.state.slideTrack, 'position', 'relative');
      setStyle(this.state.slideTrack, 'left', '0');
      setStyle(this.state.slideTrack, 'top', '0');
      setStyle(this.state.slideTrack, 'transform', 'none');
      this.setFade();
      this.updateSlideVisibility();
      this.updateDots();
      this.updateArrows();
      this.updateNavigationVisibility();
      this.setHeight();
      this.endPerformance(perf);
      return;
    }
    
    let trackWidth = 0;
    let targetLeft = 0;
    let slideOffset = 0;

    if (this.options.variableWidth) {
      // Variable width: set a large track width to accommodate variable-width slides
      // Following jQuery approach: use 5000px per slide as base
      const allSlidesInDOM = selectAll('.slick-slide', this.state.slideTrack);
      const totalSlideCount = allSlidesInDOM.length;
      trackWidth = 5000 * totalSlideCount;
      
      // SET TRACK WIDTH FIRST - this allows offsetLeft to be calculated correctly
      if (supportsCssVars) {
        setStyle(this.state.slideTrack, '--slick-track-width', `${trackWidth}px`);
        setStyle(this.state.slideTrack, '--slick-slide-width', 'auto');
        // Clear inline widths to let CSS variables take effect
        allSlidesInDOM.forEach(slide => {
          slide.style.width = '';
        });
      } else {
        setStyle(this.state.slideTrack, 'width', `${trackWidth}px`);
      }
      
      // For variable width, ensure all slides are visible (display: block)
      allSlidesInDOM.forEach(slide => {
        if (slide.style.display === 'none') {
          setStyle(slide, 'display', 'block');
        }
      });
      
      // Force multiple layout calculations to ensure accurate offsetLeft
      void this.state.slideTrack.offsetHeight;
      void this.state.slideTrack.getBoundingClientRect();
      allSlidesInDOM.forEach(slide => void slide.offsetLeft);

      // Get current slide element for positioning
      // For variable width, calculate which DOM slide corresponds to currentSlide
      let slideIndex = this.state.currentSlide;
      
      // In infinite mode, account for clones prepended at the beginning
      // Match jQuery: centerMode uses one extra clone offset
      const cloneOffset = (this.options.infinite && this.state.slideCount > this.options.slidesToShow)
        ? (this.options.centerMode ? this.options.slidesToShow + 1 : this.options.slidesToShow)
        : 0;
      slideIndex = this.state.currentSlide + cloneOffset;
      
      // Ensure slideIndex is within bounds
      if (slideIndex < 0 || slideIndex >= allSlidesInDOM.length) {
        slideIndex = Math.max(0, Math.min(slideIndex, allSlidesInDOM.length - 1));
      }
      
      const targetSlide = allSlidesInDOM[slideIndex];
      
      if (targetSlide) {
        // Read offsetLeft - should now be accurate
        const slideOffsetLeft = targetSlide.offsetLeft || 0;
        if (this.options.rtl && !this.options.vertical) {
          const slideWidth = getOuterWidth(targetSlide);
          targetLeft = -((trackWidth - slideOffsetLeft - slideWidth));
        } else {
          targetLeft = -slideOffsetLeft;
        }
        
        if (this.options.centerMode) {
          // For center mode, center the current slide in the viewport
          const slideWidth = getOuterWidth(targetSlide);
          // Add centering offset
          targetLeft += (listWidth - slideWidth) / 2;
        }
      }

      // Store slide width for swipe calculations
      this.state.slideWidth = listWidth;
    } else {
      // Fixed width slides - following jQuery's approach
      this.state.slideWidth = Math.ceil(listWidth / this.options.slidesToShow);
      
      // Get ALL slides in DOM (including clones for infinite mode)
      const allSlidesInDOM = selectAll('.slick-slide', this.state.slideTrack);
      
      // Fallback: if no slides found in track, use original slides array
      const slidesToStyle = allSlidesInDOM && allSlidesInDOM.length > 0 
        ? allSlidesInDOM 
        : this.state.slides;
      
      // Calculate track width: based on slideWidth for each slide
      const totalSlideCount = slidesToStyle.length;
      trackWidth = Math.ceil(this.state.slideWidth * totalSlideCount);
      
      // Set track width first (this gives proper context for offset calculation)
      if (supportsCssVars) {
        setStyle(this.state.slideTrack, '--slick-track-width', `${trackWidth}px`);
      } else {
        setStyle(this.state.slideTrack, 'width', `${trackWidth}px`);
      }
      
      // Calculate the offset from the first slide with proper layout context
      let offset = 0;
      const firstSlide = this.state.slides[0];
      if (firstSlide) {
        // Use computed style to get exact margins/borders/padding
        const styles = window.getComputedStyle(firstSlide);
        const marginLeft = parseFloat(styles.marginLeft) || 0;
        const marginRight = parseFloat(styles.marginRight) || 0;
        const paddingLeft = parseFloat(styles.paddingLeft) || 0;
        const paddingRight = parseFloat(styles.paddingRight) || 0;
        const borderLeft = parseFloat(styles.borderLeft) || 0;
        const borderRight = parseFloat(styles.borderRight) || 0;
        offset = marginLeft + marginRight + paddingLeft + paddingRight + borderLeft + borderRight;
      }
      
      // Set width on all slides: slideWidth minus the offset
      const slideWidthToSet = Math.max(0, this.state.slideWidth - offset);
      if (supportsCssVars) {
        setStyle(this.state.slideTrack, '--slick-slide-width', `${slideWidthToSet}px`);
        // Clear inline widths to let CSS variables take effect
        slidesToStyle.forEach((slide) => {
          slide.style.width = '';
        });
      } else {
        slidesToStyle.forEach((slide) => {
          slide.style.width = `${slideWidthToSet}px`;
        });
      }

      // Calculate slide offset based on center mode settings (matching original jQuery logic)
      slideOffset = 0;

      if (this.options.infinite) {
        if (this.state.slideCount > this.options.slidesToShow) {
          slideOffset = (this.state.slideWidth * this.options.slidesToShow) * -1;
        }
      } else {
        if (this.state.currentSlide + this.options.slidesToShow > this.state.slideCount) {
          slideOffset = ((this.state.currentSlide + this.options.slidesToShow) - this.state.slideCount) * this.state.slideWidth;
        }
      }

      // Clamp slideOffset for small slide counts
      if (this.state.slideCount <= this.options.slidesToShow) {
        slideOffset = 0;
      }

      // Apply center mode offset  
      if (this.options.centerMode && this.state.slideCount <= this.options.slidesToShow) {
        slideOffset = ((this.state.slideWidth * Math.floor(this.options.slidesToShow)) / 2) - 
                     ((this.state.slideWidth * this.state.slideCount) / 2);
      } else if (this.options.centerMode && this.options.infinite) {
        slideOffset += this.state.slideWidth * Math.floor(this.options.slidesToShow / 2) - this.state.slideWidth;
      } else if (this.options.centerMode) {
        slideOffset = 0;
        slideOffset += this.state.slideWidth * Math.floor(this.options.slidesToShow / 2);
      }

      // Calculate target position
      targetLeft = (this.state.currentSlide * this.state.slideWidth * -1) + slideOffset;
    }

    if (supportsCssVars) {
      setStyle(this.state.slideTrack, '--slick-track-width', `${trackWidth}px`);
    } else {
      setStyle(this.state.slideTrack, 'width', `${trackWidth}px`);
    }

    if (this.options.rtl && !this.options.vertical && !this.options.fade) {
      targetLeft = -targetLeft;
    }

    if (this.options.fade) {
      this.setFade();
    } else if (this.options.useTransform && this.state.transformsEnabled) {
      if (supportsCssVars) {
        setStyle(this.state.slideTrack, '--slick-track-x', `${targetLeft}px`);
        setStyle(this.state.slideTrack, '--slick-track-y', '0px');
        // Clear inline transform to let CSS variables take effect
        this.state.slideTrack.style.transform = '';
        this.state.slideTrack.style.webkitTransform = '';
      } else {
        translate3d(this.state.slideTrack, targetLeft, 0, 0);
      }
    } else {
      if (supportsCssVars) {
        setStyle(this.state.slideTrack, '--slick-track-left', `${targetLeft}px`);
        // Clear inline left positioning to let CSS variables take effect
        this.state.slideTrack.style.left = '';
      } else {
        setStyle(this.state.slideTrack, 'left', `${targetLeft}px`);
      }
    }

    this.updateSlideVisibility();
    this.updateDots();
    this.updateArrows();
    this.updateNavigationVisibility();
    this.setHeight();
    this.endPerformance(perf);
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
   * Update focusability of elements within a slide
   */
  updateSlideFocusability(slide, isActive) {
    if (!slide) return;

    const focusableSelector = 'a, button, input, select, textarea, iframe, [tabindex], [contenteditable="true"], audio[controls], video[controls]';
    const focusables = slide.querySelectorAll(focusableSelector);

    focusables.forEach((element) => {
      if (isActive) {
        if (element.hasAttribute('data-slick-tabindex')) {
          const previousValue = getAttribute(element, 'data-slick-tabindex');
          if (previousValue === '') {
            removeAttribute(element, 'tabindex');
          } else {
            setAttribute(element, 'tabindex', previousValue);
          }
          removeAttribute(element, 'data-slick-tabindex');
        }
        return;
      }

      if (!element.hasAttribute('data-slick-tabindex')) {
        const existingValue = getAttribute(element, 'tabindex');
        setAttribute(element, 'data-slick-tabindex', existingValue == null ? '' : existingValue);
      }
      setAttribute(element, 'tabindex', '-1');
    });
  }

  /**
   * Update slide ARIA hidden states and active classes
   */
  updateSlideVisibility() {
    if (!this.state.slideTrack) return;
    
    const allSlides = selectAll('.slick-slide', this.state.slideTrack);
    
    // Fade mode: only current slide gets active/current classes
    // Don't manipulate aria-hidden because z-index/opacity handle visibility
    if (this.options.fade) {
      allSlides.forEach((slide) => {
        removeClass(slide, 'slick-active');
        removeClass(slide, 'slick-current');
        removeClass(slide, 'slick-center');
        setAttribute(slide, 'aria-hidden', 'true');
        this.updateSlideFocusability(slide, false);
      });
      
      if (allSlides[this.state.currentSlide]) {
        const currentSlide = allSlides[this.state.currentSlide];
        addClass(currentSlide, 'slick-active');
        addClass(currentSlide, 'slick-current');
        removeAttribute(currentSlide, 'aria-hidden');
        this.updateSlideFocusability(currentSlide, true);
      }
      
      // Trigger lazy load for fade mode
      if (this.options.lazyLoad === 'ondemand' || this.options.lazyLoad === 'anticipated') {
        this.lazyLoad();
      }
      return;
    }
    
    // Non-fade modes: standard visibility handling
    allSlides.forEach(slide => {
      removeClass(slide, 'slick-active');
      removeClass(slide, 'slick-current');
      removeClass(slide, 'slick-center');
      setAttribute(slide, 'aria-hidden', 'true');
    });
    
    const hasClones = selectAll('.slick-cloned', this.state.slideTrack).length > 0;
    const offsetForClones = (hasClones && this.options.infinite && this.state.slideCount > this.options.slidesToShow)
      ? (this.options.centerMode ? this.options.slidesToShow + 1 : this.options.slidesToShow)
      : 0;
    
    const centerOffset = this.options.centerMode
      ? Math.floor(this.options.slidesToShow / 2)
      : 0;
    const visibleStart = offsetForClones + this.state.currentSlide - centerOffset;
    const visibleEnd = visibleStart + this.options.slidesToShow;
    const centerIndex = offsetForClones + this.state.currentSlide;
    
    allSlides.forEach((slide, index) => {
      if (index >= visibleStart && index < visibleEnd) {
        addClass(slide, 'slick-active');
        removeAttribute(slide, 'aria-hidden');
      }
      
      if (index === centerIndex) {
        addClass(slide, 'slick-current');
        if (this.options.centerMode) {
          addClass(slide, 'slick-center');
        }
      }
    });
    
    // Trigger lazy load for ondemand/anticipated modes
    if (this.options.lazyLoad === 'ondemand' || this.options.lazyLoad === 'anticipated') {
      this.lazyLoad();
    }
  }

  /**
   * Update arrow disabled states
   */
  updateArrows() {
    if (!this.options.arrows) return;
    if (!this.state.prevArrowElement || !this.state.nextArrowElement) return;

    const maxIndex = Math.max(0, this.state.slideCount - this.options.slidesToShow);
    const disablePrev = !this.options.infinite && this.state.currentSlide === 0;
    const disableNext = !this.options.infinite && this.state.currentSlide >= maxIndex;

    if (disablePrev) {
      addClass(this.state.prevArrowElement, 'slick-disabled');
      setAttribute(this.state.prevArrowElement, 'disabled', 'disabled');
    } else {
      removeClass(this.state.prevArrowElement, 'slick-disabled');
      removeAttribute(this.state.prevArrowElement, 'disabled');
    }

    if (disableNext) {
      addClass(this.state.nextArrowElement, 'slick-disabled');
      setAttribute(this.state.nextArrowElement, 'disabled', 'disabled');
    } else {
      removeClass(this.state.nextArrowElement, 'slick-disabled');
      removeAttribute(this.state.nextArrowElement, 'disabled');
    }
  }

  /**
   * Update navigation visibility based on slide count
   * Hide arrows and dots if there aren't enough slides
   */
  updateNavigationVisibility() {
    const shouldShowNav = this.state.slideCount > this.options.slidesToShow;
    
    // Handle arrows visibility
    if (this.state.prevArrowElement) {
      if (shouldShowNav) {
        removeClass(this.state.prevArrowElement, 'slick-hidden');
        removeAttribute(this.state.prevArrowElement, 'aria-hidden');
      } else {
        addClass(this.state.prevArrowElement, 'slick-hidden');
        setAttribute(this.state.prevArrowElement, 'aria-hidden', 'true');
      }
    }
    
    if (this.state.nextArrowElement) {
      if (shouldShowNav) {
        removeClass(this.state.nextArrowElement, 'slick-hidden');
        removeAttribute(this.state.nextArrowElement, 'aria-hidden');
      } else {
        addClass(this.state.nextArrowElement, 'slick-hidden');
        setAttribute(this.state.nextArrowElement, 'aria-hidden', 'true');
      }
    }
    
    // Handle dots visibility
    if (this.state.dots) {
      if (shouldShowNav) {
        removeClass(this.state.dots, 'slick-hidden');
        removeAttribute(this.state.dots, 'aria-hidden');
      } else {
        addClass(this.state.dots, 'slick-hidden');
        setAttribute(this.state.dots, 'aria-hidden', 'true');
      }
    }
  }

  /**
   * Set list height to match current slide height (for adaptive height)
   */
  setHeight() {
    if (this.options.slidesToShow === 1 && 
        this.options.adaptiveHeight === true && 
        !this.options.vertical &&
        this.state.slideList) {
      // In infinite mode, currentSlide can exceed slideCount, so we need to wrap it
      let slideIndex = this.state.currentSlide;
      if (this.options.infinite && slideIndex >= this.state.slideCount) {
        slideIndex = slideIndex % this.state.slideCount;
      } else if (this.options.infinite && slideIndex < 0) {
        slideIndex = this.state.slideCount + (slideIndex % this.state.slideCount);
      }
      
      const currentSlide = this.state.slides[slideIndex];
      if (currentSlide) {
        const targetHeight = getOuterHeight(currentSlide);
        setStyle(this.state.slideList, 'height', `${targetHeight}px`);
      }
    }
  }

  /**
   * Animate list height to match slide height when changing slides
   */
  animateHeight() {
    if (this.options.slidesToShow === 1 && 
        this.options.adaptiveHeight === true && 
        !this.options.vertical &&
        this.state.slideList) {
      // In infinite mode, currentSlide can exceed slideCount, so we need to wrap it
      let slideIndex = this.state.currentSlide;
      if (this.options.infinite && slideIndex >= this.state.slideCount) {
        slideIndex = slideIndex % this.state.slideCount;
      } else if (this.options.infinite && slideIndex < 0) {
        slideIndex = this.state.slideCount + (slideIndex % this.state.slideCount);
      }
      
      const currentSlide = this.state.slides[slideIndex];
      if (currentSlide) {
        const targetHeight = getOuterHeight(currentSlide);
        // If we're animating, use CSS transition; otherwise set directly
        if (this.state.animating) {
          applyTransition(this.state.slideList, this.options.speed, this.options.cssEase);
          setStyle(this.state.slideList, 'height', `${targetHeight}px`);
          window.setTimeout(() => {
            removeTransition(this.state.slideList);
          }, this.options.speed);
        } else {
          setStyle(this.state.slideList, 'height', `${targetHeight}px`);
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
    const index = parseInt(getAttribute(e.currentTarget, 'data-slide-index'));
    this.goTo(index);
  }

  /**
   * Start drag/swipe
   */
  startDrag(e) {
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    
    this.state.touchObject = {
      startX: touch.pageX,
      startY: touch.pageY,
      curX: touch.pageX,
      curY: touch.pageY
    };
    
    this.state.dragging = true;
    this.state.touchStartTime = new Date().getTime();
    
    // For mouse events, we need to add mousemove and mouseup listeners to the document
    if (e.type === 'mousedown') {
      this.boundMethods.handleMouseMove = (e) => this.trackDrag(e);
      this.boundMethods.handleMouseUp = (e) => this.endDrag(e);
      
      document.addEventListener('mousemove', this.boundMethods.handleMouseMove);
      document.addEventListener('mouseup', this.boundMethods.handleMouseUp);
    }
  }

  /**
   * Track drag/swipe movement
   */
  trackDrag(e) {
    if (!this.state.dragging) return;
    
    const touch = e.type.indexOf('touch') !== -1 ? e.touches[0] : e;
    
    this.state.touchObject.curX = touch.pageX;
    this.state.touchObject.curY = touch.pageY;
    
    const swipeLength = Math.round(Math.sqrt(
      Math.pow(this.state.touchObject.curX - this.state.touchObject.startX, 2) +
      Math.pow(this.state.touchObject.curY - this.state.touchObject.startY, 2)
    ));
    
    // If we've moved more than the threshold, we're swiping
    if (swipeLength > this.options.touchThreshold) {
      this.state.swiping = true;
      
      // Calculate swipe direction
      const swipeAngle = Math.atan2(
        this.state.touchObject.curY - this.state.touchObject.startY,
        this.state.touchObject.curX - this.state.touchObject.startX
      ) * 180 / Math.PI;
      
      // Determine if this is a horizontal or vertical swipe
      const horizontalSwipe = Math.abs(swipeAngle) < 45 || Math.abs(swipeAngle) > 135;
      const verticalSwipe = Math.abs(swipeAngle) >= 45 && Math.abs(swipeAngle) <= 135;
      
      // Only handle swipe if it matches our orientation
      if (this.options.vertical && verticalSwipe) {
        if (e.type === 'touchmove' && this.options.touchMove) {
          e.preventDefault();
        }
        const swipeDistance = this.state.touchObject.curY - this.state.touchObject.startY;
        this.swipeHandler(swipeDistance);
      } else if (!this.options.vertical && horizontalSwipe) {
        if (e.type === 'touchmove' && this.options.touchMove) {
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
    if (!this.state.dragging) return;
    
    this.state.dragging = false;
    
    // Remove mouse event listeners if this was a mouse drag
    if (e.type === 'mouseup') {
      document.removeEventListener('mousemove', this.boundMethods.handleMouseMove);
      document.removeEventListener('mouseup', this.boundMethods.handleMouseUp);
    }
    
    if (this.state.swiping) {
      this.state.swiping = false;
      
      // Calculate swipe velocity
      const swipeTime = new Date().getTime() - this.state.touchStartTime;
      const swipeDistance = this.options.vertical
        ? this.state.touchObject.curY - this.state.touchObject.startY
        : this.state.touchObject.curX - this.state.touchObject.startX;
      
      // Determine if we should change slides
      const referenceWidth = this.options.variableWidth 
        ? this.state.listWidth 
        : this.state.slideWidth;
      const minSwipe = referenceWidth / (this.options.touchThreshold || 5);
      
      // If swipe distance is significant enough, change slide
      if (Math.abs(swipeDistance) > minSwipe) {
        if (swipeDistance > 0) {
          // Swiped right/down (go to previous)
          this.prev();
        } else {
          // Swiped left/up (go to next)
          this.next();
        }
      } else {
        // Swipe wasn't significant, snap back to current position
        this.setPosition();
      }
    }
    
    this.state.touchObject = {};
  }

  /**
   * Handle swipe movement
   */
  swipeHandler(swipeDistance) {
    // Skip swipe visual feedback for variable width (too complex)
    if (this.options.variableWidth) return;
    
    // Apply visual feedback during swipe
    const currentLeft = this.state.currentSlide * -this.state.slideWidth;
    const targetLeft = currentLeft + swipeDistance;
    
    // Apply edge friction if not infinite
    let adjustedDistance = swipeDistance;
    if (!this.options.infinite) {
      const maxLeft = 0;
      const minLeft = -(this.state.slideCount - this.options.slidesToShow) * this.state.slideWidth;
      
      if (targetLeft > maxLeft) {
        // Swipe right at first slide
        adjustedDistance = swipeDistance * this.options.edgeFriction;
      } else if (targetLeft < minLeft) {
        // Swipe left at last slide
        adjustedDistance = swipeDistance * this.options.edgeFriction;
      }
    }
    
    // Update visual position
    const newLeft = currentLeft + adjustedDistance;
    translate3d(this.state.slideTrack, newLeft, 0, 0);
  }

  /**
   * Checks if animations should be reduced based on user preference and settings
   * @returns {boolean} - True if motion should be reduced
   */
  shouldReduceMotion() {
    // Feature must be explicitly enabled via option
    if (!this.options.respectReducedMotion) {
      return false;
    }
    
    // Check if user has enabled prefers-reduced-motion in OS settings
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    return false;
  }

  supportsCSSVariables() {
    // Disabled: CSS variables approach needs more work to handle all edge cases
    // Reverting to proven inline styles approach for v1.2.0
    return false;
  }

  startPerformance(label) {
    if (!this.options.enablePerformanceMetrics || typeof performance === 'undefined') {
      return null;
    }

    if (typeof performance.mark !== 'function' || typeof performance.measure !== 'function') {
      return null;
    }

    const prefix = this.options.performanceMetricsPrefix || 'slick';
    const id = this.state.performanceMarkId++;
    const base = `${prefix}:${this.instanceId}:${label}:${id}`;
    const start = `${base}:start`;
    performance.mark(start);
    return { base, start };
  }

  endPerformance(handle) {
    if (!handle) return;
    const end = `${handle.base}:end`;
    performance.mark(end);
    performance.measure(handle.base, handle.start, end);
  }

  /**
   * Handle keyboard navigation
   * Supports:
   * - Arrow Left/Right: Navigate to previous/next slide
   * - Home: Jump to first slide
   * - End: Jump to last slide
   * - Enter/Space: Activate slide if focusOnSelect is enabled
   */
  handleKeydown(e) {
    // Only handle if focus is within slider and we're not typing in an input
    if (!this.element.contains(document.activeElement)) {
      return;
    }

    // Don't handle if user is typing in an input field or contenteditable
    const activeElement = document.activeElement;
    if (activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    )) {
      return;
    }

    // Don't handle if modifier keys are pressed (allow browser shortcuts like Ctrl+C)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    const currentSlide = document.activeElement?.closest('.slick-slide');

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.changeSlide({ data: { message: 'prev' } });
        break;

      case 'ArrowRight':
        e.preventDefault();
        this.changeSlide({ data: { message: 'next' } });
        break;

      case 'Home':
        e.preventDefault();
        this.goTo(0);
        break;

      case 'End':
        e.preventDefault();
        this.goTo(this.state.slideCount - 1);
        break;

      case 'Enter':
      case ' ':
        // Only handle Enter/Space on slides if focusOnSelect is enabled
        if (this.options.focusOnSelect && currentSlide) {
          e.preventDefault();
          // Navigate to this slide
          const slides = [...this.element.querySelectorAll('.slick-slide:not(.slick-cloned)')];
          const index = slides.indexOf(currentSlide);
          if (index !== -1) {
            this.goTo(index);
          }
        }
        break;
    }
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

    // Determine what width to respond to
    if (this.options.respondTo === 'window') {
      respondToWidth = windowWidth;
    } else if (this.options.respondTo === 'slider') {
      respondToWidth = getDimensions(this.element).width;
    } else if (this.options.respondTo === 'min') {
      respondToWidth = Math.min(windowWidth, getDimensions(this.element).width);
    }

    // Find the matching breakpoint
    // For desktop-first (default): use settings when width < breakpoint
    // For mobile-first: use settings when width >= breakpoint
    this.originalOptions.responsive.forEach(breakpoint => {
      if (breakpoint.breakpoint) {
        if (this.originalOptions.mobileFirst) {
          // Mobile first: activate when width >= breakpoint
          // Keep updating to get the largest matching breakpoint
          if (respondToWidth >= breakpoint.breakpoint) {
            targetBreakpoint = breakpoint.breakpoint;
            targetSettings = breakpoint.settings;
          }
        } else {
          // Desktop first: activate when width < breakpoint
          // Keep updating to get the smallest matching breakpoint
          if (respondToWidth < breakpoint.breakpoint) {
            if (targetBreakpoint === null || breakpoint.breakpoint < targetBreakpoint) {
              targetBreakpoint = breakpoint.breakpoint;
              targetSettings = breakpoint.settings;
            }
          }
        }
      }
    });

    // Check if we need to update settings
    if (targetSettings) {
      if (targetSettings === 'unslick') {
        this.unslick();
      } else {
        // Check if settings actually changed
        const optionsChanged = 
          this.state.activeBreakpoint !== targetBreakpoint;

        if (optionsChanged) {
          this.state.activeBreakpoint = targetBreakpoint;
          
          // Store current slide
          const currentSlide = this.state.currentSlide;
          
          // Merge breakpoint settings with original options
          const newOptions = extend({}, this.originalOptions, targetSettings);
          
          // Update options
          this.options = newOptions;
          
          // Refresh the slider
          this.refresh();
          
          // Try to maintain current slide position
          if (currentSlide < this.state.slideCount) {
            this.state.currentSlide = currentSlide;
            this.setPosition();
          }
          
          this.emit('breakpoint', { breakpoint: targetBreakpoint });
        }
      }
    } else if (this.state.activeBreakpoint !== null) {
      // No breakpoint active, revert to original settings
      this.state.activeBreakpoint = null;
      
      // Store current slide
      const currentSlide = this.state.currentSlide;
      
      // Restore original options
      this.options = extend({}, this.originalOptions);
      
      // Refresh the slider
      this.refresh();
      
      // Try to maintain current slide position
      if (currentSlide < this.state.slideCount) {
        this.state.currentSlide = currentSlide;
        this.setPosition();
      }
      
      this.emit('breakpoint', { breakpoint: null });
    }
  }

  /**
   * Refresh slider without destroying/recreating
   */
  refresh() {
    // Rebuild dots if needed (number of dots might change with slidesToScroll)
    if (this.state.dots) {
      remove(this.state.dots);
      this.state.dots = null;
      removeClass(this.element, 'slick-dotted');
    }
    
    if (this.options.dots) {
      this.buildDots();
    }
    
    // Rebuild arrows if needed
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
    
    // Recalculate dimensions and update positioning
    // This will use the updated this.options.slidesToShow value
    this.setPosition();
  }

  /**
   * Reinitialize slider after slides have been added/removed
   */
  reinit() {
    // Update slides array and count (excluding clones)
    const allSlides = getChildren(this.state.slideTrack);
    this.state.slides = allSlides.filter(slide => !hasClass(slide, 'slick-cloned'));
    this.state.slideCount = this.state.slides.length;
    
    // Adjust current slide if out of bounds
    if (this.state.currentSlide >= this.state.slideCount && this.state.currentSlide !== 0) {
      this.state.currentSlide = this.state.currentSlide - this.options.slidesToScroll;
    }
    
    if (this.state.slideCount <= this.options.slidesToShow) {
      this.state.currentSlide = 0;
    }
    
    // Re-add data attributes to slides
    this.state.slides.forEach((slide, index) => {
      addClass(slide, 'slick-slide');
      setAttribute(slide, 'data-slick-index', index);
    });
    
    // Rebuild infinite loop
    if (this.options.infinite) {
      this.setupInfinite();
    }
    
    // Rebuild arrows if needed
    if (this.options.arrows && this.state.slideCount > this.options.slidesToShow) {
      if (!this.state.prevArrowElement) {
        this.buildArrows();
      }
    }
    
    // Rebuild dots if needed
    if (this.options.dots && this.state.slideCount > this.options.slidesToShow) {
      if (!this.state.dots) {
        this.buildDots();
      } else {
        // Update existing dots count
        const dotCount = Math.ceil(this.state.slideCount / this.options.slidesToScroll);
        const dotContainer = this.state.dots;
        empty(dotContainer);
        
        for (let i = 0; i < dotCount; i++) {
          const dot = document.createElement('li');
          const button = document.createElement('button');
          const icon = document.createElement('span');
          addClass(icon, 'slick-dot-icon');
          setAttribute(button, 'aria-label', `Go to slide ${i + 1}`);
          setAttribute(button, 'data-slide-index', i);
          if (i === 0) addClass(dot, 'slick-active');
          button.addEventListener('click', (e) => this.dotClick(e));
          appendChild(button, icon);
          appendChild(dot, button);
          appendChild(dotContainer, dot);
        }
      }
    }
    
    // Reset position
    this.setPosition();
    this.updateSlideVisibility();
    this.updateNavigationVisibility();
    
    this.emit('reInit');
  }

  /**
   * Unload cloned slides (used by addSlide/removeSlide)
   */
  unloadClones() {
    // Remove cloned slides from the track
    const clones = selectAll('.slick-cloned', this.state.slideTrack);
    clones.forEach(clone => remove(clone));
  }

  /**
   * Unload slider elements
   */
  unload() {
    // Remove event listeners
    if (this.boundMethods.handleResize) {
      window.removeEventListener('resize', this.boundMethods.handleResize);
    }
    if (this.state.resizeObserver) {
      this.state.resizeObserver.disconnect();
      this.state.resizeObserver = null;
    }
    if (this.state.lazyLoadObserver) {
      this.state.lazyLoadObserver.disconnect();
      this.state.lazyLoadObserver = null;
    }
    if (this.boundMethods.handleVisibilityChange) {
      document.removeEventListener('visibilitychange', this.boundMethods.handleVisibilityChange);
    }
    if (this.boundMethods.handleKeydown) {
      this.element.removeEventListener('keydown', this.boundMethods.handleKeydown);
    }
    if (this.boundMethods.handleMouseDown && this.state.slideList) {
      this.state.slideList.removeEventListener('mousedown', this.boundMethods.handleMouseDown);
    }
    if (this.boundMethods.handleTouchStart && this.state.slideList) {
      this.state.slideList.removeEventListener('touchstart', this.boundMethods.handleTouchStart);
      this.state.slideList.removeEventListener('touchend', this.boundMethods.handleTouchEnd);
      this.state.slideList.removeEventListener('touchmove', this.boundMethods.handleTouchMove);
    }
    if (this.boundMethods.handleFocus) {
      this.element.removeEventListener('focusin', this.boundMethods.handleFocus, true);
    }
    if (this.boundMethods.handleBlur) {
      this.element.removeEventListener('focusout', this.boundMethods.handleBlur, true);
    }
    if (this.boundMethods.handleSlideClick && this.state.slideTrack) {
      this.state.slideTrack.removeEventListener('click', this.boundMethods.handleSlideClick);
    }
    
    // Clear autoplay
    if (this.state.autoPlayTimer) {
      clearInterval(this.state.autoPlayTimer);
      this.state.autoPlayTimer = null;
    }
    
    // Remove controls
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
    if (this.state.announcementElement && this.state.announcementElement.parentNode) {
      remove(this.state.announcementElement);
      this.state.announcementElement = null;
    }
    if (this.state.skipLinkElement && this.state.skipLinkElement.parentNode) {
      remove(this.state.skipLinkElement);
      this.state.skipLinkElement = null;
    }
    if (this.state.skipLinkTarget && this.state.skipLinkTarget.parentNode) {
      remove(this.state.skipLinkTarget);
      this.state.skipLinkTarget = null;
    }
    if (this.state.announcementTimer) {
      clearTimeout(this.state.announcementTimer);
      this.state.announcementTimer = null;
    }
    
    // Remove track
    if (this.state.slideTrack && this.state.slideTrack.parentNode) {
      // Move slides back to list
      const slides = getChildren(this.state.slideTrack);
      slides.forEach(slide => {
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
    if (!this.options.lazyLoad) return;
    
    let rangeStart, rangeEnd, slideRange = [];

    // Calculate range of slides to load based on slider configuration
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
        if (rangeStart > 0) rangeStart--;
        if (rangeEnd < this.state.slideCount) rangeEnd++;
      }
    }

    // Get slides in range to load
    const allSlides = selectAll('.slick-slide', this.state.slideTrack);
    for (let i = rangeStart; i < rangeEnd; i++) {
      if (allSlides[i]) {
        slideRange.push(allSlides[i]);
      }
    }

    // Handle 'anticipated' mode - also load prev/next slides
    if (this.options.lazyLoad === 'anticipated') {
      let prevSlide = rangeStart - 1;
      let nextSlide = rangeEnd;
      
      for (let i = 0; i < this.options.slidesToScroll; i++) {
        if (prevSlide < 0) prevSlide = this.state.slideCount - 1;
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

    // Load images in the range
    slideRange.forEach(slide => {
      this.loadImages(slide);
    });

    // Handle cloned slides in infinite mode
    if (this.state.slideCount <= this.options.slidesToShow) {
      const clonedSlides = selectAll('.slick-cloned', this.state.slideTrack);
      clonedSlides.forEach(slide => {
        this.loadImages(slide);
      });
    } else if (this.state.currentSlide >= this.state.slideCount - this.options.slidesToShow) {
      const clonedSlides = selectAll('.slick-cloned', this.state.slideTrack);
      clonedSlides.slice(0, this.options.slidesToShow).forEach(slide => {
        this.loadImages(slide);
      });
    } else if (this.state.currentSlide === 0) {
      const clonedSlides = selectAll('.slick-cloned', this.state.slideTrack);
      clonedSlides.slice(this.options.slidesToShow * -1).forEach(slide => {
        this.loadImages(slide);
      });
    }
  }

  /**
   * Load all unloaded images in a given scope
   */
  handleLazyLoadStart(img) {
    if (!img) return;

    setAttribute(img, 'aria-busy', 'true');

    if (!this.options.lazyLoadLoadingIndicator) {
      return;
    }

    const parent = img.parentNode;
    if (parent && !parent.querySelector('[data-slick-lazy-loading]')) {
      const message = document.createElement('span');
      addClass(message, 'slick-lazyload-loading-message');
      setAttribute(message, 'data-slick-lazy-loading', 'true');
      message.textContent = this.options.lazyLoadLoadingText || 'Loading image';
      appendChild(parent, message);
    }
  }

  clearLazyLoadIndicator(img) {
    if (!img) return;
    removeAttribute(img, 'aria-busy');

    if (!this.options.lazyLoadLoadingIndicator) {
      return;
    }

    const parent = img.parentNode;
    const message = parent ? parent.querySelector('[data-slick-lazy-loading]') : null;
    if (message) {
      remove(message);
    }
  }

  handleLazyLoadError(img, imageSource) {
    if (!img) return;

    // Mark as failed
    removeAttribute(img, 'data-lazy');
    removeAttribute(img, 'data-srcset');
    removeAttribute(img, 'data-sizes');
    removeClass(img, 'slick-loading');
    addClass(img, 'slick-lazyload-error');
    this.clearLazyLoadIndicator(img);

    if (this.options.lazyLoadErrorVisible) {
      const parent = img.parentNode;
      if (parent && !parent.querySelector('[data-slick-lazy-error]')) {
        const message = document.createElement('span');
        addClass(message, 'slick-lazyload-error-message');
        setAttribute(message, 'data-slick-lazy-error', 'true');
        message.textContent = this.options.lazyLoadErrorMessage || 'Image failed to load';
        appendChild(parent, message);
      }
    }

    if (this.options.lazyLoadErrorAnnounce && this.state.announcementElement) {
      this.announce(this.options.lazyLoadErrorMessage || 'Image failed to load', true);
    }

    this.emit('lazyLoadError', { image: img, imageSource });
  }

  fadeImageOut(img, startTime, fadeDuration) {
    if (this.shouldReduceMotion()) {
      setStyle(img, 'opacity', '0');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / fadeDuration, 1);
        setStyle(img, 'opacity', String(1 - progress));

        if (progress >= 1) {
          resolve();
        } else {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  }

  fadeImageIn(img, duration = 200) {
    if (this.shouldReduceMotion()) {
      setStyle(img, 'opacity', '1');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      setStyle(img, 'opacity', '0');
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setStyle(img, 'opacity', String(progress));

        if (progress >= 1) {
          resolve();
        } else {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  }

  loadImages(imagesScope) {
    const lazyImages = selectAll('img[data-lazy]', imagesScope);
    
    lazyImages.forEach(img => {
      if (this.state.lazyLoadObserver) {
        this.state.lazyLoadObserver.unobserve(img);
      }
      const imageSource = getAttribute(img, 'data-lazy');
      const imageSrcSet = getAttribute(img, 'data-srcset');
      const imageSizes = getAttribute(img, 'data-sizes') || getAttribute(this.state.slideTrack, 'data-sizes');
      
      if (!imageSource) return;
      
      // Create a temporary image to test loading
      const imageToLoad = new Image();
      
      imageToLoad.onload = () => {
        const fadeDuration = 100;
        const startTime = performance.now();

        this.fadeImageOut(img, startTime, fadeDuration)
          .then(() => {
            // Set proper image attributes
            if (imageSrcSet) {
              setAttribute(img, 'srcset', imageSrcSet);
            }
            if (imageSizes) {
              setAttribute(img, 'sizes', imageSizes);
            }

            // Set src
            setAttribute(img, 'src', imageSource);

            // Fade in
            return this.fadeImageIn(img, 200);
          })
          .then(() => {
            // Clean up data attributes
            removeAttribute(img, 'data-lazy');
            removeAttribute(img, 'data-srcset');
            removeAttribute(img, 'data-sizes');
            removeClass(img, 'slick-loading');
            this.clearLazyLoadIndicator(img);

            // Trigger custom event
            this.emit('lazyLoaded', { image: img, imageSource });
          });
      };
      
      imageToLoad.onerror = () => {
        this.handleLazyLoadError(img, imageSource);
      };
      
      // Add loading class
      addClass(img, 'slick-loading');
      this.handleLazyLoadStart(img);
      
      // Start loading
      imageToLoad.src = imageSource;
    });
  }

  initLazyLoadObserver() {
    if (!('IntersectionObserver' in window)) return false;
    if (!this.state.slideTrack) return false;
    if (this.state.lazyLoadObserver) return true;

    const rootMargin = this.options.lazyLoadIntersectionRootMargin || '200px 0px';
    const thresholdValue = Number(this.options.lazyLoadIntersectionThreshold);
    const threshold = Number.isFinite(thresholdValue) ? thresholdValue : 0.01;

    this.state.lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (!img || !getAttribute(img, 'data-lazy')) {
          this.state.lazyLoadObserver.unobserve(img);
          return;
        }
        this.state.lazyLoadObserver.unobserve(img);
        this.loadImages(img);
      });
    }, {
      root: this.state.slideList || null,
      rootMargin,
      threshold
    });

    this.observeLazyImages();
    return true;
  }

  observeLazyImages() {
    if (!this.state.lazyLoadObserver || !this.state.slideTrack) return;
    const lazyImages = selectAll('img[data-lazy]', this.state.slideTrack);
    lazyImages.forEach(img => this.state.lazyLoadObserver.observe(img));
  }

  loadProgressiveImage(img, tryCount = 1) {
    return new Promise((resolve) => {
      if (!img) {
        resolve();
        return;
      }

      const imageSource = getAttribute(img, 'data-lazy');
      const imageSrcSet = getAttribute(img, 'data-srcset');
      const imageSizes = getAttribute(img, 'data-sizes') || getAttribute(this.state.slideTrack, 'data-sizes');

      if (!imageSource) {
        resolve();
        return;
      }

      const imageToLoad = new Image();

      imageToLoad.onload = () => {
        if (imageSrcSet) {
          setAttribute(img, 'srcset', imageSrcSet);
        }
        if (imageSizes) {
          setAttribute(img, 'sizes', imageSizes);
        }

        setAttribute(img, 'src', imageSource);
        removeAttribute(img, 'data-lazy');
        removeAttribute(img, 'data-srcset');
        removeAttribute(img, 'data-sizes');
        removeClass(img, 'slick-loading');
        this.clearLazyLoadIndicator(img);

        if (this.options.adaptiveHeight === true) {
          this.setPosition();
        }

        this.emit('lazyLoaded', { image: img, imageSource });
        resolve();
      };

      imageToLoad.onerror = () => {
        if (tryCount < 3) {
          setTimeout(() => {
            this.loadProgressiveImage(img, tryCount + 1).then(resolve);
          }, 500);
        } else {
          this.handleLazyLoadError(img, imageSource);
          resolve();
        }
      };

      addClass(img, 'slick-loading');
      this.handleLazyLoadStart(img);
      imageToLoad.src = imageSource;
    });
  }

  /**
   * Progressive lazy load - loads images one at a time as they appear
   */
  progressiveLazyLoad() {
    if (!this.options.lazyLoad || this.options.lazyLoad !== 'progressive') return;

    if (!this.state.lazyLoadQueue || this.state.lazyLoadQueue.length === 0) {
      const allLazyImages = selectAll('img[data-lazy]:not(.slick-loading)', this.state.slideTrack);
      if (allLazyImages.length === 0) return;
      this.state.lazyLoadQueue = Array.from(allLazyImages);
    }

    const limit = Math.max(1, Number(this.options.lazyLoadParallelLimit) || 1);

    while (this.state.lazyLoadInFlight < limit && this.state.lazyLoadQueue.length) {
      const img = this.state.lazyLoadQueue.shift();
      this.state.lazyLoadInFlight += 1;

      this.loadProgressiveImage(img)
        .finally(() => {
          this.state.lazyLoadInFlight -= 1;

          if (this.state.lazyLoadQueue && this.state.lazyLoadQueue.length) {
            this.progressiveLazyLoad();
            return;
          }

          if (this.state.lazyLoadInFlight === 0) {
            this.state.lazyLoadQueue = null;
            this.progressiveLazyLoad();
          }
        });
    }
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
    
    // Also dispatch native DOM event for jQuery compatibility
    try {
      const customEvent = new CustomEvent(`slick:${event}`, { 
        detail: data,
        bubbles: true,
        cancelable: true
      });
      this.element.dispatchEvent(customEvent);
    } catch (e) {
      // Fallback for older browsers
      try {
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(`slick:${event}`, true, true, data);
        this.element.dispatchEvent(evt);
      } catch (err) {
        // Silent fallback if CustomEvent not supported
        console.warn('CustomEvent not supported');
      }
    }
    
    return this;
  }
}

export default SlickSlider;
