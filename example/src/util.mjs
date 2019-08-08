export const articles = {
  "01": {
    name: "Peanutbutter",
    price: 1.2,
    history: [{ price: 1.1 }, { price: 1.05 }, { price: 1.0 }]
  },
  "02": { name: "Cheesecake" },
  "03": { name: "Pizza Four Seasons" },
  "04": { name: "Pizza Salami" },
  "05": { name: "Pizza Hawaii" }
};
Object.keys(articles).forEach(id => (articles[id].id = id));

/**
 * simulate fetching delay
 */
export async function loadArticles(duration = 2000, shouldFail = false) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      shouldFail
        ? reject(new Error("Unable to fetch articles"))
        : resolve(articles);
    }, duration)
  );
}
