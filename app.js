const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view-engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articlesSchema);

// TODO

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({})
      .then(function (foundArticles) {
        res.send(foundArticles);
      })
      .catch(function (err) {
        console.log(err);
      });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle
      .save()
      .then(function () {
        res.send("Successfully added a new article.");
      })
      .catch(function (err) {
        console.log(err);
      });
  })
  .delete(function (req, res) {
    Article.deleteMany({})
      .then(function () {
        res.send("Successfully deleted all articles.");
      })
      .catch(function (err) {
        console.log(err);
      });
  });

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    const articleTitle = req.params.articleTitle;
    Article.findOne({ title: articleTitle })
      .then(function (foundArticle) {
        res.send(foundArticle);
      })
      .catch(function (err) {
        res.send("No match!");
      });
  })
  .put(function (req, res) {
    const articleTitle = req.params.articleTitle;
    Article.replaceOne(
      { title: articleTitle },
      { title: req.body.title, content: req.body.content }
    )
      .then(function () {
        res.send("Successfully updated!");
      })
      .catch(function (err) {
        console.log(err);
        res.send("Unsuccesful!");
      });
  })
  .patch(function (req, res) {
    Article.updateOne(
      {
        title: req.params.articleTitle,
      },
      {
        $set: req.body,
      }
    )
      .then(function () {
        res.send("Successfully updated!");
      })
      .catch(function (err) {
        console.log(err);
        res.send("Unsuccesful!");
      });
  })
  .delete(function (req, res) {
    Article.deleteMany({ title: req.params.articleTitle })
      .then(function () {
        res.send("Successfully deleted article!");
      })
      .catch(function (err) {
        console.log(err);
        res.send("Unsuccesful deletion!");
      });
  });

// app.get("/articles", function (req, res) {
//   Article.find({})
//     .then(function (foundArticles) {
//       res.send(foundArticles);
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
// });

// app.post("/articles", function (req, res) {
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });

//   newArticle
//     .save()
//     .then(function () {
//       res.send("Successfully added a new article.");
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
// });

// app.delete("/articles", function (req, res) {
//   Article.deleteMany({})
//     .then(function () {
//       res.send("Successfully deleted all articles.");
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
// });

app.listen("3000", function () {
  console.log("Server started at port 3000.");
});
