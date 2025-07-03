const mongoose = require("mongoose");
const Product = require("./models/Product"); 

mongoose.connect("mongodb://localhost:27017/mern", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log("MongoDB connected");

    
    await Product.deleteMany({});

    const sampleProducts = [
      {
        name: "Paneer Tikka Masala",
        price: 250,
        category: "Veg",
        rating: 4.5,
        description: "Creamy and spicy North Indian dish.",
        ingredients: ["Paneer", "Tomato", "Cream", "Spices"],
        imageUrl: "https://www.cookwithmanali.com/wp-content/uploads/2014/04/Paneer-Tikka-Masala.jpg"
      },
      {
        name: "Chicken Biryani",
        price: 300,
        category: "Non-Veg",
        rating: 4.7,
        description: "Fragrant rice with spicy chicken.",
        ingredients: ["Rice", "Chicken", "Yogurt", "Spices"],
        imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/chicken-biryani-recipe.jpg"
      },
      {
        name: "Vegan Buddha Bowl",
        price: 220,
        category: "Vegan",
        rating: 4.3,
        description: "A nourishing bowl of plant-based goodness.",
        ingredients: ["Quinoa", "Chickpeas", "Avocado", "Veggies"],
        imageUrl: "https://simpleveganblog.com/wp-content/uploads/2020/01/Buddha-bowl-5.jpg"
      },
      {
        name: "Chocolate Lava Cake",
        price: 150,
        category: "Dessert",
        rating: 4.8,
        description: "Warm chocolate cake with gooey center.",
        ingredients: ["Chocolate", "Butter", "Sugar", "Flour", "Eggs"],
        imageUrl: "https://www.biggerbolderbaking.com/wp-content/uploads/2017/01/1C5A0205.jpg"
      },
      {
        name: "Mango Smoothie",
        price: 120,
        category: "Beverage",
        rating: 4.6,
        description: "Refreshing summer drink made from ripe mangoes.",
        ingredients: ["Mango", "Milk", "Sugar", "Ice"],
        imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/04/mango-smoothie-recipe.jpg"
      }
    ];

    await Product.insertMany(sampleProducts);

    console.log("Sample products inserted successfully.");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err);
  });
