var express = require('express');
var router = express.Router();
var db = require('../database');

/* GET new matchup */
router.get('/matchup', function (req, res, next) {
  db.query('select athlete_id from score_table order by rand()', function (err, rows) {
    if (err) {
      next(err);
    } else {
      res.json([rows[0].athlete_id, rows[1].athlete_id]);
    }
  });
});

module.exports = router;
