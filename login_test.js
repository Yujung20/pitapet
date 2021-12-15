const { response } = require('express');
const express = require('express');
const app = express();
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

    
// router header add
const register_router = require('./create_animal');
const qna_router = require('./question_and_answer');
const review_router = require('./review');
const information_router=require('./information');
const signup_router = require('./signup_test');
const mypage_router=require('./mypage');
const hospital_router=require('./hospital');
const store_router=require('./store');
const board_router=require('./board_and_comment');
const care_service_router = require('./create_care_service');

app.use(express.static('upload'));

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

var db = require('./db');


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
                <a href="/find_password">비밀번호 찾기</a>
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

function main_template(current,question_list,review_list,board_list,hospital_list,store_list ){
    return `
    <!doctype html>
    <html>
        <head>
            <title>main</title>
            <meta charset="utf-8">
        </head>
        <body>
            <div class="section">
                <div class="logo">
                    <a href="/"> Pit-a_Pet</a>
                </div>
                <div class="nav">
                    <ul>
                        <li> <a href="/qna">Q&A</a> </li>
                        <li> <a href="/review">리뷰</a> </li>
                        <li> <a href="/information">기본 정보</a> </li>
                        <li> <a href="/hospital">동반 정보</a> 
                        <ul>
                            <li> <a href="/hospital">병원</a> </li>
                            <li> <a href="/store">매장</a> </li>
                        </ul>
                        <li> <a href="/board">커뮤니티</a> </li>
                    </ul>
                </div>
                <div class="profile">
                    <ul>
                        ${current}
                    </ul>
                </div>
            </div>
            <h1>------------------</h1>
            <div class="container">
                <div class="home_qna">
                    <a href="/login">Q&A</a>
                    <h6> ${question_list}</h6>
                    <h1>------------------</h1>
                </div>

                <div class="home_review">
                    <a href="/login">리뷰</a>
                    <h6> ${review_list}</h6>
                    <h1>-------------------</h1>
                </div>

                <div class="home_comunity">
                    <a href="/login">커뮤니티</a>
                    <h6> ${board_list}</h6>
                    <h1>-------------------</h1>
                </div>

                <div class="home_hospital">
                    <a href="/hospital">병원</a>
                    ${hospital_list}
                    <h1>---------------------</h1>
                </div>

                <div class="home_store">
                    <a href="/store">매장</a>
                    ${store_list}
                </div>
            </div>
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

    var current=``;
    var question_list = ``;
    var review_list=``;
    var board_list=``;
    var hospital_list=``;
    var store_list=``;
    db.query(`SELECT * FROM question ORDER BY date DESC`, function(error, questions) {
        if (Object.keys(questions).length > 0) {
            for (var i = 0; i < Object.keys(questions).length; i++) {
                question_list += `<p><a href="/qna/question/${questions[i].question_number}">${questions[i].title}</a><p>`;
                if(i==4){break;}
            }
        } else {
            question_list = `작성한 질문이 없습니다.`;
        }
        console.log("qna 쿼리")
    });
    db.query(`SELECT * FROM review ORDER BY date DESC`, function(error, reviews) {
        if (Object.keys(reviews).length > 0) {
            for (var i = 0; i < Object.keys(reviews).length; i++) {
                review_list += `<p><a href="/review/${reviews[i].review_number}">${reviews[i].title}</a><p>`;
                if(i==4){break;}
            }
        } else {
            review_list = `작성한 리뷰가 없습니다.`;
        }
    });

    db.query(`SELECT * FROM hospital LEFT JOIN hospital_pet ON hospital.hospital_name=hospital_pet.hospital_name LEFT JOIN hospital_time ON hospital.hospital_name=hospital_time.hospital_name ORDER BY hospital.hospital_name ASC, FIELD (day,'월요일','화요일','수요일','목요일','금요일','토요일','일요일'); `,
    function(err,hospitals){
        if (err) throw err;
        else{
            var H_H=" ";
            var H_D=" ";
            var H_pet_list=``;
            var H_count=0;
            var H_num1=0;
            for (var i=0; H_num1<4;i++){
                if(H_H!=hospitals[i].hospital_name){
                    H_pet_list+=`${hospitals[i].pet},`;
                    H_H=hospitals[i].hospital_name;
                    H_D=hospitals[i].day;
                }
                else{
                    if(H_D==hospitals[i].day){
                        if(H_count==0){
                            H_pet_list+=`${hospitals[i].pet}, `
                        }
                    }
                    else{
                        H_count++;
                        H_D=hospitals[i].day;
                    }
                }
                if(H_H!=hospitals[i+1].hospital_name){
                    hospital_list+=`<p><a href="/hospital/info/?id=${hospitals[i].hospital_name}">${hospitals[i].hospital_name}             </a><p>`;
                    H_num1++;
                if(i+1!=(hospitals).length){
                    H_pet_list=` `;
                    H_day_list=` `;
                    H_count=0;
                }
                }
            }
            hospital_list+=`<p><a href="/hospital/info/?id=${hospitals[i].hospital_name}">${hospitals[i].hospital_name}</a><p>`;
        }
    });
    
    db.query(`SELECT * FROM store LEFT JOIN store_pet ON store.store_name=store_pet.store_name LEFT JOIN store_time ON store.store_name=store_time.store_name ORDER BY store.store_name ASC, FIELD (day,'월요일','화요일','수요일','목요일','금요일','토요일','일요일'); `,
    function(err,stores){
        if (err) throw err;
        else{
            var S_H=" ";
            var S_D=" ";
            var S_pet_list=``;
            var S_count=0;
            var S_num1=0;
            for (var i=0; S_num1<4;i++){
                if(S_H!=stores[i].store_name){
                    S_pet_list+=`${stores[i].pet},`;
                    S_H=stores[i].store_name;
                    S_D=stores[i].day;
                }
                else{
                    if(S_D==stores[i].day){
                        if(S_count==0){
                            S_pet_list+=`${stores[i].pet}, `
                        }
                    }
                    else{
                        S_count++;
                        S_D=stores[i].day;
                    }
                }
                if(S_H!=stores[i+1].store_name){
                    store_list+=`<p><a href="/store/info/?id=${stores[i].store_name}">${stores[i].store_name}----------${S_pet_list}</a><p>`;
                    S_num1++;
                if(i+1!=(stores).length){
                    S_pet_list=` `;
                    S_day_list=` `;
                    S_count=0;
                }
                }
            }
            store_list+=`<p><a href="/store/info/?id=${stores[i].store_name}">${stores[i].store_name}----------${S_pet_list}</a><p>`;
        }
    });
    if(req.session.user_id)//로그인 한 경우
    {
       var id=req.session.user_id;

        current=`<li> <a href="/logout">로그아웃</a> </li>
        <li> <a href="/mypage">${id}---마이페이지</a> </li>`

        db.query(`SELECT * FROM board ORDER BY date DESC`, function(error, boards) {
            if (Object.keys(boards).length > 0) {
                for (var i = 0; i < Object.keys(boards).length; i++) {
                    board_list += `<p><a href="/board/written/${boards[i].board_number}">${boards[i].title}</a><p>`;
                    if(i==4){break;}
                }
            } else {
                board_list = `작성한 커뮤니티가 없습니다.`;
            }console.log(id);
        res.end(main_template(current,question_list,review_list,board_list,hospital_list,store_list));
        });
        
    }else{//로그인 안한 경우
        current=`<li> <a href="/login">로그인</a> </li>
        <li> <a href="/signup">회원가입</a> </li>`
        console.log("로그인 안한 상태");
        db.query(`SELECT * FROM board ORDER BY date DESC`, function(error, boards) {
            if (Object.keys(boards).length > 0) {

            } else{

            }res.end(main_template(current,question_list,review_list,board_list,hospital_list,store_list));
        });
        
    }
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
                                res.redirect('/');
                            });
                        }else{
                            res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/login";</script>');    
                            console.log(req.body.password + ", " + results[0].password);
                        }
                    });
                } else {
                    res.send('<script type="text/javascript">alert("존재하지 않는 아이디입니다!"); document.location.href="/login";</script>');    
                    res.end();
                }
            }
        });
});

// router add
app.use('/register', register_router);
app.use('/qna', qna_router);
app.use('/review', review_router);
app.use('/information',information_router);
app.use('/signup', signup_router);
app.use('/mypage',mypage_router)
app.use('/board',board_router);
app.use('/hospital',hospital_router);
app.use('/store',store_router);
app.use('/create_care_service',care_service_router);

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
    var output = `
    <!doctype html>
    <html>
        <head>
            <title>Find ID</title>
            <meta charset="utf-8">
        </head>
        <body>
        <h1>아이디찾기</h1>
            <form action="/find_id" method="post">
                <p><input type="text" name="nickname" placeholder="nickname"></p>
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="submit" value="확인"></p>
            </form>
        </body>
    </html>
    `;
    res.send(output);
})

app.post('/find_id', function(req,res) {
    const written = req.body;
    const nickname = written.nickname;
    const email = written.email;
    db.query(`SELECT * FROM user WHERE nickname = ? AND email = ? `,[nickname, email], function(error, users) {
        if(error) {
            throw error;
        }
        else if (users.length > 0) {
            for (var i = 0; i < Object.keys(users).length; i++) {
                if(nickname === users[i].nickname) {
                    if(email === users[i].email) {
                        const id = users[i].id;
                        res.send(id_found_template(id));
                    }
                }
                else if(email.length >=1 && email !== users[i].email && nickname.length >= 1) {
                    res.write("<script>alert('Cannot find the email or the email does not exist. Please try again.');location.href='/find_id';</script>");
                    break;
                }

                else if(nickname.length >= 1 && nickname !== users[i].nickname && email.length >=1) {
                    res.write("<script>alert('Cannot find the nickname or the nickname does not exist. Please try again.');location.href='/find_id';</script>");
                    break;
                }
            }
        }
        else {
            if(email.length < 1) {
                res.write("<script>alert('Please input email.');location.href='/find_id';</script>");
            }

            if(nickname.length < 1) {
                res.write("<script>alert('Please input nickname.');location.href='/find_id';</script>");
            }
        }     
    })
})

app.get('/find_password', (req, res)=>{
    var output = `
    <!doctype html>
    <html>
        <head>
            <title>Find Password</title>
            <meta charset="utf-8">
        </head>
        <body>
        <h1>비밀번호 찾기</h1>
            <form action="/find_password" method="post">
                <p><input type="text" name="id" placeholder="id"></p>
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="submit" value="확인"></p>
            </form>
        </body>
    </html>
    `;
    res.send(output);
})

app.post('/find_password', async (req, res, next) => {
    const written = req.body;
    const id = written.id;
    const email = written.email;

    var find_password_user_email;

    db.query(`SELECT * FROM user`, function(error, rows) {
        if (error) throw error;
        else {
          for(let i = 0; i < rows.length; i++) {
            if (rows[i].id == id && rows[i].email == email) {
                find_password_user_email = rows[i].email;
            }
          }
        }

        if (find_password_user_email) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: '20171641@sungshin.ac.kr',
                    pass: 'pitapet!'
                },
            });
            
            var variable = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");
            var randomPassword = createRandomPassword(variable, 8);

            function createRandomPassword(variable, passwordLength) {
                var randomString = "";
                for (var j=0; j<passwordLength; j++)
                    randomString += variable[Math.floor(Math.random()*variable.length)];
                return randomString
            }

            bcrypt.hash(randomPassword, 10, function(error, hash) {
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

            const mailOptions = {
                from: '20171641@sungshin.ac.kr',
                to: find_password_user_email,
                subject: 'PitaPet에서 임시 비밀번호를 알려드립니다!',
                html:
                "<h1>PitaPet에서 새로운 비밀번호를 알려드립니다.</h1> <h2> 임시 비밀번호 : " + randomPassword
                + "</h2>" +'<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 반드시 비밀번호를 수정해 주세요!</h3>',
            };
          
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } 
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
        
            }
        else {
            return res.status(403).send('존재하지 않는 회원입니다. 아이디 또는 이메일을 확인해주세요.');
        }
    })
});

db.query(`SELECT * FROM user`, function(error, users) {
    console.log(users);
})


app.listen(80);