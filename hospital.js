const response = require('express');
const express = require('express');
const app = express.Router();

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');

function main_template(marker_list){
    //지도(마커 전체)
    //검색칸+검색 버튼
    //
    return `
    <!doctype html>
    <html>
        <head>
            <title>hospital</title>
            <meta charset="utf-8">
        </head>
        <body> 
        <h3>검색어를 입력하세요.</h3>
        <div id="map" style="width:700px;height:400px;"></div>
	<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=	e4410d501aa08cb040f89f52b5ee63d2"></script>
	<script>
		var container = document.getElementById('map');
		var options = {
			center: new kakao.maps.LatLng(33.450705, 126.570677),
			level: 3
		};
        var map = new kakao.maps.Map(container, options);
        var positions = [
            ${marker_list}
        ];
        var selectedMarker = null; // 클릭한 마커를 담을 변수
            
        for (var i = 0; i < positions.length; i ++) {
            
            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                map: map,
                position: positions[i].latlng,
                title : positions[i].title,
            });
        }
	</script>
            
        </body>
    </html>
    `;
    
}
app.get('/', function (req, res) {
    var marker_list=``;
    db.query(`SELECT * FROM hospital `,
    function(err,hospital){
        if (err) throw err;
        else{
            for (var i=0; i<Object.values(hospital).length-1;i++){
                marker_list+=`{
                    title: '${hospital[i].hospital_name}', 
                    latlng: new kakao.maps.LatLng(${hospital[i].latitude}, ${hospital[i].longitude})
                },`
            }
            var last=Object.values(hospital).length;
            marker_list+=`{
                title: '${hospital[last].hospital_name}', 
                latlng: new kakao.maps.LatLng(${hospital[last].latitude}, ${hospital[last].longitude})
            }`
            res.end(main_template(marker_list));
        }
    });
});

module.exports = app;