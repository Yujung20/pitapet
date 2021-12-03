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
        </head>
        <body> 
        <h3>닉네임: ${nickname}</h3>
        <a href="/mypage/user_check/"> 회원 정보 조회</a> 

        <a href="/mypage/animal_information/"> 동물 정보 조회</a> 

        <h3> 작성한 Q&A </h3>
        <h3> 작성한 리뷰 </h3>

        <a href="/mypage/resign_check/"> 회원 탈퇴</a> 
            
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
        </head>
        <body> 
        <form action="/mypage/user_check" method="post">

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
        </head>
        <body> 
        <form action="/mypage/resign_check" method="post">

            <p><input type="password" name="password" placeholder="password" ></p>   
            <p><input type="submit" value="확인"></p>         
        </form>
        </body>
    </html>
    `;

}


function user_information_template(user_id,user_password,user_email,user_nickname){
    return `
    <!doctype html>
    <html>
        <head>
            <title>mypage_user</title>
            <meta charset="utf-8">
        </head>
        <body> 
        <h3>아이디: ${user_id}</h3>
            <h3>비밀번호: ${user_password}</h3><p><input type="submit" value="변경하기" onClick="location.href='/mypage/user_information/password/'"></p>  
            <h3>이메일: ${user_email}</h3><p><input type="submit" value="변경하기" onClick="location.href='/mypage/user_information/email/'"></p>        
            <h3>닉네임: ${user_nickname}</h3><p><input type="submit" value="변경하기" onClick="location.href='/mypage/user_information/nickname/'"></p>      
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
        res.end(user_information_template(user_id,user[0].password, user[0].email, user[0].nickname));
    })
})

app.get('/user_information/password/',function(req,res){
    var output=`
    <head>
        <title>password update</title>
        <meta charset="utf-8">
    </head>
    <body>
    <form action="/mypage/user_information/password_update/" method="post">
        <p><input type="password" name="pwd1" placeholder="password"></p>
        <p><input type="password" name="pwd2" placeholder="password check"></p>
    
        <p><input type="submit" value="변경하기"></p>
        
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
        res.send(`<script>alert('비밀번호가 일치하지 않습니다.')</script>`);
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
    var output=`
    <head>
        <title>email update</title>
        <meta charset="utf-8">
    </head>
    <body>
        <form action="/mypage/user_information/email_update/" method="post">
        <p><input type="text" name="email" placeholder="email"></p>   
        
        <p><input type="submit" value="변경하기"></p>
        </form>
    </body>       
    `;
    res.send(output);
});

app.get('/user_information/email/',function(req,res){
    res.end(email_template(''));
});
app.post('/user_information/email_update/', function(req,res){
    const email=req.body.email;
    const id=req.session.user_id;
    db.query(`UPDATE user SET email=? WHERE id=?`,
    [email, id],
    function(err, result) {
        if(err) {
            res.send(err);
            throw err;
        }
        console.log(result);
        res.redirect(`/mypage/user_information/`);
    })
})

app.get('/user_information/nickname/',function(req,res){
    var output=`
    <head>
        <title>nickname update</title>
        <meta charset="utf-8">
    </head>
    <body>
        <form action="/mypage/user_information/nickname_update/" method="post">
        <p><input type="text" name="nickname" placeholder="nickname"></p>   
        <p><input type="submit" value="변경하기"></p>
        </form>
    </body>       
    `;
    res.send(output);
});

app.post('/user_information/nickname_update/', function(req,res){
    const nickname=req.body.nickname;
    const id=req.session.user_id;
    db.query(`UPDATE user SET nickname=? WHERE id=?`,
    [nickname, id],
    function(err, result) {
        if(err) {
            res.send(err);
            throw err;
        }
        console.log(result);
        res.redirect(`/mypage/user_information/`);
    })
})

function animal_template(animal_list){
    return `
    <!doctype html>
    <html>
        <head>
            <title>animal</title>
            <meta charset="utf-8">
        </head>
        <body> 
        ${animal_list}
        </body>
    </html>
    `;
}

app.get('/animal_information/',function(req,res){
    const id=req.session.user_id;
    var animal_list=``;
    db.query(`SELECT * FROM animal WHERE owner_id=?`,[id],
    function(err,animals){
        if (err) throw err;
        else{
            for (var i=0; i<Object.keys(animals).length;i++){
                animal_list+=`
                <p>
                ${animals[i].name}<br>
                ${animals[i].type}<br>
                ${animals[i].gender}<br>
                ${animals[i].birthday}<br>
                ${animals[i].special_note}
                </p>
                <p><input type="submit" value="수정" onClick="location.href='/mypage/animal_information/update/?id=${animals[i].number}'">
                <input type="submit" value="삭제" onClick="location.href='/mypage/animal_information/delete/?id=${animals[i].number}'"></p>
                                   
                `;
            }
            res.end(animal_template(animal_list));
                       
        }        
    }); 
})

function animal_update_template(animal_name,animal_type,animal_number,animal_gender,animal_birthday,animal_special_note){
    return `
    <!doctype html>
    <html>
        <head>
            <title>animal update</title>
            <meta charset="utf-8">
        </head>
        <body>
            <p>${animal_name}</p>
            <p>${animal_type}</p>

            <form action="/mypage/animal_information/update_process/?id=${animal_number}" method="post">
            <p><select name="gender" value=${animal_gender}> 
            <option value="여">여</option>
            <option value="남">남</option>
            </select></p>
            <p><input type="date" name="birthday" min="1990-01-01" max="2022-12-31" value=${animal_birthday} ></p>
            <p><textarea name="special_note" value=${animal_special_note}></textarea></p>
            <p><input type="submit" value="수정"></p>
            </form>
        </body>
    </html>
    `;


}

app.get('/animal_information/update', function(req, res) {
    const animal_number = url.parse(req.url, true).query.id;

    if (animal_number) {
        db.query(`SELECT * FROM animal WHERE number = ?`, 
        [animal_number],
        function(error, result) {
            if (error) {
                throw error;
            }
            res.end(animal_update_template(result[0].name, result[0].type, animal_number,result[0].gender,result[0].birthday,result[0].special_note));
        })
    }
   
});

app.post('/animal_information/update_process', function(req, res) {
    const animal_number = url.parse(req.url, true).query.id;

    const body = req.body;
    const gender = body.gender;
    const birthday = body.birthday;
    const special_note = body.special_note;

    db.query(`UPDATE animal SET gender=?, birthday=?, special_note=? WHERE number = ?`,
    [gender,birthday,special_note,animal_number],
    function(err, result) {
        if(err) {
            res.send(err);
            throw err;
        }
        console.log(result);
        res.redirect(`/mypage/animal_information/`);
    })
});


app.get('/animal_information/delete/', function(req, res) {
    const animal_number = url.parse(req.url, true).query.id;

    db.query(`DELETE FROM animal WHERE number = ?`,
    [animal_number],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
 
        res.redirect('/mypage/animal_information/');
    });
});


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
function last_resign_template(){
    return `
    <!doctype html>
    <html>
        <head>
            <title>last resign</title>
            <meta charset="utf-8">
        </head>
        <body>
        <h2>정말 탈퇴하시겠습니까?</h2>
        <p><input type="submit" value="예" onClick="location.href='/mypage/resign'">
        <input type="submit" value="아니오" onClick="location.href='/mypage/'"></p>

        </body>
    </html>
    `;


}
app.get('/last_resign/', function(req, res) {
    res.send(last_resign_template());
})

app.get('/resign/', function(req, res) {
    const id=req.session.user_id;

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





module.exports = app;