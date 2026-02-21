accessible-vanilla-slick
----------------

_the last (accessible) carousel you'll ever need_

A highly accessible, WCAG 2.2 compliant, drop-in replacement for Slick Slider (1.8.1) intended to make life easier for real-world dev teams who need to pass accessibility audits.

This package is a vanilla ES6 JavaScript rewrite that implements [accessibility and usability improvements](#what-makes-this-accessible) crafted and tested by native screen reader users, low vision users, and expert accessibility consultants. Built with no jQuery dependency, it maintains all the accessibility features developers need while providing modern, lightweight carousel functionality. Read on to learn more about [why this package exists](#why-is-this-needed), its [features](#what-makes-this-accessible), [how to use it](#usage), and [how you can get involved!](#contributing)

#### Demo

https://ivcreative.github.io/accessible-vanilla-slick/

Also check out this [collection of ready-to-use demos on CodePen](https://codepen.io/collection/nwRGZk) for common scenarios like hero banners, scrolling product cards, PDP thumbnail images, and more!

## What's new in v1.2.0

- Motion sensitivity support with `respectReducedMotion`.
- Full keyboard navigation (Arrow Left/Right, Home, End).
- Aria-live announcements with per-slide `data-announce` and optional descriptions.
- Skip link support for keyboard users.
- Lazy load improvements: RAF fades, loading/error indicators, progressive parallel loading, and IntersectionObserver support.
- Responsive + layout optimizations with ResizeObserver and CSS variable positioning.
- Optional `performance.mark()`/`performance.measure()` metrics for `init`, `changeSlide`, and `setPosition`.

## Changelog

### v1.2.0

- Accessibility: aria-live announcements with `data-announce`/`data-announce-description`, skip links, improved keyboard navigation, and fade focus management.
- Performance: ResizeObserver support, IntersectionObserver lazy loading, parallel progressive loading, RAF image fades, and CSS variable positioning.
- UX: autoplay toggle label updates, `aria-current` on dots, and loading/error indicators for lazy images.

#### CDN

##### Example using jsDelivr

Just add a link to the CSS file in your `<head>`:

```html
<!-- Add the core slick.min.css -->
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@ivcreative/accessible-vanilla-slick@1.2.3/slick/dist/slick.min.css">

<!-- Add ONE of the theme files (accessible version or original) -->
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@ivcreative/accessible-vanilla-slick@1.2.3/slick/dist/accessible-slick-theme.min.css">
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@ivcreative/accessible-vanilla-slick@1.2.3/slick/dist/slick-theme.min.css">
```

Then, before your closing `<body>` tag add:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@ivcreative/accessible-vanilla-slick@1.2.3/slick/dist/slick.min.js"></script>
```

#### Package Managers

```sh
npm install @ivcreative/accessible-vanilla-slick
```

## Why is this needed?

Almost by design, carousels are pretty hard for screen reader users (especially newbies) to understand and interact with successfully, let alone enjoy. Its hard to know where slides begin and end, how the slide navigation dots work, or where the various controls are. Carousels also vary quite a bit between sites or even just between pages, so it can be difficult for screen reader users to build up a reliable mental model that applies to ALL carousels. And let's not even get started on autoplay functionality ([WCAG 2.2.2](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html), anyone?)!

As one of the most widely used carousel packages out there, Slick Slider has many of these same accessibility issues, making it a consistent source of frustration for dev teams when they go through an accessibility audit. Efforts have been made in the Slick Slider repo to improve these issues (especially in version 1.8.1), but those efforts have also introduced new accessibility issues too!

In the long term it'd be great to contribute some improvements to the core Slick Slider repo, but that may or may not be possible considering it's [been abandoned](https://github.com/kenwheeler/slick/graphs/code-frequency) (but not deprecated) by it's original author since 2016. A maintainer or two has recently stepped up to resume development, but with over [1,000 open issues](https://github.com/kenwheeler/slick/issues?q=is%3Aissue+is%3Aopen+accessibility) and nearly [200 open PRs](https://github.com/kenwheeler/slick/pulls?q=is%3Apr+is%3Aopen+accessibility) (some with conflicting approaches), its unlikely that the big fixes needed will make their way to the master branch any time soon.

In the short term, an accessible jQuery version of Slick was created, but that project also appears to have been abandoned. This vanilla ES6 version was created as a modern alternative that steps away from the jQuery dependency entirely, providing a lightweight, maintainable, and truly accessible carousel solution for today's JavaScript ecosystem. The vanilla implementation respects the original functionality and API features as much as possible so you can improve the accessibility of your carousels **right now**! It's available through NPM and jsDelivr so upgrading is as easy as changing the URLs in your `<link>` and `<script>` tags—and unlike the original, you get modern ES6 JavaScript without any jQuery overhead!


## What makes this accessible?

This package implements the following changes, all of which have been thoroughly tested and discussed with Accessible360's team of native screen reader users, low vision users, and experienced accessibility engineers:

### New features ✨

<table>
  <thead>
    <tr>
      <th scope="col" width="40%" align="left">Feature</th>
      <th scope="col" align="left">Why</th>
    </tr>
  </thead>
  <tbody>
    <tr valign="top">
      <th scope="row" align="left"><a href="https://github.com/Accessible360/accessible-slick/issues/7">Wrapper</a> now has <code>role="region"</code> and a configurable <code>aria-label</code>.</th>
      <td>Tells screen reader users exactly where the carousel begins and ends in the DOM and gives them a landmark they can jump to or skip easily. Use the <a href="#new-settings-"><code>regionLabel</code> setting</a> to change the <code>aria-label</code> text (defaults to <code>'carousel'</code>).</td>
    </tr>
    <tr valign="top">
      <th scope="row" align="left"><a href="https://github.com/Accessible360/accessible-slick/issues/9">Each slide</a> now has <code>role="group"</code> with a generic, numbered <code>aria-label</code>.</th>
      <td>Tells screen reader users exactly where each individual slide begins and ends in the DOM. It should fit the vast majority of use cases, but if you <em>really</em> want to disable it you can do so with the new <a href="#new-settings-"><code>useGroupRole</code> setting</a>.</td>
    </tr>
    <tr valign="top">
      <th scope="row" align="left">Enabling autoplay now automatically adds a <a href="https://github.com/Accessible360/accessible-slick/issues/13">pause/play toggle button</a> as the first focusable element (with <a href="https://github.com/Accessible360/accessible-slick/issues/20">customizable icons</a>!).</th>
      <td><a href="https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html">WCAG 2.2.2</a> requires that all auto-updating content comes with a way to pause, stop, or hide it. For carousels, pause/play icon buttons are the most familiar option. Since autoplay is so disruptive for keyboard and screen reader users, as well as people with certain cognitive conditions, the button is the very first piece of content in the slider so it can be reached right away.</td>
    </tr>
    <tr valign="top">
      <th scope="row" align="left"><a href="https://github.com/Accessible360/accessible-slick/issues/18">Instructions can now be provided</a> for screen reader users</th>
      <td>If your slider uses complex logic or unconventional interaction behaviors, there is a good chance that screen reader users will have an especially hard time figuring it out. If you're using the <code>asNavFor</code> setting or any of the API methods/events, you should probably explain how your carousel works to screen reader users.</td>
    </tr>
    <tr valign="top">
      <th scope="row" align="left">🆕 <strong>Respects <code>prefers-reduced-motion</code></strong> to support users with motion sensitivity.</th>
      <td>With the new <code>respectReducedMotion</code> setting, the slider automatically detects and honors the user's "Reduce Motion" operating system preference. This is essential for users with vestibular disorders, epilepsy, and other conditions that make motion uncomfortable or dangerous. When enabled, animations and transitions are disabled automatically. Complies with <a href="https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html">WCAG 2.2.2 (Animation from Interactions)</a>.</td>
    </tr>
    <tr valign="top">
      <th scope="row" align="left">The <a href="https://github.com/Accessible360/accessible-slick/issues/20">Previous and Next arrows can now be placed</a> before, after, or on either side of the slides in the DOM to match the visual design.</th>
      <td>Designers can get really creative with sliders sometimes, making it difficult to ensure that all of the controls and slide contents are in a logical order in the page's DOM (<a href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">WCAG 1.3.2</a>) and tab sequence (<a href="https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html">WCAG 2.4.3</a>). Using the new <a href="#new-features-"><code>arrowsPlacement</code> setting</a>, you can now control where the previous and next buttons are injected to better match the visual design!</td>
    </tr>
    <tr valign="top">
      <th scope="row" align="left">A <a href="https://github.com/Accessible360/accessible-slick/issues/14">more accessible CSS theme</a> is now available with better focus styles and larger icons.</th>
      <td>The original CSS theme (<code>slick-theme.min.css</code>) had very small icons and poor focus indicators. Now an alternative theme is available (<code>accessible-slick-theme.min.css</code>) with larger icons and browser-default focus indicators. To minimize risk of possible breaking styling changes, this theme is <b>opt-in</b>. Just update your <code>&lt;link&gt;</code> reference to use it! Check out the <a href="https://accessible360.github.io/accessible-slick">demo page</a> to see it in action.</td>
    </tr>
    <tr valign="top">
      <th scope="row" align="left">When Center Mode is enabled, the <code>aria-label</code> of the <a href="https://github.com/Accessible360/accessible-slick/issues/21#issuecomment-756320112">centered slide will now be appended with the text "(centered)"</a>.</th>
      <td>As shown in the <a href="https://accessible360.github.io/accessible-slick/#center-mode">original examples</a>, it is possible to apply custom styles to the centered slide to emphasize it. Since it's not possible to determine when this is done, the safest option is to just always tell screen reader users which slide is the centered one.</td>
    </tr>
  </tbody>
</table>

### Feature changes ⚠️

<table>
  <thead>
    <tr>
      <th scope="col" width="40%" align="left">Feature</th>
      <th scope="col" align="left">Why</th>
    </tr>
  </thead>
  <tbody>
    <tr valign="top">
      <th scope="row" align="left"><a href="https://github.com/Accessible360/accessible-slick/issues/8">Previous and Next button markup</a> improved to use less ARIA and to safely hide the icons from screen readers.</th>
      <td>Per the <a href="https://www.w3.org/TR/using-aria/#rule1">First Rule of ARIA Use</a>, <code>aria-label</code> has been removed in favor of inner screen-reader-only text. Also, the HTML5 <code>disabled</code> attribute is now used instead of <code>aria-disabled</code> for more consistency across all input modalities. Finally, the custom icons are attached to inner <code>span</code>s that are properly hidden from screen readers with <code>aria-hidden</code>.</td>
    </tr>
    <tr valign="top">
      <th scope="row" align="left">Tab markup is no longer used for <a href="https://github.com/Accessible360/accessible-slick/issues/10">slide dots</a> or <a href="https://github.com/Accessible360/accessible-slick/issues/9">slides</a>.</th>
      <td>Carousels <a href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html">don't look like tabs</a>, so real users wouldn't expect them to work like tabs, especially when there are multiple slides visible at a time.</td>
    </tr>
    <tr valign="top">
      <th scope="row" align="left">Keyboard navigation with the <code>Left</code> and <code>Right</code> arrow keys <a href="https://github.com/Accessible360/accessible-slick/issues/15">has been removed</a>.</th>
      <td>The <code>Left</code> and <code>Right</code> keys are already used by screen readers for virtual cursor navigation, and other users have no reason to expect this functionality exists without visible instructions or clues.</td>
    </tr>
    <tr valign="top">
      <th scope="row" align="left">When slides are <a href="https://github.com/Accessible360/accessible-slick/issues/21#issuecomment-756320112">dynamically added after initialization</a>, they will now automatically get <code>role="group"</code> and a numbered <code>aria-label</code>.</th>
      <td>The API expects you to supply the complete markup for each slide you add, including its wrapper. However, developers may not realize that they need to add these attributes for accessibility, so adding them automatically guarantees they're there. This also ensures backwards compatibility with any existing implementations.</td>
    </tr>
  </tbody>
</table>


## Usage

All of the original events and methods, and most of the original settings, are still available and work as expected, so your existing configurations won't need to be updated at all! Refer to the original Slick Slider documentation to see how to use them:

* [Data attribute settings](https://github.com/kenwheeler/slick#data-attribute-settings)
* [Settings](https://github.com/kenwheeler/slick#settings)
* [Events](https://github.com/kenwheeler/slick#events)
* [Methods](https://github.com/kenwheeler/slick#methods)

### New settings ✨
In addition the original functionality, the following new settings have been added:

Setting | Type | Default | Description
:-------|:-----|:--------|:-----------
arrowsPlacement | string ('beforeSlides' \| 'afterSlides' \| 'split') | null | Determines where the previous and next arrows are placed in the slider DOM, which determines their tabbing order. Arrows can be placed together before the slides or after the slides, or split so that the previous arrow is before the slides and the next arrow is after (this is the default). Use this setting to ensure the tabbing order is logical based on your visual design to fulfill [WCAG 1.3.2](https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html) and [2.4.3](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html).
announceSlides | boolean | true | Enables screen-reader announcements when the current slide changes.
announceSlidePosition | boolean | true | When enabled, announces slide position (e.g. `Slide 2 of 6`). If all other announcement data is missing, position is used as the fallback.
announceSlideDescription | boolean | false | When enabled, appends per-slide description text from `data-announce-description` to announcements.
announcementPrefix | string | 'Slide' | Prefix used in automatic announcements, e.g. `Slide 2 of 6`.
instructionsText | string | `null` | Instructions for screen reader users placed at the very beginning of the slider markup. **If you are using `asNavFor` or adding custom functionality with API methods/events, you probably need to supply instructions!**
lazyLoadErrorMessage | string | 'Image failed to load' | Text shown when a lazy-loaded image fails to load.
lazyLoadErrorVisible | boolean | true | When true, shows a visible error message near the failed image.
lazyLoadErrorAnnounce | boolean | true | When true, announces the lazy-load error via the aria-live region.
lazyLoadLoadingIndicator | boolean | false | When true, shows a visible loading message while images are loading.
lazyLoadLoadingText | string | 'Loading image' | Text shown while a lazy-loaded image is loading.
lazyLoadParallelLimit | number | 3 | Maximum number of images to load in parallel for `lazyLoad: 'progressive'`. Set to 1 to keep sequential loading.
lazyLoadUseIntersectionObserver | boolean | true | When true, uses IntersectionObserver for `lazyLoad: 'ondemand'` if available.
lazyLoadIntersectionRootMargin | string | '200px 0px' | Root margin for IntersectionObserver preloading.
lazyLoadIntersectionThreshold | number | 0.01 | IntersectionObserver threshold for lazy-loaded images.
enablePerformanceMetrics | boolean | false | When true, emits `performance.mark()` and `performance.measure()` entries for `init`, `changeSlide`, and `setPosition`.
performanceMetricsPrefix | string | 'slick' | Prefix used for performance entries (e.g. `slick:slider-id:setPosition:0`).
pauseIcon | string (html \| jQuery selector) \| object (DOM node \| jQuery object) | `<span class="slick-pause-icon" aria-hidden="true"></span>` | Custom element to use as the "pause" icon inside the autoplay pause/play toggle button, when `autoplay` is enabled.
playIcon | string (html \| jQuery selector) \| object (DOM node \| jQuery object) | `<span class="slick-play-icon" aria-hidden="true"></span>` | Custom element to use as the "play" icon inside the autoplay pause/play toggle button, when `autoplay` is enabled.
regionLabel | string | 'carousel' | Text to use for the `aria-label` that is placed on the wrapper.
useSkipLink | boolean | true | Adds a skip link before the carousel so keyboard users can bypass it quickly.
skipLinkText | string | 'Skip carousel' | Text for the skip link (e.g. `Skip featured carousel`).
skipLinkVisible | boolean | false | When true, the skip link is always visible; otherwise it is visually hidden until focused.
useGroupRole | boolean | true | Controls whether `role="group"` and an `aria-label` are applied to each slide.
useAutoplayToggleButton | boolean | true | Controls whether a pause/play icon button is added when autoplay is enabled. Setting this to `false` without providing an alternative control would likely violate [WCAG 2.2.2](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html), so be careful!

### Per-slide announcements (`data-announce`) 🔊

For dynamic environments like WordPress, add `data-announce` to each slide wrapper to control what gets read by screen readers:

```html
<div class="slide" data-announce="New arrivals: Summer collection">
  ...
</div>
```

Automatic message format:

```text
Slide X of Y: [data-announce value]
```

You can also customize the prefix per-slide with `data-announce-prefix` (for example `Showing`), or globally with the `announcementPrefix` setting.

If you only want the description or custom text and no slide position, set `announceSlidePosition: false`.

If you also want to announce extra details per slide, add `data-announce-description` and enable `announceSlideDescription: true`:

```html
<div
  class="slide"
  data-announce="Summer collection"
  data-announce-description="20 items, free shipping, limited edition"
>
  ...
</div>
```

```javascript
const slider = new slickModule.SlickSlider(document.querySelector('.slider'), {
  announceSlides: true,
  announceSlideDescription: true
});
```

Programmatic API is also available for dynamic updates:

```javascript
slider.announce('A new slide was added', true);
slider.announceCurrentSlide(true);
```


### Deprecated settings ❌
The following settings have been removed from the API, but if you pass them in through your initialization function or data attributes nothing bad will happen! If any of these settings are passed in, you'll just get a soft console warning letting you know that the setting is no longer relevant.

Setting | Reason(s)
:-------|:---------
accessibility | Equal access should not be a feature that can be turned off. This setting actually made the slides _less_ accessible by introducing unintuitive tab markup, keyboard navigation that conflicts with screen readers, and more. [See issue #12](https://github.com/Accessible360/accessible-slick/issues/12).
focusOnChange | Per [WCAG 3.2.2](https://www.w3.org/WAI/WCAG21/Understanding/on-input.html) and user research, keyboard focus should never be moved unless the user is told ahead of time. Even when explained, moving focus like this would suck for keyboard users, so this setting had to go. [See issue #11](https://github.com/Accessible360/accessible-slick/issues/11).
focusOnSelect | Unnecessary since keyboard navigation has been removed. Even with keyboard navigation, tab stops on non-actionable elements is very strange for keyboard users, and really just adds work for them. [See issue #11](https://github.com/Accessible360/accessible-slick/issues/11).


## Development
If you'd like to contribute changes or just make modifications for your own use, use the following process:

1. Install all the dev dependencies with NPM:

```sh
npm install
```

2. Make your changes to the source files. You'll want to focus on:
    * `slick/slick.js`
    * `slick/slick.scss`
    * `slick/slick-theme.scss`

3. Build using npm scripts (modern Sass + ESBuild pipeline):

```sh
# Build once
npm run build

# Watch source files and rebuild on change
npm run watch
```

4. Check your changes by loading up `docs/index.html` in your browser.


## Contributing

[See the contributing guidelines.](https://github.com/ivcreative/accessible-vanilla-slick/blob/master/CONTRIBUTING.md)


## Credits

Massive kudos to [Ken Wheeler](https://github.com/kenwheeler) and the entire [Slick Slider community](https://github.com/kenwheeler/slick) for creating the original package.

The accessible jQuery fork was created by [Jason Webb](https://github.com/jasonwebb), Developer Advocate at <a href="https://accessible360.com" target="_blank">Accessible360</a>, and the team at Accessible360 who contributed extensive accessibility research, testing with native screen reader users, and expert accessibility consultation to ensure a truly accessible carousel implementation.

The vanilla version of this package was created by [Miguel Quintero](https://github.com/ivcreative) to maintain and distribute this accessible carousel as an independent, community-supported project.
