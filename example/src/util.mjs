import { readable } from "svelte/store";

export const _articles = {
  "01": {
    name: "Peanutbutter",
    category: "staple",
    price: 1.98
  },
  "02": { name: "Cheesecake", price: 2.0, category: "dessert" },
  "03": { name: "Hot Dog", price: 2.0, category: "to go" },
  "10": { name: "Pizza Quattro Stagioni", price: 8.0, category: "pizza" },
  "11": { name: "Pizza Salami", price: 7.0, category: "pizza" },
  "12": { name: "Pizza Hawaii", price: 7.0, category: "pizza" },
  "13": { name: "Pizza Margherita", price: 5.0, category: "pizza" },
  "14": { name: "Pizza Funghi", price: 7.0, category: "pizza" }
};

Object.keys(_articles).forEach(id => (_articles[id].id = id));

export const articles = readable({}, set => {
  setTimeout(() => {
    set(Object.values(_articles));
  }, 1000);

  return () => {
    console.log("unsubscribe articles");
  };
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

  return () => {
    console.log("unsubscribe categories");
  };
});
