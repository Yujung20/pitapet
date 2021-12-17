const response = require('express');
const express = require('express');
const app = express.Router();
const url = require('url');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');
const path = require('path');

function main_template(question_list, search_title, search_content) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>Q&A</h1>
            <form action="/qna/search?q_title=${search_title}" method="get">
                <p><input type="text" name="search_title" placeholder="검색어를 입력하세요.">
                <input type="submit" value="검색"></p>
            </form>
            <form action="/qna/search?a_content=${search_content}" method="get">
                <p><input type="text" name="search_content" placeholder="답변 검색 내용을 입력하세요.">
                <input type="submit" value="검색"></p>
            </form>
            <a href="/qna/write_question/">질문하기</a>
            ${question_list}
        </body>
    </html>
    `;
}

function detail_template(question_id, question_title, question_content, question_user, question_date, question_category,
    answer, auth_btn) {
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
            ${auth_btn}
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

function question_update_template(question_id, question_title, question_content, question_category) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>create question</title>
            <meta charset="utf-8">
        </head>
        <body>
            <form action="/qna/question/${question_id}/update_process/" method="post">
                <h1><input type="text" name="title" value="${question_title}"></h1>
                <p><textarea name="content">${question_content}</textarea></p>
                <p><select name="category" value="${question_category}">
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
                <p><input type="submit" value="수정"></p>
            </form>
        </body>
    </html>
    `;
}

app.get('/', function(req, res) {
    var question_list = ``;
    db.query(`SELECT * FROM question ORDER BY date DESC`, function(error, questions) {
        if (Object.keys(questions).length > 0) {
            for (var i = 0; i < Object.keys(questions).length; i++) {
                question_list += `<p><a href="/qna/question/${questions[i].question_number}">${questions[i].title}</a><p>`;
            }
        } else {
            question_list = `아직 올라온 질문이 없습니다.`;
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
        db.query(`SELECT * FROM question WHERE question_number = ? ORDER BY date DESC`, 
        [question_id],
        function(err1, question) {
            if (err1) {
                res.end(err1);
                throw err1;
            }

            db.query(`SELECT * FROM answer WHERE question_number = ? ORDER BY date DESC`,
            [question_id],
            function(err2, answers) {
                if (err2) {
                    res.send(err2);
                    throw err2;
                }

                for (var i = 0; i < Object.keys(answers).length; i++) {
                    const adate = String(answers[i].date).split(" ");
                    var formating_adate = adate[3] + "-" + adate[1] + "-" + adate[2] + "-" + adate[4];

                    if (req.session.user_id === answers[i].user_id) {
                        answer_list += `
                            <p>${answers[i].content}</p>
                            <p>${answers[i].user_id}</p>
                            <p>${formating_adate}</p>
                            <p>${answers[i].category}</p>
                            <p><input type="submit" value="삭제" onClick="location.href='answer/${answers[i].answer_number}/delete/'"></p>
                            <hr/>
                        `
                    } else {
                        answer_list += `
                            <p>${answers[i].content}</p>
                            <p>${answers[i].user_id}</p>
                            <p>${formating_adate}</p>
                            <p>${answers[i].category}</p>
                            <hr/>
                        `
                    }
                }

                const qdate = String(question[0].date).split(" ");
                var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];

                let auth_btn = ``;
                if (req.session.user_id === question[0].user_id) {
                    auth_btn = `
                        <p><input type="submit" value="수정" onClick="location.href='/qna/question/${question_id}/update/'"></p>
                        <p><input type="submit" value="삭제" onClick="location.href='/qna/question/${question_id}/delete/'"></p>
                    `
                }

                res.send(detail_template(question_id, question[0].title, question[0].content, question[0].user_id, formating_qdate, question[0].category, answer_list, auth_btn));
            })
        })
    }
})

app.get('/search/', function(req, res) {
    const q_keyword = req.query.search_title;
    const a_keyword = req.query.search_content;
    var question_list = ``;

    console.log(q_keyword);
    console.log(a_keyword);
    
    if (q_keyword) {
        console.log(q_keyword);
        db.query(`SELECT * FROM question WHERE title LIKE ? ORDER BY date DESC`,
        ['%' + q_keyword + '%'],
        function(err, questions) {
            if (err) {
                res.send(err);
                throw err;
            }
    
            if (Object.keys(questions).length > 0) {
                for (var i = 0; i < Object.keys(questions).length; i++) {
                    question_list += `<p><a href="/qna/question/${questions[i].question_number}">${questions[i].title}</a><p>`;
                }
            } else {
                question_list = `<p> 검색 결과가 없습니다. </p>`
                
            }
    
            res.send(main_template(question_list));
        })
    } if (a_keyword) {
        console.log(a_keyword);
        db.query(`SELECT * FROM answer WHERE content LIKE ? ORDER BY date DESC`,
        ['%' + a_keyword + '%'],
        function(err, answers) {
            if (Object.keys(answers).length > 0) {
                for (var i = 0; i < Object.keys(answers).length; i++) {
                    question_list += `<p><a href="/qna/question/${answers[i].question_number}">${answers[i].content}</a><p>`;
                }
            } else {
                question_list = `<p> 검색 결과가 없습니다. </p>`
                
            }
    
            res.send(main_template(question_list));
        })
    }
    else {
        res.send('<script type="text/javascript">alert("검색어를 입력해주세요.");location.href="/qna";</script>')
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

app.get('/question/:question_id/update/', function(req, res) {
    const question_id = req.params.question_id;
    console.log(question_id);

    db.query(`SELECT * FROM question WHERE question_number = ?`,
    [question_id],
    function(err, question) {
        if (err) {
            res.send(err);
            throw err;
        }
        console.log(question);
        res.send(question_update_template(question_id, question[0].title, question[0].content, question[0].category));
    })
});

app.post('/question/:question_id/update_process/', function(req, res) {
    const question_id = req.params.question_id;

    const body = req.body;
    const title = body.title;
    const content = body.content;
    const category = body.category;

    db.query(`UPDATE question SET title=?, content=?, category=? WHERE question_number = ?`,
    [title, content, category, question_id],
    function(err, question) {
        if(err) {
            res.send(err);
            throw err;
        }
        console.log(question);
        res.redirect(`/qna/question/${question_id}/`);
    })
});

app.get('/question/:question_id/delete/', function(req, res) {
    const question_id = req.params.question_id;

    db.query(`DELETE FROM question WHERE question_number = ?`,
    [question_id],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }

        res.redirect('/qna/');
    });
});

app.get('/question/answer/:answer_id/delete/', function(req, res) {
    const answer_id = req.params.answer_id;

    db.query(`DELETE FROM answer WHERE answer_number = ?`,
    [answer_id],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
        console.log(result);

        res.redirect('/qna/');
    });
});

module.exports = app;