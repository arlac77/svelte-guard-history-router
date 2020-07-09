import { articles, categories } from "./data.js";

import App from "./App.svelte";
import Waiting from "./Waiting.svelte";

import {
  IteratorStoreRoute,
  ObjectStoreRoute,
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

async function delay(msecs = 1000) {
  return new Promise(r => setTimeout(r, msecs));
}

export class ArticlesRoute extends IteratorStoreRoute {
  async *iteratorFor() {
    await delay(2000);

    for (const a of Object.values(articles)) {
      yield a;
    }
  }
}

export class ArticleRoute extends ObjectStoreRoute {
  async objectFor(properties) {
    return articles[properties.article];
  }

  propertiesFor(article) {
    return article.id ? { article: article.id } : undefined;
  }
}

export class CategoriesRoute extends IteratorStoreRoute {
  async *iteratorFor() {
    await delay(2000);

    for (const c of Object.values(categories)) {
      yield c;
    }
  }
}

export class CategoryRoute extends ObjectStoreRoute {
  async objectFor(properties) {
    return categories[properties.category];
  }

  propertiesFor(category) {
    return category.name && category.articles
      ? { category: category.name }
      : undefined;
  }
}

export default new App({
  target: document.body
});
