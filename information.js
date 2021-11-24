const response = require('express');
const express = require('express');
const app = express.Router();
const url = require('url');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');


function main_template(type_list) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>information</title>
            <meta charset="utf-8">
        </head>
        <body> 
        <h1>종류</h1>
        ${type_list}
            
        </body>
    </html>
    `;
}


function information_template(feedtimes, foodtype, vaccine, bathtimes, warning) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>information detail</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h3> 먹이 횟수  </h3>
            <p> 하루에 ${feedtimes} 번 </p>
            <h3> 먹이 종류 </h3>
            ${foodtype}
            <h3> 예방 접종 </h3>
            ${vaccine}
            <h3> 목욕 횟수 </h3>
            ${bathtimes}
            <h3> 주의 사항  </h3>
            ${warning}
        </body>
    </html>
    `;
}





app.get('/', function(req, res) {
    var type_list=``;
    db.query(`SELECT * FROM information `,
    function(err,informations){
        if (err) throw err;
        else{
            for (var i=0; i<Object.values(informations).length;i++){
                type_list+=`<p><a href="/information/type/?id=${informations[i].id}">${informations[i].type}     ></a> <p>`;
            }
            res.end(main_template(type_list));
        }
        
    });
    
    
});


app.get('/type/', function(req, res) {
    const information_id = url.parse(req.url, true).query.id;

    if (information_id) {
        db.query(`SELECT * FROM information WHERE id = ?`, 
        [information_id],
        function(error, information) {
            if (error) {
                throw error;
            }
            console.log(information);
            res.end(information_template(information[0].feedtimes, information[0].foodtype, information[0].vaccine, information[0].bathtimes,information[0].warning));
        })
    }
})

module.exports = app;