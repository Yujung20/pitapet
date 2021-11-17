const { response } = require('express');
const express = require('express');
const app = express();
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));
const bcrypt = require('bcrypt');
//const passport = require('passport');




const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: `pitapet`
});
db.connect();


app.use(session({
    key: 'LoginSession',
    secret: 'Secret',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'pitapet'
      })
  }))



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

app.get('/', function (req, res, next) {
    res.send('<a href="/login">login</a>');
});



app.post('/login', function(req, res) {
    db.connect(function(err) {
        var id = req.body.id;
        var password = req.body.password;

    db.query('SELECT * FROM user WHERE id = ? ',[password],
    function(error,results){
        if (error) throw error;
        else {
            if(results.length>0){
            bcrypt.compare(req.body.password,results[0].password, function(err,result){
                if(result){
                    req.session.loggedin = true;
                    req.session.id = id;
                    res.redirect('/welcome');
                    res.end();
                }else{
                    res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/login";</script>');    

                }
            });
            }else{

            res.send('<script type="text/javascript">alert("id과 pwd를 입력하세요!"); document.location.href="/login";</script>');    
            res.end();
            }
        }
    });
});
});







app.get('/welcome',(req,res)=>{
    var output="";
    if(req.session.id)
    {   
        output+=`
            <h1>Welcome</h1>
            <a href="/logout">logout</a>
        `;
        res.send(output);
        
    }
    else{
        output+=`
            <h1>Welcome</h1>
            <a href="/login>login</a>
        `;
        res.send(output);
    }
});

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