var express = require('express');
var router = express.Router();
var db = require('../database');

var selectAthlete = 'select a.id, a.name, a.dob, a.height, a.weight, s.hw_score, s.medal_score, s.total ' +
  'from Athlete a left join score_table s on a.id=s.athlete_id';
var whereValid = 's.total is not null';

/* GET athletes listing. */
router.get('/', function (req, res, next) {
  db.query(selectAthlete + ' where ' + whereValid, [], function (err, rows) {
    if (err) {
      next(err);
    } else {
      res.json(rows);
    }
  });
});

/* GET athlete by id */
router.get('/:id', getAthleteInfo, getAthleteEvents, getAthleteSports, function (req, res) {
  res.json({
    athlete: req.info,
    events: req.events,
    sports: req.sports
  });
});


function getAthleteInfo(req, res, next) {
  var id = req.params.id;
  var query = selectAthlete + ' where id = ? and ' + whereValid;
  db.query(query, [id], function (err, rows) {
    if (err) {
      next(err);
    } else if (rows.length == 0) {
      res.status(404).send("Athlete not found");
    } else {
      req.info = rows[0];
      next();
    }
  });
}

function getAthleteSports(req, res, next) {
  var id = req.params.id;
  db.query('select sport_name name from Plays where athlete_id = ?', [id], function (err, rows) {
    if (err) {
      next(err);
    } else if (rows.length == 0) {
      res.status(404).send("Athlete not found");
    } else {
      var arr = [];
      for (var i = 0; i < rows.length; i++) {
        arr.push(rows[i].name);
      }
      req.sports = arr;
      next();
    }
  });
}

function getAthleteEvents(req, res, next) {
  var id = req.params.id;
  var query = 'select event_name, c.name, c.year, location, medal_type, results ' +
    'from Competes_In ci ' +
    'inner join Competition c on ci.comp_id=c.id ' +
    'where athlete_id = ?';
  db.query(query, [id], function (err, rows) {
    if (err) {
      next(err);
    } else if (rows.length == 0) {
      res.status(404).send("Athlete not found");
    } else {
      req.events = rows;
      next();
    }
  });
}

module.exports = router;
