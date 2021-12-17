const response = require('express');
const express = require('express');
const app = express.Router();
const url = require('url');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');
const path = require('path');

function main_template(boardlist,search_title){
    return `
    <!doctype html>
      <html>
          <head>
              <title>Board</title>
              <meta charset="utf-8">
              <style>
              button {
                background-color: #0066FF;
                color: white;
                padding: 14px;
                margin: 8px 0;
                border: none;
                cursor: pointer;
                width: 100%;
                border-radius: 15px;
                }
    
                button:hover {
                opacity: 0.8;
                }
              </style>
          </head>
          <body>
              <h1>Board</h1>
              <div class="container">
              <form action="/board/search?b_title=${search_title}"method="get">
                <input type="text" name="search_title" placeholder="검색어를 입력하세요.">
                <button type="submit">검색</button>
            </form>
            </div>
              <a href="/board/write/">작성하기</a>
              ${boardlist}
          </body>
      </html>
    `;
  }
  
  function detail_template(board_id, board_title, board_content, board_user, board_date, board_category,
      comments, auth_btn) {
      return `
      <!doctype html>
      <html>
          <head>
              <title>board content</title>
              <meta charset="utf-8">
          </head>
          <body>
              <h1>${board_title}</h1>
              <p>${board_category}</p>
              <p>${board_content}</p>
              <p>${board_user}</p>
              <p>${board_date}</p>
              ${auth_btn}
              <hr/>
              <h3>댓글</h3>
              <form action="/board/write_comment/" method="post">
                  <input type="hidden" name="board_id" value="${board_id}">
                  <p><textarea name="content"></textarea></p>
                  <p><input type="submit" value="등록"></p>
              </form>
              ${comments}
          </body>
      </html>
      `
  }
  
  function board_template() {
      return `
      <!doctype html>
      <html>
          <head>
              <title>write board</title>
              <meta charset="utf-8">
          </head>
          <body>
              <h1>작성하기</h1>
              <form action="/board/write/" method="post">
                  <p><input type"text" name="title" placeholder="title"></p>
                  <p><select name="category">
                      <option value="정보 공유">정보 공유</option>
                      <option value="산책 메이트">산책 메이트</option>
                  </select></p>
                  <p><textarea name="content"></textarea></p>
                  <p><input type="submit" value="등록"></p>
              </form>
          </body>
      </html>
      `;
  }
  
  function board_update_template(board_id, board_title, board_content, board_category) {
      return `
      <!doctype html>
      <html>
          <head>
              <title>update board</title>
              <meta charset="utf-8">
          </head>
          <body>
              <form action="/board/written/${board_id}/update_process/" method="post">
                  <h1><input type="text" name="title" value="${board_title}"></h1>
                  <p><textarea name="content">${board_content}</textarea></p>
                  <p><select name="category" value="${board_category}">
                    <option value="정보 공유">정보 공유</option>
                    <option value="산책 메이트">산책 메이트</option>
                  </select></p>
                  <p><input type="submit" value="수정"></p>
              </form>
          </body>
      </html>
      `;
  }
  
  app.get('/', function(req, res) {
      var board_list = ``;
      db.query(`SELECT * FROM board ORDER BY date DESC`, function(error, boards) {
          if (Object.keys(boards).length > 0) {
            for (var i = 0; i < Object.keys(boards).length; i++) {
                board_list += `<p><a href="/board/written/${boards[i].board_number}">${boards[i].title}</a></p>`;
            }
            } else {
                board_list = '0개의 게시물이 있습니다.';
            }
          res.end(main_template(board_list));
      });
  });
  
  app.get('/write/', function(req, res) {
      res.end(board_template());
  })
  
  app.post('/write/', function(req, res) {
      const body = req.body;
      const title = body.title;
      const content = body.content;
      const category = body.category;
      const user = req.session.user_id;
      
      db.query(`INSERT INTO board (user_id, title, content, category) VALUES(?, ?, ?, ?)`,
      [user, title, content, category],
      function(error, result) {
          if (error) {
              res.send(error);
              throw error;
          }
          res.redirect('/board');
      })
  })
  
  app.get('/written/:board_id', function(req, res) {
      const board_id = req.params.board_id;
      var comments_list = ``;
  
      if (board_id) {
          db.query(`SELECT * FROM board WHERE board_number = ?`, 
          [board_id],
          function(err1, board) {
              if (err1) {
                  res.end(err1);
                  throw err1;
              }
  
              db.query(`SELECT * FROM board_comment WHERE board_number = ?`,
              [board_id],
              function(err2, comments) {
                  if (err2) {
                      res.send(err2);
                      throw err2;
                  }
  
                  for (var i = 0; i < Object.keys(comments).length; i++) {
                      const adate = String(comments[i].date).split(" ");
                      var formating_adate = adate[3] + "-" + adate[1] + "-" + adate[2] + "-" + adate[4];
  
                      if (req.session.user_id === comments[i].user_id) {
                          comments_list += `
                              <p>${comments[i].content}</p>
                              <p>${comments[i].user_id}</p>
                              <p>${formating_adate}</p>
                              <p><input type="submit" value="삭제" onClick="location.href='comment/${comments[i].comment_number}/delete/'"></p>
                              <hr/>
                          `
                      } else {
                          comments_list += `
                              <p>${comments[i].content}</p>
                              <p>${comments[i].user_id}</p>
                              <p>${formating_adate}</p>
                              <hr/>
                          `
                      }
                  }
  
                  const qdate = String(board[0].date).split(" ");
                  var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];
  
                  let auth_btn = ``;
                  if (req.session.user_id === board[0].user_id) {
                      auth_btn = `
                          <p><input type="submit" value="수정" onClick="location.href='/board/written/${board_id}/update/'"></p>
                          <p><input type="submit" value="삭제" onClick="location.href='/board/written/${board_id}/delete/'"></p>
                      `
                  }
  
                  res.send(detail_template(board_id, board[0].title, board[0].content, board[0].user_id, formating_qdate, board[0].category, comments_list, auth_btn));
              })
          })
      }
  })

  app.get('/search/', function(req, res) {
        const b_keyword = req.query.search_title;
        var board_list = ``;

        console.log(b_keyword);
        if(b_keyword) {
        db.query(`SELECT * FROM board WHERE title LIKE ? ORDER BY date DESC`, 
        ['%'+b_keyword+'%'],function(err, boards) {
            if (err) {
                res.send(err);
                throw err;
            }
        
            if (Object.keys(boards).length > 0) {
                for (var i = 0; i < Object.keys(boards).length; i++) {
                    board_list += `<p><a href="/board/written/${boards[i].board_number}">${boards[i].title}</a><p>`;
                }
            } else {
                board_list = `<p> 검색 결과가 없습니다. </p>`
                    
            }
        
            res.send(main_template(board_list));
        })
        }
        else {
            res.send('<script type="text/javascript">alert("검색어를 입력해주세요.");location.href="/board";</script>')
        }
  });
  
  app.post('/write_comment/', function(req, res) {
      const body = req.body;
      const board_id = body.board_id;
      const content1 = body.content;
      const user1 = req.session.user_id;
  
      db.query(`INSERT INTO board_comment (user_id, content, board_number) VALUES (?, ?, ?)`,
      [user1, content1, board_id],
      function(error, comments) {
          if (error) {
              res.send(error);
              throw error;
          }
          console.log(comments);
          res.redirect(`/board/written/${board_id}`);
      })
  });
  
  app.get('/written/:board_id/update/', function(req, res) {
      const board_id = req.params.board_id;
      console.log(board_id);
  
      db.query(`SELECT * FROM board WHERE board_number = ?`,
      [board_id],
      function(err, board) {
          if (err) {
              res.send(err);
              throw err;
          }
          console.log(board);
          res.send(board_update_template(board_id, board[0].title, board[0].content, board[0].category));
      })
  });
  
  app.post('/written/:board_id/update_process/', function(req, res) {
      const board_id = req.params.board_id;
  
      const body = req.body;
      const title = body.title;
      const content = body.content;
      const category = body.category;
  
      db.query(`UPDATE board SET title=?, content=?, category=? WHERE board_number = ?`,
      [title, content, category, board_id],
      function(err, board) {
          if(err) {
              res.send(err);
              throw err;
          }
          console.log(board);
          res.redirect(`/board/written/${board_id}/`);
      })
  });
  
  app.get('/written/:board_id/delete/', function(req, res) {
      const board_id = req.params.board_id;
  
      db.query(`DELETE FROM board WHERE board_number = ?`,
      [board_id],
      function(err, result) {
          if (err) {
              res.send(err);
              throw err;
          }
  
          res.redirect('/board/');
      });
  });
  
  app.get('/written/comment/:comment_id/delete/', function(req, res) {
      const comment_id = req.params.comment_id;
  
      db.query(`DELETE FROM board_comment WHERE comment_number = ?`,
      [comment_id],
      function(err, result) {
          if (err) {
              res.send(err);
              throw err;
          }
          console.log(result);
  
          res.redirect('/board/');
      });
  });
  
  module.exports = app;