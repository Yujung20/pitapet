const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-pool');
//const cron = require('node-cron');

var mysql = require('mysql');
var db = require('./db');

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

// 오늘 날짜의 pet_name, mail_category, mail_number을 추출하기 위해 사용한다.
//var query1 = 'SELECT * FROM care_service WHERE care_service.mail_number IN (SELECT mail_number FROM care_service_date WHERE DATE_FORMAT(mail_date, "%Y-%m-%d") = CURDATE())';

//cron.schedule('10 * * * * *', function() {
  var mail_number_array = [];
  var owner_id_array = [];
  var name_array = [];
  var mail_category_array = [];

  db.query('SELECT * FROM care_service WHERE care_service.mail_number IN (SELECT mail_number FROM care_service_date WHERE DATE_FORMAT(mail_date, "%Y-%m-%d") = CURDATE())', (error, rows1) => {
    if (error) throw error;
    else {
      console.log("오늘 날짜인 케어 서비스\n");
      for(let i = 0; i < rows1.length; i++){
        mail_number_array[i] = rows1[i].mail_number;
        owner_id_array[i] = rows1[i].owner_id;
        name_array[i] = rows1[i].name;
        mail_category_array[i] = rows1[i].mail_category;
        console.log(mail_number_array[i], owner_id_array[i], name_array[i], mail_category_array[i]);
      }
    }

    db.query('SELECT * FROM user', (error, rows2) => {
      if (error) throw error;
      else {
        for (var i=0; i<owner_id_array.length; i++) {
          for (var j=0; j<rows2.length; j++) {
            if (rows2[j].id == owner_id_array[i]) {
              send_mail(rows2[j].email, name_array[i], mail_category_array[i]);
            }
          }
        }
      }
    });

    db.end();
  });
//});
//db.end();