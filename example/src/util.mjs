import { readable } from "svelte/store";

export const _articles = {
  "01": {
    name: "Peanutbutter",
    category: "staple",
    price: 1.2
  },
  "02": { name: "Cheesecake", category: "dessert" },
  "03": { name: "Hot Dog", category: "to go" },
  "10": { name: "Pizza Quattro Stagioni", category: "pizza" },
  "11": { name: "Pizza Salami", category: "pizza" },
  "12": { name: "Pizza Hawaii", category: "pizza" },
  "13": { name: "Pizza Margherita", category: "pizza" },
  "14": { name: "Pizza Funghi", category: "pizza" }
};

Object.keys(_articles).forEach(id => (_articles[id].id = id));

export const articles = readable({}, set => {
  setTimeout(() => {
    set(Object.values(_articles));
  }, 1000);

  return () => { console.log("unsubscribe articles"); };
});

export const categories = readable({}, set => {
  setTimeout(() => {
    const categories = {};

    Object.keys(_articles).forEach(id => {
      const a = _articles[id];
      let c = categories[a.category];
      if (c === undefined) {
        c = { name: a.category, articles: {} };
        categories[a.category] = c;
      }
      c.articles[id] = a;
    });
      set(Object.values(categories));
  }, 500);

  return () => { console.log("unsubscribe categories"); };
});
