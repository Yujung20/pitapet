const response = require('express');
const express = require('express');
const app = express.Router();
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');

function main_template() {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>Q&A</h1>
            <a href='/qna/write_question/">질문하기</a>
        </body>
    </html>
    `;
}

app.get('/', function(req, res) {
    res.end(main_template());
});

module.exports = app;