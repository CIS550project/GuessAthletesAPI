var express = require('express');
var router = express.Router();
var User = require('../models/user');
var fb = require('../facebook');

// USER API ENDPOINTS

/**
 * GET user stats list
 */
router.get('/', function (req, res, next) {
  User.aggregate([
    {
      $project: {
        _id: true,
        name: true,
        results: true,
        numResults: { $size: '$results' }
      }
    },
    {
      $unwind: '$results'
    },
    {
      $match: {
        'results.correct': true
      }
    },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        numResults: { $first: '$numResults' },
        correct: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: false,
        name: '$name',
        points: {
          $multiply: [
            { $divide: ['$correct', '$numResults'] },
            '$correct',
            100
          ]
        }
      }
    }
  ], function (err, users) {
    if (err) {
      next(err);
    } else {
      res.json(users);
    }
  });
});

/**
 * GET authenticated user details
 */
router.get('/me', function(req, res, next) {
  req.projection = 'name facebookId results.winner results.loser results.correct -_id';
  next();
}, authenticate, calculateStats, function (req, res) {
  res.json({ user: req.user, stats: req.stats });
});

/**
 * POST new game result as { winner: [id], loser: [id], correct: [boolean] }
 */
router.post('/me/result', authenticate, function (req, res, next) {
  var user = req.user;
  user.results.push(req.body);
  user.save(function (err, doc) {
    if (err) {
      next(err);
    } else {
      req.user = doc;
      next();
    }
  });
}, calculateStats, function (req, res) {
  res.json(req.stats);
});

/**
 * GET user friend stats
 */
router.get('/me/friends', function (req, res, next) {
  req.scope = ['friends'];
  next();
}, authenticate, function (req, res, next) {
  if (req.fb.friends.data.length == 0) {
    res.json([]);
  } else {
    var ids = req.fb.friends.data.map(friend => friend.id);
    User.aggregate([
      {
        $match: {
          facebookId: { $in: ids }
        }
      },
      {
        $project: {
          _id: true,
          name: true,
          results: true,
          facebookId: true,
          numResults: { $size: '$results' }
        }
      },
      {
        $unwind: '$results'
      },
      {
        $match: {
          'results.correct': true
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          facebookId: { $first: '$facebookId' },
          numResults: { $first: '$numResults' },
          correct: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: false,
          name: '$name',
          facebookId: '$facebookId',
          stats: {
            accuracy: { $divide: ['$correct', '$numResults'] },
            wins: '$correct',
            losses: { $subtract: ['$numResults', '$correct'] },
            plays: '$numResults',
            points: { $multiply: [{ $divide: ['$correct', '$numResults'] }, '$correct', 100] }
          }
        }
      }
    ], function (err, users) {
      if (err) {
        next(err);
      } else {
        res.json(users);
      }
    });
  }
});


// HELPER FUNCTIONS

/**
 * Middleware to authenticate the request using a Facebook access token passed in the bearer field and
 * return the associated user. Token is taken from req.token field (set by express-bearer-token middleware).
 *
 * Creates a new user before returning it if there is currently no user linked to the Facebook user ID.
 *
 * Additionally accepts an optional MongoDB projection in the req.projection field.
 *
 * The Facebook response is stored in req.fb. Additional fields can be added to the scope through req.scope[].
 */
function authenticate(req, res, next) {
  fields = ['id', 'name'];
  if (Array.isArray(req.scope)) {
    Array.prototype.push.apply(fields, req.scope);
  }

  fb.api('me', { fields: fields, access_token: req.token }, function (fbRes) {
    if (!fbRes) {
      next('Unknown error occured in the Facebook SDK');
    } else if (fbRes.error) {
      next(fbRes.error);
    } else {
      req.fb = fbRes;
      User.findOne({ facebookId: fbRes.id }, req.projection, function(err, user) {
        if (err) {
          next(err);
        } else if (!user) {
          // Create a new user
          var newUser = new User({ name: fbRes.name, facebookId: fbRes.id });
          newUser.save(function (err, createdUser) {
            req.user = createdUser;
            next();
          });
        } else {
          req.user = user;
          next();
        }
      });
    }
  });
}

/**
 * Calculates and stores basic game statistics for the current user (in the req.user field).
 */
function calculateStats(req, res, next) {
  var stats = { points: 0, accuracy: null, wins: 0, losses: 0 };
  var results = req.user.results;

  stats.plays = results.length;
  if (stats.plays == 0) {
    next();
  }

  stats.wins = results.reduce((total, result) => total + (result.correct ? 1 : 0), 0);
  stats.losses = results.reduce((total, result) => total + (result.correct ? 0 : 1), 0);
  stats.accuracy = stats.wins / stats.plays;
  stats.points = stats.wins * 100 * stats.accuracy;

  req.stats = stats;
  next();
}

module.exports = router;
