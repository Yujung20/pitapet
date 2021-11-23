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

function detail_template(question_id, question_title, question_content, question_user, question_date, question_category,
    answer) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>create question</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>${question_title}</h1>
            <p>${question_category}</p>
            <p>${question_content}</p>
            <p>${question_user}</p>
            <p>${question_date}</p>
            <hr/>
            <h3>답변</h3>
            <form action="/qna/write_answer/" method="post">
                <input type="hidden" name="question_id" value="${question_id}">
                <p><textarea name="content"></textarea></p>
                <p><input type="submit" value="답변 등록하기"></p>
            </form>
            ${answer}
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
    })
})

app.get('/question/:question_id', function(req, res) {
    const question_id = req.params.question_id;
    var answer_list = ``;

    if (question_id) {
        db.query(`SELECT * FROM question WHERE question_number = ?`, 
        [question_id],
        function(err1, question) {
            if (err1) {
                res.end(err1);
                throw err1;
            }

            db.query(`SELECT * FROM answer WHERE question_number = ?`,
            [question_id],
            function(err2, answers) {
                if (err2) {
                    res.send(err2);
                    throw err2;
                }

                for (var i = 0; i < Object.keys(answers).length; i++) {
                    const adate = String(answers[i].date).split(" ");
                    var formating_adate = adate[3] + "-" + adate[1] + "-" + adate[2] + "-" + adate[4];
                    answer_list += `
                        <p>${answers[i].content}</p>
                        <p>${answers[i].user_id}</p>
                        <p>${formating_adate}</p>
                        <p>${answers[i].category}</p>
                        <hr/>
                    `
                }

                const qdate = String(question[0].date).split(" ");
                var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];
                res.send(detail_template(question_id, question[0].title, question[0].content, question[0].user_id, formating_qdate, question[0].category, answer_list));
            })
        })
    }
})

app.post('/write_answer/', function(req, res) {
    const body = req.body;
    const question_id = body.question_id;
    const content = body.content;
    const user = req.session.user_id;
    var category = "일반인";

    db.query(`SELECT * FROM user WHERE id = ?`, 
    [user],
    function(err, user) {
        if (!user[0].is_normal) {
            category = "전문가";
        }
    })

    db.query(`INSERT INTO answer (user_id, content, question_number, category) VALUES (?, ?, ?, ?)`,
    [user, content, question_id, category],
    function(error, answer) {
        if (error) {
            res.send(error);
            throw error;
        }
        console.log(answer);
        res.redirect(`/qna/question/${question_id}`);
    })
});

module.exports = app;