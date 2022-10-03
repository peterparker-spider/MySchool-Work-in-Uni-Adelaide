var nodemailer = require('nodemailer');

async function inviteEventPlanEmail(event, users) {
  var transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    secure: false,
    port: 587,
    auth:{
      user: 'liufengyuan45@outlook.com',
      pass: 'yrdksefbsbetdqaq'
    }
  })
  var usersTo = ''
  users.forEach((user, index) => {
    if (index === 0) {
      usersTo += `${user.email}`
    } else {
      usersTo += `,${user.email}`
    }
  });
  var message ={
    from: 'liufengyuan45@outlook.com',
    to: usersTo,
    subject: 'SocialPanningApp: Your received a new event plan invite!',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>invite you to join out event plan</title>T
    </head>
    <body>
      <p>We have a new event <b>${event.name}</b></p>
      <p>${event.description}</p>
      <p>Start Time is: <b>${event.start_time}</b></p>
    </body>
    </html>
    `
  }

  transporter.sendMail(message, function(err, result) {
    if (err) {
      return console.log(err)
    }
    console.log(result.response)
  })


}

module.exports = {
  inviteEventPlanEmail
}