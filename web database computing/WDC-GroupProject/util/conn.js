const mysql = require("mysql")


const conn = mysql.createConnection({
  host: '103.46.128.46',
  user: 'root',
  password: '123456789',
  database: 'event-plan',
  port: '46801'
})


module.exports = conn