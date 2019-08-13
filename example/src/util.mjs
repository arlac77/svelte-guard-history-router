import { readable } from "svelte/store";

const _articles = {
  "01": {
    name: "Peanutbutter",
    ceatgory: "staple",
    price: 1.2
  },
  "02": { name: "Cheesecake", ceatgory: "dessert" },
  "03": { name: "Hot Dog", ceatgory: "to go" },
  "10": { name: "Pizza Quattro Stagioni", ceatgory: "pizza" },
  "11": { name: "Pizza Salami", ceatgory: "pizza" },
  "12": { name: "Pizza Hawaii", ceatgory: "pizza" },
  "13": { name: "Pizza Margherita", ceatgory: "pizza" },
  "14": { name: "Pizza Funghi", ceatgory: "pizza" }
};

Object.keys(_articles).forEach(id => (_articles[id].id = id));

export const articles = readable({}, set => {
  setTimeout(() => {
    console.log("ARTICLES...");
    set(_articles);
  }, 1000);

  return () => { console.log("unsubscribe articles"); };
});

export const categories = readable({}, set => {
  setTimeout(() => {
    const categories = {};

    Object.keys(_articles).forEach(id => {
      const a = _articles[id];
      const c = categories[a.category];
      if (c === undefined) {
        c = { name: a.category, articles: {} };
      }
      c.articles[id] = a;
    });
      set(categories);
  }, 500);

  return () => { console.log("unsubscribe categories"); };
});
