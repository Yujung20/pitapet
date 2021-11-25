CREATE TABLE `hospital`(
    `hospital_name` varchar(20) NOT NULL,
    `latitude` decimal(16,14) NOT NULL,
    `longitude` decimal(17,14) NOT NULL,
    `night` boolean NOT NULL DEFAULT FALSE,
    PRIMARY KEY(`hospital_name`)
);

INSERT INTO `hospital` VALUES ('24시 애니동물병원', 37.5839183,127.019814,1);
INSERT INTO `hospital` VALUES ('VIP 동물의료센터 성북점', 37.5922893,127.013408,1);
INSERT INTO `hospital` VALUES ('ZOO동물병원', 37.6019921,127.019524,0);
INSERT INTO `hospital` VALUES ('강북 24시 N 동물의료센터', 37.6058205,127.024361,1);
INSERT INTO `hospital` VALUES ('강북동물병원', 37.5961953,127.035138,0);
INSERT INTO `hospital` VALUES ('길음동물병원', 37.6024330,127.023035,0);
INSERT INTO `hospital` VALUES ('꿈의숲동물병원', 37.6190676,127.046418,0);
INSERT INTO `hospital` VALUES ('나래종합동물병원', 37.5914154,127.013011,0);
INSERT INTO `hospital` VALUES ('넬동물병원', 37.6087909,127.035755,0);
INSERT INTO `hospital` VALUES ('대학동물병원', 37.6136192,127.060969,0);
INSERT INTO `hospital` VALUES ('더편한동물병원', 37.6119732,127.028757,0);
INSERT INTO `hospital` VALUES ('도담도담동물병원', 37.6018068,127.040429,0);
INSERT INTO `hospital` VALUES ('드림동물병원', 37.5918207,127.013679,0);
INSERT INTO `hospital` VALUES ('로이동물병원', 37.5953434,127.015741,0);
INSERT INTO `hospital` VALUES ('미소동물병원', 37.5983760,127.034335,0);
INSERT INTO `hospital` VALUES ('보성통증동물병원', 37.6105886,127.009356,0);
INSERT INTO `hospital` VALUES ('비비펫 동물병원', 37.6028695,127.041992,0);
INSERT INTO `hospital` VALUES ('서울종합동물병원', 37.5870900,127.018173,0);
INSERT INTO `hospital` VALUES ('성신동물병원', 37.5944964,127.016307,0);
INSERT INTO `hospital` VALUES ('스마트동물병원 성북길음점', 37.6101462,127.018167,0);
INSERT INTO `hospital` VALUES ('쓰담쓰담 동물병원', 37.6001421,127.033656,0);
INSERT INTO `hospital` VALUES ('앙리동물병원', 37.5934432,127.001700,0);
INSERT INTO `hospital` VALUES ('우리동물병원', 37.6109204,127.022494,0);
INSERT INTO `hospital` VALUES ('원러브동물의료센터', 37.5988124,127.013601,0);
INSERT INTO `hospital` VALUES ('카카오 N 동물병원', 37.6074343,127.017963,0);
INSERT INTO `hospital` VALUES ('큐동물병원', 37.6139863,127.045679,0);
INSERT INTO `hospital` VALUES ('퍼스트동물병원', 37.6212728,127.051698,0);
INSERT INTO `hospital` VALUES ('포유동물병원', 37.6042043,127.037723,0);
INSERT INTO `hospital` VALUES ('한사랑동물병원', 37.5903347,127.003817,0);
INSERT INTO `hospital` VALUES ('행복한동물병원', 37.6110986,127.056493,0);
INSERT INTO `hospital` VALUES ('호담동물병원', 37.6067656,127.028506,0);
