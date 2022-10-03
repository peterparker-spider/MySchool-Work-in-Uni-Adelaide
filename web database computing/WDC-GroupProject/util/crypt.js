var crypto = require('crypto');

function cryptPwd(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}

function cryptUsername(username) {
  var md5 = crypto.createHash('md5');
  var time = new Date().getTime();
  return md5.update(username+time).digest('hex');
}

module.exports = {
  cryptPwd,
  cryptUsername
}