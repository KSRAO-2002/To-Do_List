const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const items = ["Apply for internship", "Play minecraft", "Work on Capstone"]
const workItems = [];

app.get("/", (req, res) =>{
    const day = date.getDay();
    res.render('list', {listTitle: day, newListItems: items});
});

app.post("/",(req,res)=>{
    item = req.body.newItem;

    if(req.body.list === "Work"){
        workItems.push(item)
        res.redirect("/work");
    } else{
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", (req,res)=>{
    res.render('list', {listTitle: "Work", newListItems:workItems});
});

app.post("/work ", (req,res)=>{
    item = req.body.newItem;
    workItems.push(item);
    res.redirect("/");
});

app.get("/about", (req,res)=>{
    res.render("about")
})

app.listen(5050, ()=>{
    console.log("App is up and running");
});


