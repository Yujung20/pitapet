const express = require('express');
const app = express.Router();

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false }));

const db = require('./db');

const multer = require('multer');
const upload = multer({dest: './upload/review_img'});

function main_template(review_list) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>Review</h1>
            <a href="/review/write_review/">리뷰 작성하기</a>
            ${review_list}
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
        </head>
        <body>
            <h1>리뷰 작성하기</h1>
            <form action="/review/write_review/" method="post" enctype="multipart/form-data">
                <p><input type"text" name="title" placeholder="title"></p>
                <p><select name="category">
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
                <p><textarea name="content" placeholder="내용"></textarea></p>
                <p><input type="text" name="price" placeholder="가격" onkeyup="numberWithCommas(this.vale)"></p>
                <p><input type="text" name="product_name" placeholder="제품명"></p>
                <p><input type="text" name="brand" placeholder="브랜드명"></p>
                <p><input type="file" name="photo"></p>
                <p><input type="submit" value="리뷰 등록하기"></p>
            </form>
        </body>
    </html>
    <script>
        function numberWithCommas(x) {
            x = x.replace(/[^0-9]/g,'');   // 입력값이 숫자가 아니면 공백
            x = x.replace(/,/g,'');          // ,값 공백처리
            $("#price").val(x.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // 정규식을 이용해서 3자리 마다 , 추가 
        }
    </script>
    `;
}

app.use(express.static('upload'));

app.get('/', function(req, res) {
    var review_list = '';
    
    db.query(`SELECT * FROM review`,
    function(error, reviews) {
        if (error) {
            res.send(error);
            throw error;
        }
        for (var i = 0; i < reviews.length; i++) {
            review_list += `<p><a href="/review/${reviews[i].review_number}">${reviews[i].title}</a></p>`;
        }
        res.send(main_template(review_list));
    })
})

app.get('/write_review/', function(req, res) {
    res.send(review_create_template());
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
    const photo = req.file.path;

    db.query(`INSERT INTO review (user_id, title, content, price, product_name, brand, category, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, title, content, price, product_name, brand, category, photo],
    function(error, result) {
        if(error) {
            res.send(error);
            throw error;
        }
        console.log(result);
        console.log(req.file);
        res.redirect('/review');
    })
})

// db.query(`SELECT * FROM review`, 
//     function(error, result) {
//         console.log(result[4].photo.toString('utf8'));
// })

module.exports = app;