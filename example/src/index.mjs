import { articles, categories } from "./data.js";

import App from "./App.svelte";
import Waiting from "./Waiting.svelte";
import Category from "./Category.svelte";
import Article from "./Article.svelte";
import Categories from "./Categories.svelte";
import Articles from "./Articles.svelte";

import {
  IteratorStoreRoute,
  ObjectStoreRoute,
  BaseRouter,
  Guard,
  WaitingGuard,
  route
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

class SessionGuard extends Guard {
  async enter(transition) {
    if (!session) {
      return transition.redirect("/login");
    }
  }
}

export const sessionGuard = new SessionGuard();
export const waitingGuard = new WaitingGuard(Waiting);

async function delay(msecs=1000)
{
  return new Promise(r => setTimeout(r, msecs));
}

class ArticlesRoute extends IteratorStoreRoute {
  async *iteratorFor() {
    await delay(2000);

    for (const a of Object.values(articles)) {
      yield a;
    }
  }
}

class ArticleRoute extends ObjectStoreRoute {
  async objectFor(properties) {
    return articles[properties.article];
  }

  propertiesFor(article) {
    return { article: article.id };
  }
}

class CategoriesRoute extends IteratorStoreRoute {
  async *iteratorFor() {
    await delay(2000);

    for (const c of Object.values(categories)) {
      yield c;
    }
  }
}

class CategoryRoute extends ObjectStoreRoute {
  async objectFor(properties) {
    return categories[properties.category];
  }

  propertiesFor(category) {
    return { category: category.name };
  }

  async enter(transition) {
    if (!session) {
      return transition.redirect("/login");
    }

    return super.enter(transition);
  }
}

export const categoriesRoute = route(
  "/category",
  CategoriesRoute,
  sessionGuard,
  waitingGuard,
  Categories
);
export const categoryRoute = route(
  categoriesRoute.path + "/:category",
  CategoryRoute,
  sessionGuard,
  waitingGuard,
  Category
);
export const articlesRoute = route(
  "/article",
  ArticlesRoute,
  sessionGuard,
  waitingGuard,
  Articles
);
export const articleRoute = route(
  articlesRoute.path + "/:article",
  ArticleRoute,
  sessionGuard,
  waitingGuard,
  Article
);

export const router = new BaseRouter(
  [categoriesRoute, categoryRoute, articlesRoute, articleRoute],
  "/modules/svelte-guard-history-router/example"
);

export default new App({
  target: document.body
});
