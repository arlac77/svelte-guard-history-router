import { derived } from "svelte/store";

import App from "./App.svelte";
import About from "./About.svelte";
import NoWay from "./NoWay.svelte";
import Home from "./Home.svelte";
import Login from "./Login.svelte";
import Article from "./Article.svelte";
import Articles from "./Articles.svelte";
import Categories from "./Categories.svelte";
import Category from "./Category.svelte";
import Waiting from "./Waiting.svelte";

import { articles, categories } from "./util.mjs";

import { Router, route, Guard, WaitingGuard } from "../../src/index.svelte";

class ExceptionGuard extends Guard {
  async enter(transition) {
    throw new Error("never go there");
  }
}


let session;

export function setSession(s)
{
  session = s;
}

class SessionGuard extends Guard {
  async enter(transition) {
    if(!session) {
      transition.redirect('/login');
    }
  }
}

const sessionGuard = new SessionGuard();
const waitingGuard = new WaitingGuard(Waiting);

export const router = new Router(
  [
    route("*", Home),
    route("/about", About),
    route("/login", Login),
    route("/article", sessionGuard, /*waitingGuard,*/ Articles),
    route("/article/:article", sessionGuard, Article),
    route("/category", sessionGuard, Categories),
    route("/category/:category", sessionGuard, Category),

    route("/noway", new ExceptionGuard(), NoWay)
  ],
  "/base"
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
