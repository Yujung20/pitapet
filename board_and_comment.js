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
                .tableline {
                    border-bottom: 1px solid #888888;
                }

                .tableline a:hover {
                    border-bottom:3px solid blue;
                }

                a {
                    text-decoration: none;
                    color: black;
                }

                .search_p {
                    font-size: 14px;
                }

                .search_text {
                    width: 40%;
                    padding: 15px;
                    margin: 3px 0 0 0;
                    display: inline-block;
                    border: 1px solid #000000;
                    border-radius: 10px;
                    background: none;
                }

                .search_submit {
                    background-color: #0066FF;
                    color: white;
                    padding: 15px;
                    margin: 3px 0 0 5px;
                    border: none;
                    cursor: pointer;
                    width: 8%;
                    opacity: 0.9;
                    border-radius: 10px;
                    box-shadow: 3px 3px 3px #b0b0b0;
                }

                .tb_button {
                    background-color: #0066FF;
                    color: white;
                    padding: 15px;
                    margin: 3px 0 0 5px;
                    border: none;
                    cursor: pointer;
                    width: 42.3%;
                    opacity: 0.9;
                    border-radius: 10px;
                    box-shadow: 3px 3px 3px #b0b0b0;
                }

                .detail_table {
                    width="100%";
                    cellpadding="0";
                    cellspacing="0";
                    border="0";
                }

                .datail_table.detail_underline {
                    border-top: 2px solid #888888;
                }
              </style>
          </head>
          <body>
              <h1>Board</h1>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <form action="/board/search?b_title=${search_title}"method="get">
                <tr>
                <td align="center">
                    <p class="search_p">커뮤니티 검색&nbsp&nbsp&nbsp
                    <input type="text" name="search_title" placeholder="검색어를 입력하세요." class="search_text">&nbsp
                    <input type="submit" value="검색" class="search_submit"></p>
                </td>
                </tr>
            </form>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
            <td align="center">
              <button class="tb_button" type="button" onclick="location.href='/board/write/'">글 작성하기</button>
            </td>
            </tr>
            </table>
            <table align="center" width="80%" cellpadding="0" cellspacing="0" border="0">
                <tr align="left">
                    <td><h3>글 목록</h3></td>
                </tr>
                <tr> <p>&nbsp</p> </tr>
              ${boardlist}
              </table>
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
              <table align="center" class="detail_table">
                <tr align="center" padding=25px>
                    <td align="left"><h2>[ ${board_category} ]</h2></td>
                    <td align="left"><h2>${board_title}</h2></td>
                    <td width=66% align="right"><p>${board_user}</p></td>
                </tr>
                <tr class="detail_underline" align="center" padding=10px>
                    <td width=33% align="right" colspan="3"><p>${board_date}</p></td>
                </tr>
                <tr align="center" padding=20px>
                    <td align="left"><p>${board_content}</p></td>
              </table>
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
                const qdate = String(boards[i].date).split(" ");
                var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];
                board_list += `<tr align="center"><td class="tableline" align="left" width="50%">`
                board_list += `<a href="/board/written/${boards[i].board_number}">${boards[i].title}</a></td>`;
                board_list += `<td class="tableline" align="right">${boards[i].user_id}</td>`
                board_list += `<td class="tableline" align="right">`
                board_list += `<p>${formating_qdate}</p></td></tr>`
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
                              <form action="/board/comment_delete/" method="post">
                                <input type="hidden" name="comment_number" value="${comments[i].comment_number}">
                                <input type="hidden" name="board_number" value="${board_id}">
                                <p><input type="submit" value="삭제"></p>
                            </form>
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
  
  app.get('/comment_delete', function(req, res) {
    const body = req.body;  
    const comment_id = body.comment_number;
    const board_id = body.board_number;
  
      db.query(`DELETE FROM board_comment WHERE comment_number = ?`,
      [comment_id],
      function(err, result) {
          if (err) {
              res.send(err);
              throw err;
          }
          console.log(result);
  
          res.redirect(`/board/written/${board_id}/`);
      });
  });
  
  module.exports = app;