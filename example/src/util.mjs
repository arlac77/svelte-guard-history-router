export const articles = {
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

Object.keys(articles).forEach(id => (articles[id].id = id));

export async function loadCategories(duration = 10, shouldFail = false) {
  const categories = {};

  Object.keys(articles).forEach(id => {
    const a = articles[id];
    const c = categories[a.category];
    if(c === undefined) {
      c = { name: a.category, articles: {} };
    }
    c.articles[id] = a;
  });

  return new Promise((resolve, reject) =>
    setTimeout(() => {
      shouldFail
        ? reject(new Error("Unable to fetch categories"))
        : resolve(categories);
    }, duration)
  );
}

/**
 * simulate fetching delay
 */
export async function loadArticles(duration = 10, shouldFail = false) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      shouldFail
        ? reject(new Error("Unable to fetch articles"))
        : resolve(articles);
    }, duration)
  );
}
