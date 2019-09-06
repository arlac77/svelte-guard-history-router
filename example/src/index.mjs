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
import { articles, categories } from "./util.mjs";

import { Router, route, Guard } from "../../src/index.svelte";

class ExceptionGuard extends Guard {

  async enter(state, from) {
    throw new Error("never go there");
  }
}

export const router = new Router(
  [
    route("*", Home),
    route("/about", About),
    route("/login", Login),
    route("/article", Articles),
    route("/article/:article", Article),
    route("/category", Categories),
    route("/category/:category", Category),

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
