const express = require("express");
const router = express.Router();

const config = require("../config");
const models = require("../models");

async function posts(req, res) {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;

  try {
    const posts = await models.Post.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("owner")
      .sort({ createdAt: -1 });

    const count = await models.Post.countDocuments();

    res.render("archive/index", {
      posts,
      current: page,
      pages: Math.ceil(count / perPage),
      user: {
        id: userId,
        login: userLogin
      }
    });
  } catch (error) {
    throw new Error("Server Error");
  }

  //   models.Post.find({})
  //     .skip(perPage * page - perPage)
  //     .limit(perPage)
  //     .populate("owner")
  //     .sort({ createdAt: -1 })
  //     .then(posts => {
  //       models.Post.countDocuments()
  //         .then(countDocuments => {
  //           res.render("archive/index", {
  //             posts,
  //             current: page,
  //             pages: Math.ceil(countDocuments / perPage),
  //             user: {
  //               id: userId,
  //               login: userLogin
  //             }
  //           });
  //         })
  //         .catch(() => {
  //           throw new Error("Server Error");
  //         });
  //     })
  //     .catch(() => {
  //       throw new Error("Server Error");
  //     });
}

// routers
router.get("/", (req, res) => posts(req, res));
router.get("/archive/:page", (req, res) => posts(req, res));
router.get("/posts/:post", (req, res, next) => {
  const url = req.params.post.trim().replace(/ +(?= )/g, "");
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!url) {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
  } else {
    models.Post.findOne({
      url
    }).then(post => {
      if (!post) {
        const err = new Error("Not found");
        err.status = 404;
        next(err);
      } else {
        res.render("post/post", {
          post,
          user: {
            id: userId,
            login: userLogin
          }
        });
      }
    });
  }
});

// users posts
router.get("/users/:login/:page*?", (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;
  const login = req.params.login;

  models.User.findOne({
    login
  }).then(user => {
    models.Post.find({
      owner: user.id
    })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .then(posts => {
        models.Post.countDocuments({
          owner: user.id
        })
          .then(countDocuments => {
            res.render("archive/user", {
              posts,
              _user: user,
              current: page,
              pages: Math.ceil(countDocuments / perPage),
              user: {
                id: userId,
                login: userLogin
              }
            });
          })
          .catch(() => {
            throw new Error("Server Error");
          });
      })
      .catch(() => {
        throw new Error("Server Error");
      });
  });
});

module.exports = router;
