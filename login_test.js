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
        user: 'flora',
        password: 'shin*7883',
        database: 'pit_a_pet_example'
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
            <a href="/hospital">hospital</a>
        `;
        res.send(output);
        console.log(req.session.user_id);
        
    }
    else{
        output+=`
            <h1>Welcome</h1>
            <a href="/login>login</a>
        `;
        res.send(output);
    }
});

// router add
app.use('/register', register_router);
app.use('/qna', qna_router);
app.use('/information',information_router)
app.use('/hospital',hospital_router)

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


db.query(`SELECT * FROM user`, function(error, users) {
    console.log(users);
})


app.listen(80);