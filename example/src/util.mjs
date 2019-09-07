import { readable } from "svelte/store";
import { articles as _articles } from "./data.mjs";

export const articles = readable([], set => {
  setTimeout(() => {
    set(Object.values(_articles));
  }, 1000);

  return () => {};
});

export const categories = readable([], set => {
  setTimeout(() => {
    const categories = [];

    Object.keys(_articles).forEach(id => {
      const a = _articles[id];
      let c = categories.find(c => c.name === a.category);
      if (c === undefined) {
        c = { name: a.category, articles: [] };
        categories.push(c);
      }
      c.articles.push(a);
    });
    set(categories);
  }, 500);

  return () => {};
});
