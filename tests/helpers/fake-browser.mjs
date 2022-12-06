if (!globalThis.window) {

  const base = "http://example.com";

  const window = {
    addEventListener() {},

    location: new URL(base)
  };

  globalThis.window = window;

  const history = {
    back() {},
    replaceState(a, b, location) {
      window.location = new URL(location, base);
    },
    pushState() {}
  };

  globalThis.history = history;
}
