import { derived } from "svelte/store";

import App from "./App.svelte";
import Waiting from "./Waiting.svelte";
import Category from "./Category.svelte";
import Article from "./Article.svelte";

import { articles, categories } from "./util.mjs";

import { Router, route, Guard, WaitingGuard } from "../../src/index.svelte";

export class AlwaysThrowGuard extends Guard {
  async enter(transition) {
    throw new Error("never go there");
  }
}

let session;

export function setSession(s)
{
  session = s;
}

if(sessionStorage.session) {
  setSession(sessionStorage.session);
}

class SessionGuard extends Guard {
  async enter(transition) {
    if(!session) {
      transition.redirect('/login');
    }
  }
}

export const sessionGuard = new SessionGuard();
export const waitingGuard = new WaitingGuard(Waiting);

export const router = new Router(
  [
    route("/category/:category",sessionGuard,Category),
    route("/article/:article",sessionGuard,Article)
  ],
  "/modules/svelte-guard-history-router/example"
);

export const article = derived(
  [articles, router.keys.article],
  ([$articles, $id], set) => {
    set($articles.find(a => a.id === $id));
    return () => {};
  }
);

const emptyCategory = { articles: [] };

export const category = derived(
  [categories, router.keys.category],
  ([$categories, $name], set) => {
    set($categories ? $categories.find(a => a.name === $name): emptyCategory);
    return () => emptyCategory;
  }
);

export default new App({
  target: document.body
});
