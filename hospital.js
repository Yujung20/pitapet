const response = require('express');
const express = require('express');
const app = express.Router();
const url=require('url');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');
const path=require('path')

function main_template(current, marker_list,info_list,search_name){
    return `
    <!doctype html>
    <html>
        <head>
            <title>hospital</title>
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
            .container{
                display: flex;
                flex-direction: column;
                flex: 1;
                align-items: center;
                margin-left: auto;
                margin-right: auto;
            }
            .row {
                flex-direction: row;
                flex: 1;
                justify-content: center;
                display: flex;
                max-width: 500px;
                width: 100%;
            }
            .hospital_row {
                flex-direction: row;
                flex: 1;
                justify-content: space-between;
                display: flex;
                max-width: 1000px;
                width: 100%;
            }
            .pet_row{
                flex-direction: row;
                    flex: 1;
                    display: flex;
                    justify-content: right;;
                    max-width: 1000px;
                    width: 100%;
            }
            .pet{
                align-self: center;
                margin: 0px 20px 0px 0px;
            }
            label {
                align-self: center;
                width: 20%;
                font-size: 15px;
            }
            a {
                color: black;
                text-decoration: none;
                align-self: center;
                width: 20%;
            }
            #underline {
                color: black;
                text-decoration: none;
                align-self: center;
                width: 20%;
            }
            #underline:hover {
                border-bottom: 3px solid blue;
                width: auto;
            }
            hr {
                margin: 0 0 15px 0;
                max-width: 1000px;
                width: 100%;
            }
            #search_name {
                width: 80%;
                padding: 10px;
                margin: 3px 0 0 0;
                display: inline-block;
                border: 1px solid #000000;
                border-radius: 10px;
                background: none;
            }
            .hospital_list {
                flex-direction: column;
                flex: 1;
                justify-content: space-between;
                display: flex;
                max-width: 1000px;
                width: 100%;
            }
            #list_txt {
                align-self: start;
                font-weight: bolder;
                margin: 10px 0px 5px 0px;
            }
            input[type="submit"] {
                background-color: #0066FF;
                color: white;
                padding: 10px 10px 10px 10px;
                margin: 3px 0 0 5px;
                border: none;
                cursor: pointer;
                width: 20%;
                opacity: 0.9;
                border-radius: 10px;
                float: right;
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
                <li> <a href="/hospital" class="nav_selected">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital" class="nav_selected">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
        <div class="container">
            <form class="row" action="/hospital/search?h_name=${search_name}">
                    <label for="search_name">병원 검색</label>
                    <input type="text" id="search_name" name="search_name" placeholder="검색어를 입력하세요.">
                    <input type="submit" value="검색">
            </form>
            <br>
            <div id="map" style="width:1000px;height:500px;"></div>
            <h3>야간 운영 병원은 붉은색 마커로 표시됩니다.</h3>
            <div class="hospital_list">
                <h3><p id="list_txt">병원 목록</p></h3>
                ${info_list}
            </div>
        </div>
	<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=	e4410d501aa08cb040f89f52b5ee63d2"></script>
	<script>
		var container = document.getElementById('map');
		var options = {
			center: new kakao.maps.LatLng(37.59244753353966, 127.02133437301545),
			level: 7
		};
        var map = new kakao.maps.Map(container, options);
        var marker_information = [
            ${marker_list}
        ];

        var imageSrc1 = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 마커이미지의 주소입니다    
            imageSize1 = new kakao.maps.Size(25, 37), // 마커이미지의 크기입니다
            imageOption1 = {offset: new kakao.maps.Point(27, 69)};

        var imageSrc2 = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', // 마커이미지의 주소입니다    
            imageSize2 = new kakao.maps.Size(25, 40), // 마커이미지의 크기입니다
            imageOption2 = {offset: new kakao.maps.Point(27, 69)};

        var markerImage1 = new kakao.maps.MarkerImage(imageSrc1, imageSize1, imageOption1);
        var markerImage2 = new kakao.maps.MarkerImage(imageSrc2, imageSize2, imageOption2);
        for (let i = 0; i < marker_information.length; i ++) {
            var setimage;
            if(marker_information[i].night!=0){
                setimage=markerImage1;
            }
            else{
                setimage=markerImage2;
            }
            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                position: marker_information[i].latlng,
                title : marker_information[i].title,
                image: setimage,
            });
            var infowindow= new kakao.maps.InfoWindow({
                content: marker_information[i].content, // 인포윈도우에 표시할 내용
            });
            
            marker.setMap(map)

            kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
            kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        }
        function makeOverListener(map, marker, infowindow) {
            return function() {
                infowindow.open(map, marker);
            };
        }
        function makeOutListener(infowindow) {
            return function() {
                infowindow.close();
            };
        }
	</script>
        </body>
    </html>
    `;
    
}
function detail_template(current,detail_list){
    return `
    <!doctype html>
    <html>
        <head>
            <title>detail info</title>
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
            .detail_list{
                position: absolute;
                height: 70%;
                top: 15%;
                padding-left: 5%;
            }
            .detail_name{
                font-size: 50px;
                font-weight: bold;
                height: 10vh;
                display: inline-block;
                margin-bottom: 2%;
            }
            .detail_pet{
                font-size:20px;                
                line-height:2.5;

            }
            .detail_day{
                font-size:20px;                
                line-height:2.5;
            }
            hr{
                width:30vw;
                color:black;
                text-align:center;
                left:5%;
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
                <li> <a href="/hospital" class="nav_selected">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital" class="nav_selected">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
        <div class="detail_list">${detail_list}</div>
        <br>
        </body>
        </html>
        `;
}
app.get('/', function (req, res) {
    var marker_list=``;
    var info_list=``;
    db.query(`SELECT * FROM hospital LEFT JOIN hospital_pet ON hospital.hospital_name=hospital_pet.hospital_name LEFT JOIN hospital_time ON hospital.hospital_name=hospital_time.hospital_name ORDER BY hospital.hospital_name ASC, FIELD (day,'월요일','화요일','수요일','목요일','금요일','토요일','일요일'); `,
    function(err,hospitals){
        if (err) throw err;
        else{
            var H=" ";
            var D=" ";
            var pet_list=``;
            var day_list=``;
            var count=0;
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
            for (var i=0; i<Object.keys(hospitals).length-1;i++){
                if(H!=hospitals[i].hospital_name){
                    marker_list+=`{
                        title: '${hospitals[i].hospital_name}', 
                        latlng: new kakao.maps.LatLng(${hospitals[i].latitude}, ${hospitals[i].longitude}),
                        night: ${hospitals[i].night},
                        `;
                    pet_list+=`${hospitals[i].pet},`;
                    day_list+=`${hospitals[i].day}: ${hospitals[i].start_time}~${hospitals[i].end_time} <br>`;
                    H=hospitals[i].hospital_name;
                    D=hospitals[i].day;
                }
                else{
                    if(D==hospitals[i].day){
                        if(count==0){
                            pet_list+=`${hospitals[i].pet}, `
                        }
                    }
                    else{
                        day_list+=`${hospitals[i].day}: ${hospitals[i].start_time}~${hospitals[i].end_time} <br>`;
                        count++;
                        D=hospitals[i].day;
                    }
                }
                if(H!=hospitals[i+1].hospital_name){
                    marker_list+=`content:'<div><h6>${hospitals[i].hospital_name}<br>${pet_list}<br>${day_list}</h6></div>'},
                    `;
                    info_list+=
                    `<div class="hospital_row">
                        <a id="underline" href="/hospital/info/?id=${hospitals[i].hospital_name}">${hospitals[i].hospital_name}</a>
                        <div class="pet_row">
                        <p class="pet">${pet_list}</p></div></div><hr/>`;
                if(i+1!=(hospitals).length){
                    pet_list=` `;
                    day_list=` `;
                    count=0;
                }
                }
            }
            marker_list+=`content:'<div><h6>${hospitals[i].hospital_name}<br>${pet_list}<br>${day_list}</h6></div>'},
                `;
                info_list+=
                    `<div class="hospital_row">
                        <a id="underline" href="/hospital/info/?id=${hospitals[i].hospital_name}">${hospitals[i].hospital_name}</a>
                        <div class="pet_row">
                        <p class="pet">${pet_list}</p></div></div><hr/>`;
            res.end(main_template(current,marker_list,info_list));
        }
        
    });
});
app.get('/search/',function(req,res){
    const keyword=req.query.search_name;
    var marker_list=``;
    var info_list=``;
    console.log(keyword);
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
    db.query(`SELECT * FROM hospital LEFT JOIN hospital_pet ON hospital.hospital_name=hospital_pet.hospital_name LEFT JOIN hospital_time ON hospital.hospital_name=hospital_time.hospital_name WHERE hospital.hospital_name LIKE ? ORDER BY hospital.hospital_name ASC, FIELD (day,'월요일','화요일','수요일','목요일','금요일','토요일','일요일')`,['%'+keyword+'%'],function(err,hospitals){
        if(err)throw err;
        if(Object.keys(hospitals).length>0){
            var H=" ";
            var D=" ";
            var pet_list=``;
            var day_list=``;
            var count=0;
            for (var i=0; i<Object.keys(hospitals).length-1;i++){
                if(H!=hospitals[i].hospital_name){
                    marker_list+=`{
                        title: '${hospitals[i].hospital_name}', 
                        latlng: new kakao.maps.LatLng(${hospitals[i].latitude}, ${hospitals[i].longitude}),
                        night: ${hospitals[i].night},
                        `;
                    pet_list+=`${hospitals[i].pet},`;
                    day_list+=`${hospitals[i].day}: ${hospitals[i].start_time}~${hospitals[i].end_time} <br>`;
                    H=hospitals[i].hospital_name;
                    D=hospitals[i].day;
                }
                else{
                    if(D==hospitals[i].day){
                        if(count==0){
                            pet_list+=`${hospitals[i].pet}, `
                        }
                    }
                    else{
                        day_list+=`${hospitals[i].day}: ${hospitals[i].start_time}~${hospitals[i].end_time} <br>`;
                        count++;
                        D=hospitals[i].day;
                    }     
                }
                if(H!=hospitals[i+1].hospital_name){
                    marker_list+=`content:'<div><h6>${hospitals[i].hospital_name}<br>${pet_list}<br>${day_list}</h6></div>'},
                    `;
                    info_list+=`<div class="hospital_row">
                        <a id="underline" href="/hospital/info/?id=${hospitals[i].hospital_name}">${hospitals[i].hospital_name}</a>
                        <div class="pet_row">
                        <p class="pet">${pet_list}</p></div></div><hr/>`;
                if(i+1!=(hospitals).length){
                    pet_list=` `;
                    day_list=` `;
                    count=0;
                }
                }
            }
            marker_list+=`content:'<div><h6>${hospitals[i].hospital_name}<br>${pet_list}<br>${day_list}</h6></div>'},
                `;
                info_list+=
                    `<div class="hospital_row">
                        <a id="underline" href="/hospital/info/?id=${hospitals[i].hospital_name}">${hospitals[i].hospital_name}</a>
                        <div class="pet_row">
                        <p class="pet">${pet_list}</p></div></div><hr/>`;
            console.log(marker_list);
            res.end(main_template(current, marker_list,info_list));
        }
        else {
            marker_list=``
            info_list=``;
            res.end(main_template(current, marker_list,info_list));
        }
    })
});
app.get('/info/',function(req,res){
    const info_id = url.parse(req.url, true).query.id;
    console.log(info_id);
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
    var detail_list=``;
    if(info_id){
        db.query(`SELECT * FROM hospital LEFT JOIN hospital_pet ON hospital.hospital_name=hospital_pet.hospital_name LEFT JOIN hospital_time ON hospital.hospital_name=hospital_time.hospital_name WHERE hospital.hospital_name = ? ORDER BY hospital.hospital_name ASC, FIELD (day,'월요일','화요일','수요일','목요일','금요일','토요일','일요일')`,[info_id],
        function(error, hospitals){
            if(error){
                throw error;
            }
            var H=" ";
            var D=" ";
            var pet_list=``;
            var day_list=``;
            var count=0;
            for (var i=0; i<Object.keys(hospitals).length-1;i++){
                if(H!=hospitals[i].hospital_name){
                    pet_list+=`${hospitals[i].pet},`;
                    day_list+=`${hospitals[i].day}: ${hospitals[i].start_time}~${hospitals[i].end_time} <br>`;
                    H=hospitals[i].hospital_name;
                    D=hospitals[i].day;
                }
                else{
                    if(D==hospitals[i].day){
                        if(count==0){
                            pet_list+=`${hospitals[i].pet}, `
                        }
                    }
                    else{
                        day_list+=`${hospitals[i].day}: ${hospitals[i].start_time}~${hospitals[i].end_time} <br>`;
                        count++;
                        D=hospitals[i].day;
                    }
                }
                if(H!=hospitals[i+1].hospital_name){
                    detail_list+=`
                    <div class="detail_name">${hospitals[i].hospital_name}</div>
                    <div class="detail_pet">${pet_list}</div>
                    <div calss="detail_day">${day_list}</div>`;
                if(i+1!=(hospitals).length){
                    pet_list=` `;
                    day_list=` `;
                    count=0;
                }
                }
            }
            detail_list+=`
            <div class="detail_name">${hospitals[i].hospital_name}</div><hr/>
            <div class="detail_pet">${pet_list}</div><hr/>
            <div calss="detail_day">${day_list}</div>`;
            console.log(hospitals);
            res.send(detail_template(current, detail_list));
        })
    }
});
module.exports = app;