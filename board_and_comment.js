const response = require('express');
const express = require('express');
const app = express.Router();
const url = require('url');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');
const path = require('path');

function main_template(current,boardlist,search_title){
    return `
    <!doctype html>
      <html>
          <head>
              <title>Board</title>
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
                .tableline {
                    border-bottom: 1px solid #888888;
                }

                .tableline a:hover {
                    border-bottom:3px solid blue;
                }

                a {
                    text-decoration: none;
                    color: black;
                }

                .search_p {
                    font-size: 14px;
                }

                .search_text {
                    width: 40%;
                    padding: 15px;
                    margin: 3px 0 0 0;
                    display: inline-block;
                    border: 1px solid #000000;
                    border-radius: 10px;
                    background: none;
                }

                .search_submit {
                    background-color: #0066FF;
                    color: white;
                    padding: 15px;
                    margin: 3px 0 0 5px;
                    border: none;
                    cursor: pointer;
                    width: 8%;
                    opacity: 0.9;
                    border-radius: 10px;
                    box-shadow: 3px 3px 3px #b0b0b0;
                }

                .tb_button {
                    background-color: #0066FF;
                    color: white;
                    padding: 15px;
                    margin: 3px 0 0 5px;
                    border: none;
                    cursor: pointer;
                    width: 42.3%;
                    opacity: 0.9;
                    border-radius: 10px;
                    box-shadow: 3px 3px 3px #b0b0b0;
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    align-items: center;
                    margin-left: auto;
                    margin-right: auto; 
                    width: 800px; 
                }
                .row {
                    flex-direction: row;
                    flex: 1;
                    justify-content: center;
                    display: flex;
                    max-width: 500px;
                    width: 100%;
                }
                .board_row {
                    flex-direction: row;
                    flex: 1;
                    justify-content: space-between;
                    display: flex;
                    width: 800px;
                }
                .auth_date_row {
                    flex-direction: row;
                    flex: 1;
                    display: flex;
                    justify-content: right;;
                    width: 800px;
                }
                .user_id {
                    align-self: center;
                    margin: 0px 20px 0px 0px;
                }
                label {
                    align-self: center;
                    width: 30%;
                    font-size: 13px;
                }
                #underline {
                    color: black;
                    text-decoration: none;
                    align-self: center;
                    width: 40%;
                }
                #underline:hover {
                    border-bottom: 3px solid blue;
                    width: auto;
                }
                hr {
                    margin: 0px;
                    max-width: 800px;
                    width: 100%;
                }
                #search_title {
                    width: 80%;
                    padding: 10px;
                    margin: 3px 0 0 0;
                    display: inline-block;
                    border: 1px solid #000000;
                    border-radius: 10px;
                    background: none;
                }
                .board_list {
                    flex-direction: column;
                    flex: 1;
                    justify-content: space-between;
                    display: flex;
                    width: 800px
                }
                #list_txt {
                    align-self: start;
                    font-weight: bolder;
                    margin: 10px 0px 5px 0px;
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
                <li> <a href="/board" class="nav_selected">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
              <div class="container">
                <form class="row" action="/board/search?b_title=${search_title}" method="get">
                    <label for="search_title">커뮤니티 검색</label>
                    <input type="text" id="search_title" name="search_title" placeholder="검색어를 입력하세요.">
                    <input type="submit" value="검색">
                </form>
                <button type="button" onclick="location.href='/board/write/'">글 작성하기</button>
                <div class="board_list">
                    <p id="list_txt">글 목록</p>
                    ${boardlist}
                </div>
            </div>
          </body>
      </html>
    `;
  }
  
  function detail_template(current, board_id, board_title, board_content, board_user, board_date, board_category,
      comments, auth_btn) {
      return `
      <!doctype html>
      <html>
          <head>
              <title>board content</title>
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
            .container {
                display: flex;
                flex-direction: column;
                flex: 1;
                align-items: center;
                margin-left: auto;
                margin-right: auto; 
                width: 800px; 
            }
            .title_row {
                flex-direction: row;
                justify-content: space-between;
                flex: 1;
                display: flex;
                width: 800px; 
            }
            .board {
                flex-direction: column;
                flex: 1;
                display: flex;
                padding: 10px 10px 10px 10px;
                background: rgba(196, 196, 196, 0.15);
                box-shadow: 3px 3px 3px #b0b0b0;
            }
            .comment {
                flex-direction: column;
                flex: 1;
                display: flex;
                width: 800px; 
            }
            .write_comment {
                flex-direction: row;
                flex: 1;
                display: flex;
                margin: 20px 0px 0px 0px;
                justify-content: space-between;
            }
            textarea {
                width: 800px; 
                border:1px solid #0066FF;
                border-radius: 10px;
                height: 95px;
            }
            #write_comment_btn {
                width: 100%;
                max-width: 90px;
            }
            #comment_user_id {
                color: #0066FF;
                margin: 5px 0px 0px 0px;
            }
            #comment_hr {
                border: 1px solid #0066FF;
            }
            .comment_date {
                display: flex;
                justify-content: flex-end;
                margin-top: auto;
            }
            .comment_list {
                margin: 10px 0 0 0;
            }
            .auth_btn {
                flex-direction: row;
                justify-content: flex-start;
                flex: 1;
                display: flex;
                max-width: 800px;
                width: 100%;
            }
            p {
                margin: 5px 0px;
            }
            hr {
                width: 100%;
            }
            #title, #user {
                margin: 0;
            }
            #title {
                font-size: 20px;
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
              <meta charset="utf-8">
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
                <li> <a href="/board" class="nav_selected">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
        <div class="container">
            <div class="board">
                <div class="title_row">
                    <p id="title"><strong>&nbsp;[ ${board_category} ]&nbsp;${board_title}</strong></p>
                    <p id="user">작성자: ${board_user}</p>
                </div>
                <hr/>
                <p id="date">${board_date}</p>
                <p id="content">${board_content}</p>
                <div class="auth_btn">
                    ${auth_btn}
                </div>
            </div>
            <div class="comment">
                <form action="/board/write_comment/" method="post">
                    <input type="hidden" name="board_id" value="${board_id}">
                    <div class="write_comment">
                        <textarea name="content" maxlength="1000"></textarea>
                        <input type="submit" id="write_comment_btn" value="댓글 달기">
                    </div>
                </form>
                <div class="comment_list">
                    ${comments}
                </div>
            </div>
            </div>
          </body>
      </html>
      `
  }
  
  function board_template(current) {
      return `
      <!doctype html>
      <html>
          <head>
              <title>write board</title>
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
              <meta charset="utf-8">
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
                <li> <a href="/board" class="nav_selected">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
              <div class="container">
                <form action="/board/write/" method="post">
                <div class="row">
                    <label for="title">제목</label>
                    <p><input type="text" name="title" placeholder="제목" maxlength="200"></p>
                </div>
                <div class="row">
                    <label for="category">카테고리</label>
                    <p><select id="category" name="category">
                        <option value="정보 공유">정보 공유</option>
                        <option value="산책 메이트">산책 메이트</option>
                    </select></p>
                </div>
                <div class="row">
                    <label for="content">내용</label>
                    <p><textarea id="content" name="content" maxlength="2000"></textarea></p>
                </div>
                <p><input type="submit" value="등록하기"></p>
                </form>
                </div>
          </body>
      </html>
      `;
  }
  
  function board_update_template(current,board_id, board_title, board_content, board_category) {
      return `
      <!doctype html>
      <html>
          <head>
              <title>update board</title>
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
            input[type="submit"], button {
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
              <meta charset="utf-8">
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
                        <li> <a href="/board" class="nav_selected">커뮤니티</a> </li>
                    </ul>

                    <ul class ="navbar_icons">
                        ${current}
                    </ul>
                </nav>
              <div class="container">
                <form action="/board/written/${board_id}/update_process/" method="post">
                <div class="row">
                    <label for="title">제목</label>
                    <p><input type"text" id="title" name="title" value="${board_title}" maxlength="200"></p>
                </div>
                <p>
                <div class="row">
                    <label for="category">카테고리</label>
                    <p><select id="category" name="category">
                        ${board_category}
                    </select></p>
                </div>
                <div class="row">
                    <label for="content">내용</label>    
                    <p><textarea id="content" name="content" maxlength="2000">${board_content}</textarea></p>
                </div>
                <p><input type="submit" value="수정하기"></p>
                </form>
                </div>

          </body>
      </html>
      `;
  }
  
  app.get('/', function(req, res) {
      var board_list = ``;
      var current=``;
            if(req.session.user_id){
                var id=req.session.user_id;
                current=`<li> <a href="/logout">로그아웃</a> </li>
                <li> <a href="/mypage">${id}--마이페이지</a> </li>`
                console.log(id)
            }
            else{
                current=`<li> <a href="/login">로그인</a> </li>
                <li> <a href="/signup">회원가입</a> </li>`
            }
            if (req.session.user_id) {
                db.query(`SELECT * FROM board ORDER BY date DESC`, function(error, boards) {
                if (Object.keys(boards).length > 0) {
                    for (var i = 0; i < Object.keys(boards).length; i++) {
                        const qdate = String(boards[i].date).split(" ");
                        var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];
                        board_list += `
                               <div class="board_row">
                                    <a id="underline" href="/board/written/${boards[i].board_number}">[ ${boards[i].category} ] ${boards[i].title}</a>
                                    <div class="auth_date_row">
                                        <p class="user_id">${boards[i].user_id}<p>
                                        <p>${formating_qdate}</p>
                                    </div>
                                </div>
                                <hr/>
                            `;
                    }
                } else {
                    board_list = '0개의 게시물이 있습니다.';
                }
                    res.end(main_template(current,board_list));
                });
            }
            else {
                res.send('<script type="text/javascript">alert("로그인이 필요한 서비스입니다.");location.href="/login";</script>')
            }
  });
  
  app.get('/write/', function(req, res) {
    var current=``;
    if(req.session.user_id){
        var id=req.session.user_id;
        current=`<li> <a href="/logout">로그아웃</a> </li>
        <li> <a href="/mypage">${id}--마이페이지</a> </li>`
        console.log(id)
    }
    else{
        current=`<li> <a href="/login">로그인</a> </li>
        <li> <a href="/signup">회원가입</a> </li>`
    }
    if(req.session.loggedin) {
        res.end(board_template(current));
    }
    else {
        res.send('<script type="text/javascript">alert("로그인이 필요한 서비스입니다.");location.href="/login";</script>');
    }

  })
  
  app.post('/write/', function(req, res) {
      const body = req.body;
      const title = body.title;
      const content = body.content;
      const category = body.category;
      const user = req.session.user_id;

      if(title === '' || content === '' || category === '') {
        res.send('<script type="text/javascript">alert("모든 정보를 입력해주세요."); document.location.href="/board/write";</script>');
      }
      else {
        db.query(`INSERT INTO board (user_id, title, content, category) VALUES(?, ?, ?, ?)`,
        [user, title, content, category],
        function(error, result) {
          if (error) {
              res.send(error);
              throw error;
          }
          res.redirect('/board');
        })
    }
  })
  
  app.get('/written/:board_id', function(req, res) {
      const board_id = req.params.board_id;
      var comments_list = ``;
      var current=``;
      if(req.session.user_id){
          var id=req.session.user_id;
          current=`<li> <a href="/logout">로그아웃</a> </li>
          <li> <a href="/mypage">${id}--마이페이지</a> </li>`
          console.log(id)
      }
      else{
          current=`<li> <a href="/login">로그인</a> </li>
          <li> <a href="/signup">회원가입</a> </li>`
      }
      if (board_id) {
          db.query(`SELECT * FROM board WHERE board_number = ?`, 
          [board_id],
          function(err1, board) {
              if (err1) {
                  res.end(err1);
                  throw err1;
              }
  
              db.query(`SELECT * FROM board_comment WHERE board_number = ?`,
              [board_id],
              function(err2, comments) {
                  if (err2) {
                      res.send(err2);
                      throw err2;
                  }
  
                  for (var i = 0; i < Object.keys(comments).length; i++) {
                      const adate = String(comments[i].date).split(" ");
                      var formating_adate = adate[3] + "-" + adate[1] + "-" + adate[2] + "-" + adate[4];
  
                      if (req.session.user_id === comments[i].user_id) {
                          comments_list += `
                            <p id="comment_user_id">${comments[i].user_id}</p>
                            <hr id="comment_hr"/>
                            <div class="comment_date">
                                <p>${formating_adate}</p> </span>
                            </div>
                            <p>${comments[i].content}</p>
                            <div class="auth_btn">
                                <form action="/board/written/${comments[i].comment_number}/board_comment_delete/" method="post">
                                    <input type="hidden" name="comment_number" value="${comments[i].comment_number}">
                                    <input type="hidden" name="board_number" value="${board_id}">
                                    <p><input id="delete_btn" type="submit" value="삭제"></p>
                                </form>
                            </div>
                                `;
                      } else {
                        comments_list += `
                        <p id="comment_user_id">${comments[i].user_id}</p>
                        <hr id="comment_hr"/>
                        <div class="comment_date">
                            <p>${formating_adate}</p> </span>
                        </div>
                        <p>${comments[i].content}</p>
                        `;
                      }
                  }
  
                  const qdate = String(board[0].date).split(" ");
                  var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];
  
                  let auth_btn = ``;
                  if (req.session.user_id === board[0].user_id) {
                      auth_btn = `
                        <p><input type="submit" value="수정" onClick="location.href='/board/written/${board_id}/update/'"></p>
                        <p><input type="submit" value="삭제" id="delete_btn" onClick="location.href='/board/written/${board_id}/delete/'"></p>   
                      `
                  }
  
                  res.send(detail_template(current,board_id, board[0].title, board[0].content, board[0].user_id, formating_qdate, board[0].category, comments_list, auth_btn));
              })
          })
      }
  })

  app.get('/search/', function(req, res) {
        const b_keyword = req.query.search_title;
        var board_list = ``;
        var current=``;
        if(req.session.user_id){
            var id=req.session.user_id;
            current=`<li> <a href="/logout">로그아웃</a> </li>
            <li> <a href="/mypage">${id}--마이페이지</a> </li>`
            console.log(id)
        }
        else{
            current=`<li> <a href="/login">로그인</a> </li>
            <li> <a href="/signup">회원가입</a> </li>`
        }
        console.log(b_keyword);
        if(b_keyword) {
        db.query(`SELECT * FROM board WHERE title LIKE ? ORDER BY date DESC`, 
        ['%'+b_keyword+'%'],function(err, boards) {
            if (err) {
                res.send(err);
                throw err;
            }
        
            if (Object.keys(boards).length > 0) {
                for (var i = 0; i < Object.keys(boards).length; i++) {
                    const qdate = String(boards[0].date).split(" ");
                    var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];

                    board_list += `
                        <div class="board_row">
                            <a id="underline" href="/board/written/${boards[i].board_number}">[ ${boards[i].category} ] ${boards[i].title}</a>
                            <div class="auth_date_row">
                                <p class="user_id">${boards[i].user_id}<p>
                                <p>${formating_qdate}</p>
                            </div>
                        </div>
                        <hr/>
                        `;
                }
            } else {
                board_list = `<p> 검색 결과가 없습니다. </p>`
                    
            }
        
            res.send(main_template(current,board_list));
        })
        }
        else {
            res.send('<script type="text/javascript">alert("검색어를 입력해주세요.");location.href="/board";</script>')
        }
  });
  
  app.post('/write_comment/', function(req, res) {
      const body = req.body;
      const board_id = body.board_id;
      const content1 = body.content;
      const user1 = req.session.user_id;
      
      if (req.session.user_id) {
        if(content1 === '') {
            res.send(`<script type="text/javascript">alert("모든 정보를 입력해주세요."); document.location.href="/board/written/${board_id}";</script>`);     
        }
        else {
            db.query(`INSERT INTO board_comment (user_id, content, board_number) VALUES (?, ?, ?)`,
            [user1, content1, board_id],
            function(error, comments) {
                if (error) {
                    res.send(error);
                    throw error;
                }
                console.log(comments);
                res.redirect(`/board/written/${board_id}`);
            })
        }
      } else {
        res.send('<script type="text/javascript">alert("로그인이 필요한 서비스입니다.");location.href="/login";</script>')
    }
  });
  
  app.get('/written/:board_id/update/', function(req, res) {
      const board_id = req.params.board_id;
      const category = ['정보 공유', '산책 메이트'];
      let category_list = '';

      console.log(board_id);
      var current=``;
      if(req.session.user_id){
          var id=req.session.user_id;
          current=`<li> <a href="/logout">로그아웃</a> </li>
          <li> <a href="/mypage">${id}--마이페이지</a> </li>`
          console.log(id)
      }
      else{
          current=`<li> <a href="/login">로그인</a> </li>
          <li> <a href="/signup">회원가입</a> </li>`
      }
        db.query(`SELECT * FROM board WHERE board_number = ?`,
        [board_id],
        function(err, board) {
          if (err) {
              res.send(err);
              throw err;
          }
          for (let i = 0; i <category.length; i++) {
              let selected = '';
              if (category[i] === board[0].category) selected = 'selected';
              category_list += `<option value="${category[i]}" ${selected}>${category[i]}</option>`
          }
          res.send(board_update_template(current,board_id, board[0].title, board[0].content, category_list));
        })
  });
  
  app.post('/written/:board_id/update_process/', function(req, res) {
      const board_id = req.params.board_id;
  
      const body = req.body;
      const title = body.title;
      const content = body.content;
      const category = body.category;
  
      if(title === '' || content === '' || category === '') {
          res.send(`<script type="text/javascript">alert("모든 정보를 입력해주세요."); document.location.href="/board/written/${board_id}/update";</script>`);
      }
      else {
        db.query(`UPDATE board SET title=?, content=?, category=? WHERE board_number = ?`,
        [title, content, category, board_id],
        function(err, board) {
          if(err) {
              res.send(err);
              throw err;
          }
          console.log(board);
          res.redirect(`/board/written/${board_id}/`);
      })
    }
  });
  
  app.get('/written/:board_id/delete/', function(req, res) {
      const board_id = req.params.board_id;
  
      db.query(`DELETE FROM board WHERE board_number = ?`,
      [board_id],
      function(err, result) {
          if (err) {
              res.send(err);
              throw err;
          }
  
          res.redirect('/board/');
      });
  });
  
  app.post('/written/:comment_id/board_comment_delete', function(req, res) {
    const body = req.body;  
    const comment_number = body.comment_number;
    const board_number = body.board_number;
  
      db.query(`DELETE FROM board_comment WHERE comment_number = ?`,
      [comment_number],
      function(err, result) {
          if (err) {
              res.send(err);
              throw err;
          }
          res.redirect(`/board/written/${board_number}/`);
      });
  });
  
  module.exports = app;