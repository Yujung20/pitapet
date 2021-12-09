const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-pool');
//const cron = require('node-cron');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'hyeon',
    password: 'password!',
    database: `pitapet`,
    multipleStatements: true
});

connection.connect();

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: '20171641@sungshin.ac.kr',
    pass: 'pitapet!'
  }
}));

function send_mail(address, name, category) {
  const mailOptions = {
    from: '20171641@sungshin.ac.kr',
    to: address,
    subject: 'PitaPet에서 '+name+'의 '+category+'을 알려드립니다!',
    text: name+'의 '+category+'입니다!'
  };
   
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// today owner_id, mail_category
var query1 = 'SELECT * FROM care_service WHERE care_service.mail_number IN (SELECT mail_number FROM care_service_date WHERE DATE_FORMAT(mail_date, "%Y-%m-%d") = CURDATE())';
// owner_id's email
var query2 = 'SELECT email FROM user WHERE id IN (SELECT owner_id FROM care_service WHERE care_service.mail_number IN (SELECT mail_number FROM care_service_date WHERE DATE_FORMAT(mail_date, "%Y-%m-%d") = CURDATE()))';

//cron.schedule('10 * * * * *', function() {
  var a = [];
  var b = [];

  connection.query(query1, (error, rows1) => {
    if (error) throw error;
    else {
      for(var i = 0; i < rows1.length; i++){
        a[i] = rows1[i].name;
        b[i] = rows1[i].mail_category;
      }
    }
  });

  connection.query(query2, (error, rows2) => {
    if (error) throw error;
    else {
      for(var i = 0; i < rows2.length; i++){
        send_mail(rows2[i].email, a[i], b[i]);
      }
    }
  });
//});

connection.end();