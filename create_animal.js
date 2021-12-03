const { response } = require('express');
const express = require('express');
const app = express.Router();

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');

function template(check_name, name_check_txt) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>create_animal</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>create animal</h1>
            <form action="/register/register_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name" value="${check_name}" formaction="/register/name_check"> <input type="submit" value="이름 확인" formaction="/register/name_check">
                    <p id="name_check_txt">${name_check_txt}</p>
                </p>
                <p><select name="gender"> 
                    <option value="여">여</option>
                    <option value="남">남</option>
                </select></p>
                <p><input type="date" name="birthday" min="1990-01-01" max="2022-12-31" value="2021-01-01"></p>
                <p><select name="type"> 
                    <option value="개">개</option>
                    <option value="고양이">고양이</option>
                    <option value="토끼">토끼</option>
                    <option value="햄스터">햄스터</option>
                    <option value="앵무새">앵무새</option>
                    <option value="기니피그">기니피그</option>
                    <option value="페럿">페럿</option>
                    <option value="고슴도치">고슴도치</option>
                    <option value="기타">기타</option>
                </select></p>
                <p><textarea name="special_note"></textarea></p>
                <p><input type="submit" value="등록하기"></p>
            </form>
        </body>
    </html>
    `;
}

app.get('/', function(req, res) {
    res.end(template("", ""));
});
app.post('/name_check', function(request, response) {
    const post = request.body;
    const name = post.name;
    console.log(name);
    var name_check_txt=``;
    db.query(`SELECT * FROM animal`, function(error, animals) {
        if(error) {
            throw error;
        }

        for (var i = 0; i < Object.keys(animals).length; i++) {
            if (name === animals[i].name) {
                name_check_txt = "사용할 수 없는 이름입니다."
                break;
            }
        }
        response.send(template(name_check_txt, name));
    })
});

app.post('/register_process', function(req, res) {
    const body = req.body;
    const owner = req.session.user_id;
    const name = body.name;
    const gender = body.gender;
    const type = body.type;
    const birthday = body.birthday;
    const special_note = body.special_note;

    db.query(`INSERT INTO animal (owner_id, name, gender, birthday, type, special_note) VALUES(?, ?, ?, ?, ?, ?)`,
    [owner, name, gender, birthday, type, special_note],
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

db.query(`SELECT * FROM animal`, function(error, animals) {
    console.log(animals);
})

module.exports = app;