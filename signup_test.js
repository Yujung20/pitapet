const { response } = require('express');
const express = require('express');
const app = express.Router();
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

const bcrypt = require('bcrypt');

var db = require('./db');

const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, './upload/expert');
        },
        filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        }
    })
});

function template(current,id_check_txt, check_id, email_check_txt, nickname_check_txt) { 
    return `
        <!doctype html>
        <html>
            <head>
                <title>test</title>
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
                <script>
                    window.onload = function() {
                        document.getElementById("id_save").value = getSavedValue("id_save");
                        document.getElementById("password_save").value = getSavedValue("password_save");
                        document.getElementById("password_check_save").value = getSavedValue("password_check_save");
                        document.getElementById("email_save").value = getSavedValue("email_save");
                        document.getElementById("nickname_save").value = getSavedValue("nickname_save");

                        document.getElementById("general_btn").classList = getSavedValue("general_btn");
                        if (!document.getElementById("general_btn").classList.contains('active')) document.getElementById("general_btn").classList.add('active');
                        document.getElementById("expert_btn").classList = getSavedValue("expert_btn")
                        if (document.getElementById("expert_btn").classList.contains('active')) {
                            if (document.getElementById("general_btn").classList.contains('active')) document.getElementById("general_btn").classList.remove('active');
                            var license_exist = document.getElementById("license");
                            if (!license_exist){
                                var license = document.createElement('input');
                                license.setAttribute("type", "file");
                                license.setAttribute("name", "license");
                                license.setAttribute("id", "license");
                                document.getElementById('signup_form').insertBefore(license, document.getElementById('signup_form').children[15]);

                                var license_label = document.createElement('label');
                                license_label.setAttribute("for", "license");
                                license_label.setAttribute("id", "license_label");
                                license_label.innerHTML = "증명서 첨부";
                                document.getElementById('signup_form').insertBefore(license_label, document.getElementById('signup_form').children[15]);
                            }
                        }
                    }

                    function saveValue(e) {
                        var id = e.id;
                        var val = e.value;
                        sessionStorage.setItem(id, val);
                    }

                    function getSavedValue(v) {
                        return sessionStorage.getItem(v);
                    }

                    function clearStorage() {
                        sessionStorage.clear();

                        var expert = document.getElementById('expert_btn');
                        if (expert.classList.contains('active')) {
                            var is_normal = document.createElement('input');
                            is_normal.setAttribute('type', 'hidden');
                            is_normal.setAttribute('value', true);
                            is_normal.setAttribute('name', 'is_normal');
                            document.getElementById('signup_form').appendChild(is_normal);
                        }

                    }

                    function open_signup(e) {
                        if (e.id === 'general_btn') {
                            var expert = document.getElementById('expert_btn');
                            var license = document.getElementById("license");
                            var license_label = document.getElementById("license_label");
                            if (license) {
                                license.remove();
                                license_label.remove();
                            }
                            if (e.classList.contains('active')) {
                                e.classList.remove('active');
                            } else {
                                if (expert.classList.contains('active')) expert.classList.remove('active');
                                e.classList.add('active');
                            }

                            sessionStorage.setItem(e.id, e.classList);
                            sessionStorage.setItem('expert_btn', expert.classList);
                        } else {
                            var general = document.getElementById('general_btn');
                            if (e.classList.contains('active')) {
                                e.classList.remove('active');
                            } else {
                                if (general.classList.contains('active')) general.classList.remove('active');
                                e.classList.add('active');
                            }
                            var license_exist = document.getElementById("license");
                            if (!license_exist){
                                var license = document.createElement('input');
                                license.setAttribute("type", "file");
                                license.setAttribute("name", "license");
                                license.setAttribute("id", "license");

                                // document.getElementById('signup_form').appendChild(license);
                                document.getElementById('signup_form').insertBefore(license, document.getElementById('signup_form').children[15]);

                                var license_label = document.createElement('label');
                                license_label.setAttribute("for", "license");
                                license_label.setAttribute("id", "license_label");
                                license_label.innerHTML = "증명서 첨부";
                                document.getElementById('signup_form').insertBefore(license_label, document.getElementById('signup_form').children[15]);
                            }

                            sessionStorage.setItem(e.id, e.classList);
                            sessionStorage.setItem('general_btn', general.classList);
                        }
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
                    label {
                        align-self: start;
                    }
                    #license_label {
                        margin-top: 10px;
                        margin-right: 10px;
                        font-size: 15px;
                    }
                    p {
                        margin: 10px 0px 0px 0px;
                    }
                    .row {
                        flex-direction: row;
                        justify-content: space-between;
                        flex: 1;
                        display: flex;
                    }
                    input[type=text], input[type=password], input[type="email"] {
                        width: 100%;
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
                        padding: 10px 0px 10px 0px;
                        margin: 3px 0 0 5px;
                        border: none;
                        cursor: pointer;
                        width: 80%;
                        opacity: 0.9;
                        border-radius: 10px;
                        box-shadow: 3px 3px 3px #b0b0b0;
                    }
                    #submit_btn {
                        width: 100%;
                        margin: 3px 0 0 0px;
                    }
                    #id_check_txt, #email_check_txt, #nickname_check_txt {
                        font-size: 15px;
                        color: #0066FF; 
                    }
                    #password_save, #password_check_save {
                        max-width: 500px;
                    }

                    .tab {
                        overflow: hidden;
                        background-color: #C4D6F2;
                        max-width: 500px;
                        width: 100%;
                        box-shadow: 3px 3px 3px #b0b0b0;
                      }
                      .tab button {
                        background-color: inherit;
                        float: left;
                        border: none;
                        outline: none;
                        cursor: pointer;
                        padding: 14px 16px;
                        transition: 0.3s;
                        width: 50%;
                      }
                      .tab button:hover {
                        background-color: #0066FF;
                        color: white;
                      }
                      .tab button.active {
                        background-color: #0066FF;
                        color: white;
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
                <div class="tab">
                    <button id="general_btn" onclick="open_signup(this)">일반 회원</button>
                    <button id="expert_btn" onclick="open_signup(this)">전문가 회원</button>
                </div>
                <form id="signup_form" action="/signup/signup_process" enctype="multipart/form-data" method="post" style='max-width:500px; width: 100%'>
                        <p><label for="id_save">아이디</label></p>
                        <div class="row">
                            <input type="text" maxlength="15" name="id" placeholder="id" value="${check_id}" id="id_save" oninput='saveValue(this)' formaction="/signup/id_check" formaction="/signup/email_check"> 
                            <input type="submit" value="아이디 확인" formaction="/signup/id_check">
                        </div>
                        <p id="id_check_txt">${id_check_txt}</p>
                        <input type="hidden" name="id_check_txt" value="${id_check_txt}" formaction="/signup/email_check" formaction="/signup/nickname_check">
                        </p>
                        <div class="row>
                        <p><label for="password_save">비밀번호</label></p>
                        <p><input type="password" maxlength="8" name="pwd" placeholder="password" id="password_save" oninput='saveValue(this)'></p>
                        </div>
                        <p><label for="password_check_save">비밀번호 확인</label></p>
                        <p><input type="password" maxlength="8" name="pwd2" placeholder="password check" id="password_check_save" oninput='saveValue(this)'></p>
                        <p><label for="email_save">이메일</label></p>
                        <div class="row">
                        <input type="email" maxlength="30" name="email" placeholder="email" id="email_save" oninput='saveValue(this)' formaction="/signup/email_check"> 
                        <input type="submit" value="이메일 확인" formaction="/signup/email_check"></p>
                        </div>
                        <p id="email_check_txt">${email_check_txt}</p>
                        <input type="hidden" name="email_check_txt" value="${email_check_txt}" formaction="/signup/id_check" formaction="/signup/nickname_check">
                        <p><label for="nickname_save">닉네임</label></p>
                        <div class="row">
                        <input type="text" maxlength="10" name="nickname" placeholder="nickname" id="nickname_save" oninput='saveValue(this)'>
                        <input type="submit" value="닉네임 확인" formaction="/signup/nickname_check">
                        </div>
                        <p id="nickname_check_txt">${nickname_check_txt}</p>
                        <input type="hidden" name="nickname_check_txt" value="${nickname_check_txt}" formaction="/signup/id_check" formaction="/signup/email_check">
                        <p><input id="submit_btn" type="submit" onclick="clearStorage()" value="가입하기"></p>
                </form>
            </div>
            </body>
        </html>
    `;
}

app.get('/', function(request, response) {
    var current=``;
            if(request.session.user_id){//로그인 한 경우
                var uid=request.session.user_id;
                current=`<li> <a href="/logout">로그아웃</a> </li>
                <li> <a href="/mypage">${uid}--마이페이지</a> </li>`
                console.log(uid)
            }
            else{
                current=`<li> <a href="/login">로그인</a> </li>
                <li> <a href="/signup">회원가입</a> </li>`
            }
    response.end(template(current,"아이디 중복을 확인하세요.", '', "이메일 중복을 확인하세요.", "닉네임 중복을 확인하세요."));
});

app.post('/id_check', upload.single('license'), function(request, response) {
    const post = request.body;
    const id = post.id;
    const email_check_txt = post.email_check_txt;
    const nickname_check_txt = post.nickname_check_txt;
    console.log(id);
    var current=``;
    if(request.session.user_id){//로그인 한 경우
        var uid=request.session.user_id;
        current=`<li> <a href="/logout">로그아웃</a> </li>
        <li> <a href="/mypage">${uid}--마이페이지</a> </li>`
        console.log(uid)
    }
    else{
        current=`<li> <a href="/login">로그인</a> </li>
        <li> <a href="/signup">회원가입</a> </li>`
    }
    var id_check_txt = "사용할 수 있는 아이디입니다."
    db.query(`SELECT * FROM user`, function(error, users) {
        if(error) {
            throw error;
        }

        for (var i = 0; i < Object.keys(users).length; i++) {
            if (id === users[i].id) {
                id_check_txt = "사용할 수 없는 아이디입니다."
                break;
            }
        }
        response.send(template(current,id_check_txt, id, email_check_txt, nickname_check_txt));
    })
});

app.post('/email_check', upload.single('license'), function(req, res) {
    const body = req.body;
    const id_check_txt = body.id_check_txt;
    const nickname_check_txt = body.nickname_check_txt;
    const email = body.email;
    const id = body.id;
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
    var email_check_txt = "사용할 수 있는 이메일입니다."
    db.query(`SELECT * FROM user`, function(err, result) {
        if (err) {
            throw err;
        }

        for (var i = 0; i < result.length; i++) {
            if (email === result[i].email) {
                email_check_txt = "사용할 수 없는 이메일입니다."
                break;
            }
        }
        res.send(template(current,id_check_txt, id, email_check_txt, nickname_check_txt));
    })
})

app.post('/nickname_check', upload.single('license'), function(req, res) {
    const body = req.body;
    const id_check_txt = body.id_check_txt;
    const email_check_txt = body.email_check_txt;
    const nickname = body.nickname;
    const id = body.id;
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
    var nickname_check_txt = "사용할 수 있는 닉네임입니다."
    db.query(`SELECT * FROM user`, function(err, result) {
        if (err) {
            throw err;
        }

        for (var i = 0; i < result.length; i++) {
            if (nickname === result[i].nickname) {
                nickname_check_txt = "사용할 수 없는 닉네임입니다."
                break;
            }
        }
        res.send(template(current,id_check_txt, id, email_check_txt, nickname_check_txt));
    })
})

app.post('/signup_process', upload.single('license'), function(request, response) {
    const post = request.body;
    const id = post.id;
    const pwd = post.pwd;
    const pwd2 = post.pwd2;
    const email = post.email;
    const nickname = post.nickname;
    const license = post.license;
    const certificate = post.certificate;
    const id_check_txt = post.id_check_txt;
    const email_check_txt = post.email_check_txt;
    const nickname_check_txt = post.nickname_check_txt;
    const is_normal = post.is_normal;
    let photo = undefined;
    if(request.file) {
        photo = request.file.path;
    } else {
        photo = null;
    }
    
    if (id_check_txt === "사용할 수 없는 아이디입니다.") {
        response.send('<script type="text/javascript">alert("중복된 아이디입니다."); document.location.href="/signup";</script>');
    } else if (id_check_txt === "아이디 중복을 확인하세요.") {
        response.send('<script type="text/javascript">alert("아이디 중복을 먼저 확인해주세요."); document.location.href="/signup";</script>');
    } else if (nickname_check_txt === "사용할 수 없는 닉네임입니다.") {
        response.send('<script type="text/javascript">alert("중복된 닉네임입니다."); document.location.href="/signup";</script>');
    } else if (nickname_check_txt === "닉네임 중복을 확인하세요.") {
        response.send('<script type="text/javascript">alert("닉네임 중복을 먼저 확인해주세요."); document.location.href="/signup";</script>');
    } else if (email_check_txt === "사용할 수 없는 이메일입니다.") {
        response.send('<script type="text/javascript">alert("중복된 이메일입니다."); document.location.href="/signup";</script>');
    }else if (email_check_txt === "이메일 중복을 확인하세요.") {
        response.send('<script type="text/javascript">alert("이메일 중복을 먼저 확인해주세요."); document.location.href="/signup";</script>');
    }
    else if (id === '' || pwd === '' || pwd2 === '' || email === '' || nickname === '') {
        response.send('<script type="text/javascript">alert("모든 정보를 입력해주세요."); document.location.href="/signup";</script>');
    }
    else if (pwd !== pwd2) {
        response.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다."); document.location.href="/signup";</script>');
    } else {
        if (is_normal) {
            if (photo === null) {
                response.send('<script type="text/javascript">alert("전문가 회원가입은 증명서가 필요합니다."); document.location.href="/signup";</script>');
            } else {
                bcrypt.hash(pwd, 10, function(error, hash) {
                    db.query(`INSERT INTO user (id, password, email, nickname, license, certificate, is_normal) VALUES(?, ?, ?, ?, ?, ?, ?)`,
                    [id, hash, email, nickname, photo, certificate, !is_normal], 
                    function(error, result) {
                        if (error) {
                            throw error;
                        }
                        console.log(result);
                        response.redirect('/');
                    });
                });
            }
        } else {
            bcrypt.hash(pwd, 10, function(error, hash) {
                db.query(`INSERT INTO user (id, password, email, nickname, license, certificate) VALUES(?, ?, ?, ?, ?, ?)`,
                [id, hash, email, nickname, license, certificate], 
                function(error, result) {
                    if (error) {
                        throw error;
                    }
                    console.log(result);
                    response.redirect('/');
                });
            });
        }
    }
});

// db.query(`SELECT * FROM user`, function(error, users) {
//     console.log(users);
// })

module.exports = app;