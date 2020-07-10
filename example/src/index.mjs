import { articles, categories } from "./data.js";

import App from "./App.svelte";
import Waiting from "./Waiting.svelte";

import {
  IteratorStoreRoute,
  ChildStoreRoute,
  WaitingGuard,
  Guard,
  redirectGuard
} from "../../src/index.svelte";

export class AlwaysThrowGuard extends Guard {
  async enter(transition) {
    throw new Error("never go there");
  }
}

let session;

export function setSession(s) {
  session = s;
}

if (sessionStorage.session) {
  setSession(sessionStorage.session);
}

export const enshureSession = redirectGuard("/login",() => !session);

export const waitingGuard = new WaitingGuard(Waiting);

async function delay(msecs = 1000) {
  return new Promise(r => setTimeout(r, msecs));
}

export class ArticlesRoute extends IteratorStoreRoute {
  async *iteratorFor() {
    await delay(1000);

    for (const a of Object.values(articles)) {
      yield a;
    }
  }
}

export class CategoriesRoute extends IteratorStoreRoute {
  async *iteratorFor() {
    await delay(800);

    for (const c of Object.values(categories)) {
      yield c;
    }
  }
}

export default new App({
  target: document.body
});
