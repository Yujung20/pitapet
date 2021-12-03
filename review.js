const express = require('express');
const app = express.Router();

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

function review_detail_template(review_number, title, content, date, price, product_name, brand, category, photo, user_id, comment_list) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Q&A</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>${title}</h1>
            <p>${date}</p>
            <p>가격: ${price}</p>
            <p>상품명: ${product_name}</p>
            <p>브랜드명: ${brand}</p>
            <p>카테고리: ${category}</p>
            <p>작성자: ${user_id}</p>
            <p>${content}</p>
            <hr/>
            <h3>댓글</h3>
            <form action="/review/write_comment/" method="post">
                <input type="hidden" name="review_number" value="${review_number}"">
                <p><textarea name="comment"></textarea></p>
                <p><input type="submit" value="댓글 달기"></p>
            </form>
            ${comment_list}
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
    let photo = undefined;
    if(req.file) {
        photo = req.file.path;
    } else {
        photo = null;
    }

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
            
            let photo = undefined;
            if (review.photo !== null) {
                photo = review.photo.toString('utf8')
            }
            
            console.log(photo);
            console.log(comments);

            for(var i = 0; i < comments.length; i++) {
                const cdate = String(comments[i].date).split(" ");
                var formating_cdate = cdate[3] + "-" + cdate[1] + "-" + cdate[2] + "-" + cdate[4];

                comment_list += `
                    <p>${comments[i].content}</p>
                    <p>${comments[i].user_id}</p>
                    <p>${formating_cdate}</p>
                `
            }

            res.send(review_detail_template(review.review_number, review.title, review.content, formating_rdate, review.price, review.product_name, review.brand, review.category, photo, review.user_id, comment_list));
        });
    })
})

app.post('/write_comment/', function(req, res) {
    const body = req.body;
    const review_number = body.review_number;
    const content = body.comment;
    const user_id = req.session.user_id;

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
})

// db.query(`SELECT * FROM review`, 
//     function(error, result) {
//         console.log(result[4].photo.toString('utf8'));
// })

module.exports = app;