export const articles = Object.fromEntries(
  [
    {
      id: "01",
      name: "Peanutbutter",
      category: "staple",
      price: 1.98
    },
    {
      id: "02",
      name: "cracked wheat",
      category: "staple",
      price: 1.29
    },
    { id: "03", name: "Milk", category: "staple", price: 1.05 },
    { id: "10", name: "Pizza Quattro Stagioni", price: 8.0, category: "pizza" },
    { id: "11", name: "Pizza Salami", price: 7.0, category: "pizza" },
    { id: "12", name: "Pizza Hawaii", price: 7.0, category: "pizza" },
    { id: "13", name: "Pizza Margherita", price: 5.0, category: "pizza" },
    { id: "14", name: "Pizza Funghi", price: 7.0, category: "pizza" },
    { id: "15", name: "Pizza Calzone", price: 7.0, category: "pizza" },
    { id: "16", name: "Pizza Tonno", price: 7.0, category: "pizza" },
    { id: "17", name: "Pizza Frutti di Mare", price: 7.0, category: "pizza" },
    { id: "18", name: "Pizza Prosciutto", price: 7.0, category: "pizza" },
    { id: "19", name: "Pizza Peperoni", price: 7.0, category: "pizza" },
    { id: "20", name: "Pizza Chef", price: 7.5, category: "pizza" },
    { id: "21", name: "Pizza Speciale", price: 8.5, category: "pizza" },
    { id: "23", name: "Hot Dog", price: 2.0, category: "to go" },
    { id: "32", name: "Cheesecake", price: 2.0, category: "dessert" }
  ].map(a => [a.id, a])
);

export const categories = Object.values(articles).reduce((all, c) => {
  if (!all[c.category]) all[c.category] = { cid: c.category, name: c.category, articles: [] };
  all[c.category].articles.push(c);
  c.category = all[c.category];
  return all;
}, {});
