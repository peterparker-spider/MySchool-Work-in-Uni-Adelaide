const e = require('express');
var express = require('express');
var router = express.Router();
let mysql = require('mysql');
var conn = require('../util/conn')
var crypt = require('../util/crypt')
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


/* GET users listing. */
router.get('/', function(req, res, next) {
  let data = {}
  let sql = 'select id, username, firstname, lastname, email, image from users;'
  conn.query(sql, function(err, results) {
    if (err) {
      console.log('database query fail!');
    } else {
      if (results.length > 0) {
        data = {
          code: 0,
          list: results
        } 
      } else {
        data = {
          code: 1,
          message: 'no results!'
        }
      }
    } 
    res.json(data)
  })
});


router.post('/login', function(req, res, next) {
  let {username, password} = req.body 

  const cryptPassword = crypt.cryptPwd(password)
  let sql = 'select id, username, firstname, lastname, email, image, is_manager from users where username = ' + mysql.escape(username) + ' and password = ' + mysql.escape(cryptPassword);
  conn.query(sql, function(err, results) {
    if (err) {
      console.log('database query fail!');
    } else {
      if (results.length > 0) {
        const selectSessionSql = `update user_sessions set expired_at = '${timeNow}' where user_id = '${results[0].id}'` 
        conn.query(selectSessionSql, function(err, _) {
          if (err) {
            res.json({
              code: 1,
              message: 'Reset Sessions fail!'
            })
          } else {
            const sign = crypt.cryptUsername(username)
            const expired_at = new Date(+new Date() + 24*60*60*1000)            
            const insertSessionSql = `insert into user_sessions (user_id, sign, expired_at, created, updated) VALUES ('${results[0].id}', '${sign}', '${expired_at.toISOString().replace(/T/, ' ').replace(/\..+/, '') }', '${timeNow}', '${timeNow}')`
            conn.query(insertSessionSql, function(err, _) {
              if (err) {
                console.log('database insert fail!')
                res.json({
                  code: 1,
                  message: 'Insert Sessions fail!'
                })
              } else {
                res.cookie('event-plan-token', sign, {expires:expired_at})
                res.json({
                  code: 0,
                  user: results[0]
                })
              }
            })
          }
        })
      } else {
        res.json({
          code: 1,
          message: 'Required Truth Username And Password!'
        })
      }
    }
  })
});

router.post('/register', function(req, res, next) {
  let {email, username, firstname, lastname, age, password, image} = req.body
  if (!email || !username || !password) {
    res.json({code: 1, message: 'Email, Username, Password not be blank!'})
    res.end()
  }

  const selectSql = `select * from users where username = ? or email = ?`;
  conn.query(selectSql, [username, email], function(error, results){
    if (error) {
      console.log('database query fail!')
      res.json({code: 1, message: 'query users fail!'})
    } else {
      if (results.length > 0) {
        res.json({code: 1, message: 'username or email is already used!'})
      } else {
        const insertSql = `insert into users(email, username, firstname, lastname, age, password, image, created, updated) values(?,?,?,?,?,?,?,?,?)`;
        conn.query(insertSql, [email, username, firstname,lastname, age, crypt.cryptPwd(password), image, timeNow, timeNow], function(err, result){
          if (err) {
            console.log('database insert fail!')
            res.json({code:1, message: 'insert User fail!'})
          }
          if (result.affectedRows === 1) {
            res.json({code:0, message: 'insert User success!'})
          } else {
            res.json({code:1, message: 'insert User fail!'})
          }
        }) 
      }
    }
  }) 
})

router.delete('/logout', requireLogin, function(req, res, next) {
  const updateSql = `update user_sessions set expired_at = ? where user_id = ?` 
  conn.query(updateSql, [timeNow, global['user_id']], function(err, result) {
    if(err) {
      res.json({code: 1, message: 'database update fail!'})
    }
    if (result.affectedRows > 0) {
      res.cookie("event-plan-token", "", {expires: new Date()})
      res.json({code: 0, message: 'user logout success!'})
    } else {
      res.json({code: 1, message: 'user logout fail!'})
    }
  })
})


router.get('/user_manage', requireLogin, function(req, res, next) {
  let sql = 'select * from users;'
  conn.query(sql, function(err, results) {
    if (err) {
      console.log('database query fail!');
      res.json({code: 1, message: 'database query fail!'})
    } else {
      if (results.length > 0) {
        res.json({
          code: 0,
          list: results
        })
      } else {
        res.json({
          code: 1,
          message: 'no results!'
        })
      }
    } 
  })
});


router.patch('/:id/manage_update', requireLogin, function(req, res, next) {
  const selectSql = 'select * from users where id = ? limit 1'
  conn.query(selectSql, [req.params.id], function(err, result) {
    if (err) {
      res.json({code: 1, message: 'database query fail!'})
    } else {
      if (result && result.length === 1) {
        const record = result[0]
        let {email, username, firstname, lastname, age, password, image} = req.body
        if (!email) {
          email = record.email
        }
        if (!username) {
          username = record.username
        }
        if (!firstname) {
          firstname = record.firstname
        }
        if (!lastname) {
          lastname = record.lastname
        }
        if(!age) {
          age = record.age 
        } 
        if(!password) {
          password = record.password
        } else {
          password = crypt.cryptPwd(password)
        }
        if(!image) {
          image = record.image
        }
        const updateSql = 'update users set email = ?, username = ?, firstname = ?, lastname = ?, age= ?, password= ?, image=? where id = ?';
        conn.query(updateSql, [email, username, firstname, lastname, age, password, image, req.params.id], function(err, result) {
          if (err) {
            res.json({
              code: 1,
              message: 'update user fail!'
            })
          }
          if (result.affectedRows === 1) {
            res.json({code: 0, message: 'update user success!'})
          } else {
            res.json({code: 1, message: 'update user fail!'})
          }
        })
      } else {
        res.json({code: 1, message: 'User is not present!'})
      }
    }
  })
})

router.delete('/:id/manage_destroy', requireLogin, function(req, res, next) {
  const selectSql = 'select * from users where id = ? limit 1'
  conn.query(selectSql, [req.params.id], function(err, results) {
    if (err) {
      console.log(err)
      res.json({code: 1, message: 'database query error!'})
    } else {
      if (results && results.length === 1) {
        const deleteSql = 'delete users, user_event_plans from users left join user_event_plans on user_event_plans.user_id = users.id where users.id = ?'
        conn.query(deleteSql,[req.params.id], function(err, result) {
          if (err) {
            console.log(err)
            res.json({code: 1, message: 'User deleted fail!'})
          } else {
            if (result && result.affectedRows > 0) {
              res.json({code: 0, message: 'User deleted success!'})
            } else {
              res.json({code: 1, message: 'User deleted fail!'})
            }
          }
        })
      } else {
        res.json({code: 1, message: 'User is not present!'})
      }
    }
  })
})

router.post('/user_information', requireLogin, function(req, res, next) {
  let {email, username, firstname, lastname, age, password, image} = req.body
  const selectSql = 'select * from users where id = ? limit 1'
  conn.query(selectSql, [global['user_id']], function(err, results) {
    if (results.length === 1) {
      const record = results[0]
      if (!email) {
        email = record.email
      }
      if (!username) {
        username = record.username
      }
      if (!firstname) {
        firstname = record.firstname
      }
      if (!lastname) {
        lastname = record.lastname
      }
      if(!age) {
        age = record.age 
      } 
      if(!password) {
        password = record.password
      } else {
        password = crypt.cryptPwd(password)
      }
      if(!image) {
        image = record.image
      }
      const updateSql = 'update users set email = ?, username = ?, firstname = ?, lastname = ?, age= ?, password= ?, image=? where id = ?';
      conn.query(updateSql, [email, username, firstname, lastname, age, password, image, global['user_id']], function(err, result) {
        if (err) {
          res.json({
            code: 1,
            message: 'update user information fail!'
          })
        }
        if (result.affectedRows === 1) {
          res.json({code: 0, message: 'update user information success!'})
        } else {
          res.json({code: 1, message: 'update user information fail!'})
        }
      })
    } else {
      res.json({code:1, message: 'User is not present!'})
    }
  })
});


module.exports = router;
