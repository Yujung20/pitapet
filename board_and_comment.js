const response = require('express');
const express = require('express');
const app = express.Router();
const url = require('url');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');
const path = require('path');

function main_template(current,boardlist,search_title){
    return `
    <!doctype html>
      <html>
          <head>
              <title>Board</title>
              <meta charset="utf-8">
              <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
                <style>
                body{
                    margin: 0;
                }
                a{
                    text-decoration: none;
                    color: black;
                }
                .navbar{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 12px;
                    
                }
                .navbar_logo{
                    font-size: 30px;
                
                }
                .navbar_logo i{
                    color: blue;
                }
                
                .navbar_menu{
                    display: flex;
                    list-style: none;
                    padding-left: 0;
                }
                
                .navbar_menu li{
                    padding: 8px 40px;
                    font-size: 20px;
                
                }
                .navbar_menu li:hover{
                    border-bottom:3px solid blue;
                }
                
                .navbar_menu ul{
                    align-items: center;
                    list-style: none;
                    padding-left: 0;
                    display: none;
                }
                .navbar_menu ul li{
                    padding: 8px 5px;
                }
                .navbar_menu li:hover ul{
                    display: flex;
                    position: absolute;
                }
                .navbar_menu li:hover li:hover{
                    box-sizing: border-box;
                }
                .navbar_icons{
                    list-style: none;
                    display: flex;
                    margin: 0;
                    padding-left:0;
                }
                .navbar_icons li{
                    padding: 8px 12px;
                }
                
                .navbar_icons li:hover{
                    border-bottom: 3px solid blue;
                }
                .nav_selected{
                    color: blue;
                }
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
              </style>
          </head>
          <body>
          <nav class="navbar">
            <div class="navbar_logo">
                <a href="/"><i class="fas fa-paw"></i></a>
                <a href="/">pit-a-pet</a>
            </div>

            <ul class="navbar_menu">
                <li> <a href="/qna">Q&A</a> </li>
                <li> <a href="/review">리뷰</a> </li>
                <li> <a href="/information">기본 정보</a> </li>
                <li> <a href="/hospital">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board" class="nav_selected">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
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
  
  function detail_template(current, board_id, board_title, board_content, board_user, board_date, board_category,
      comments, auth_btn) {
      return `
      <!doctype html>
      <html>
          <head>
              <title>board content</title>
              <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }

            .detail_table {
                width="100%";
                cellpadding="0";
                cellspacing="0";
                border="0";
            }
           td.underlined {
               border-top: 2px solid #000000;
           }

           td.font_size {
               font-size: 20px;
           }
           td.underlined_blue {
            border-top: 2px solid blue;
           }
            .nav_selected{
                color: blue;
            }
            .comment_textarea {
                width: 51%;
                margin: 3px 0 0 0;
                padding: 42px;
                display: inline-blue;
                border: 2px solid blue;
                border-radius: 10px;
                background: none;
            }
            .comment_submit {
                background-color: #0066FF;
                color: white;
                padding: 42px;
                margin: 3px 0 0 6px;
                border: none;
                cursor: pointer;
                width: 10%;
                opacity: 0.9;
                border-radius: 10px;
                box-shadow: 3px 3px 3px #b0b0b0;
            }
            .auth_btn {
                background-color: #0066FF;
                color: white;
                padding: 18px;
                margin: 3px 0 0 5px;
                border: none;
                cursor: pointer;
                width: 13%;
                opacity: 0.9;
                border-radius: 10px;
                box-shadow: 3px 3px 3px #b0b0b0;
            }
            </style>
              <meta charset="utf-8">
          </head>
          <body>
          <nav class="navbar">
            <div class="navbar_logo">
                <a href="/"><i class="fas fa-paw"></i></a>
                <a href="/">pit-a-pet</a>
            </div>

            <ul class="navbar_menu">
                <li> <a href="/qna">Q&A</a> </li>
                <li> <a href="/review">리뷰</a> </li>
                <li> <a href="/information">기본 정보</a> </li>
                <li> <a href="/hospital">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board" class="nav_selected">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
        <table align="center" class="detail_table" bgcolor="#F4F4F4";>
                <tr align="center">
                    <td align="left"><h2>&nbsp;[ ${board_category} ]</h2></td>
                    <td align="left"><h2>&nbsp;${board_title}</h2></td>
                    <td width=80% align="right"><p>${board_user}&nbsp;</p></td>
                </tr>
                <tr align="center">
                    <td class="underlined" width=38% align="right" colspan="3"><p>${board_date}&nbsp;</p></td>
                </tr>
                <tr align="center">
                    <td class="font_size" align="left"><p>&nbsp;&nbsp;&nbsp;${board_content}</p></td>
                    </tr>
              </table>
              ${auth_btn}
              <div style="padding: 2% 0 2% 0; text-align="center"'></div>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <form action="/board/write_comment/" method="post">
                <input type="hidden" name="board_id" value="${board_id}">
                <tr>
                <td align="center">
                    <input type="textarea" name="content" class="comment_textarea">
                    <input type="submit" value="등록" class="comment_submit">
                </td>
                </tr>
            </form>
            </table>
              ${comments}
          </body>
      </html>
      `
  }
  
  function board_template(current) {
      return `
      <!doctype html>
      <html>
          <head>
              <title>write board</title>
              <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }
            .nav_selected{
                color: blue;
            }
            </style>
              <meta charset="utf-8">
          </head>
          <body>
          <nav class="navbar">
            <div class="navbar_logo">
                <a href="/"><i class="fas fa-paw"></i></a>
                <a href="/">pit-a-pet</a>
            </div>

            <ul class="navbar_menu">
                <li> <a href="/qna">Q&A</a> </li>
                <li> <a href="/review">리뷰</a> </li>
                <li> <a href="/information">기본 정보</a> </li>
                <li> <a href="/hospital">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board" class="nav_selected">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
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
  
  function board_update_template(current,board_id, board_title, board_content, board_category) {
      return `
      <!doctype html>
      <html>
          <head>
              <title>update board</title>
              <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }
            .nav_selected{
                color: blue;
            }
            </style>
              <meta charset="utf-8">
          </head>
          <body>
                <nav class="navbar">
                    <div class="navbar_logo">
                        <a href="/"><i class="fas fa-paw"></i></a>
                        <a href="/">pit-a-pet</a>
                    </div>

                    <ul class="navbar_menu">
                        <li> <a href="/qna">Q&A</a> </li>
                        <li> <a href="/review">리뷰</a> </li>
                        <li> <a href="/information">기본 정보</a> </li>
                        <li> <a href="/hospital">동반 정보</a>
                            <ul class="sub">
                                <li> <a href="/hospital">병원</a> </li>
                                <li> <a href="/store">매장</a> </li>
                            </ul>
                        </li>
                        <li> <a href="/board" class="nav_selected">커뮤니티</a> </li>
                    </ul>

                    <ul class ="navbar_icons">
                        ${current}
                    </ul>
                </nav>
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
      var current=``;
            if(req.session.user_id){//로그인 한 경우
                var id=req.session.user_id;
                current=`<li> <a href="/logout">로그아웃</a> </li>
                <li> <a href="/mypage">${id}--마이페이지</a> </li>`
                console.log(id)
            }
            else{
                current=`<li> <a href="/login">로그인</a> </li>
                <li> <a href="/signup">회원가입</a> </li>`
            }
      db.query(`SELECT * FROM board ORDER BY date DESC`, function(error, boards) {
          if (Object.keys(boards).length > 0) {
            for (var i = 0; i < Object.keys(boards).length; i++) {
                const qdate = String(boards[i].date).split(" ");
                var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];
                board_list += `<tr align="center"><td class="tableline" align="left" width="50%">
                                <a href="/board/written/${boards[i].board_number}">[ ${boards[i].category} ] ${boards[i].title}</a></td>
                                <td class="tableline" align="right">${boards[i].user_id}</td>
                                <td class="tableline" align="right">
                                <p>${formating_qdate}</p></td></tr>
                                `
            }
            } else {
                board_list = '0개의 게시물이 있습니다.';
            }
          res.end(main_template(current,board_list));
      });
  });
  
  app.get('/write/', function(req, res) {
    var current=``;
    if(req.session.user_id){//로그인 한 경우
        var id=req.session.user_id;
        current=`<li> <a href="/logout">로그아웃</a> </li>
        <li> <a href="/mypage">${id}--마이페이지</a> </li>`
        console.log(id)
    }
    else{
        current=`<li> <a href="/login">로그인</a> </li>
        <li> <a href="/signup">회원가입</a> </li>`
    }
      res.end(board_template(current));
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
      var current=``;
      if(req.session.user_id){//로그인 한 경우
          var id=req.session.user_id;
          current=`<li> <a href="/logout">로그아웃</a> </li>
          <li> <a href="/mypage">${id}--마이페이지</a> </li>`
          console.log(id)
      }
      else{
          current=`<li> <a href="/login">로그인</a> </li>
          <li> <a href="/signup">회원가입</a> </li>`
      }
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
                          <<table align="center" class="detail_table";>
                          <tr align="center" >
                              <td align="left"><h2 style="color: blue;">&nbsp;${comments[i].user_id}</h2></td>
                          </tr>
                          <tr align="center">
                              <td class="underlined_blue" width=950px align="right" colspan="3"><p style="color: blue;">${formating_adate}&nbsp;</p></td>
                          </tr>
                          <tr align="center">
                              <td class="font_size" align="left" style="color: blue;"><p>&nbsp;&nbsp;&nbsp;${comments[i].content}</p></td>
                              </tr>
                        </table>
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
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr align="center">
                      <td width=55%><p>&nbsp</p></td>
                      <td border-right=20% aiign="right">
                          <input class="auth_btn" type="submit" value="수정" onClick="location.href='/board/written/${board_id}/update/'">
                          <input class="auth_btn" type="submit" value="삭제" onClick="location.href='/board/written/${board_id}/delete/'">
                      </td>
                      </tr>
                        </table>
                      `
                  }
  
                  res.send(detail_template(current,board_id, board[0].title, board[0].content, board[0].user_id, formating_qdate, board[0].category, comments_list, auth_btn));
              })
          })
      }
  })

  app.get('/search/', function(req, res) {
        const b_keyword = req.query.search_title;
        var board_list = ``;
        var current=``;
        if(req.session.user_id){//로그인 한 경우
            var id=req.session.user_id;
            current=`<li> <a href="/logout">로그아웃</a> </li>
            <li> <a href="/mypage">${id}--마이페이지</a> </li>`
            console.log(id)
        }
        else{
            current=`<li> <a href="/login">로그인</a> </li>
            <li> <a href="/signup">회원가입</a> </li>`
        }
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
        
            res.send(main_template(current,board_list));
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
      var current=``;
      if(req.session.user_id){//로그인 한 경우
          var id=req.session.user_id;
          current=`<li> <a href="/logout">로그아웃</a> </li>
          <li> <a href="/mypage">${id}--마이페이지</a> </li>`
          console.log(id)
      }
      else{
          current=`<li> <a href="/login">로그인</a> </li>
          <li> <a href="/signup">회원가입</a> </li>`
      }
      db.query(`SELECT * FROM board WHERE board_number = ?`,
      [board_id],
      function(err, board) {
          if (err) {
              res.send(err);
              throw err;
          }
          console.log(board);
          res.send(board_update_template(current,board_id, board[0].title, board[0].content, board[0].category));
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