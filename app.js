const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


mongoose.connect("mongodb://127.0.0.1:27017/To-Do-List_db", {useNewUrlParser:true});

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);


const game = new Item({
    name: "Game"
});

const code = new Item({
    name: "Code"
});

const walk = new Item({
    name: "Walk"
});

app.get("/", (req, res) =>{
    //const day = date.getDay();
    Item.find({}).exec()
    .then((foundItem) => {
        if (foundItem.length === 0){
            Item.insertMany([game, walk, code]).catch((err)=>{
                console.log(err);
            });
            res.redirect("/");
        } else {
            res.render('list', {listTitle: "Today", newListItems: foundItem });
        }
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post("/",(req,res)=>{
    itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });
    //item.save();
    res.redirect("/");
});

app.post("/delete", (req,res)=>{
    const checkedItem = req.body.checkbox;
    Item.findByIdAndRemove(checkedItem).exec()
    .then(()=>{
        console.log("Successfully deleted!");
        res.redirect("/")
    })
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
    res.render("about");
})

app.listen(5050, ()=>{
    console.log("App is up and running");
});


