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
  Router,
  Guard,
  WaitingGuard
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
      transition.redirect("/login");
    }
  }
}

export const sessionGuard = new SessionGuard();
export const waitingGuard = new WaitingGuard(Waiting);

class ArticlesRoute extends IteratorStoreRoute {
  async *iteratorForProperties() {
    for (const a of Object.values(articles)) {
      yield a;
    }
  }
}

class CategoriesRoute extends IteratorStoreRoute {
  async *iteratorForProperties() {
    for (const c of Object.values(categories)) {
      yield c;
    }
  }
}

class CategoryRoute extends ObjectStoreRoute {
  async objectForProperties(properties) {
    return categories[properties.category]
  }

  propertiesForObject(category) {
    return { category: category.name };
  }
}

class ArticleRoute extends ObjectStoreRoute {
  async objectForProperties(properties) {
    return articles[properties.article];
  }

  propertiesForObject(article) {
    return { article: article.id };
  }
}

export const categoriesRoute = new CategoriesRoute("/category", Categories);
export const categoryRoute = new CategoryRoute(
  categoriesRoute.path + "/:category",
  Category
);
export const articlesRoute = new ArticlesRoute("/article", Articles);
export const articleRoute = new ArticleRoute(
  articlesRoute.path + "/:article",
  Article
);

export const router = new Router(
  [categoriesRoute, categoryRoute, articlesRoute, articleRoute],
  "/modules/svelte-guard-history-router/example"
);

export default new App({
  target: document.body
});
