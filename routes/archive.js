const express = require("express");
const router = express.Router();

const config = require("../config");
const models = require("../models");

function posts(req, res) {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;

  models.Post.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .then(posts => {
      models.Post.countDocuments()
        .then(countDocuments => {
          res.render("index", {
            posts,
            current: page,
            pages: Math.ceil(countDocuments / perPage),
            user: {
              id: userId,
              login: userLogin
            }
          });
        })
        .catch(console.log);
    })
    .catch(console.log);
}

// routers
router.get("/", (req, res) => posts(req, res));
router.get("/archive/:page", (req, res) => posts(req, res));

module.exports = router;
