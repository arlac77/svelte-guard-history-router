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
      return transition.redirect("/login");
    }
  }
}

export const sessionGuard = new SessionGuard();
export const waitingGuard = new WaitingGuard(Waiting);

class ArticlesRoute extends IteratorStoreRoute {
  async *iteratorFor() {
    for (const a of Object.values(articles)) {
      yield a;
    }
  }
  async enter(transition) {
    if (!session) {
      return transition.redirect("/login");
    }

    return super.enter(transition);
  }
}

class ArticleRoute extends ObjectStoreRoute {
  async objectFor(properties) {
    return articles[properties.article];
  }

  propertiesFor(article) {
    return { article: article.id };
  }

  async enter(transition) {
    if (!session) {
      return transition.redirect("/login");
    }

    return super.enter(transition);
  }
}

export const articlesRoute = new ArticlesRoute("/article", Articles);
export const articleRoute = new ArticleRoute(
  articlesRoute.path + "/:article",
  Article
);

class CategoriesRoute extends IteratorStoreRoute {
  async *iteratorFor() {
    for (const c of Object.values(categories)) {
      yield c;
    }
  }

  async enter(transition) {
    if (!session) {
      return transition.redirect("/login");
    }

    return super.enter(transition);
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

export const categoriesRoute = new CategoriesRoute("/category", Categories);
export const categoryRoute = new CategoryRoute(
  categoriesRoute.path + "/:category",
  Category
);

export const router = new Router(
  [categoriesRoute, categoryRoute, articlesRoute, articleRoute],
  "/modules/svelte-guard-history-router/example"
);

export default new App({
  target: document.body
});
