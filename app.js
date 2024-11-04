const express = require("express");
const path = require("path");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from "public" directory

let tasks = []; // Array for to-do tasks

// Sample products and users data
const products = [
    { name: "Laptop", price: 1200, image: "/images/laptop.jpg", description: "A powerful laptop" },
    { name: "Smartphone", price: 800, image: "/images/smartphone.jpg", description: "A sleek smartphone" }
];
const users = {
    "john": { age: 25, hobby: "Football" },
    "jane": { age: 22, hobby: "Painting" },
    "sam": { age: 30, hobby: "Cooking" }
};
const items = [
    { name: "Laptop", category: "electronics" },
    { name: "Smartphone", category: "electronics" },
    { name: "Book", category: "literature" },
    { name: "Movie", category: "entertainment" }
];

// Routes

// Redirect root to welcome
app.get("/", (req, res) => {
    res.redirect("/welcome");
});

// Welcome route with greeting based on time
app.get("/welcome", (req, res) => {
    const username = req.query.username || "Sam";
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? "Good Morning" : "Good Evening";
    res.render("index", { username, greeting });
});

// To-Do list
app.get("/todo", (req, res) => {
    res.render("index2", { tasks });
});

app.post("/addTask", (req, res) => {
    const newTask = req.body.task;
    if (newTask) tasks.push(newTask);
    res.redirect("/todo");
});

app.post("/deleteTask", (req, res) => {
    const taskIndex = parseInt(req.body.taskIndex, 10);
    if (taskIndex >= 0 && taskIndex < tasks.length) {
        tasks.splice(taskIndex, 1);
    }
    res.redirect("/todo");
});

// Product listing and search functionality
app.get("/products", (req, res) => {
    const searchQuery = req.query.search || "";
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    res.render("products", { products: filteredProducts });
});

// User profile route
app.get("/profile/:username", (req, res) => {
    const username = req.params.username.toLowerCase();
    const user = users[username];
    if (user) {
        res.render("profile", { username, age: user.age, hobby: user.hobby });
    } else {
        res.status(404).send("User not found");
    }
});

// Search route
app.get("/search", (req, res) => {
    const query = req.query.q || "";
    const results = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );
    res.render("search", { query, results });
});

// Contact form
app.get("/contact", (req, res) => {
    res.render("contact");
});

app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    res.render("thankyou", { name, email, message });
});

// Start the server
app.listen(PORT, err => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server running on http://localhost:${PORT}`);
    }
});
