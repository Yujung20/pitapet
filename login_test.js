const { response } = require('express');
const express = require('express');
const app = express();
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));
const bcrypt = require('bcrypt');


// router header add
const register_router = require('./create_animal');
const qna_router = require('./question_and_answer');
const information_router=require('./information');
const signup_router = require('./signup_test');
const board_router = require('./board_and_comment');
const hospital_router= require('./hospital')

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

var db = require('./db');
/*
var dbOptions= require('./dbOptions');

const connection = mysql.createConnection(dbOptions);
const sessionStore=new MySQLStore({},connection);
*/

app.use(session({
    key: 'LoginSession',
    secret: 'Secret',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        user: 'root',
        password: '09220322',
        database: 'pit_a_pet'
      })
  }))
/*

app.use(session({
    key: 'LoginSession',
    secret: 'Secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore }));
*/
app.get('/login',(req,res)=> { 
    var output=`
        
            <head>
                <title>test</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1>login</h1>
                <form action="/login" method="post">
                    <p><input type="text" name="id"  ></p>
                    <p><input type="password" name="password" placeholder="password" ></p>
                    <p><input type="submit" value="로그인하기"></p>
                </form>
                <a href="/find_id">아이디 찾기</a>
            </body>
        
    `;
    res.send(output);
});

app.get('/index',function(req,res){
    if(!req.session.login){
        req.session.login = false
        req.session.id = -1
    }
    res.render('index');
});

function main_template(){
    return `
    <!doctype html>
    <html>
        <head>
            <title>main</title>
            <meta charset="utf-8">
        </head>
        <body>
            <a href="/login">login</a>
            <a href="/information">information</a>
            <a href="/hospital">hospital</a>
            <a href="/signup">sign up</a>
        </body>
    </html>
    `;
}

function find_id_template(){
    return `
    <!doctype html>
    <html>
        <head>
            <title>Find ID</title>
            <meta charset="utf-8">
        </head>
        <body>
        <h1>아이디찾기</h1>
            <p><input type="text" name="nickname1" placeholder="nickname" formaction="/finding_id"></p>
            <p><input type="text" name="email1" placeholder="email" formaction="/finding_id"></p>
            <p><input type="submit" value="확인" formaction="/finding_id"></p>
        </body>
    </html>
    `;
}

function id_found_template(found_id){
    return `
    <!doctype html>
    <html>
        <head>
            <title>ID found</title>
            <meta charset="utf-8">
        </head>
        <body>
        <h1>아이디찾기</h1>
            <p id="found_id">귀하의 아이디는 [ ${found_id} ] 입니다!</p>
            <a href="/login">로그인</a>
        </body>
    </html>
    `;
}

app.get('/', function (req, res, next) {
    res.end(main_template());
});



app.post('/login', function(req, res) {
    var id = req.body.id;
    var password = req.body.password;

    db.query('SELECT * FROM user WHERE id = ? ',[id],
        function(error,results){
            if (error) throw error;
            else {
                if(results.length>0){
                    bcrypt.compare(password, results[0].password, function(err,result){
                        if(result){
                            req.session.loggedin = true;
                            req.session.user_id = id;
                            req.session.save(function() {
                                res.redirect('/welcome');
                            });
                        }else{
                            res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/login";</script>');    
                            console.log(req.body.password + ", " + results[0].password);
                        }
                    });
                } else {
                    res.send('<script type="text/javascript">alert("id과 pwd를 입력하세요!"); document.location.href="/login";</script>');    
                    res.end();
                }
            }
        });
});

app.get('/welcome',(req,res)=>{
    var output="";
    if(req.session.user_id)
    {   
        // button add
        output+=`
            <h1>Welcome</h1>
            <a href="/logout">logout</a>
            <a href="/register">register</a>
            <a href="/qna">QnA</a>
            <a href="/information">information</a>
            <a href="/board">board</a>
        `;
        res.send(output);
        console.log(req.session.user_id);
        
    }
    else{
        output+=`
            <h1>Welcome</h1>
            <a href="/login">login</a>
        `;
        res.send(output);
    }
});

// router add
app.use('/register', register_router);
app.use('/qna', qna_router);
app.use('/information',information_router);
app.use('/signup', signup_router);
app.use('/board',board_router);
app.use('/hospital',hospital_router);

app.get('/logout',(req,res)=>{
    if(req.session.id){
        req.session.destroy(function(err){
            if (err) throw err;
            res.redirect('/');
        });
    }
    else{
        res.redirect('/');
    }

})

app.get('/find_id', (req, res)=>{
    res.send(find_id_template());
})

app.post('/finding_id', function(req,res) {
    const written = req.body;
    const nickname = written.nickname1;
    const email = written.email1;

    db.query(`SELECT * FROM user`, function(error, users) {
        if(error) {
            throw error;
        }

        for (var i = 0; i < Object.keys(users).length; i++) {
            if(nickname === users[i].nickname) {
                if(email === users[i].email) {
                    const id = users.id;
                    res.send(id_found_template(id));
                }
                else if(email === null) {
                    confirm("email을 입력하십시오!");
                    break;
                }
                else {
                    confirm("email을 찾을 수 없거나 존재하지 않습니다. 다시 한 번 확인해주세요.");
                    break;
                }
            }
            else if(nickname === null) {
                confirm("nickname을 입력하십시오!");
                break;
            }
            else {
                confirm("nickname을 찾을 수 없거나 존재하지 않습니다. 다시 한 번 확인해주세요.");
                break;
            }
        }
    })
})


db.query(`SELECT * FROM user`, function(error, users) {
    console.log(users);
})


app.listen(80);