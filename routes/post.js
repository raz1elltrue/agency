const express = require("express");
const router = express.Router();
const TurndownService = require("turndown");

const models = require("../models");

// GET for del
router.get("/edit/:id/delete", async (req, res) => {
  const id = req.params.id;
  await models.Post.deleteOne({ _id: id });
  res.redirect("/");
});

// GET for edit
router.get("/edit/:id", async (req, res, next) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const id = req.params.id.trim().replace(/ +(?= )/g, "");

  if (!userId || !userLogin) {
    res.redirect("/");
  } else {
    try {
      const post = await models.Post.findById(id);

      if (!post) {
        const err = new Error("Not Found");
        err.status = 404;
        next(err);
      }

      res.render("post/edit", {
        post,
        user: {
          id: userId,
          login: userLogin
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
});

// GET for add
router.get("/add", (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userId || !userLogin) {
    res.redirect("/");
  } else {
    res.render("post/edit", {
      user: {
        id: userId,
        login: userLogin
      }
    });
  }
});

// POST is add
router.post("/add", async (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userId || !userLogin) {
    res.redirect("/");
  } else {
    const title = req.body.title.trim().replace(/ +(?= )/g, "");
    const body = req.body.body.trim();
    const isDraft = !!req.body.isDraft;
    const postId = req.body.postId;
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
      try {
        if (postId) {
          const post = await models.Post.findOneAndUpdate(
            {
              _id: postId,
              owner: userId
            },
            {
              title,
              body: turndownService.turndown(body),
              owner: userId,
              status: isDraft ? "draft" : "published"
            },
            { new: true }
          );

          // console.log(post);

          if (!post) {
            res.json({
              ok: false,
              error: "Not Owner of this post"
            });
          } else {
            res.json({
              ok: true,
              post
            });
          }
        } else {
          const post = await models.Post.create({
            title,
            body: turndownService.turndown(body),
            owner: userId
          });
          res.json({
            ok: true,
            post
          });
        }
      } catch (error) {
        res.json({
          ok: false
        });
      }
    }
  }
});

module.exports = router;
