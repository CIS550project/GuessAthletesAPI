var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET user list */
router.get('/', function (req, res, next) {
  User.find({}, 'name', function (err, docs) {
    if (err) {
      next(err);
    } else {
      res.json(docs);
    }
  });
});

/* GET user info */
router.get('/:id', function (req, res, next) {
  User.findOne(req.param.id, function (err, docs) {
    if (err) {
      next(err);
    } else if (docs.length == 0) {
      res.status(404).send('User not found');
    } else {
      res.json(docs);
    }
  });
});

/* POST new user */
router.post('/', function (req, res, next) {
  var newUser = new User(req.body);
  newUser.save(function (err, doc) {
    if (err) {
      next(err);
    } else {
      res.json(doc);
    }
  });
});

/* POST new game result */
router.post('/:id/result', function (req, res, next) {
  var user = User.findOne(req.param.id, function (err, doc) {
    if (err) {
      next(err);
    } else {
      req.user = doc;
      next();
    }
  });
}, function (req, res, next) {
  var user = req.user;
  user.results.push(req.body);
  user.save(function (err, doc) {
    if (err) {
      next(err);
    } else {
      res.json(doc.results);
    }
  });
});

module.exports = router;
