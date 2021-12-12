const { response } = require('express');
const express = require('express');
const app = express.Router();
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

const bcrypt = require('bcrypt');

var db = require('./db');

function template(id_check_txt, check_id, email_check_txt, nickname_check_txt) { 
    return `
        <!doctype html>
        <html>
            <head>
                <title>test</title>
                <meta charset="utf-8">
                <script>
                    window.onload = function() {
                        document.getElementById("id_save").value = getSavedValue("id_save");
                        document.getElementById("password_save").value = getSavedValue("password_save");
                        document.getElementById("password_check_save").value = getSavedValue("password_check_save");
                        document.getElementById("email_save").value = getSavedValue("email_save");
                        document.getElementById("nickname_save").value = getSavedValue("nickname_save");
                    }

                    function saveValue(e) {
                        var id = e.id;
                        var val = e.value;
                        sessionStorage.setItem(id, val);
                    }

                    function getSavedValue(v) {
                        return sessionStorage.getItem(v);
                    }
                </script>
            </head>
            <body>
                <h1>sign up</h1>
                <form action="/signup/signup_process" method="post">
                    <p><input type="text" name="id" placeholder="id" value="${check_id}" id="id_save" oninput='saveValue(this)' formaction="/signup/id_check" formaction="/signup/email_check"> <input type="submit" value="아이디 확인" formaction="/signup/id_check"></p>
                    <p id="id_check_txt">${id_check_txt}</p>
                    <input type="hidden" name="id_check_txt" value="${id_check_txt}" formaction="/signup/email_check" formaction="/signup/nickname_check">
                    </p>
                    <p><input type="password" name="pwd" placeholder="password" id="password_save" oninput='saveValue(this)'></p>
                    <p><input type="password" name="pwd2" placeholder="password check" id="password_check_save" oninput='saveValue(this)'></p>
                    <p><input type="text" name="email" placeholder="email" id="email_save" oninput='saveValue(this)' formaction="/signup/email_check"> <input type="submit" value="이메일 확인" formaction="/signup/email_check"></p>
                    <p id="email_check">${email_check_txt}</p>
                    <input type="hidden" name="email_check_txt" value="${email_check_txt}" formaction="/signup/id_check" formaction="/signup/nickname_check">
                    <p><input type="text" name="nickname" placeholder="nickname" id="nickname_save" oninput='saveValue(this)'> <input type="submit" value="닉네임 확인" formaction="/signup/nickname_check"></p>
                    <p>${nickname_check_txt}</p>
                    <input type="hidden" name="nickname_check_txt" value="${nickname_check_txt}" formaction="/signup/id_check" formaction="/signup/email_check">
                    <p><input type="file" name="license"></p>
                    <p><input type="file" name="certificate"></p>
                    <p><input type="submit" value="가입하기"></p>
                </form>
            </body>
        </html>
    `;
}

app.get('/', function(request, response) {
    response.end(template("아이디 중복을 확인하세요.", '', "이메일 중복을 확인하세요.", "닉네임 중복을 확인하세요."));
});

app.post('/id_check', function(request, response) {
    const post = request.body;
    const id = post.id;
    const email_check_txt = post.email_check_txt;
    const nickname_check_txt = post.nickname_check_txt;
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
        response.send(template(id_check_txt, id, email_check_txt, nickname_check_txt));
    })
});

app.post('/email_check', function(req, res) {
    const body = req.body;
    const id_check_txt = body.id_check_txt;
    const nickname_check_txt = body.nickname_check_txt;
    const email = body.email;
    const id = body.id;

    var email_check_txt = "사용할 수 있는 이메일입니다."
    db.query(`SELECT * FROM user`, function(err, result) {
        if (err) {
            throw err;
        }

        for (var i = 0; i < result.length; i++) {
            if (email === result[i].email) {
                email_check_txt = "사용할 수 없는 이메일입니다."
                break;
            }
        }
        res.send(template(id_check_txt, id, email_check_txt, nickname_check_txt));
    })
})

app.post('/nickname_check', function(req, res) {
    const body = req.body;
    const id_check_txt = body.id_check_txt;
    const email_check_txt = body.email_check_txt;
    const nickname = body.nickname;
    const id = body.id;

    var nickname_check_txt = "사용할 수 있는 닉네임입니다."
    db.query(`SELECT * FROM user`, function(err, result) {
        if (err) {
            throw err;
        }

        for (var i = 0; i < result.length; i++) {
            if (nickname === result[i].nickname) {
                nickname_check_txt = "사용할 수 없는 닉네임입니다."
                break;
            }
        }
        res.send(template(id_check_txt, id, email_check_txt, nickname_check_txt));
    })
})

app.post('/signup_process', function(request, response) {
    const post = request.body;
    const id = post.id;
    const pwd = post.pwd;
    const pwd2 = post.pwd2;
    const email = post.email;
    const nickname = post.nickname;
    const license = post.license;
    const certificate = post.certificate;
    const id_check_txt = post.id_check_txt;
    const email_check_txt = post.email_check_txt;
    const nickname_check_txt = post.nickname_check_txt;

    if (id_check_txt === "사용할 수 없는 아이디입니다.") {
        response.send('<script type="text/javascript">alert("중복된 아이디입니다."); document.location.href="/signup";</script>');
    } else if (id_check_txt === "아이디 중복을 확인하세요.") {
        response.send('<script type="text/javascript">alert("아이디 중복을 먼저 확인해주세요."); document.location.href="/signup";</script>');
    } else if (nickname_check_txt === "사용할 수 없는 닉네임입니다.") {
        response.send('<script type="text/javascript">alert("중복된 닉네임입니다."); document.location.href="/signup";</script>');
    } else if (nickname_check_txt === "닉네임 중복을 확인하세요.") {
        response.send('<script type="text/javascript">alert("닉네임 중복을 먼저 확인해주세요."); document.location.href="/signup";</script>');
    } else if (email_check_txt === "사용할 수 없는 이메일입니다.") {
        response.send('<script type="text/javascript">alert("중복된 이메일입니다."); document.location.href="/signup";</script>');
    }else if (nickname_check_txt === "이메일 중복을 확인하세요.") {
        response.send('<script type="text/javascript">alert("이메일 중복을 먼저 확인해주세요."); document.location.href="/signup";</script>');
    }
    else if (id === '' || pwd === '' || pwd2 === '' || email === '' || nickname === '') {
        response.send('<script type="text/javascript">alert("모든 정보를 입력해주세요."); document.location.href="/signup";</script>');
    }
    else if (pwd !== pwd2) {
        response.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다."); document.location.href="/signup";</script>');
    } else {
        bcrypt.hash(pwd, 10, function(error, hash) {
            db.query(`INSERT INTO user (id, password, email, nickname, license, certificate) VALUES(?, ?, ?, ?, ?, ?)`,
            [id, hash, email, nickname, license, certificate], 
            function(error, result) {
                if (error) {
                    throw error;
                }
                console.log(result);
                response.redirect('/');
            });
        });
        
    }
});

// db.query(`SELECT * FROM user`, function(error, users) {
//     console.log(users);
// })

module.exports = app;