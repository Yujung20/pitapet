const { response } = require('express');
const express = require('express');
const app = express();
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

const bcrypt = require('bcrypt');

var db = require('./db');

function template(id_check_txt, check_id) { 
    return `
        <!doctype html>
        <html>
            <head>
                <title>test</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1>sign up</h1>
                <form action="/signup/signup_process" method="post">
                    <p><input type="text" name="id" placeholder="id" value="${check_id}" formaction="/signup/id_check"> <input type="submit" value="아이디 확인" formaction="/signup/id_check">
                    <p id="id_check_txt">${id_check_txt}</p>
                    </p>
                    <p><input type="password" name="pwd" placeholder="password"></p>
                    <p><input type="password" name="pwd2" placeholder="password check"></p>
                    <p><input type="text" name="email" placeholder="email"></p>
                    <p><input type="text" name="nickname" placeholder="nickname"></p>
                    <p><input type="file" name="license"></p>
                    <p><input type="file" name="certificate"></p>
                    <p><input type="submit" value="가입하기"></p>
                </form>
            </body>
        </html>
    `;
}

app.get('/', function(request, response) {
    response.end(template("아이디 중복을 확인하세요.", ''));
});

app.post('/id_check', function(request, response) {
    const post = request.body;
    const id = post.id;
    console.log(id);

    var id_check_txt = "사용할 수 있는 아이디입니다."
    db.query(`SELECT * FROM user`, function(error, users) {
        if(error) {
            throw error;
        }

        for (var i = 0; i < Object.keys(users).length; i++) {
            if (id === users[i].id) {
                id_check_txt = "사용할 수 없는 아이디입니다."
                break;
            }
        }
        response.send(template(id_check_txt, id));
    })
});

app.post('/signup_process', function(request, response) {
    const post = request.body;
    const id = post.id;
    const pwd = post.pwd;
    const pwd2 = post.pwd2;
    const email = post.email;
    const nickname = post.nickname;
    const license = post.license;
    const certificate = post.certificate;

    if (pwd !== pwd2) {
        response.send(`<script>alert('password not match')</script>`);
    } else {
        bcrypt.hash(pwd, 10, function(error, hash) {
            db.query(`INSERT INTO user (id, password, email, nickname, license, certificate) VALUES(?, ?, ?, ?, ?, ?)`,
            [id, hash, email, nickname, license, certificate], 
            function(error, result) {
                if (error) {
                    response.send(error);
                    throw error;
                }
                console.log(result);
                response.redirect('/');
                response.end();
            });
        });
        
    }
});

db.query(`SELECT * FROM user`, function(error, users) {
    console.log(users);
})

module.exports = app;