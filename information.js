const response = require('express');
const express = require('express');
const app = express.Router();
const url = require('url');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');


function main_template(current, type_list) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>information</title>
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
                width: 800px; 
                position: absolute;
            }
            #underline {
                color: black;
                text-decoration: none;
                width: 40%;
                align-self: center;
            }
            #underline:hover {
                border-bottom: 3px solid blue;
                width: auto;
            }
            p {
                display: flex;
                flex: 1;
                margin: 25px 0px;
            }
            .row {
                flex: 1;
                display: flex;
                max-width: 500px;
                width: 100%;
                align: center;
            }
            hr {
                margin: 0px;
                max-width: 800px;
                width: 100%;
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
                <li> <a href="/information"  class="nav_selected">기본 정보</a> </li>
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
        <hr/>
        <div class="container" text-align="center">
        ${type_list}
        </div>
        </body>
    </html>
    `;
}


function information_template(current,feedtimes, foodtype, vaccine, bathtimes, warning) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>information detail</title>
            <title>information</title>
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
                    <li> <a href="/information"  class="nav_selected">기본 정보</a> </li>
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
            <h3> 먹이 횟수  </h3>
            <p> 하루에 ${feedtimes} 번 </p>
            <h3> 먹이 종류 </h3>
            ${foodtype}
            <h3> 예방 접종 </h3>
            ${vaccine}
            <h3> 목욕 횟수 </h3>
            ${bathtimes}
            <h3> 주의 사항  </h3>
            ${warning}
        </body>
    </html>
    `;
}





app.get('/', function(req, res) {
    var type_list=``;
    var current=``;
    if(req.session.user_id){//로그인 한 경우
        var id=req.session.user_id;
        current=`<li> <a href="/logout">로그아웃</a> </li>
        <li> <a href="/mypage">${id}--마이페이지</a> </li>`
        console.log(id)
    }
    else{
        current=`<li> <a href="/login">로그인</a> </li>
        <li> <a href="/signup">회원가입</a> </li>`
    }
    db.query(`SELECT * FROM information `,
    function(err,informations){
        if (err) throw err;
        else{
            for (var i=0; i<Object.values(informations).length;i++){
                type_list+=`
                    <div class="row">
                    <p><a id="underline" href="/information/type/?id=${informations[i].id}">${informations[i].type}</a></p>
                    </div>
                    <hr/>
                `;
            }
            res.end(main_template(current, type_list));
        }
        
    });
    
    
});


app.get('/type/', function(req, res) {
    const information_id = url.parse(req.url, true).query.id;
    var current=``;
    if(req.session.user_id){//로그인 한 경우
        var id=req.session.user_id;
        current=`<li> <a href="/logout">로그아웃</a> </li>
        <li> <a href="/mypage">${id}--마이페이지</a> </li>`
        console.log(id)
    }
    else{
        current=`<li> <a href="/login">로그인</a> </li>
        <li> <a href="/signup">회원가입</a> </li>`
    }
    if (information_id) {
        db.query(`SELECT * FROM information WHERE id = ?`, 
        [information_id],
        function(error, information) {
            if (error) {
                throw error;
            }
            console.log(information);
            res.end(information_template(current, information[0].feedtimes, information[0].foodtype, information[0].vaccine, information[0].bathtimes,information[0].warning));
        })
    }
})

module.exports = app;