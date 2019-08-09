export const articles = {
  "01": {
    name: "Peanutbutter",
    price: 1.2,
    history: [{ price: 1.1 }, { price: 1.05 }, { price: 1.0 }]
  },
  "02": { name: "Cheesecake" },
  "03": { name: "Hot Dog" },
  "10": { name: "Pizza Quattro Stagioni" },
  "11": { name: "Pizza Salami" },
  "12": { name: "Pizza Hawaii" },
  "13": { name: "Pizza Margherita" },
  "14": { name: "Pizza Funghi" }
};
Object.keys(articles).forEach(id => (articles[id].id = id));

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
