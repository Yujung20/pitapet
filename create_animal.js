const { response } = require('express');
const express = require('express');
const app = express.Router();

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');

function template() {
    return `
    <!doctype html>
    <html>
        <head>
            <title>create_animal</title>
            <meta charset="utf-8">
            <style>
            form {
                display: flex;
                flex-direction: column;
                max-width: 500px;
                width: 100%;
                margin-top: 10%;
                margin-left: auto;
                margin-right: auto;
            }
    
            input[type=text], textarea[name=special_note] {
                width: 100%;
                padding: 12px 20px;
                margin: 8px 0;
                display: inline-block;
                border: 1px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
            }

            select[name=gender], input[type=date], select[name=type] {
                width: 60%;
                padding: 12px 20px;
                margin: 8px 0;
                display: inline-block;
                border: 1px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
            }

            button {
                background-color: #0066FF;
                color: white;
                padding: 14px 20px;
                margin: 8px 0;
                border: none;
                cursor: pointer;
                width: 100%;
                border-radius: 15px;
            }
        
            button:hover {
                opacity: 0.8;
            }
            </style>
        </head>
        <body>
            <form action="/register/register_process" method="post">
                <h1>반려동물 등록하기</h1>
                <p>
                    <input type="text" name="name" placeholder="name"  formaction="/register/name_check"> 
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
                <button type="submit">등록하기</button>
            </form>
        </body>
    </html>
    `;
}

app.get('/', function(req, res) {
    res.end(template("", ""));
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
        res.redirect('/mypage/');
        res.end();
    });
});

db.query(`SELECT * FROM animal`, function(error, animals) {
    console.log(animals);
})

module.exports = app;