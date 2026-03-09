// Minimal entry point: serve static assets (index.html, script.js, style.css)
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
