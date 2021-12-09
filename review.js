const express = require('express');
const app = express.Router();
const fs = require('fs');

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

function review_detail_template(review_number, title, content, date, price, product_name, brand, category, photo, user_id, comment_list, auth_btn) {
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
            <p><img src="${photo}"></p>
            ${auth_btn}
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

function review_detail_no_photo_template(review_number, title, content, date, price, product_name, brand, category, user_id, comment_list, auth_btn) {
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
            ${auth_btn}
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
    `;
}

function review_update_template(review_id, title, category, content, price, product_name, brand, photo) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>리뷰 작성하기</title>
            <meta charset="utf-8">
            <script>
                function remove_img() {
                    var photo = document.getElementById('photo');
                    photo_src = photo.src;

                    var input = document.createElement('input');
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", "photo_delete");
                    input.setAttribute("value", photo_src);

                    document.getElementById('update_review').appendChild(input);
                    photo.remove();
                }

                function photo_src() {
                    var photo = document.getElementById('photo');
                    photo = photo.src;

                    var photo_src = document.createElement('input');
                    photo_src.setAttribute("type", "hidden");
                    photo_src.setAttribute("name", "img_src");
                    photo_src.setAttribute("value", photo);

                    document.getElementById('update_review').appendChild(photo_src);
                }
            </script>
        </head>
        <body>
            <h1>리뷰 작성하기</h1>
            <form action="/review/${review_id}/update_process/" method="post" enctype="multipart/form-data" id="update_review" onclick="photo_src()">
                <p><input type"text" name="title" value="${title}"></p>
                <p>
                ${category}
                <select name="category">
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
                <p><textarea name="content">${content}</textarea></p>
                <p><input type="text" name="price" value="${price}"></p>
                <p><input type="text" name="product_name" value="${product_name}"></p>
                <p><input type="text" name="brand" value="${brand}"></p>
                <p><img src="${photo}" id="photo"></p>
                <p><button type="button" onclick="remove_img()">사진 지우기</button></p>
                <p><input type="file" name="photo"></p>
                <p><input type="submit" value="리뷰 수정하기"></p>
            </form>
        </body>
    </html>
    `;
}

function review_update_no_photo_template(review_id, title, category, content, price, product_name, brand) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>리뷰 작성하기</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>리뷰 작성하기</h1>
            <form action="/review/${review_id}/update_process/" method="post" enctype="multipart/form-data">
                <p><input type"text" name="title" value="${title}"></p>
                <p>
                ${category}
                <select name="category">
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
                <p><textarea name="content">${content}</textarea></p>
                <p><input type="text" name="price" value="${price}"></p>
                <p><input type="text" name="product_name" value="${product_name}"></p>
                <p><input type="text" name="brand" value="${brand}"></p>
                <p><input type="file" name="photo"></p>
                <p><input type="submit" value="리뷰 수정하기"></p>
            </form>
        </body>
    </html>
    `;
}

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

    console.log(body);

    db.query(`INSERT INTO review (user_id, title, content, price, product_name, brand, category, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, title, content, price, product_name, brand, category, photo],
    function(error, result) {
        if(error) {
            res.send(error);
            throw error;
        }
        console.log(result);
        console.log(req.file);
        res.redirect(`/review/${result.insertId}`);
    })
})

app.get('/update/:review_id/', function(req, res) {
    const review_id = req.params.review_id;

    db.query(`SELECT * FROM review WHERE review_number = ?`,
    [review_id],
    function (err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
        
        const review = result[0];

        if (review.photo) {
            let photo = review.photo.toString('utf8')
            photo = photo.replace('upload/', '/')
            console.log(photo);
            res.send(review_update_template(review_id, review.title, review.category, review.content, review.price, review.product_name, review.brand, photo))
        } else {
            res.send(review_update_no_photo_template(review_id, review.title, review.category, review.content, review.price, review.product_name, review.brand))
        }
    })
})

app.post('/:review_id/update_process', upload.single('photo'), function(req, res) {
    const review_id = req.params.review_id;
    const body = req.body;
    const title = body.title;
    const category = body.category;
    const content = body.content;
    const price = body.price;
    const product_name = body.product_name;
    const brand = body.brand;
    let photo = undefined;

    if(body.photo_delete) {
        photo_path = body.photo_delete;
        if (Array.isArray(photo_path)) photo_path = photo_path[0];
        console.log(photo_path);
        photo_path = photo_path.split('/');
        photo_path = './upload/' + photo_path[photo_path.length - 2] + '/' + photo_path[photo_path.length - 1];
        console.log(photo_path);
        fs.unlinkSync(decodeURI(photo_path));

        if(req.file) {
            photo = req.file.path;
        } else {
            photo = null;
        }
    } else {
        if (req.file) {
            if (!body.photo_delete && body.img_src) {
                res.send("<script>alert('사진을 먼저 지워주세요.');</script>")
            }
            photo = req.file.path;
        } else {
            db.query(`UPDATE review SET title=?, category=?, content=?, price=?, product_name=?, brand=? WHERE review_number=?`,
            [title, category, content, price, product_name, brand, review_id],
            function(err, result) {
                if (err) {
                    res.send(err);
                    throw err;
                }
                console.log(result);
                res.redirect(`/review/${review_id}`);
            })
            return;

            // if (body.img_src) {
            //     photo = body.img_src;
            //     if (Array.isArray(photo)) photo = photo[0];
            //     console.log(photo);
            //     photo = photo.split('/');
            //     photo = '/upload/' + photo[photo.length - 2] + '/' + photo[photo.length - 1];
            //     console.log(photo);
            // } else {
            //     photo = null;
            // }
            
        }
    }

    console.log(body);

    // let photo_path = body.img_src;
    // console.log(photo_path);
    // photo_path = photo_path.split('/');
    // photo_path = './upload/' + photo_path[photo_path.length - 2] + '/' + photo_path[photo_path.length - 1];
    // console.log(photo_path);

    db.query(`UPDATE review SET title=?, category=?, content=?, price=?, product_name=?, brand=?, photo=? WHERE review_number=?`,
    [title, category, content, price, product_name, brand, photo, review_id],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
            }
        console.log(result);
        res.redirect(`/review/${review_id}`);
    })
})

app.post('/delete', function(req, res) {
    const body = req.body;
    const review_id = body.review_number;

    db.query(`SELECT photo FROM review WHERE review_number=?`,
    [review_id],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }

        const photo = result[0].photo;
        console.log(photo);

        db.query(`DELETE FROM review WHERE review_number=?`,
        [review_id],
        function(err2, result) {
            if (err2) {
                res.send(err2);
                throw err2;
            }
            if (photo) {
                fs.unlinkSync('./' + photo);
            }
            res.redirect('/review');
        })
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

            for(var i = 0; i < comments.length; i++) {
                const cdate = String(comments[i].date).split(" ");
                var formating_cdate = cdate[3] + "-" + cdate[1] + "-" + cdate[2] + "-" + cdate[4];

                if (req.session.user_id === comments[i].user_id) {
                    comment_list += `
                        <p>${comments[i].content}</p>
                        <p>${comments[i].user_id}</p>
                        <p>${formating_cdate}</p>
                        <form action="/review/comment_update/${comments[i].review_comment_number}" method="post">
                            <input type="hidden" name="review_number" value="${review_id}">
                            <p><input type="submit" value="수정"></p>
                        </form>
                        <form action="/review/comment_delete/" method="post">
                            <input type="hidden" name="comment_number" value="${comments[i].review_comment_number}">
                            <input type="hidden" name="review_number" value="${review_id}">
                            <p><input type="submit" value="삭제"></p>
                        </form>
                    `;
                } else {
                    comment_list += `
                        <p>${comments[i].content}</p>
                        <p>${comments[i].user_id}</p>
                        <p>${formating_cdate}</p>
                    `;
                }
                
            }
            
            let auth_btn = ``;
            if (req.session.user_id === review.user_id) {
                auth_btn += `
                <p><input type="submit" value="수정" onClick="location.href='/review/update/${review_id}/'"></p>
                <form action="/review/delete/" method="post">
                    <input type="hidden" name="review_number" value="${review_id}">
                    <p><input type="submit" value="삭제"></p>    
                </form>
                `
            }

            if (review.photo !== null) {
                let photo = review.photo.toString('utf8')
                photo = photo.replace('upload/', '/')
                res.send(review_detail_template(review.review_number, review.title, review.content, formating_rdate, review.price, review.product_name, review.brand, review.category, photo, review.user_id, comment_list, auth_btn));
            } else {
                res.send(review_detail_no_photo_template(review.review_number, review.title, review.content, formating_rdate, review.price, review.product_name, review.brand, review.category, review.user_id, comment_list, auth_btn));
            }
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

app.post('/comment_update/:comment_number', function(req, res) {
    const comment_number = req.params.comment_number;
    const body = req.body;
    const review_id = body.review_number;

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

            for(var i = 0; i < comments.length; i++) {
                const cdate = String(comments[i].date).split(" ");
                var formating_cdate = cdate[3] + "-" + cdate[1] + "-" + cdate[2] + "-" + cdate[4];

                if (req.session.user_id === comments[i].user_id) {
                    if (comment_number == comments[i].review_comment_number) {
                        comment_list += `
                            <form action="/review/comment_update_process" method="post">
                                <input type="hidden" name="comment_number" value="${comment_number}">
                                <input type="hidden" name="review_number" value="${review_id}">
                                <p><textarea name="content">${comments[i].content}</textarea></p>
                                <p><input type="submit" value="수정완료"></p>
                            </form>
                        `;
                    } else {
                        comment_list += `
                        <p>${comments[i].content}</p>
                        <p>${comments[i].user_id}</p>
                        <p>${formating_cdate}</p>\
                        `;
                    }
                } else {
                    comment_list += `
                        <p>${comments[i].content}</p>
                        <p>${comments[i].user_id}</p>
                        <p>${formating_cdate}</p>
                    `;
                }
            }
            
            // let auth_btn = ``;
            // if (req.session.user_id === review.user_id) {
            //     auth_btn += `
            //     <p><input type="submit" value="수정" onClick="location.href='/review/update/${review_id}/'"></p>
            //     <form action="/review/delete/" method="post">
            //         <input type="hidden" name="review_number" value="${review_id}">
            //         <p><input type="submit" value="삭제"></p>    
            //     </form>
            //     `
            // }

            if (review.photo !== null) {
                let photo = review.photo.toString('utf8')
                photo = photo.replace('upload/', '/')
                res.send(review_detail_template(review.review_number, review.title, review.content, formating_rdate, review.price, review.product_name, review.brand, review.category, photo, review.user_id, comment_list, ``));
            } else {
                res.send(review_detail_no_photo_template(review.review_number, review.title, review.content, formating_rdate, review.price, review.product_name, review.brand, review.category, review.user_id, comment_list, ``));
            }
        });
    })
})

app.post('/comment_update_process', function(req, res) {
    const body = req.body;
    const comment_number = body.comment_number;
    const review_number = body.review_number;
    const content = body.content;

    db.query(`UPDATE review_comment SET content=? WHERE review_comment_number=?`,
    [content, comment_number],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
        res.redirect(`/review/${review_number}`);
    })
})

app.post('/comment_delete', function(req, res){
    const body = req.body;
    const comment_number = body.comment_number;
    const review_number = body.review_number;

    db.query(`DELETE FROM review_comment WHERE review_comment_number=?`,
    [comment_number],
    function(err, result) {
        if (err) {
            res.send(err);
            throw err;
        }
        res.redirect(`/review/${review_number}`);
    })
})

// db.query(`SELECT * FROM review`, 
//     function(error, result) {
//         console.log(result[4].photo.toString('utf8'));
// })

module.exports = app;