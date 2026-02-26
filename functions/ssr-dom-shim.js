/**
 * Minimal DOM shims for SSR.
 *
 * Some libraries (MUI, Firebase client SDK remnants, etc.) reference
 * `document` or `window` at module-evaluation time. In Node.js these
 * globals don't exist, so we provide lightweight stubs. These are only
 * used during the initial module import -- actual rendering uses
 * React's `renderToString` which doesn't touch the DOM.
 *
 * This file must be required() BEFORE the SSR bundle is imported.
 */

if (typeof globalThis.document === 'undefined') {
  const noop = () => {};
  const noopEl = () => {
    const el = {
      setAttribute: noop,
      getAttribute: () => null,
      removeAttribute: noop,
      // appendChild/insertBefore must return the child (DOM spec)
      appendChild: (child) => child,
      removeChild: (child) => child,
      insertBefore: (child) => child,
      addEventListener: noop,
      removeEventListener: noop,
      classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
      style: {},
      childNodes: [],
      children: [],
      innerHTML: '',
      textContent: '',
      ownerDocument: null,
      parentNode: null,
      nodeName: 'DIV',
      nodeType: 1,
      // firstChild accessed by goober CSS-in-JS library
      firstChild: { data: '' },
      getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
      querySelectorAll: () => [],
      querySelector: () => null,
      matches: () => false,
      contains: () => false,
      closest: () => null,
      cloneNode: () => noopEl(),
    };
    return el;
  };

  globalThis.document = {
    createElement: () => noopEl(),
    createElementNS: () => noopEl(),
    createTextNode: () => ({ nodeType: 3, textContent: '' }),
    createComment: () => ({ nodeType: 8, textContent: '' }),
    createDocumentFragment: () => ({
      appendChild: (child) => child,
      childNodes: [],
      querySelectorAll: () => [],
      querySelector: () => null,
    }),
    head: noopEl(),
    body: noopEl(),
    documentElement: noopEl(),
    getElementById: () => null,
    getElementsByClassName: () => [],
    getElementsByTagName: (tag) => {
      // SweetAlert2 calls getElementsByTagName("head")[0].appendChild(...)
      if (tag === 'head') return [globalThis.document.head];
      if (tag === 'body') return [globalThis.document.body];
      return [];
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: noop,
    removeEventListener: noop,
    cookie: '',
    readyState: 'complete',
    visibilityState: 'visible',
    hidden: false,
  };
}

if (typeof globalThis.window === 'undefined') {
  const noop = () => {};

  globalThis.window = {
    document: globalThis.document,
    location: {
      href: 'http://localhost',
      origin: 'http://localhost',
      protocol: 'http:',
      host: 'localhost',
      hostname: 'localhost',
      port: '',
      pathname: '/',
      search: '',
      hash: '',
      assign: noop,
      replace: noop,
      reload: noop,
    },
    navigator: {
      userAgent: 'Node.js SSR',
      language: 'en-US',
      languages: ['en-US'],
      platform: 'server',
      onLine: true,
    },
    history: {
      pushState: noop,
      replaceState: noop,
      go: noop,
      back: noop,
      forward: noop,
      length: 1,
      state: null,
    },
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: noop,
    requestAnimationFrame: (cb) => setTimeout(cb, 0),
    cancelAnimationFrame: noop,
    getComputedStyle: () => ({
      getPropertyValue: () => '',
    }),
    matchMedia: () => ({
      matches: false,
      addListener: noop,
      removeListener: noop,
      addEventListener: noop,
      removeEventListener: noop,
    }),
    scrollTo: noop,
    scroll: noop,
    pageYOffset: 0,
    pageXOffset: 0,
    innerWidth: 1024,
    innerHeight: 768,
    screen: { width: 1024, height: 768, orientation: { type: 'landscape-primary' } },
    localStorage: {
      getItem: () => null,
      setItem: noop,
      removeItem: noop,
      clear: noop,
    },
    sessionStorage: {
      getItem: () => null,
      setItem: noop,
      removeItem: noop,
      clear: noop,
    },
    CSS: { supports: () => false },
    MutationObserver: class {
      observe() {}
      disconnect() {}
      takeRecords() { return []; }
    },
    ResizeObserver: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    IntersectionObserver: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    performance: {
      now: () => Date.now(),
      mark: noop,
      measure: noop,
      getEntriesByName: () => [],
      getEntriesByType: () => [],
    },
    fetch: noop,
    AbortController: class {
      constructor() { this.signal = { aborted: false, addEventListener: noop, removeEventListener: noop }; }
      abort() {}
    },
    URL: globalThis.URL,
    URLSearchParams: globalThis.URLSearchParams,
    TextEncoder: globalThis.TextEncoder,
    TextDecoder: globalThis.TextDecoder,
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  };
}

if (typeof globalThis.navigator === 'undefined') {
  globalThis.navigator = globalThis.window.navigator;
}

if (typeof globalThis.self === 'undefined') {
  globalThis.self = globalThis.window;
}

if (typeof globalThis.MutationObserver === 'undefined') {
  globalThis.MutationObserver = globalThis.window.MutationObserver;
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = globalThis.window.ResizeObserver;
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = globalThis.window.IntersectionObserver;
}

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = globalThis.window.localStorage;
}

if (typeof globalThis.matchMedia === 'undefined') {
  globalThis.matchMedia = globalThis.window.matchMedia;
}

// Canvas API stubs (used by Recharts / chart polyfills)
if (typeof globalThis.CanvasRenderingContext2D === 'undefined') {
  globalThis.CanvasRenderingContext2D = class CanvasRenderingContext2D {
    beginPath() {}
    moveTo() {}
    lineTo() {}
    arcTo() {}
    closePath() {}
    fill() {}
    stroke() {}
    arc() {}
    rect() {}
    roundRect() {}
    fillRect() {}
    strokeRect() {}
    clearRect() {}
    measureText() { return { width: 0 }; }
    setTransform() {}
    drawImage() {}
    save() {}
    restore() {}
    createLinearGradient() { return { addColorStop() {} }; }
    createRadialGradient() { return { addColorStop() {} }; }
    createPattern() { return {}; }
    scale() {}
    rotate() {}
    translate() {}
    transform() {}
    clip() {}
    getImageData() { return { data: [] }; }
    putImageData() {}
  };
  CanvasRenderingContext2D.prototype.roundRect = CanvasRenderingContext2D.prototype.roundRect;
}

if (typeof globalThis.HTMLCanvasElement === 'undefined') {
  globalThis.HTMLCanvasElement = class HTMLCanvasElement {
    getContext() { return new globalThis.CanvasRenderingContext2D(); }
    toDataURL() { return ''; }
    toBlob() {}
  };
}

if (typeof globalThis.Image === 'undefined') {
  globalThis.Image = class Image {
    constructor() { this.src = ''; this.onload = null; this.onerror = null; }
  };
}
