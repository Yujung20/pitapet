const response = require('express');
const express = require('express');
const app = express.Router();
const url = require('url');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');
const path = require('path');

function main_template(question_list) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>Q&A</h1>
            <a href="/qna/write_question/">질문하기</a>
            ${question_list}
        </body>
    </html>
    `;
}

function detail_template(title, content, user, date) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>create question</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>${title}</h1>
            <p>${content}</p>
            <p>${user}</p>
            <p>${date}</p>
        </body>
    </html>
    `
}

function question_template() {
    return `
    <!doctype html>
    <html>
        <head>
            <title>create question</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>질문하기</h1>
            <form action="/qna/write_question/" method="post">
                <p><input type"text" name="title" placeholder="title"></p>
                <p><select name="category">
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
                <p><textarea name="content"></textarea></p>
                <p><input type="submit" value="질문 등록하기"></p>
            </form>
        </body>
    </html>
    `;
}

app.get('/', function(req, res) {
    var question_list = ``;
    db.query(`SELECT * FROM question`, function(error, questions) {
        for (var i = 0; i < Object.keys(questions).length; i++) {
            question_list += `<p><a href="/qna/question/${questions[i].question_number}">${questions[i].title}</a><p>`;
        }
        res.end(main_template(question_list));
    });
});

app.get('/write_question/', function(req, res) {
    res.end(question_template());
})

app.post('/write_question/', function(req, res) {
    const body = req.body;
    const title = body.title;
    const content = body.content;
    const category = body.category;
    const user = req.session.user_id;
    
    db.query(`INSERT INTO question (user_id, title, content, category) VALUES(?, ?, ?, ?)`,
    [user, title, content, category],
    function(error, result) {
        if (error) {
            res.send(error);
            throw error;
        }
        res.redirect('/qna');
        res.end();
    })
})

app.get('/question/:question_id', function(req, res) {
    const question_id = req.params.question_id;

    if (question_id) {
        db.query(`SELECT * FROM question WHERE question_number = ?`, 
        [question_id],
        function(error, question) {
            if (error) {
                res.end(error);
                throw error;
            }
            console.log(question);
            const date = String(question[0].date).split(" ");
            var formating_date = date[3] + "-" + date[1] + "-" + date[2] + "-" + date[4]
            res.send(detail_template(question[0].title, question[0].content, question[0].user_id, formating_date));
        })
    }
})

module.exports = app;