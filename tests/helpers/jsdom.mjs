import { JSDOM } from "jsdom";

const dom = new JSDOM(``, {
  url: "https://example.org/"
});

globalThis.window = dom.window;
globalThis.history = dom.window.history;
