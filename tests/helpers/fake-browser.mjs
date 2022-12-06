if (!globalThis.window) {

  const base = "http://example.com";

  const window = {
    addEventListener() {},

    location: new URL(base)
  };

  globalThis.window = window;

  const state = [];

  const history = {
    back() {},
    forward() {},
    get state() { return state[state.length - 2]; },
    get length() { return state.length; },

    replaceState(a, b, location) {
      window.location = new URL(location, base);
    },
    pushState() {}
  };

  globalThis.history = history;
}
