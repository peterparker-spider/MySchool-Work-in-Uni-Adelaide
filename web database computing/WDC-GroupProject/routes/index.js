var express = require('express');
var router = express.Router();
let mysql = require('mysql');

var conn = require('../util/conn')
/* GET home page. */
router.get('/', function(req, res, next) {
  let data = {}
  let sql = ''
  // res.render('auth', { title: 'Express' });
  if (req.query.user_id) {
    if (req.query.plandate) {
      sql = 'select e.* from event_plans e inner join user_event_plans p on p.event_plan_id = e.id where p.user_id = ' + mysql.escape(req.query.user_id) + ' and date(e.tag_time) = ' + mysql.escape(req.query.plandate);
    } else {
      sql = 'select e.* from event_plans e inner join user_event_plans p on p.event_plan_id = e.id where p.user_id = ' + mysql.escape(req.query.user_id)
    }
  } else {
    if (req.query.plandate) {
      sql = 'select * from event_plans where date(tag_time) = ' + mysql.escape(req.query.plandate);
    } else {
      sql = 'select * from event_plans;'
    }
  }

  // conn.connect();
  conn.query(sql, function(err, results) {
    if (err) {
      console.log('database query error!');
    } else {
      if (results.length) {
        data = {
          code: 0,
          list: results
        }
      } else {
        data = {
          code: 1,
          message: 'no result!'
        }
      }
    }
    res.json(data)
  })
  // conn.end()
});




//Auth section
//router.get('/sign_up', function(req, res, next) {
//  res.render('sign_up');
//});


module.exports = router;
