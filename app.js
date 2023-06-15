const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");
const _ = require("lodash")

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


mongoose.connect("mongodb://127.0.0.1:27017/To-Do-List_db", {useNewUrlParser:true});

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);


const item1 = new Item({
    name: "Welcome to todolist"
});

const item2 = new Item({
    name: "Hit the + button to add new item"
});

const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) =>{
    //const day = date.getDay();
    Item.find({}).exec()
    .then((foundItem) => {
        if (foundItem.length === 0){
            Item.insertMany([item1, item2, item3]).catch((err)=>{
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
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }

    else{
        List.findOne({name:listName}).exec()
        .then((foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        })
    }

});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
  
    if (listName === "Today") {
      Item.findByIdAndRemove(checkedItem).exec()
        .then(() => {
          console.log("Successfully deleted!");
          res.redirect("/");
        });
    } else {
      List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemId } } }
      ).exec()
        .then(() => {
          res.redirect("/" + listName);
        });
    }
  });
  
app.get("/:customListName", (req,res)=>{
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName}).exec()
    .then((foundList)=>{
        if(!foundList){
            const list = new List({
                name: customListName,
                items: [item1, item2, item3]
            })
        
            list.save();
            res.redirect("/"+customListName);
        } else {
            res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
        }

    })
    .catch((err)=>{
        console.log(err);
    })

    
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


