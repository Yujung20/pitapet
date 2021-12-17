const response = require('express');
const express = require('express');
const app = express.Router();
const url = require('url');
const bcrypt = require('bcrypt');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

app.use(session({
    key: 'LoginSession',
    secret: 'Secret',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'pit_a_pet'
    })
}))


function main_template(nickname) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>mypage</title>
            <meta charset="utf-8">
            <style>
            .mypage{
                position: absolute;
                height:70%;
                top:15%;
                padding-left:5%;
            }
            
            .text1{
                font-size:50px;
                font-weight: bold;
                height: 10vh;
                padding-left:5%;
                display: inline-block;
            }
            .text2{
                font-size:20px;
                display: inline-block;

                height: 10vh;
                padding-left: 10px;
            }
            
            .mypage_{
                padding-left:5%;
            }
            .atag{
                font-size:20px;
                
                line-height:2.5;
            }
            .atagtext{
                font-weight:bold;
            }
            a {
                text-decoration:none !important
            }           
            a:link {
                color :black;
            }
            a:visited {
                color: black;
                text-shadow: 2px 2px 2px gray; 
            }
            a:hover {
                border-bottom: 3px solid blue;
            }
            a:active {
            color : blue;
            }
            
            hr{
                width:75vw;
                color:black;
                text-align:center;
                left:5%;

            }
             
            </style>
        </head>
        <body>
        <div class="mypage">
            <div class="row">
            <div class="text1"> My Page </div><div class="text2"> ${nickname}님</div>
            </div>
            <div class="mypage_mine mypage_">
                <a class="atag" href="/mypage/user_check/"> 회원 정보 조회</a> <br>               
                <a class="atag" href="/create_care_service/"> 케어서비스 등록하기</a> <br>
                <a class="atag" href="/mypage/care_service_information/"> 케어서비스 조회</a> 
            </div>
            <hr class="one">

            <div class="mypage_write mypage_">
                <a class="atagtext atag" href="/mypage/">내가 쓴 글 조회</a> <br>

                <a class="atag" href="/mypage/qna/"> Q&A</a> <br>
                <a class="atag" href="/mypage/review/"> 리뷰</a> <br>
                <a class="atag" href="/mypage/board/"> 커뮤니티</a><br>
            </div>
            <hr class="two">

            <div class="mypage_resign mypage_">
                <a class="atag" href="/mypage/resign_check/"> 회원 탈퇴</a>  
            </div>           
            </div>
        </body>
    </html>
    `;
}

function user_check() {
    return `
    <!doctype html>
    <html>
    <head>
        <title>user_check</title>
        <meta charset="utf-8">
        <style>
            form {
                height: 100vh;
                justify-content: center;
                width: 70vw;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-left: auto;
                margin-right: auto;
            }
            label {
                align-self: flex-start;
                margin-left:10vw;
            }
            input[type=password] {
                width: 50vw;
                padding: 2% 2%;
                display: inline-block;
                border: 1px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
            }
            input[type=submit] {
                width: 50vw;
                padding: 2% 2%;
                display: inline-block;
                border: 1px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
                text-align:center;
                background-color:#0066FF;
                color: white;
            }
            .text{
                margin-top:10vh;                              
                font-weight: bold;
                font-size: 35px;             
                color: black;
                margin-bottom: 15%;                
            }            
            </style>
        </head>
        <body> 
        <form action="/mypage/user_check" method="post">
        <div class="text"><b> 회원 정보 조회</b> </div>
            <label for="pwd">비밀번호 확인</label>
            <p><input type="password" name="password" placeholder="password" ></p>   
            <p><input type="submit" value="확인"></p>         
        </form>
        </body>
    </html>
    `;
}

function resign_check(){
    return `
    <!doctype html>
    <html>
        <head>
            <title>resign_check</title>
            <meta charset="utf-8">
            <style>
            form {
                height: 100vh;
                justify-content: center;
                width: 70vw;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-left: auto;
                margin-right: auto;
            }
            label {
                align-self: flex-start;
                margin-left:10vw;
            }
            input[type=password] {
                width: 50vw;
                padding: 2% 2%;
                display: inline-block;
                border: 1px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
            }
            input[type=submit] {
                width: 50vw;
                padding: 2% 2%;
                display: inline-block;
                border: 1px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
                text-align:center;
                background-color:#0066FF;
                color: white;
            }
            .text{
                margin-top:10vh;                              
                font-weight: bold;
                font-size: 35px;             
                color: black;
                margin-bottom: 15%;                
            }            
            </style>
        </head>
        <body> 
        <form action="/mypage/resign_check" method="post">
            <div class="text"><b> 회원 탈퇴</b> </div>
            <label for="pwd">비밀번호 확인</label>
            <p><input type="password" name="password" placeholder="password" ></p>   
            <p><input type="submit" value="확인"></p>     
                     
        </form>
        </body>
    </html>
    `;
}

function user_information_template(user_id,  user_email, user_nickname) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>mypage_user</title>
            <meta charset="utf-8">
            <style>
            .mypage_user{
                position: absolute;
                height:70%;
                top:15%;
                padding-left:5%;
            }
            
            .text1{
                font-size:50px;
                font-weight: bold;
                height: 10vh;
                padding-left:5%;
                display: inline-block;
                margin-bottom:2%;
            }
            
            
            .mypage_{
                padding-left:5%;
            }
            .text2{
                font-size:20px;                
                line-height:2.5;
            }
            .atag{
                font-size:20px;                
                line-height:2.5;
            }
            .atagtext{
                font-weight:bold;
            }
            a {
                text-decoration:none !important
            }           
            a:link {
                color :black;
            }
            a:visited {
                color: black;
                text-shadow: 2px 2px 2px gray; 
            }
            a:hover {
                border-bottom: 3px solid blue;
            }
            a:active {
            color : blue;
            }
            
            hr{
                width:75vw;
                color:black;
                text-align:center;
                left:5%;

            }

            </style>
        </head>
        <body> 
        <div class="mypage_user">
            <div class="row">
            <div class="text1">회원 정보 조회</div></div>
            <div class="mypage_id mypage_">
                <div class="text2">아이디: ${user_id}</div>            
            </div>
            <div class="mypage_password mypage_">
                <p><a class="atag" href="/mypage/user_information/password/">비밀번호 변경</a></p>  
            </div>
            <hr class="one">
            <div class="mypage_email mypage_">
                <div class="text2">이메일: ${user_email}</div>
                <p><a class="atag" href="/mypage/user_information/email/">이메일 변경</a></p>        
            </div>
            <hr class="one">
            <div class="mypage_nickname mypage_">
            <div class="text2">닉네임: ${user_nickname}</div>
            <p><a class="atag" href="/mypage/user_information/nickname/">닉네임 변경</a></p>      
            </div>
        </div>
        </body>
    </html>
    `;
}

function email_template(email_check_txt, check_email) {
    return `
        <!doctype html>
        <html>
        <head>
        <title>email update</title>
        <meta charset="utf-8">
        <style>
        form {
            height: 100vh;
            justify-content: center;
            width: 70vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: auto;
            margin-right: auto;
        }
        label {
            align-self: flex-start;
            margin-left:10vw;
        }
        input[type=email] {
            width: 40vw;
            padding: 2% 2%;
            display: inline-block;
            border: 1px solid #ccc;
            box-sizing: border-box;
            border-radius: 15px;
        }
        input[type=submit] {
            width: 10vw;
            margin: 2% 0;
            border: 1px solid #ccc;
            border-radius: 15px;
            text-align:center;
            background-color:#0066FF;
            color: white;
        }


        button {
            width: 50vw;
            padding: 2% 2%;
            display: inline-block;
            border: 1px solid #ccc;
            box-sizing: border-box;
            border-radius: 15px;
            text-align:center;
            background-color:#0066FF;
            color: white;
        }
        .text{
            margin-top:10vh;                              
            font-weight: bold;
            font-size: 35px;             
            color: black;
            margin-bottom: 15%;                
        }
        .row {
            justify-content: space-between;
            display: flex;
        }
        </style>
        </head>
        <body>
            <form action="/mypage/user_information/email_update/" method="post">
            <div class="text"><b> 이메일 변경하기</b> </div>
            <label for="email">새 이메일</label>

            <div class="row">
                <p><input type="email" name="email" placeholder="email" value="${check_email}" formaction="/mypage/user_information/email_check"> </p>
                <input type="submit" id="email" value="이메일 중복 확인" formaction="/mypage/user_information/email_check"></p>
                </div>
                <label id="email_check">${email_check_txt}</label>
                <input type="hidden" name="email_check_txt" value="${email_check_txt}" formaction="/mypage/user_information/email_check" >
                <p><button type="submit" >확인 </button>
            </div>
            </form>
        </body>       
        </html>
    `;
}

function nickname_template(nickname_check_txt, check_nickname) {
    return `
        <!doctype html>
        <html>
        <head>
        <title>nickname update</title>
        <meta charset="utf-8">
        <style>
        form {
            height: 100vh;
            justify-content: center;
            width: 70vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: auto;
            margin-right: auto;
        }
        label {
            align-self: flex-start;
            margin-left:10vw;
        }
        input[type=nickname] {
            width: 40vw;
            padding: 2% 2%;
            display: inline-block;
            border: 1px solid #ccc;
            box-sizing: border-box;
            border-radius: 15px;
        }
        input[type=submit] {
            width: 10vw;
            margin: 2% 0;
            border: 1px solid #ccc;
            border-radius: 15px;
            text-align:center;
            background-color:#0066FF;
            color: white;
        }


        button {
            width: 50vw;
            padding: 2% 2%;
            display: inline-block;
            border: 1px solid #ccc;
            box-sizing: border-box;
            border-radius: 15px;
            text-align:center;
            background-color:#0066FF;
            color: white;
        }
        .text{
            margin-top:10vh;                              
            font-weight: bold;
            font-size: 35px;             
            color: black;
            margin-bottom: 15%;                
        }
        .row {
            justify-content: space-between;
            display: flex;
        }
        </style>
    </head>
    <body>
    <form action="/mypage/user_information/nickname_update/" method="post">
    <div class="text"><b> 닉네임 변경하기</b> </div>
    <label for="nickname">새 닉네임</label>

    <div class="row">
        <p><input type="nickname" name="nickname" placeholder="nickname" value="${check_nickname}" formaction="/mypage/user_information/nickname_check"> </p>
        <input type="submit" id="nickname" value="닉네임 중복 확인" formaction="/mypage/user_information/nickname_check"></p>
        </div>
        <label id="nickname_check">${nickname_check_txt}</label>
        <input type="hidden" name="nickname_check_txt" value="${nickname_check_txt}" formaction="/mypage/user_information/nickname_check" >
        <p><button type="submit" >확인 </button>
    </div>
    </form>
    </body>       
        </html>
    `;
}


function care_service_template(care_service_list) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>care service</title>
            <meta charset="utf-8">
        </head>
        <body> 
        ${care_service_list}
        </body>
    </html>
    `;
}

function care_service_update_template(care_service_name, care_service_category, care_service_number, care_service_date, care_service_account) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>care service update</title>
            <meta charset="utf-8">
        </head>
        <body>
            <p>${care_service_name}</p>
            <p>${care_service_category}</p>

            <form action="/mypage/care_service_information/update_process/?id=${care_service_number}" method="post">
            <p><input type="date" name="mail_date" min="1990-01-01" max="2022-12-31" value=${care_service_date}></p>
            <p><textarea name="note" value=${care_service_account}></textarea></p>
            <p><input type="submit" value="수정"></p>
            </form>
        </body>
    </html>
    `;
}

function last_resign_template() {
    return `
    <!doctype html>
    <html>
        <head>
            <title>last resign</title>
            <meta charset="utf-8">
            <style>
            body {
                height: 100vh;
                justify-content: center;
                width: 70vw;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-left: auto;
                margin-right: auto;
            }
            label {
                color:red;
            }
            
            input[type=submit] {
                width: 25vw;
                padding: 2% 2%;
                display: inline-block;
                border: 1px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
                text-align:center;
                background-color:#0066FF;
                color: white;
            }
            .text{
                margin-top:10vh;                              
                font-weight: bold;
                font-size: 35px;             
                color: black;
                margin-bottom: 15%;                
            }       
            .row {
                justify-content: space-between;
                display: flex;
            }     
            </style>
        </head>
        <body>
        <div class="text"><b> 정말 탈퇴하시겠습니까?</b> </div>
        <label for="caution"> 삭제된 계정은 다시 복구할 수 없고 계정의 게시물이나 정보는 완전히 삭제되는 점을 기억해주세요.</label>
        <div class="row">
            <p><input type="submit" value="예" onClick="location.href='/mypage/resign'">
            <input type="submit" value="아니오" onClick="location.href='/mypage/'"></p>
        </div>
        </body>
    </html>
    `;
}

function qna_template(question_list, answer_list) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
        </head>
        <body> 
        
        <p><h3>작성한 질문</h3>${question_list}</p>
        <p><h3>작성한 대답</h3>${answer_list}</p>
        
        </body>
    </html>
    `;
}

function review_template(review_list,comment_list){
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
        </head>
        <body> 
        
        <p><h3>작성한 리뷰</h3>${review_list}</p>
        <p><h3>작성한 댓글</h3>${comment_list}</p>
        
        </body>
    </html>
    `;
}

function board_template(board_list, comment_list) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
        </head>
        <body> 
        
        <p><h3>작성한 커뮤니티</h3>${board_list}</p>
        <p><h3>작성한 답변</h3>${comment_list}</p>
        
        </body>
    </html>
    `;
}

app.get('/', function(req, res) {
    const id=req.session.user_id;
    db.query(`SELECT * FROM user WHERE id = ?`, 
    [id],function(error, user) {
        if (error) {
            throw error;
        }
        else{
            res.end(main_template(user[0].nickname));
        }    
    })    
})

app.get('/user_check/',function(req,res){
    res.end(user_check());
})

app.post('/user_check/', function(req, res) {
    const id=req.session.user_id;
    var password = req.body.password;
    db.query('SELECT * FROM user WHERE id = ? ',[id],
    function(error,results){
        if (error) throw error;
        else {
            if(results.length>0){
                bcrypt.compare(password, results[0].password, function(err,result){
                    if(result){
                        
                        res.redirect('/mypage/user_information/');
                    }else{
                        res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/mypage/user_check";</script>');    
                        console.log(req.body.password + ", " + results[0].password);
                    }
                });
            } else {
                res.send('<script type="text/javascript">alert("id과 pwd를 입력하세요!"); document.location.href="/user_check";</script>');    
                res.end();
            }
        }
    });
});

app.get('/user_information/', function(req, res) {
    user_id=req.session.user_id;       
    db.query(`SELECT * FROM user WHERE id = ?`, [user_id],
    function(error, user) {
        if (error) {
            throw error;
        }
        console.log(user);
        res.end(user_information_template(user_id, user[0].email, user[0].nickname));
    })
})

app.get('/user_information/password/',function(req,res){
    var output=`
    <head>
        <title>password update</title>
        <meta charset="utf-8">
    </head>
    <style>
    form {
        height: 100vh;
        justify-content: center;
        width: 70vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: auto;
        margin-right: auto;
    }
    label {
        align-self: flex-start;
        margin-left:10vw;
    }
    input[type=password] {
        width: 50vw;
        padding: 2% 2%;
        display: inline-block;
        border: 1px solid #ccc;
        box-sizing: border-box;
        border-radius: 15px;
    }
    input[type=submit] {
        width: 50vw;
        padding: 2% 2%;
        display: inline-block;
        border: 1px solid #ccc;
        box-sizing: border-box;
        border-radius: 15px;
        text-align:center;
        background-color:#0066FF;
        color: white;
    }
    .text{
        margin-top:10vh;                              
        font-weight: bold;
        font-size: 35px;             
        color: black;
        margin-bottom: 15%;                
    }     
    </style>
    <body>
    <form action="/mypage/user_information/password_update/" method="post">
        <div class="text"><b> 비밀번호 변경하기</b> </div>
        <label for="pwd">새 비밀번호</label>
        <p><input type="password" name="pwd1" placeholder="password"></p>
        <label for="pwd">새 비밀번호 확인</label>
        <p><input type="password" name="pwd2" placeholder="password check"></p>    
        <p><input type="submit" value="확인"></p>
        
    </form>
    </body>   
    
    `;
    res.send(output);
});

app.post('/user_information/password_update/', function(req,res){
    const post = req.body;
    const pwd1 = post.pwd1;
    const pwd2 = post.pwd2;
    const id=req.session.user_id;
    if (pwd1 !== pwd2) {
        res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다."); document.location.href="/mypage/user_information/password/";</script>');
    } else {
        bcrypt.hash(pwd1, 10, function(error, hash) {
            db.query(`UPDATE user SET password=? WHERE id = ?`,
            [hash, id], 
            function(err, result) {
                if (err) {
                    res.send(err);
                    throw err;
                }
                else{
                    console.log(result);
                    req.session.destroy(function(err){
                        if (err) throw err;
                        res.redirect('/');
                    });
                }                
            });
        });        
    } 
})

app.get('/user_information/email/',function(req,res){
    res.end(email_template("이메일 중복을 확인하세요.", ''));
});

app.post('/user_information/email_check', function(request, response) {
    const post = request.body;
    const email = post.email;
    console.log(email);

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
        response.send(email_template(email_check_txt, email));
    })
});

app.post('/user_information/email_update/', function(request,response){
    const post = request.body;
    const email = post.email;
    const email_check_txt = post.email_check_txt;
    const id=request.session.user_id;


    if (email_check_txt == "사용할 수 없는 이메일입니다.") {
        response.send('<script type="text/javascript">alert("중복된 이메일입니다."); document.location.href="/mypage/user_information/email/";</script>');
    }else if (email_check_txt == "이메일 중복을 확인하세요.") {
        response.send('<script type="text/javascript">alert("이메일 중복을 먼저 확인해주세요."); document.location.href="/mypage/user_information/email/";</script>');
    }
    else if (email === '' ) {
        response.send('<script type="text/javascript">alert("이메일을 입력해주세요."); document.location.href="/mypage/user_information/email/";</script>');
    }
     else {
        db.query(`UPDATE user SET email=? WHERE id=?`,
        [email, id],
        function(error, result) {
            if (error) {
                response.send(error);
                throw error;                
                

            }
            console.log(result);
            response.redirect('/mypage/user_information/');
        });
        
    }
})

app.get('/user_information/nickname/',function(req,res){
    res.end(nickname_template("닉네임 중복을 확인하세요.", ''));
});

app.post('/user_information/nickname_check', function(request, response) {
    const post = request.body;
    const nickname = post.nickname;
    console.log(nickname);

    var nickname_check_txt = "사용할 수 있는 닉네임입니다."
    db.query(`SELECT * FROM user`, function(error, users) {
        if(error) {
            throw error;
        }

        for (var i = 0; i < Object.keys(users).length; i++) {
            if (nickname === users[i].nickname) {
                nickname_check_txt = "사용할 수 없는 닉네임입니다."
                break;
            }
        }
        response.send(nickname_template(nickname_check_txt, nickname));
    })
});


app.post('/user_information/nickname_update/', function(request,response){
    const post = request.body;
    const nickname = post.nickname;
    const nickname_check_txt = post.nickname_check_txt;
    const id=request.session.user_id;


    if (nickname_check_txt == "사용할 수 없는 닉네임입니다.") {
        response.send('<script type="text/javascript">alert("중복된 닉네임입니다."); document.location.href="/mypage/user_information/nickname/";</script>');
    }else if (nickname_check_txt == "닉네임 중복을 확인하세요.") {
        response.send('<script type="text/javascript">alert("닉네임 중복을 먼저 확인해주세요."); document.location.href="/mypage/user_information/nickname/";</script>');
    }
    else if (nickname === '' ) {
        response.send('<script type="text/javascript">alert("닉네임을 입력해주세요."); document.location.href="/mypage/user_information/nickname/";</script>');
    }
     else {
        db.query(`UPDATE user SET nickname=? WHERE id=?`,
        [nickname, id],
        function(error, result) {
            if (error) {
                response.send(error);
                throw error;                
                

            }
            console.log(result);
            response.redirect('/mypage/user_information/');
        });
        
    }
})

app.get('/care_service_information/', function(req, res) {
    const id = req.session.user_id;
    var care_service_list = ``;
    var care_service_date_list = ``;

    db.query(`SELECT * FROM care_service WHERE owner_id = ?`,[id],
    function(err, care_service){
        if (err) throw err;
        else{
            db.query('SELECT * FROM care_service_date',
                function(error, care_service_date) {
                    if (err) throw err;
                else{
                    for (var i=0; i<Object.keys(care_service).length; i++) {
                        for (var j=0; j<Object.keys(care_service_date).length; j++) {
                            if (care_service_date[j].mail_number == care_service[i].mail_number)
                            {
                                care_service_date_list += care_service_date[j].mail_date;
                                care_service_date_list += '<br/>';
                            }
                        }

                        care_service_list += `
                        <p>${care_service[i].name}</p>
                        <p>${care_service[i].mail_category}</p>
                        <p>${care_service_date_list}</p>
                        <p>${care_service[i].account}</p>
                        <p><input type="submit" value="수정" onClick="location.href='/mypage/care_service_information/update/?id=${care_service[i].mail_number}'">
                        <input type="submit" value="삭제" onClick="location.href='/mypage/care_service_information/delete/?id=${care_service[i].mail_number}'"></p>       
                        `;

                        care_service_date_list = ``;
                    }
                    res.end(care_service_template(care_service_list));
                }
            });
            
        }        
    }); 
})

app.get('/care_service_information/update', function(req, res) {
    const care_service_number = url.parse(req.url, true).query.id;

    if (care_service_number) {
        db.query(`SELECT * FROM care_service WHERE mail_number = ?`, 
        [care_service_number],
        function(error, result1) {
            if (error) {
                throw error;
            }
            db.query(`SELECT * FROM care_service_date WHERE mail_number = ?`, 
            [care_service_number],
            function(error, result2) {
            if (error) {
                throw error;
            }

            res.end(care_service_update_template(result1[0].name, result1[0].mail_category, care_service_number,
                result2[0].mail_date, result1[0].account));
            })
        })
    }
   
});

app.post('/care_service_information/update_process', function(req, res) {
    const care_service_number = url.parse(req.url, true).query.id;

    const body = req.body;
    const date = body.mail_date;
    const note = body.note;

    db.query(`UPDATE care_service SET account=? WHERE mail_number = ?`,
    [note, care_service_number],
    function(err, result) {
        if(err) {
            res.send(err);
            throw err;
        }
        console.log(result);
    })

    db.query(`UPDATE care_service_date SET mail_date=? WHERE mail_number = ?`,
    [date, care_service_number],
    function(err, result) {
        if(err) {
            res.send(err);
            throw err;
        }
        console.log(result);
        res.redirect(`/mypage/care_service_information/`);
    })
});

app.get('/care_service_information/delete/', function(req, res) {
    const care_service_number = url.parse(req.url, true).query.id;
    console.log(care_service_number);
    
    db.query(`DELETE FROM care_service WHERE mail_number = ?`,
    [care_service_number],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
 
        res.redirect('/mypage/');
    });
});

app.get('/qna/',function(req,res){
    const id=req.session.user_id;
    var question_list = ``;
    var answer_list=``;
    db.query(`SELECT * FROM question WHERE user_id=?`,[id], function(error, questions) {
        if (Object.keys(questions).length > 0) {
            for (var i = 0; i < Object.keys(questions).length; i++) {
                question_list += `<p><a href="/qna/question/${questions[i].question_number}">${questions[i].title}</a><p>`;
            }
        } else {
            question_list = `작성한 질문이 없습니다.`;
        }

    });
    db.query(`SELECT * FROM answer WHERE user_id=?`,[id], function(error, answers) {
        if (Object.keys(answers).length > 0) {
            for (var i = 0; i < Object.keys(answers).length; i++) {
                answer_list += `<p><a href="/qna/question/${answers[i].question_number}">${answers[i].content}</a><p>`;
            }
        } else {
            answer_list = `작성한 대답이 없습니다.`;
        }
        res.send(qna_template(question_list,answer_list));                       

    });    
})

app.get('/review/',function(req,res){
    const id=req.session.user_id;
    var review_list = ``;
    var comment_list=``;
    db.query(`SELECT * FROM review WHERE user_id=?`,[id], function(error, reviews) {
        if (Object.keys(reviews).length > 0) {
            for (var i = 0; i < Object.keys(reviews).length; i++) {
                review_list += `<p><a href="/review/${reviews[i].review_number}">${reviews[i].title}</a><p>`;
            }
        } else {
            review_list = `작성한 리뷰가 없습니다.`;
        }

    });
    db.query(`SELECT * FROM review_comment WHERE user_id=?`,[id], function(error, comments) {
        if (Object.keys(comments).length > 0) {
            for (var i = 0; i < Object.keys(comments).length; i++) {
                comment_list += `<p><a href="/review/${comments[i].review_number}">${comments[i].content}</a><p>`;
            }
        } else {
            comment_list = `작성한 댓글이 없습니다.`;
        }
        res.send(review_template(review_list,comment_list));                       

    });    
})

app.get('/board/',function(req,res){
    const id=req.session.user_id;
    var board_list = ``;
    var comment_list=``;
    db.query(`SELECT * FROM board WHERE user_id=?`,[id], function(error, boards) {
        if (Object.keys(boards).length > 0) {
            for (var i = 0; i < Object.keys(boards).length; i++) {
                board_list += `<p><a href="/board/written/${boards[i].board_number}">${boards[i].title}</a><p>`;
            }
        } else {
            board_list = `작성한 커뮤니티가 없습니다.`;
        }

    });
    db.query(`SELECT * FROM board_comment WHERE user_id=?`,[id], function(error, comments) {
        if (Object.keys(comments).length > 0) {
            for (var i = 0; i < Object.keys(comments).length; i++) {
                comment_list += `<p><a href="/board/written/${comments[i].board_number}">${comments[i].content}</a><p>`;
            }
        } else {
            comment_list = `작성한 답변이 없습니다.`;
        }
        res.send(board_template(board_list,comment_list));                       

    });    
})


app.get('/resign_check/', function(req,res){
    res.end(resign_check());
})

app.post('/resign_check/', function(req, res) {
    const id=req.session.user_id;
    var password = req.body.password;
    db.query('SELECT * FROM user WHERE id = ? ',[id],
    function(error,results){
        if (error) throw error;
        else {
            if(results.length>0){
                bcrypt.compare(password, results[0].password, function(err,result){
                    if(result){
                        
                        res.redirect('/mypage/last_resign/');
                    }else{
                        res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/mypage/user_check";</script>');    
                        console.log(req.body.password + ", " + results[0].password);
                    }
                });
            } else {
                res.send('<script type="text/javascript">alert("id과 pwd를 입력하세요!"); document.location.href="/user_check";</script>');    
                res.end();
            }
        }
    });

});

app.get('/last_resign/', function(req, res) {
    res.send(last_resign_template());
})


app.get('/resign/', function(req, res) {
    const id=req.session.user_id;
    if(req.session.id){
        req.session.destroy(function(err){
            if (err) throw err;
            db.query(`DELETE FROM user WHERE id = ?`,
            [id],
            function(err, result) {
                if (err) {
                    res.send(err);
                    throw err;
                }
        
                res.redirect('/');
            });
            
        });
    }
    else{
        res.redirect('/');
    }
    
});

module.exports = app;