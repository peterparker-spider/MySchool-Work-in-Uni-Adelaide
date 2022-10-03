var express = require('express');
const conn = require('../util/conn');
var router = express.Router();
let mysql = require('mysql');
const mailer = require('../util/mailer')

const timeNow = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') 
var requireLogin = function(req, res, next) {
  const event_plan_token = req.cookies['event-plan-token'] 
  if(!req.cookies && !event_plan_token) {
    res.json({code: 401, message: 'need login!'})
  }
  let selectSql = 'select id, user_id, sign, expired_at from user_sessions where sign ='+ mysql.escape(event_plan_token);
  conn.query(selectSql, function(err, results) {
    if (results && results.length > 0 ) {
      const expiredTime = new Date(results[0].expired_at).getTime()
      if (expiredTime < new Date().getTime()) {
        res.json({code: 401, message: 'sign is expired!'})
      } else {
        global.user_id = results[0].user_id
        next()
      }
    } else {
      res.json({code: 401, message: 'need login!'})
    }
  })
}


router.post('/', requireLogin, function(req, res, next) {
  const {name, description, tag_time, start_time, end_time, image} = req.body 
  if (!name || !tag_time) {
    res.json({code: 1, message: 'Name, Tag_time not be blank!'})
    res.end()
  } 
  const insertSql = 'insert into event_plans(name, description, tag_time, start_time, end_time, image, created, updated) values(?,?,?,?,?,?,?,?)';
  conn.query(insertSql, [name, description, tag_time, start_time, end_time, image, timeNow, timeNow], function(err, result) {
    if (err) {
      console.log('database insert fail!')
      res.json({code:1, message: 'insert event plan fail!'})
    } 
    if (result.affectedRows === 1) {
      res.json({code:0, message: 'insert event plan success!'})
    } else {
      res.json({code:1, message: 'insert event plan fail!'})
    }
  })

});

router.patch('/:id/manage_update', requireLogin, function(req, res, next) {
  const selectSql = 'select * from event_plans where id = ? limit 1' 
  conn.query(selectSql, [req.params.id], function(err, result) {
    if (err) {
      res.json({code: 1, message: 'database query fail!'})
    } else {
      if(result && result.length === 1) {
        const record = result[0]
        let {name, description, tag_time, start_time, end_time, image} = req.body
        if (!name) {
          name = record.name
        } 
        if (!description) {
          description = record.description
        }
        if (!tag_time) {
          tag_time = record.tag_time
        }
        if (!start_time) {
          start_time = record.start_time
        }
        if (!end_time) {
          end_time = record.end_time
        }
        if (!image) {
          image = record.image
        }
        const updateSql = 'update event_plans set name = ?, description = ?, tag_time = ?, start_time = ?, end_time = ?, image = ?, updated = ? where id = ?';
        conn.query(updateSql, [name, description, tag_time, start_time, end_time, image, timeNow, req.params.id], function(err, result) {
          if (err) {
            res.json({
              code: 1,
              message: 'update event plan fail!'
            })
          } else {
            if (result && result.affectedRows === 1) {
              res.json({code: 0, message: 'update event plan success!'})
            } else {
              res.json({code: 1, messgae: 'update event plan fail!'})
            }
          }
        })
      } else {
        res.json({code: 1, message: 'event plan is not present!'})
      }
    }
  })
})

router.delete('/:id/manage_destroy', requireLogin, function(req, res, next) {
  const selectSql = 'select * from event_plans where id = ? limit 1';
  conn.query(selectSql, [req.params.id], function(err,  results) {
    if (err) {
      console.log(err)
      res.json({code: 1, message: 'database query fail!'})
    } else {
      if (results && results.length === 1) {
        const deleteSql = 'delete event_plans.*, user_event_plans.* from event_plans left join user_event_plans on user_event_plans.event_plan_id = event_plans.id where event_plans.id = ?'
        conn.query(deleteSql, [req.params.id], function(err, result) {
          if (err) {
            console.log(err)
            res.json({code: 1, message: 'Event Plan deleted fail!'})
          } else {
            console.log(result)
            if (result && result.affectedRows > 0) {
              res.json({code: 0, message: 'Event Plan deleted success!'})
            } else {
              res.json({code: 1, message: 'Event Plan deleted fail!'})
            }
          }
        })
      } else {
        res.json({code: 1, message: 'Event Plan is not present!'})
      }
    }
  })
})


router.get('/:id', requireLogin, function(req, res, next) {
  const selectSql = 'select * from event_plans where id = ? limit 1'
  conn.query(selectSql, [req.params.id], function(err, results) {
    if (err) {
      console.log('database query fail!')
      res.json({code: 1, message: 'select event plan fail!'})
    } 
    if (results.length === 1) {
      const selectData = results[0]
      const selectUsersSql = 'select distinct u.id, u.email, u.username, u.firstname, u.lastname, u.age, u.image, u.created, u.updated from users u inner join user_event_plans p on p.user_id = u.id where p.event_plan_id = ? limit 10';

      conn.query(selectUsersSql, [req.params.id], function(err, users) {
        if (err) {
          console.log('database query fail!')
          res.json({code:1, message: 'select event plan users fail!'})
        }
        res.json({
          code: 0,
          event: selectData,
          users: users
        })
      })
    } else {
      res.json({code: 1, message: 'event plan is not present!'})
    }
  })
})
 
router.post('/:id/users', requireLogin, function(req, res, next) {
  const selectSql = 'select * from event_plans where id = ? limit 1'
  conn.query(selectSql, [req.params.id], function(err, event) {
    if (err) {
      console.log('database query fail!')
      res.json({code: 1, message: 'select event plan fail!'})
      res.end()
    } 
    if(event && event.length === 1) {
      const {users_id} = req.body 
      if (!users_id && (a instanceof Array)) {
        res.json({code: 1, message: 'users_id not be blank?'})
        res.end()
      } 
      var selectUsersSql = `select * from users where id in (${users_id.join(",")})`
      conn.query(selectUsersSql, function(err, users) {
        if (err) {
          res.json({code: 1, message: 'select users fail!'})
        } else {
          if (users && users.length > 0){
            var insertSql = 'insert into user_event_plans (event_plan_id, user_id, created, updated) values'
            users.forEach((user, index) => {
              if (index === 0) {
                insertSql += ` (${mysql.escape(req.params.id)},${mysql.escape(user.id)},${mysql.escape(timeNow)}, ${mysql.escape(timeNow)})`
              } else {
                insertSql += `,(${mysql.escape(req.params.id)},${mysql.escape(user.id)},${mysql.escape(timeNow)}, ${mysql.escape(timeNow)})`
              }
            });
            conn.query(insertSql, function(err, result) {
              if (err) {
                res.json({code: 1, message: 'insert user event plans fail!'})
                res.end()
              } else {
                if (result && result.affectedRows > 0) {
                  mailer.inviteEventPlanEmail(event[0], users)
                  res.json({code: 0, message: 'insert user event plans success!'})
                } else {
                  res.json({code: 1, message: 'insert user event plans fail!'})
                }
              }
            })
          } else {
            res.json({code: 0, message: 'no users select!'})
          }
        }
      })
      
    }
  })
  
  
})
module.exports = router;
