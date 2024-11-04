const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.static("uploads")); // Serve uploaded images

let tasks = [];
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

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

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
app.get("/product", (req, res) => {
    const searchQuery = req.query.search || "";
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    res.render("product", { products: filteredProducts });
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

// Products catalog and add-product form
app.get("/products", (req, res) => {
    res.render("products", { products });
});

app.post("/products/add", upload.single("image"), (req, res) => {
    const { name, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "/images/default.jpg"; // Use a default image if none is uploaded
    products.push({ name, description, image });
    res.redirect("/products");
});

// Start the server
app.listen(PORT, err => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server running on http://localhost:${PORT}`);
    }
});
