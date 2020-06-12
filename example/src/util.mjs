import { readable } from "svelte/store";
import { articles as _articles, categories as _categories } from "./data.js";

export const articles = readable([], set => {
  setTimeout(() => {
    set(Object.values(_articles));
  }, 1000);

  return () => {};
});

export const categories = readable([], set => {
  setTimeout(() => {
    set(Object.values(_categories));
  }, 1000);

  return () => {};
});
