const express=require("express");
const app=express();
const PORT=8080;
const path=require("path");
const filepath=path.join(__dirname,"./views/index.ejs");
// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true })); 


// app.get("/",(req,res)=>{
//     let name="Sam";
//     let place="Bengaluru"
//     res.render(filepath,{name,destination:place});
// })
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
let tasks = []; 

app.get("/welcome", (req, res) => {
    let username = req.query.username || "sam";
    let currentHour = new Date().getHours();
    let greeting = currentHour < 12 ? "Good Morning" : "Good Evening";
    res.render("index", { username, greeting });
});
app.get("/todo", (req, res) => {
    // Render 'index2.ejs' (for to-do list)
    res.render("index2", { tasks });
});

// Add a new task
app.post("/addTask", (req, res) => {
    let newTask = req.body.task;
    if (newTask) {
        tasks.push(newTask); // Add task to the array
    }
    res.redirect("/todo"); // Redirect to the to-do page after adding task
});

// Delete a task
app.post("/deleteTask", (req, res) => {
    let taskIndex = req.body.taskIndex;
    if (taskIndex >= 0 && taskIndex < tasks.length) {
        tasks.splice(taskIndex, 1); // Remove task from the array
    }
    res.redirect("/todo"); // Redirect to the to-do page after deleting task
});


const products = [
    { name: "Laptop", price: 1200 },
    { name: "Smartphone", price: 800 },
    { name: "Tablet", price: 400 },
    { name: "Headphones", price: 150 },
    { name: "Smartwatch", price: 250 }
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

app.get("/products", (req, res) => {
    let filteredProducts = products;
    const searchQuery = req.query.search;

    if (searchQuery) {
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    res.render("product", { products: filteredProducts });
});
app.get("/profile/:username", (req, res) => {
    const username = req.params.username;

    // Get user data based on the username
    const user = users[username.toLowerCase()];

    if (user) {
        res.render("profile", { username, age: user.age, hobby: user.hobby });
    } else {
        res.status(404).send("User not found");
    }
});
app.get("/search", (req, res) => {
    const query = req.query.q || ""; // Get the query string
    const results = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    res.render("search", { query, results });
});
app.listen(PORT,(err)=>{
    if(err){
        console.log(err);
    } 
    else{
        console.log(`Listening on PORT ${PORT}`);
    }
})