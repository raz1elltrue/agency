var express = require("express");
const bodyParser = require("body-parser");

const post = require("./models/post");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  post.find({}).then(posts => {
    res.render("index", { posts: posts });
  });
});

app.get("/create", function(req, res) {
  res.render("create");
});

app.post("/create", function(req, res) {
  const { title, body } = req.body;

  post
    .create({
      title: title,
      body: body
    })
    .then(post => console.log(post.id));

  res.redirect("/");
});

module.exports = app;
