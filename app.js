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
app.listen(PORT,(err)=>{
    if(err){
        console.log(err);
    } 
    else{
        console.log(`Listening on PORT ${PORT}`);
    }
})