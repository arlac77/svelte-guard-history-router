  export const articles = {
    "01": { name: "Peanutbutter" },
    "02": { name: "Cheesecake" },
    "03": { name: "Pizza Four Seasons" },
    "04": { name: "Pizza Salami" },
    "05": { name: "Pizza Hawaii" }
  };

  export async function loadArticles() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Object.keys(articles).forEach(id => (articles[id].id = id));
        resolve(articles);
      }, 2000);
    });
  }
