const express = require("express");
const router = express.Router();
const TurndownService = require("turndown");

const models = require("../models");

// GET for add
router.get("/add", (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;

  res.render("post/add", {
    user: {
      id,
      login
    }
  });
});

// POST is add
router.post("/add", (req, res) => {
  const title = req.body.title.trim().replace(/ +(?= )/g, "");
  const body = req.body.body;
  const turndownService = new TurndownService();

  if (!title || !body) {
    const fields = [];
    if (!title) fields.push("title");
    if (!body) fields.push("body");

    res.json({
      ok: false,
      error: "All fields must be filled",
      fields: fields
    });
  } else if (title.length < 3 || title.length > 64) {
    res.json({
      ok: false,
      error: "Title length must be from 3 to 64 characters",
      fields: ["title"]
    });
  } else if (body.length < 3) {
    res.json({
      ok: false,
      error: "Body must contain at least 3",
      fields: ["body"]
    });
  } else {
    models.Post.create({
      title,
      body: turndownService.turndown(body)
    })
      .then(post => {
        console.log(post);
        res.json({
          ok: true
        });
      })
      .catch(err => {
        console.log(err);
        res.json({
          ok: false
        });
      });
  }
});
module.exports = router;
