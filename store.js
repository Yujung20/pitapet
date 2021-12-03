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
            <title>store</title>
            <meta charset="utf-8">
        </head>
        <body> 
        <form action="/store/search?h_name=${search_name}"method="get">
                <p><input type="text" name="search_name" placeholder="검색어를 입력하세요.">
                <input type="submit" value="검색"></p>
        </form>
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
        for (let i = 0; i < marker_information.length; i ++) {
            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                position: marker_information[i].latlng,
                title : marker_information[i].title,

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
    db.query(`SELECT * FROM store LEFT JOIN store_pet ON store.store_name=store_pet.store_name LEFT JOIN store_time ON store.store_name=store_time.store_name; `,
    function(err,stores){
        if (err) throw err;
        else{
            var H=" ";
            var P=" ";
            var D=" ";
            var pet_list=``;
            var day_list=``;
            var count=0;
            for (var i=0; i<Object.keys(stores).length-1;i++){
                if(H!=stores[i].store_name){
                    marker_list+=`{
                        title: '${stores[i].store_name}', 
                        latlng: new kakao.maps.LatLng(${stores[i].latitude}, ${stores[i].longitude}),
                        `;
                    pet_list+=`${stores[i].pet},`;
                    day_list+=`${stores[i].day}: ${stores[i].start_time}~${stores[i].end_time} <br>`;
                    H=stores[i].store_name;
                    P=stores[i].pet;
                    D=stores[i].day;
                }
                else{
                    if(P!=stores[i].pet){
                        pet_list+=`${stores[i].pet}, `
                        P=stores[i].pet;
                    }
                    if(D!=stores[i].day && count==0){
                        day_list+=`${stores[i].day}: ${stores[i].start_time}~${stores[i].end_time} <br>`;
                    }
                    else{
                        count++;
                    }
                }
                if(H!=stores[i+1].store_name){
                    marker_list+=`content:'<div><h6>${stores[i].store_name}<br>${pet_list}<br>${day_list}</h6></div>'},
                    `;
                if(i+1!=(stores).length){
                    pet_list=` `;
                    day_list=` `;
                    count=0;
                }
                }
            }
            marker_list+=`content:'<div><h6>${stores[i].store_name}<br>${pet_list}<br>${day_list}</h6></div>'},
                `;
            
            res.end(main_template(marker_list));
        }
        
    });
});
app.get('/search/', function (req, res) {
    const keyword=req.query.search_name;
    var marker_list=``;
    console.log(keyword);
    db.query(`SELECT * FROM store LEFT JOIN store_pet ON store.store_name=store_pet.store_name LEFT JOIN store_time ON store.store_name=store_time.store_name WHERE hospital.hospital_name LIKE ?`,['%'+keyword+'%'],
    function(err,stores){
        if (err) throw err;
        if(Object.keys(hospitals).length>0){
            var H=" ";
            var P=" ";
            var D=" ";
            var pet_list=``;
            var day_list=``;
            var count=0;
            for (var i=0; i<Object.keys(stores).length-1;i++){
                if(H!=stores[i].store_name){
                    marker_list+=`{
                        title: '${stores[i].store_name}', 
                        latlng: new kakao.maps.LatLng(${stores[i].latitude}, ${stores[i].longitude}),
                        `;
                    pet_list+=`${stores[i].pet},`;
                    day_list+=`${stores[i].day}: ${stores[i].start_time}~${stores[i].end_time} <br>`;
                    H=stores[i].store_name;
                    P=stores[i].pet;
                    D=stores[i].day;
                }
                else{
                    if(P!=stores[i].pet){
                        pet_list+=`${stores[i].pet}, `
                        P=stores[i].pet;
                    }
                    if(D!=stores[i].day && count==0){
                        day_list+=`${stores[i].day}: ${stores[i].start_time}~${stores[i].end_time} <br>`;
                    }
                    else{
                        count++;
                    }
                }
                if(H!=stores[i+1].store_name){
                    marker_list+=`content:'<div><h6>${stores[i].store_name}<br>${pet_list}<br>${day_list}</h6></div>'},
                    `;
                if(i+1!=(stores).length){
                    pet_list=` `;
                    day_list=` `;
                    count=0;
                }
                }
            }
            marker_list+=`content:'<div><h6>${stores[i].store_name}<br>${pet_list}<br>${day_list}</h6></div>'},
                `;
            console.log(marker_list);
            res.end(main_template(marker_list));
        }
        
    });
});
module.exports=app;