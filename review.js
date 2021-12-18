const express = require('express');
const app = express.Router();
const fs = require('fs');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false }));

const db = require('./db');

const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, './upload/review_img');
        },
        filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        }
    })
});


function main_template(review_list, search_title) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
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
                .review_row {
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
                label {
                    align-self: center;
                    width: 20%;
                    font-size: 15px;
                }
                a {
                    color: black;
                    text-decoration: none;
                    align-self: center;
                    width: 20%;
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
                #search_title {
                    width: 80%;
                    padding: 10px;
                    margin: 3px 0 0 0;
                    display: inline-block;
                    border: 1px solid #000000;
                    border-radius: 10px;
                    background: none;
                }
                .review_list {
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
        <div class="container">
            <h1>Review</h1>
            <form class="row" action="/review/search?title=${search_title}">
                <label for="search_title">리뷰 검색</label>
                <input type="text" id="search_title" name="search_title" placeholder="검색어를 입력하세요.">
                <input type="submit" value="검색">
            </form>
            <button type="button" onclick="location.href='/review/write_review/'">리뷰 작성하기</button>
            <div class="review_list">
                <p id="list_txt">글 목록</p>
                ${review_list}
            </div>
        </div>
        </body>
    </html>
    `
}

function review_detail_template(review_number, title, content, date, price, product_name, brand, category, photo, user_id, comment_list, auth_btn) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
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
                .title_row {
                    flex-direction: row;
                    justify-content: space-between;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .review {
                    flex-direction: column;
                    flex: 1;
                    display: flex;
                    padding: 10px 10px 10px 10px;
                    background: rgba(196, 196, 196, 0.15);
                    box-shadow: 3px 3px 3px #b0b0b0;
                    max-width: 800px;
                    width: 100%;
                }
                .comment {
                    flex-direction: column;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .write_comment {
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
                .info_row {
                    flex-direction: row;
                    justify-content: space-between;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .auth_btn {
                    flex-direction: row;
                    justify-content: flex-start;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .category_price {
                    flex-direction: column;
                    justify-content: space-between;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .name_brand {
                    flex-direction: column;
                    justify-content: space-between;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                p {
                    margin: 5px 0px;
                }
                img {
                    width: 100%;
                    object-fit: cover;
                }
                hr {
                    width: 100%;
                }
                #title, #user {
                    margin: 0;
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
        <div class="container">
            <div class="review">
                <div class="title_row">
                    <p id="title">${title}</p>
                    <p id="user">작성자: ${user_id}</p>
                </div>
                <hr/>
                <p id="date">${date}</p>
                <div class="info_row">
                    <div class="category_price">
                    <p>카테고리: ${category}</p>
                    <p>가격: ${price}</p>
                    </div>
                    <div class="name_brand">
                    <p>상품명: ${product_name}</p>
                    <p>브랜드명: ${brand}</p>
                    </div>
                </div>
                <p id="content">${content}</p>
                <p><img src="${photo}"></p>
                <div class="auth_btn">
                    ${auth_btn}
                </div>
            </div>
            <div class="comment">
                <form action="/review/write_comment/" method="post">
                    <input type="hidden" name="review_number" value="${review_number}"">
                    <div class="write_comment">
                        <textarea name="comment"></textarea>
                        <input type="submit" id="write_comment_btn" value="댓글 달기">
                    </div>
                </form>
                <div class="comment_list">
                    ${comment_list}
                </div>
            </div>
        </div>
        </body>
    </html>
    `
}

function review_detail_no_photo_template(review_number, title, content, date, price, product_name, brand, category, user_id, comment_list, auth_btn) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
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
                .title_row {
                    flex-direction: row;
                    justify-content: space-between;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .review {
                    flex-direction: column;
                    flex: 1;
                    display: flex;
                    padding: 10px 10px 10px 10px;
                    background: rgba(196, 196, 196, 0.15);
                    box-shadow: 3px 3px 3px #b0b0b0;
                    max-width: 780px;
                    width: 100%;
                }
                .comment {
                    flex-direction: column;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .write_comment {
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
                .info_row {
                    flex-direction: row;
                    justify-content: space-between;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .auth_btn {
                    flex-direction: row;
                    justify-content: flex-start;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .category_price {
                    flex-direction: column;
                    justify-content: space-between;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                .name_brand {
                    flex-direction: column;
                    justify-content: space-between;
                    flex: 1;
                    display: flex;
                    max-width: 800px;
                    width: 100%;
                }
                p {
                    margin: 5px 0px;
                }
                img {
                    width: 100%;
                    object-fit: cover;
                }
                hr {
                    width: 100%;
                }
                #title, #user {
                    margin: 0;
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
        <div class="container">
            <div class="review">
                <div class="title_row">
                    <p id="title">${title}</p>
                    <p id="user">작성자: ${user_id}</p>
                </div>
                <hr/>
                <p id="date">${date}</p>
                <div class="info_row">
                    <div class="category_price">
                    <p>카테고리: ${category}</p>
                    <p>가격: ${price}</p>
                    </div>
                    <div class="name_brand">
                    <p>상품명: ${product_name}</p>
                    <p>브랜드명: ${brand}</p>
                    </div>
                </div>
                <p id="content">${content}</p>
                <div class="auth_btn">
                    ${auth_btn}
                </div>
            </div>
            <div class="comment">
                <form action="/review/write_comment/" method="post">
                    <input type="hidden" name="review_number" value="${review_number}"">
                    <div class="write_comment">
                        <textarea name="comment"></textarea>
                        <input type="submit" id="write_comment_btn" value="댓글 달기">
                    </div>
                </form>
                <div class="comment_list">
                    ${comment_list}
                </div>
            </div>
        </div>
        </body>
    </html>
    `
}

function review_create_template() {
    return `
    <!doctype html>
    <html>
        <head>
            <title>리뷰 작성하기</title>
            <meta charset="utf-8">
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
                input[type=text], #photo, #title {
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
            <div class="container">
            <form action="/review/write_review/" method="post" enctype="multipart/form-data">
                <div class="row">
                    <label for="title">제목</label>
                    <p><input type"text" name="title" id="title" placeholder="제목"></p>
                </div>
                <div class="row">
                    <label for="category">종</label>
                    <p><select id="category" name="category">
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
                    <label for="price">가격</label>
                    <p><input type="text" id="price" oninput="this.value=this.value.replace(/[^0-9]/g,'');" name="price" placeholder="가격" onkeyup="numberWithCommas(this.vale)"></p>
                </div>
                <div class="row">
                    <label for="product_name">제품명</label>
                    <p><input type="text" id="product_name" name="product_name" placeholder="제품명"></p>
                </div>
                <div class="row">
                    <label for="brand">브랜드명</label>
                    <p><input type="text" id="brand" name="brand" placeholder="브랜드명"></p>
                </div>
                <div class="row">
                    <label for="content">내용</label>
                    <p><textarea id="content" name="content"></textarea></p>
                </div>
                <div class="row">
                    <label for="photo">사진</label>
                    <p><input type="file" id="photo" name="photo"></p>
                </div>
                <p><input type="submit" value="리뷰 등록하기"></p>
            </form>
        </body>
        </div>
    </html>
    `;
}

function review_update_template(review_id, title, category, content, price, product_name, brand, photo) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>리뷰 작성하기</title>
            <meta charset="utf-8">
            <script>
                function remove_img() {
                    var photo = document.getElementById('photo');
                    photo_src = photo.src;

                    var input = document.createElement('input');
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", "photo_delete");
                    input.setAttribute("value", photo_src);

                    document.getElementById('update_review').appendChild(input);
                    photo.remove();
                }

                function photo_src() {
                    var photo = document.getElementById('photo');
                    photo = photo.src;

                    var photo_src = document.createElement('input');
                    photo_src.setAttribute("type", "hidden");
                    photo_src.setAttribute("name", "img_src");
                    photo_src.setAttribute("value", photo);

                    document.getElementById('update_review').appendChild(photo_src);
                }
            </script>
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
                input[type=text], #title, input[type="file"] {
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
                img {
                    width: 100%;
                    object-fit: cover;
                }
            </style>
        </head>
        <body>
            <div class="container">
            <form action="/review/${review_id}/update_process/" method="post" enctype="multipart/form-data" id="update_review" onclick="photo_src()">
                <div class="row">
                    <label for="title">제목</label>
                    <p><input type"text" id="title" name="title" value="${title}"></p>
                </div>
                <p>
                <div class="row">
                    <label for="category">종</label>
                    <p><select id="category" name="category">
                    ${category}
                    </select></p>
                </div>
                <div class="row">
                    <label for="price">가격</label>
                    <p><input type="text" id="price" oninput="this.value=this.value.replace(/[^0-9]/g,'');" name="price" value="${price}"></p>
                </div>
                <div class="row">
                    <label for="product_name">제품명</label>
                    <p><input type="text" id="product_name" name="product_name" value="${product_name}"></p>
                </div>
                <div class="row">
                    <label for="brand">브랜드명</label>
                    <p><input type="text" id="brand" name="brand" value="${brand}"></p>
                </div>
                <div class="row">
                    <label for="content">내용</label>    
                    <p><textarea id="content" name="content">${content}</textarea></p>
                </div>
                <p><img src="${photo}" id="photo"></p>
                <p><button type="button" onclick="remove_img()">사진 지우기</button></p>
                <div class="row">
                    <label for="photo_new">사진</label>
                    <p><input type="file" id="photo_new" name="photo"></p>
                </div>
                <p><input type="submit" value="리뷰 수정하기"></p>
            </form>
            </div>
        </body>
    </html>
    `;
}

function review_update_no_photo_template(review_id, title, category, content, price, product_name, brand) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>리뷰 작성하기</title>
            <meta charset="utf-8">
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
                input[type=text], #title, input[type="file"] {
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
        </head>
        <body>
            <div class="container">
            <form action="/review/${review_id}/update_process/" method="post" enctype="multipart/form-data" id="update_review" onclick="photo_src()">
                <div class="row">
                    <label for="title">제목</label>
                    <p><input type"text" id="title" name="title" value="${title}"></p>
                </div>
                <p>
                <div class="row">
                    <label for="category">종</label>
                    <p><select id="category" name="category">
                    ${category}
                    </select></p>
                </div>
                <div class="row">
                    <label for="price">가격</label>
                    <p><input type="text" id="price" oninput="this.value=this.value.replace(/[^0-9]/g,'');" name="price" value="${price}"></p>
                </div>
                <div class="row">
                    <label for="product_name">제품명</label>
                    <p><input type="text" id="product_name" name="product_name" value="${product_name}"></p>
                </div>
                <div class="row">
                    <label for="brand">브랜드명</label>
                    <p><input type="text" id="brand" name="brand" value="${brand}"></p>
                </div>
                <div class="row">
                    <label for="content">내용</label>    
                    <p><textarea id="content" name="content">${content}</textarea></p>
                </div>
                <div class="row">
                    <label for="photo_new">사진</label>
                    <p><input type="file" id="photo_new" name="photo"></p>
                </div>
                <p><input type="submit" value="리뷰 수정하기"></p>
            </form>
            </div>
        </body>
    </html>
    `;
}

app.get('/', function(req, res) {
    var review_list = '';
    
    db.query(`SELECT * FROM review ORDER BY date DESC`,
    function(error, reviews) {
        if (error) {
            res.send(error);
            throw error;
        }
        for (var i = 0; i < reviews.length; i++) {
            const rdate = String(reviews[i].date).split(" ");
            var formating_rdate = rdate[3] + "-" + rdate[1] + "-" + rdate[2] + "-" + rdate[4];
            review_list += 
                `<div class="review_row">
                    <a href="/review/${reviews[i].review_number}">${reviews[i].title}</a>
                    <div class="auth_date_row">
                        <p class="user_id">${reviews[i].user_id}<p>
                        <p>${formating_rdate}</p>
                    </div>
                </div>
                <hr/>
                `;
        }
        res.send(main_template(review_list));
    })
})

app.get('/search', function(req, res) {
    const keyword = req.query.search_title;
    var review_list = ``;

    if (keyword) {
    db.query(`SELECT * FROM review WHERE title LIKE ? ORDER BY date DESC`,
    ['%' + keyword + '%'],
    function(err, reviews) {
        if (err) {
            res.send(err);
            throw err;
        }

        if (reviews.length > 0) {
            for (var i = 0; i < reviews.length; i++) {
                const rdate = String(reviews[i].date).split(" ");
                var formating_rdate = rdate[3] + "-" + rdate[1] + "-" + rdate[2] + "-" + rdate[4];
                review_list += 
                    `<div class="review_row">
                        <a href="/review/${reviews[i].review_number}">${reviews[i].title}</a>
                        <div class="auth_date_row">
                            <p class="user_id">${reviews[i].user_id}<p>
                            <p>${formating_rdate}</p>
                        </div>
                    </div>
                    <hr/>
                    `;
            }
        } else {
            reivew_list = `<p> 검색 결과가 없습니다. </p>`;
        }

        res.send(main_template(review_list));
    })
    }
    else {
        res.send('<script type="text/javascript">alert("검색어를 입력해주세요.");location.href="/review";</script>')
    }
})

app.get('/write_review/', function(req, res) {
    const user_login = req.session.loggedin;
    if (user_login) {
        res.send(review_create_template());
    } else {
        res.send('<script type="text/javascript">alert("로그인이 필요한 서비스입니다.");location.href="/login";</script>')
    }
})

app.post('/write_review/', upload.single('photo'), function(req, res) {
    const body = req.body;
    const user_id = req.session.user_id;
    const title = body.title;
    const content = body.content;
    const price = body.price;
    const product_name = body.product_name;
    const brand = body.brand;
    const category = body.category;
    let photo = undefined;
    if(req.file) {
        photo = req.file.path;
    } else {
        photo = null;
    }

    console.log(body);
    if (title === '' || content === '' || price === '' || product_name === '' || brand === '' || category === '') {
        res.send('<script type="text/javascript">alert("모든 정보를 입력해주세요."); document.location.href="/review/write_review";</script>');
    } else {
        db.query(`INSERT INTO review (user_id, title, content, price, product_name, brand, category, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, title, content, price, product_name, brand, category, photo],
        function(error, result) {
            if(error) {
                res.send(error);
                throw error;
            }
            console.log(result);
            console.log(req.file);
            res.redirect(`/review/${result.insertId}`);
        });
    }
})

app.get('/update/:review_id/', function(req, res) {
    const review_id = req.params.review_id;
    const category = ['개', '고양이', '토끼', '햄스터', '앵무새', '기니피그', '패럿', '고슴도치', '기타'];
    let category_list = '';

    db.query(`SELECT * FROM review WHERE review_number = ?`,
    [review_id],
    function (err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
        
        const review = result[0];
        for (let i = 0; i < category.length; i++) {
            let selected = '';
            if (category[i] === review.category) selected = 'selected';
            category_list += `<option value="${category[i]}" ${selected}>${category[i]}</option>`
        }

        if (review.photo) {
            let photo = review.photo.toString('utf8')
            photo = photo.replace('upload/', '/')
            console.log(photo);
            res.send(review_update_template(review_id, review.title, category_list, review.content, review.price, review.product_name, review.brand, photo))
        } else {
            res.send(review_update_no_photo_template(review_id, review.title, category_list, review.content, review.price, review.product_name, review.brand))
        }
    })
})

app.post('/:review_id/update_process', upload.single('photo'), function(req, res) {
    const review_id = req.params.review_id;
    const body = req.body;
    const title = body.title;
    const category = body.category;
    const content = body.content;
    const price = body.price;
    const product_name = body.product_name;
    const brand = body.brand;
    let photo = undefined;

    if(body.photo_delete) {
        photo_path = body.photo_delete;
        if (Array.isArray(photo_path)) photo_path = photo_path[0];
        console.log(photo_path);
        photo_path = photo_path.split('/');
        photo_path = './upload/' + photo_path[photo_path.length - 2] + '/' + photo_path[photo_path.length - 1];
        console.log(photo_path);
        fs.unlinkSync(decodeURI(photo_path));

        if(req.file) {
            photo = req.file.path;
        } else {
            photo = null;
        }
    } else {
        if (req.file) {
            if (!body.photo_delete && body.img_src) {
                res.send("<script>alert('사진을 먼저 지워주세요.');</script>")
            }
            photo = req.file.path;
        } else {
            db.query(`UPDATE review SET title=?, category=?, content=?, price=?, product_name=?, brand=? WHERE review_number=?`,
            [title, category, content, price, product_name, brand, review_id],
            function(err, result) {
                if (err) {
                    res.send(err);
                    throw err;
                }
                console.log(result);
                res.redirect(`/review/${review_id}`);
            })
            return;

            // if (body.img_src) {
            //     photo = body.img_src;
            //     if (Array.isArray(photo)) photo = photo[0];
            //     console.log(photo);
            //     photo = photo.split('/');
            //     photo = '/upload/' + photo[photo.length - 2] + '/' + photo[photo.length - 1];
            //     console.log(photo);
            // } else {
            //     photo = null;
            // }
            
        }
    }

    console.log(body);

    // let photo_path = body.img_src;
    // console.log(photo_path);
    // photo_path = photo_path.split('/');
    // photo_path = './upload/' + photo_path[photo_path.length - 2] + '/' + photo_path[photo_path.length - 1];
    // console.log(photo_path);

    db.query(`UPDATE review SET title=?, category=?, content=?, price=?, product_name=?, brand=?, photo=? WHERE review_number=?`,
    [title, category, content, price, product_name, brand, photo, review_id],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
            }
        console.log(result);
        res.redirect(`/review/${review_id}`);
    })
})

app.post('/delete', function(req, res) {
    const body = req.body;
    const review_id = body.review_number;

    db.query(`SELECT photo FROM review WHERE review_number=?`,
    [review_id],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }

        const photo = result[0].photo;
        console.log(photo);

        db.query(`DELETE FROM review WHERE review_number=?`,
        [review_id],
        function(err2, result) {
            if (err2) {
                res.send(err2);
                throw err2;
            }
            if (photo) {
                fs.unlinkSync('./' + photo);
            }
            res.redirect('/review');
        })
    })
})

app.get('/:review_id', function(req, res) {
    const review_id = req.params.review_id;
    let comment_list = ``;

    db.query(`SELECT * FROM review WHERE review_number = ?`, 
    [review_id],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
        db.query(`SELECT * FROM review_comment WHERE review_number = ? ORDER BY date DESC`,
        [review_id],
        function(err2, comments) {
            if (err2) {
                res.send(err2);
                throw err2;
            }
            const review = result[0];

            const rdate = String(review.date).split(" ");
            var formating_rdate = rdate[3] + "-" + rdate[1] + "-" + rdate[2] + "-" + rdate[4];

            for(var i = 0; i < comments.length; i++) {
                const cdate = String(comments[i].date).split(" ");
                var formating_cdate = cdate[3] + "-" + cdate[1] + "-" + cdate[2] + "-" + cdate[4];

                if (req.session.user_id === comments[i].user_id) {
                    comment_list += `
                        <p id="comment_user_id">${comments[i].user_id}</p>
                        <hr id="comment_hr"/>
                        <div class="comment_date">
                            <p>${formating_cdate}</p> </span>
                        </div>
                        <p>${comments[i].content}</p>
                        <div class="auth_btn">
                            <form action="/review/comment_update/${comments[i].review_comment_number}" method="post">
                                <input type="hidden" name="review_number" value="${review_id}">
                                <!--<p><input type="submit" value="수정"></p>-->
                            </form>
                            <form action="/review/comment_delete/" method="post">
                                <input type="hidden" name="comment_number" value="${comments[i].review_comment_number}">
                                <input type="hidden" name="review_number" value="${review_id}">
                                <p><input id="delete_btn" type="submit" value="삭제"></p>
                            </form>
                        </div>
                    `;
                } else {
                    comment_list += `
                    <p id="comment_user_id">${comments[i].user_id}</p>
                    <hr id="comment_hr"/>
                    <div class="comment_date">
                        <p>${formating_cdate}</p> </span>
                    </div>
                    <p>${comments[i].content}</p>
                    `;
                }
                
            }
            
            let auth_btn = ``;
            if (req.session.user_id === review.user_id) {
                auth_btn += `
                <p><input type="submit" value="수정" onClick="location.href='/review/update/${review_id}/'"></p>
                <form action="/review/delete/" method="post">
                    <input type="hidden" name="review_number" value="${review_id}">
                    <p><input type="submit" value="삭제" id="delete_btn"></p>    
                </form>
                `
            }

            if (review.photo !== null) {
                let photo = review.photo.toString('utf8')
                photo = photo.replace('upload/', '/')
                res.send(review_detail_template(review.review_number, review.title, review.content, formating_rdate, review.price, review.product_name, review.brand, review.category, photo, review.user_id, comment_list, auth_btn));
            } else {
                res.send(review_detail_no_photo_template(review.review_number, review.title, review.content, formating_rdate, review.price, review.product_name, review.brand, review.category, review.user_id, comment_list, auth_btn));
            }
        });
    })
})

app.post('/write_comment/', function(req, res) {
    const body = req.body;
    const review_number = body.review_number;
    const content = body.comment;
    const user_id = req.session.user_id;

    if (req.session.loggedin) {
        db.query(`INSERT INTO review_comment (review_number, content, user_id) VALUES (?, ?, ?)`,
        [review_number, content, user_id],
        function(err, comment) {
            if (err) {
                res.send(err);
                throw err;
            }
            console.log(comment);
            res.redirect(`/review/${review_number}`);
        });
    } else {
        res.send('<script type="text/javascript">alert("로그인이 필요한 서비스입니다.");location.href="/login";</script>')
    }
})

app.post('/comment_update/:comment_number', function(req, res) {
    const comment_number = req.params.comment_number;
    const body = req.body;
    const review_id = body.review_number;

    let comment_list = ``;

    db.query(`SELECT * FROM review WHERE review_number = ?`, 
    [review_id],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
        db.query(`SELECT * FROM review_comment WHERE review_number = ?`,
        [review_id],
        function(err2, comments) {
            if (err2) {
                res.send(err2);
                throw err2;
            }
            const review = result[0];

            const rdate = String(review.date).split(" ");
            var formating_rdate = rdate[3] + "-" + rdate[1] + "-" + rdate[2] + "-" + rdate[4];

            for(var i = 0; i < comments.length; i++) {
                const cdate = String(comments[i].date).split(" ");
                var formating_cdate = cdate[3] + "-" + cdate[1] + "-" + cdate[2] + "-" + cdate[4];

                if (req.session.user_id === comments[i].user_id) {
                    if (comment_number == comments[i].review_comment_number) {
                        comment_list += `
                            <form action="/review/comment_update_process" method="post">
                                <input type="hidden" name="comment_number" value="${comment_number}">
                                <input type="hidden" name="review_number" value="${review_id}">
                                <p><textarea name="content">${comments[i].content}</textarea></p>
                                <p><input type="submit" value="수정완료"></p>
                            </form>
                        `;
                    } else {
                        comment_list += `
                        <p>${comments[i].content}</p>
                        <p>${comments[i].user_id}</p>
                        <p>${formating_cdate}</p>\
                        `;
                    }
                } else {
                    comment_list += `
                        <p>${comments[i].content}</p>
                        <p>${comments[i].user_id}</p>
                        <p>${formating_cdate}</p>
                    `;
                }
            }
            
            // let auth_btn = ``;
            // if (req.session.user_id === review.user_id) {
            //     auth_btn += `
            //     <p><input type="submit" value="수정" onClick="location.href='/review/update/${review_id}/'"></p>
            //     <form action="/review/delete/" method="post">
            //         <input type="hidden" name="review_number" value="${review_id}">
            //         <p><input type="submit" value="삭제"></p>    
            //     </form>
            //     `
            // }

            if (review.photo !== null) {
                let photo = review.photo.toString('utf8')
                photo = photo.replace('upload/', '/')
                res.send(review_detail_template(review.review_number, review.title, review.content, formating_rdate, review.price, review.product_name, review.brand, review.category, photo, review.user_id, comment_list, ``));
            } else {
                res.send(review_detail_no_photo_template(review.review_number, review.title, review.content, formating_rdate, review.price, review.product_name, review.brand, review.category, review.user_id, comment_list, ``));
            }
        });
    })
})

app.post('/comment_update_process', function(req, res) {
    const body = req.body;
    const comment_number = body.comment_number;
    const review_number = body.review_number;
    const content = body.content;

    db.query(`UPDATE review_comment SET content=? WHERE review_comment_number=?`,
    [content, comment_number],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
        res.redirect(`/review/${review_number}`);
    })
})

app.post('/comment_delete', function(req, res){
    const body = req.body;
    const comment_number = body.comment_number;
    const review_number = body.review_number;

    db.query(`DELETE FROM review_comment WHERE review_comment_number=?`,
    [comment_number],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
        res.redirect(`/review/${review_number}`);
    })
})

// db.query(`SELECT * FROM review`, 
//     function(error, result) {
//         console.log(result[4].photo.toString('utf8'));
// })

module.exports = app;