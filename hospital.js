const response = require('express');
const express = require('express');
const app = express.Router();
const url=require('url');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');
const path=require('path')

function main_template(marker_list,search_name){
    return `
    <!doctype html>
    <html>
        <head>
            <title>hospital</title>
            <meta charset="utf-8">
        </head>
        <body> 
        <form action="/hospital/search?h_name=${search_name}"method="get">
                <p><input type="text" name="search_name" placeholder="검색어를 입력하세요.">
                <input type="submit" value="검색"></p>
        </form>
        <h6>야간 운영 병원은 붉은색 마커로 표시됩니다.</h6>
        <div id="map" style="width:700px;height:400px;"></div>
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
app.get('/', function (req, res) {
    var marker_list=``;
    db.query(`SELECT * FROM hospital LEFT JOIN hospital_pet ON hospital.hospital_name=hospital_pet.hospital_name LEFT JOIN hospital_time ON hospital.hospital_name=hospital_time.hospital_name ORDER BY hospital.hospital_name ASC, FIELD (day,'월요일','화요일','수요일','목요일','금요일','토요일','일요일'); `,
    function(err,hospitals){
        if (err) throw err;
        else{
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
                if(i+1!=(hospitals).length){
                    pet_list=` `;
                    day_list=` `;
                    count=0;
                }
                }
            }
            marker_list+=`content:'<div><h6>${hospitals[i].hospital_name}<br>${pet_list}<br>${day_list}</h6></div>'},
                `;
            
            res.end(main_template(marker_list));
        }
        
    });
});
app.get('/search/',function(req,res){
    const keyword=req.query.search_name;
    var marker_list=``;
    console.log(keyword);
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
                if(i+1!=(hospitals).length){
                    pet_list=` `;
                    day_list=` `;
                    count=0;
                }
                }
            }
            marker_list+=`content:'<div><h6>${hospitals[i].hospital_name}<br>${pet_list}<br>${day_list}</h6></div>'},
                `;
            
            console.log(marker_list);
            res.end(main_template(marker_list));
        }
        else {
            marker_list=``
            res.end(main_template(marker_list));
        }
    })
});
module.exports = app;