export const articles = {
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

Object.keys(articles).forEach(id => (articles[id].id = id));
