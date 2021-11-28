const response = require('express');
const express = require('express');
const app = express.Router();

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');

function main_template(){
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
        <div id="map" style="width:500px;height:400px;"></div>
	<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=	e4410d501aa08cb040f89f52b5ee63d2"></script>
	<script>
		var container = document.getElementById('map');
		var options = {
			center: new kakao.maps.LatLng(33.450701, 126.570667),
			level: 3
		};

		var map = new kakao.maps.Map(container, options);
        var markerPosition  = new kakao.maps.LatLng(33.450701, 126.570667); 
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });

        marker.setMap(map);


	</script>
            
        </body>
    </html>
    `;
}
app.get('/', function (req, res) {
    res.end(main_template());
});

module.exports = app;