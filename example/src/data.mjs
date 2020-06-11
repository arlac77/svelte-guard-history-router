export const articles = Object.fromEntries(
  [
    {
      id: "01",
      name: "Peanutbutter",
      category: "staple",
      price: 1.98
    },
    { id: "02", name: "Cheesecake", price: 2.0, category: "dessert" },
    { id: "03", name: "Hot Dog", price: 2.0, category: "to go" },
    { id: "04", name: "Milk", category: "staple", price: 1.05 },
    { id: "10", name: "Pizza Quattro Stagioni", price: 8.0, category: "pizza" },
    { id: "11", name: "Pizza Salami", price: 7.0, category: "pizza" },
    { id: "12", name: "Pizza Hawaii", price: 7.0, category: "pizza" },
    { id: "13", name: "Pizza Margherita", price: 5.0, category: "pizza" },
    { id: "14", name: "Pizza Funghi", price: 7.0, category: "pizza" },
    { id: "15", name: "Pizza Calzone", price: 7.0, category: "pizza" }
  ].map(a => [a.id, a])
);
