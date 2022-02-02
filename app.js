const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("article",articleSchema);

// chained routing
app.route("/articles")

.get(function(req,res){
    Article.find({},function(err,foundArticles){
        if(!err){
           // res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(foundArticles, undefined, 4));
        }
        else
        res.send(err);
    });
})

.post(function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err)
        res.send("Successfully added new Article");
        else
        res.send(err);
    });

})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err)
        res.send("Successfully deleted all Articles");
        else
        res.send(err);
    })
});

///////////////*********  Requests for targeting a specific article  *************/////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){ 
Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
    if(foundArticle)
        res.send(foundArticle);
    else
        res.send("No articles matching that title was found.");
});
})

.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err){
            if(!err)
            {
                res.send("Successfully updated article");
            }
            else
            {
                res.send(err);
            }
        }
    );
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        {strict: true},
        function(err){
            if(!err)
            {
                res.send("Successfully patched & updated article");
            }
            else
            {
                res.send(err);
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(err)
            res.send(err);
            else
            res.send("Successfully deleted selected article");
        }
    );
});

// .post(function(req,res){

// });

app.listen(3000,function(){
    console.log("Server started at port 3000.");
});
