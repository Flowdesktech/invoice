/**
 * SSR Cloud Function for public-facing pages.
 *
 * This module exports an Express handler that:
 *  1. Reads the client-built index.html as a template (once, on cold start)
 *  2. Dynamically imports the Vite SSR bundle (once, on cold start)
 *  3. Calls render(url) for each request to produce HTML + critical CSS
 *  4. Injects the result into the template and returns it
 */
const path = require('path');
const fs = require('fs');

// Set up minimal DOM globals before loading the SSR bundle.
// Some libraries reference document/window at module-evaluation time.
require('./ssr-dom-shim');

// Lazy-loaded on first request (cold start)
let template = null;
let renderFn = null;

/**
 * Load the HTML template and SSR bundle. Called once per cold start.
 */
async function init() {
  if (template && renderFn) return;

  // The build pipeline copies build/index.html → functions/ssr-template.html
  const templatePath = path.resolve(__dirname, 'ssr-template.html');
  console.log('[SSR] Loading template from:', templatePath);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`SSR template not found at ${templatePath}`);
  }
  template = fs.readFileSync(templatePath, 'utf-8');
  console.log('[SSR] Template loaded, length:', template.length);

  // The Vite SSR build outputs to functions/ssr-bundle/entry-server.js (ESM)
  const bundlePath = path.resolve(__dirname, 'ssr-bundle', 'entry-server.js');
  console.log('[SSR] Loading SSR bundle from:', bundlePath);

  if (!fs.existsSync(bundlePath)) {
    throw new Error(`SSR bundle not found at ${bundlePath}`);
  }

  const ssrModule = await import(bundlePath);
  renderFn = ssrModule.render;
  console.log('[SSR] SSR bundle loaded successfully');
}

/**
 * Express-compatible handler for SSR requests.
 */
async function handleSSR(req, res) {
  try {
    await init();

    const url = req.originalUrl || req.url;

    const result = await renderFn(url);

    // Handle redirects from React Router
    if (result.redirect) {
      res.redirect(result.status || 302, result.redirect);
      return;
    }

    // Inject SSR output into the template
    let html = template;

    // Inject critical CSS into <head>
    html = html.replace('<!--ssr-head-->', result.css || '');

    // Inject rendered HTML into the root div
    html = html.replace('<!--ssr-outlet-->', result.html || '');

    // For SSR pages, hide the initial loader via inline style since content
    // is already visible in the HTML.
    html = html.replace(
      '<div id="initial-loader">',
      '<div id="initial-loader" style="display:none">'
    );

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (error) {
    console.error('[SSR] Render error for URL:', req.originalUrl || req.url);
    console.error('[SSR] Error:', error.message);
    console.error('[SSR] Stack:', error.stack);
    // Fall back to serving the un-rendered template (client-side rendering)
    if (template) {
      console.warn('[SSR] Falling back to CSR template');
      res.status(200).set({ 'Content-Type': 'text/html' }).send(template);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = { handleSSR };
