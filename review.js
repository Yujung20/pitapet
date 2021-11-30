const express = require('express');
const app = express.Router();

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false }));

const db = require('./db');

function main_template(review_list) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>Review</h1>
            <a href="/review/write_review/">리뷰 작성하기</a>
            ${review_list}
        </body>
    </html>
    `
}

app.get('/', function(req, res) {
    var review_list = '';
    res.send(main_template(review_list));
})

module.exports = app;