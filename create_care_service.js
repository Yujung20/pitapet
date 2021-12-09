const { response } = require('express');
const express = require('express');
const app = express.Router();

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');

function template(animal_name, name_check_txt) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>create care service</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>create care service</h1>
            <form action="/create_care_service/create_mail" method="post">
                <p><input type="text" name="pet_name" placeholder="이름"></textarea></p>
                <p><select name="category"> 
                    <option value="건강 검진일">건강 검진일</option>
                    <option value="접종일">접종일</option>
                    <option value="생일">생일</option>
                    <option value="기념일">기념일</option>
                </select></p>
                <p><input type="date" name="mail_date" min="1990-01-01" max="2022-12-31" value="2021-12-01"></p>
                <p><textarea name="note"></textarea></p>
                <p><input type="submit" value="등록하기"></p>
            </form>
        </body>
    </html>
    `;
}

app.get('/', function(req, res) {
    res.end(template("", ""));
});


app.post('/create_mail', function(req, res) {
    const body = req.body;
    const owner = req.session.user_id;
    const pet_name = body.pet_name;
    const category = body.category;
    const date = body.mail_date;
    const note = body.note;
    var mail_num;
    
    db.query(`INSERT INTO care_service (owner_id, name, mail_category, account) VALUES(?, ?, ?, ?)`,
    [owner, pet_name, category, note],
    function(error, result) {
        if (error) {
            res.send(error);
            throw error;
        }
        console.log(result);
    });

    db.query('SELECT mail_number FROM care_service order by mail_number desc limit 1', (error, result) => {
        if (error) throw error;
        else mail_num = result[0].mail_number;
        console.log(mail_num);

        db.query('INSERT INTO care_service_date (mail_number, mail_date) VALUES(?, ?)',
        [mail_num, date],
        function(error, result) {
            if (error) {
                res.send(error);
                throw error;
            }
            console.log(result);
            res.redirect('/welcome/');
            res.end();
        });
    });
});

db.query(`SELECT * FROM care_service`, function(error, care_services) {
    console.log(care_services);
})

module.exports = app;