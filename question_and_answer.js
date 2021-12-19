const response = require('express');
const express = require('express');
const app = express.Router();
const url = require('url');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');
const path = require('path');

function main_template(current,question_list, search_title, search_content) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
            <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }
            .nav_selected{
                color: blue;
            }
            </style>
            <style>
                .container {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    align-items: center;
                    margin-left: auto;
                    margin-right: auto;
                }
                .row {
                    flex-direction: row;
                    flex: 1;
                    justify-content: center;
                    display: flex;
                    max-width: 500px;
                    width: 100%;
                }
                label {
                    align-self: center;
                    width: 20%;
                    font-size: 15px;
                }
                #search_title, #search_content {
                    width: 80%;
                    padding: 10px;
                    margin: 3px 0 0 0;
                    display: inline-block;
                    border: 1px solid #000000;
                    border-radius: 10px;
                    background: none;
                }
                input[type="submit"] {
                    background-color: #0066FF;
                    color: white;
                    padding: 10px 10px 10px 10px;
                    margin: 3px 0 0 5px;
                    border: none;
                    cursor: pointer;
                    width: 20%;
                    opacity: 0.9;
                    border-radius: 10px;
                    float: right;
                    box-shadow: 3px 3px 3px #b0b0b0;
                }
                button {
                    background-color: #0066FF;
                    color: white;
                    padding: 10px 0px 10px 0px;
                    margin: 5px 0 0 0;
                    border: none;
                    cursor: pointer;
                    max-width: 500px;
                    width: 80%;
                    opacity: 0.9;
                    border-radius: 10px;
                    float: right;
                    box-shadow: 3px 3px 3px #b0b0b0;
                }
                .question_list {
                    flex-direction: column;
                    flex: 1;
                    justify-content: space-between;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                #list_txt {
                    align-self: start;
                    font-weight: bolder;
                    margin: 10px 0px 5px 0px;
                }
                .question_row {
                    flex-direction: row;
                    flex: 1;
                    justify-content: space-between;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .auth_date_row {
                    flex-direction: row;
                    flex: 1;
                    display: flex;
                    justify-content: right;;
                    max-width: 800px;
                    width: 100%;
                }
                .user_id {
                    align-self: center;
                    margin: 0px 20px 0px 0px;
                }
                a {
                    color: black;
                    text-decoration: none;
                    align-self: center;
                    width: 50%;
                }
                a:hover {
                    border-bottom: 3px solid blue;
                    width: auto;
                }
                hr {
                    margin: 0px;
                    max-width: 800px;
                    width: 100%;
                }
            </style>
        </head>
        <body>
        <nav class="navbar">
            <div class="navbar_logo">
                <a href="/"><i class="fas fa-paw"></i></a>
                <a href="/">pit-a-pet</a>
            </div>

            <ul class="navbar_menu">
                <li> <a href="/qna">Q&A</a> </li>
                <li> <a href="/review">리뷰</a> </li>
                <li> <a href="/information">기본 정보</a> </li>
                <li> <a href="/hospital">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
        <div class="container">
            <h1>Q&A</h1>
            <form class="row" action="/qna/search?q_title=${search_title}" method="get">
                <label for="search_title">질문 검색</label>
                <input type="text" id="search_title" name="search_title" placeholder="질문 검색 내용을 입력하세요.">
                <input type="submit" value="검색"></p>
            </form>
            <form class="row" action="/qna/search?a_content=${search_content}" method="get">
                <label for="search_content">답변 검색</label>
                <input type="text" id="search_content" name="search_content" placeholder="답변 검색 내용을 입력하세요.">
                <input type="submit" value="검색"></p>
            </form>
            <button type="button" onclick="location.href='/qna/write_question/'">질문하기</button>
            <div class="question_list">
                <p id="list_txt">질문 목록</p>
                ${question_list}
            </div>
        </div>
        </body>
    </html>
    `;
}

function detail_template(current,question_id, question_title, question_content, question_user, question_date, question_category,
    answer, auth_btn) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>질문 보기</title>
            <meta charset="utf-8">
            <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }
            .nav_selected{
                color: blue;
            }
            </style>
            <style>
                .container {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    align-items: center;
                    margin-left: auto;
                    margin-right: auto; 
                    max-width: 800px;
                    width: 100%; 
                }
                hr {
                    width: 100%;
                }
                p {
                    margin: 5px 0px;
                }
                .question {
                    flex-direction: column;
                    flex: 1;
                    display: flex;
                    padding: 10px 10px 10px 10px;
                    background: rgba(196, 196, 196, 0.15);
                    box-shadow: 3px 3px 3px #b0b0b0;
                    max-width: 780px;
                    width: 100%;
                }
                .title_row {
                    flex-direction: row;
                    justify-content: space-between;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                #title {
                    font-size: 20px;
                    align-self: flex-start;
                }
                #user {
                    align-self: center;
                }
                #date {
                    align-self: flex-end;
                    margin-top: auto;
                }
                #content {
                    margin: 30px 0 10px 0;
                }
                .auth_btn {
                    flex-direction: row;
                    justify-content: flex-start;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .answer {
                    flex-direction: column;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .write_answer {
                    flex-direction: row;
                    flex: 1;
                    display: flex;
                    margin: 20px 0px 0px 0px;
                    justify-content: space-between;
                }
                textarea {
                    width: 100%;
                    max-width: 700px;
                    border:1px solid #0066FF;
                    border-radius: 10px;
                    height: 95px;
                }
                #write_answer_btn {
                    width: 100%;
                    max-width: 90px;
                }
                .answer_list {
                    margin: 10px 0 0 0;
                }
                #answer_user_id, #answer_category {
                    color: #0066FF;
                    margin: 5px 0px 0px 0px;
                }
                .answer_date {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: auto;
                }
                #answer_hr {
                    border: 1px solid #0066FF;
                }
                input[type="submit"] {
                    background-color: #0066FF;
                    color: white;
                    padding: 10px 10px 10px 10px;
                    margin: 0px 0 0 5px;
                    border: none;
                    cursor: pointer;
                    max-width: 50px;
                    width: 100%;
                    opacity: 0.9;
                    border-radius: 10px;
                    box-shadow: 3px 3px 3px #b0b0b0;
                }
                #delete_btn {
                    background-color: white;
                    color: #0066FF;
                    padding: 10px 10px 10px 10px;
                    margin: 0px 0 0 10px;
                    border: none;
                    cursor: pointer;
                    max-width: 50px;
                    width: 100%;
                    opacity: 0.9;
                    border-radius: 10px;
                    box-shadow: 3px 3px 3px #b0b0b0;
                }
            </style>
        </head>
        <body>
        <nav class="navbar">
            <div class="navbar_logo">
                <a href="/"><i class="fas fa-paw"></i></a>
                <a href="/">pit-a-pet</a>
            </div>

            <ul class="navbar_menu">
                <li> <a href="/qna">Q&A</a> </li>
                <li> <a href="/review">리뷰</a> </li>
                <li> <a href="/information">기본 정보</a> </li>
                <li> <a href="/hospital">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
        <div class="container">
            <div class="question">
                <div class="title_row">
                    <p id="title">${question_title}</p>
                    <p id="user">작성자: ${question_user}</p>
                </div>
                <hr/>
                <p id="date">${question_date}</p>
                <p id="category">종: ${question_category}</p>
                <p id="content">${question_content}</p>
                <div class="auth_btn">
                    ${auth_btn}
                </div>
            </div>
            <div class="answer">
                <form action="/qna/write_answer/" method="post">
                    <input type="hidden" name="question_id" value="${question_id}">
                    <div class="write_answer">
                        <textarea name="content"></textarea>
                        <input type="submit" id="write_answer_btn" value="답변하기">
                    </div>
                </form>
                <div class="answer_list">
                    ${answer}
                </div>
            </div>
        </div>
        </body>
    </html>
    `
}

function question_template(current) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>질문 작성하기</title>
            <meta charset="utf-8">
            <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }
            .nav_selected{
                color: blue;
            }
            </style>
            <style>
                .container {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    align-items: center;
                    margin-left: auto;
                    margin-right: auto;
                }
                form {
                    max-width: 500px;
                    width: 100%;
                }
                .row {
                    flex: 1;
                    display: flex;
                    max-width: 500px;
                    width: 100%;
                }
                label {
                    align-self: center;
                    width: 20%;
                }
                p {
                    display: flex;
                    flex: 1;
                    margin: 10px 0px;
                }
                input[type=text], #title {
                    width: 100%;
                    padding: 10px;
                    margin: 3px 0 0 20px;
                    display: flex;
                    border: 1px solid #000000;
                    border-radius: 10px;
                    background: none;   
                    align-self: flex-end;
                }
                #category {
                    width: 30%;
                    padding: 10px;
                    margin: 3px 0 0 20px;
                    display: flex;
                    border: 1px solid #000000;
                    border-radius: 10px;
                    background: none;   
                    align-self: flex-end;
                }
                input[type="submit"] {
                    background-color: #0066FF;
                    color: white;
                    padding: 10px 0px 10px 0px;
                    margin: 3px 0 0 5px;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                    opacity: 0.9;
                    border-radius: 10px;
                    box-shadow: 3px 3px 3px #b0b0b0;
                }
                textarea {
                    width: 100%;
                    margin: 0px 0px 0px 20px;
                    max-width: 700px;
                    border:1px solid black;
                    border-radius: 10px;
                    height: 95px;
                }
            </style>
        </head>
        <body>
        <nav class="navbar">
            <div class="navbar_logo">
                <a href="/"><i class="fas fa-paw"></i></a>
                <a href="/">pit-a-pet</a>
            </div>

            <ul class="navbar_menu">
                <li> <a href="/qna">Q&A</a> </li>
                <li> <a href="/review">리뷰</a> </li>
                <li> <a href="/information">기본 정보</a> </li>
                <li> <a href="/hospital">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
            <div class="container">
                <form action="/qna/write_question/" method="post">
                    <div class="row">
                        <label for="title">제목</label>
                        <p><input type"text" name="title" id="title" placeholder="제목"></p>
                    </div>
                    <div class="row">
                        <label for="category">종</label>
                        <p><select name="category" id="category">
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
                    </div>
                    <div class="row">
                        <label for="content">내용</label>
                        <p><textarea name="content" id="content"></textarea></p>
                    </div>
                    <p><input type="submit" value="질문 등록하기"></p>
                </form>
            </body>
        </body>
    </html>
    `;
}

function question_update_template(current,question_id, question_title, question_content, question_category) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>질문 수정하기</title>
            <meta charset="utf-8">
            <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }
            .nav_selected{
                color: blue;
            }
            </style>
            <style>
                .container {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    align-items: center;
                    margin-left: auto;
                    margin-right: auto;
                }
                form {
                    max-width: 500px;
                    width: 100%;
                }
                .row {
                    flex: 1;
                    display: flex;
                    max-width: 500px;
                    width: 100%;
                }
                #category {
                    width: 30%;
                    padding: 10px;
                    margin: 3px 0 0 20px;
                    display: flex;
                    border: 1px solid #000000;
                    border-radius: 10px;
                    background: none;   
                    align-self: flex-end;
                }
                label {
                    align-self: center;
                    width: 20%;
                }
                p {
                    display: flex;
                    flex: 1;
                    margin: 10px 0px;
                }
                input[type=text], #title {
                    width: 100%;
                    padding: 10px;
                    margin: 3px 0 0 20px;
                    display: flex;
                    border: 1px solid #000000;
                    border-radius: 10px;
                    background: none;   
                    align-self: flex-end;
                }
                input[type="submit"] {
                    background-color: #0066FF;
                    color: white;
                    padding: 10px 0px 10px 0px;
                    margin: 3px 0 0 5px;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                    opacity: 0.9;
                    border-radius: 10px;
                    box-shadow: 3px 3px 3px #b0b0b0;
                }
                textarea {
                    width: 100%;
                    margin: 0px 0px 0px 20px;
                    max-width: 700px;
                    border:1px solid black;
                    border-radius: 10px;
                    height: 95px;
                }
            </style>
        </head>
        <body>
        <nav class="navbar">
            <div class="navbar_logo">
                <a href="/"><i class="fas fa-paw"></i></a>
                <a href="/">pit-a-pet</a>
            </div>

            <ul class="navbar_menu">
                <li> <a href="/qna">Q&A</a> </li>
                <li> <a href="/review">리뷰</a> </li>
                <li> <a href="/information">기본 정보</a> </li>
                <li> <a href="/hospital">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
            <div class="container">
                <form action="/qna/question/${question_id}/update_process/" method="post">
                <div class="row">
                        <label for="title">제목</label>    
                    <p><input type="text" id="title" name="title" value="${question_title}"></p>
                </div>
                <div class="row">
                    <label for="category">종</label>
                        <p><select id="category" name="category">
                            ${question_category}
                        </select></p>
                </div>
                <div class="row">
                    <label for="content">내용</label>
                    <p><textarea id="content" name="content">${question_content}</textarea></p>
                </div>
                <p><input type="submit" value="수정"></p>
                </form>
            </div>
        </body>
    </html>
    `;
}

app.get('/', function(req, res) {
    var question_list = ``;
    var current=``;
            if(req.session.user_id){//로그인 한 경우
                var uid=req.session.user_id;
                current=`<li> <a href="/logout">로그아웃</a> </li>
                <li> <a href="/mypage">${uid}--마이페이지</a> </li>`
                console.log(uid)
            }
            else{
                current=`<li> <a href="/login">로그인</a> </li>
                <li> <a href="/signup">회원가입</a> </li>`
            }
    db.query(`SELECT * FROM question ORDER BY date DESC`, function(error, questions) {
        if (Object.keys(questions).length > 0) {
            for (var i = 0; i < Object.keys(questions).length; i++) {
                const qdate = String(questions[0].date).split(" ");
                var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];
                question_list += 
                `<div class="question_row">
                    <a href="/qna/question/${questions[i].question_number}">${questions[i].title}</a>
                    <div class="auth_date_row">
                        <p class="user_id">${questions[i].user_id}<p>
                        <p>${formating_qdate}</p>
                    </div>
                </div>
                <hr/>
                `;
            }
        } else {
            question_list = `아직 올라온 질문이 없습니다.`;
        }
        res.end(main_template(current,question_list));
    });
});

app.get('/write_question/', function(req, res) {
    var current=``;
            if(req.session.user_id){//로그인 한 경우
                var uid=req.session.user_id;
                current=`<li> <a href="/logout">로그아웃</a> </li>
                <li> <a href="/mypage">${uid}--마이페이지</a> </li>`
                console.log(uid)
            }
            else{
                current=`<li> <a href="/login">로그인</a> </li>
                <li> <a href="/signup">회원가입</a> </li>`
            }
    if(req.session.loggedin) {
        res.end(question_template(current));
    } else {
        res.send('<script type="text/javascript">alert("로그인이 필요한 서비스입니다.");location.href="/login";</script>')
    }
})

app.post('/write_question/', function(req, res) {
    const body = req.body;
    const title = body.title;
    const content = body.content;
    const category = body.category;
    const user = req.session.user_id;
    
    if (title === '' || content === '' || category === '') res.send(`<script type="text/javascript">alert("모든 정보를 입력해주세요."); document.location.href="/qna/write_question/";</script>`);
    else {
        db.query(`INSERT INTO question (user_id, title, content, category) VALUES(?, ?, ?, ?)`,
        [user, title, content, category],
        function(error, result) {
            if (error) {
                res.send(error);
                throw error;
            }
            res.redirect(`/qna/question/${result.insertId}`);
        });
    }
})

app.get('/question/:question_id', function(req, res) {
    const question_id = req.params.question_id;
    var answer_list = ``;
var current=``;
            if(req.session.user_id){//로그인 한 경우
                var uid=req.session.user_id;
                current=`<li> <a href="/logout">로그아웃</a> </li>
                <li> <a href="/mypage">${uid}--마이페이지</a> </li>`
                console.log(uid)
            }
            else{
                current=`<li> <a href="/login">로그인</a> </li>
                <li> <a href="/signup">회원가입</a> </li>`
            }
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
                            <div class="title_row">
                                <p id="answer_user_id">${answers[i].user_id}</p>
                                <p id="answer_category">${answers[i].category}</p>
                            </div>
                            <hr id="answer_hr"/>
                            <div class="answer_date">
                                <p>${formating_adate}</p>
                            </div>
                            <p>${answers[i].content}</p>
                            <div class="auth_btn">
                                <form action="/qna/answer_delete/" method="post">
                                    <input type="hidden" name="question_number" value="${question_id}">
                                    <input type="hidden" name="answer_number" value="${answers[i].answer_number}">
                                    <input type="submit" value="삭제" id="delete_btn"></p>
                                </form>
                            </div>
                        `
                    } else {
                        answer_list += `
                        <div class="title_row">
                        <p id="answer_user_id">${answers[i].user_id}</p>
                        <p id="answer_category">${answers[i].category}</p>
                        </div>
                        <hr id="answer_hr"/>
                        <div class="answer_date">
                            <p>${formating_adate}</p>
                        </div>
                        <p>${answers[i].content}</p>
                        `
                    }
                }

                const qdate = String(question[0].date).split(" ");
                var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];

                let auth_btn = ``;
                if (req.session.user_id === question[0].user_id) {
                    auth_btn = `
                        <p><input type="submit" value="수정" onClick="location.href='/qna/question/${question_id}/update/'"></p>
                        <form action="/qna/delete/" method="post">
                            <input type="hidden" name="question_number" value="${question_id}">
                            <p><input type="submit" value="삭제" id="delete_btn"></p>
                        </form>
                        `;
                }

                res.send(detail_template(current,question_id, question[0].title, question[0].content, question[0].user_id, formating_qdate, question[0].category, answer_list, auth_btn));
            })
        })
    }
})

app.get('/search/', function(req, res) {
    const q_keyword = req.query.search_title;
    const a_keyword = req.query.search_content;
    var question_list = ``;
    var current=``;
    if(req.session.user_id){//로그인 한 경우
        var uid=req.session.user_id;
        current=`<li> <a href="/logout">로그아웃</a> </li>
        <li> <a href="/mypage">${uid}--마이페이지</a> </li>`
        console.log(uid)
    }
    else{
        current=`<li> <a href="/login">로그인</a> </li>
        <li> <a href="/signup">회원가입</a> </li>`
    }
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
                    const qdate = String(questions[0].date).split(" ");
                    var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];
                    question_list += 
                    `<div class="question_row">
                        <a href="/qna/question/${questions[i].question_number}">${questions[i].title}</a>
                        <div class="auth_date_row">
                            <p class="user_id">${questions[i].user_id}<p>
                            <p>${formating_qdate}</p>
                        </div>
                    </div>
                    <hr/>
                    `;
                }
            } else {
                question_list = `<p> 검색 결과가 없습니다. </p>`
                
            }
    
            res.send(main_template(current,question_list));
        })
    } else if (a_keyword) {
        console.log(a_keyword);
        db.query(`SELECT * FROM answer WHERE content LIKE ? ORDER BY date DESC`,
        ['%' + a_keyword + '%'],
        function(err, answers) {
            if (Object.keys(answers).length > 0) {
                for (var i = 0; i < Object.keys(answers).length; i++) {
                    const qdate = String(answers[0].date).split(" ");
                    var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];
                    question_list += 
                    `<div class="question_row">
                        <a href="/qna/question/${answers[i].question_number}">${answers[i].content}</a>
                        <div class="auth_date_row">
                            <p class="user_id">${answers[i].user_id}<p>
                            <p>${formating_qdate}</p>
                        </div>
                    </div>
                    <hr/>
                `;
                }
            } else {
                question_list = `<p> 검색 결과가 없습니다. </p>`
                
            }
    
            res.send(main_template(current,question_list));
        })
    }
    else {
        res.send('<script type="text/javascript">alert("검색어를 입력해주세요.");location.href="/qna";</script>');
    }
})

app.post('/write_answer/', function(req, res) {
    const body = req.body;
    const question_id = body.question_id;
    const content = body.content;
    const user = req.session.user_id;
    var category = "일반인";

    if (req.session.loggedin) {
        if (content === '') res.send(`<script type="text/javascript">alert("내용을 입력해주세요.");location.href="/qna/question/${question_id}";</script>`);
        else {
            db.query(`SELECT * FROM user WHERE id = ?`, 
            [user],
            function(err, result) {
                if (!result[0].is_normal) {
                    category = "전문가";
                }

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
        }
    } else {
        res.send('<script type="text/javascript">alert("로그인이 필요한 서비스입니다.");location.href="/login";</script>')
    }

    console.log(category);
});

app.get('/question/:question_id/update/', function(req, res) {
    const question_id = req.params.question_id;
    const category = ['개', '고양이', '토끼', '햄스터', '앵무새', '기니피그', '패럿', '고슴도치', '기타'];
    let category_list = '';
    var current=``;
    if(req.session.user_id){//로그인 한 경우
        var uid=req.session.user_id;
        current=`<li> <a href="/logout">로그아웃</a> </li>
        <li> <a href="/mypage">${uid}--마이페이지</a> </li>`
        console.log(uid)
    }
    else{
        current=`<li> <a href="/login">로그인</a> </li>
        <li> <a href="/signup">회원가입</a> </li>`
    }
    db.query(`SELECT * FROM question WHERE question_number = ?`,
    [question_id],
    function(err, question) {
        if (err) {
            res.send(err);
            throw err;
        }
        for (let i = 0; i < category.length; i++) {
            let selected = '';
            if (category[i] === question[0].category) selected = 'selected';
            category_list += `<option value="${category[i]}" ${selected}>${category[i]}</option>`
        }
        res.send(question_update_template(current,question_id, question[0].title, question[0].content, category_list));
    })
});

app.post('/question/:question_id/update_process/', function(req, res) {
    const question_id = req.params.question_id;

    const body = req.body;
    const title = body.title;
    const content = body.content;
    const category = body.category;

    if (title === '' || content === '' || category === '') {
        res.send(`<script type="text/javascript">alert("모든 정보를 입력해주세요.");location.href="/qna/question/${question_id}/update";</script>`);
    } else {
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
    }
});

app.post('/delete/', function(req, res) {
    const body = req.body;
    const question_id = body.question_number;
    console.log(question_id);

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

app.post('/answer_delete/', function(req, res) {
    const body = req.body;
    const question_id = body.question_number;
    const answer_id = body.answer_number;

    db.query(`DELETE FROM answer WHERE answer_number = ?`,
    [answer_id],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
        console.log(result);

        res.redirect(`/qna/question/${question_id}`);
    });
});

module.exports = app;