CREATE TABLE `store_pet`(
    `pet` varchar(10) NOT NULL,
    `store_name` varchar(20) NOT NULL,
    PRIMARY KEY(`pet`,`store_name`),
    FOREIGN KEY(`store_name`) REFERENCES `store`(`store_name`)
);
INSERT INTO `store_pet` VALUES ('개', '피알디');
INSERT INTO `store_pet` VALUES ('개', '모블러');
INSERT INTO `store_pet` VALUES ('개', '강아지카페 카페개네');
INSERT INTO `store_pet` VALUES ('개', '멍박스24 애견셀프목욕 & 무인카페');
INSERT INTO `store_pet` VALUES ('개', '카페 평행선');
INSERT INTO `store_pet` VALUES ('개', '행복하게키울고양');
INSERT INTO `store_pet` VALUES ('개', 'GODOG');
INSERT INTO `store_pet` VALUES ('개', '시절인연');
INSERT INTO `store_pet` VALUES ('고양이', '시절인연');
INSERT INTO `store_pet` VALUES ('토끼', '시절인연');
INSERT INTO `store_pet` VALUES ('햄스터', '시절인연');
INSERT INTO `store_pet` VALUES ('앵무새', '시절인연');
INSERT INTO `store_pet` VALUES ('기니피그', '시절인연');
INSERT INTO `store_pet` VALUES ('패럿', '시절인연');
INSERT INTO `store_pet` VALUES ('고슴도치', '시절인연');
INSERT INTO `store_pet` VALUES ('개', '빌라드코스테스');
INSERT INTO `store_pet` VALUES ('개', '문화식당 성신여대점');
INSERT INTO `store_pet` VALUES ('개', '카레');
INSERT INTO `store_pet` VALUES ('개', '문화식당 성북동점');
INSERT INTO `store_pet` VALUES ('개', '그루밍솔');
INSERT INTO `store_pet` VALUES ('개', '마이도그');
INSERT INTO `store_pet` VALUES ('개', '행복하개');
INSERT INTO `store_pet` VALUES ('고양이', '행복하개');
INSERT INTO `store_pet` VALUES ('개', '러블리펫');
INSERT INTO `store_pet` VALUES ('개', '트리몽');
INSERT INTO `store_pet` VALUES ('개', '토미펫샵');
INSERT INTO `store_pet` VALUES ('개', '큐그루밍샵');
INSERT INTO `store_pet` VALUES ('고양이', '큐그루밍샵');
INSERT INTO `store_pet` VALUES ('개', '개끌림');
INSERT INTO `store_pet` VALUES ('개', '몽몽이발소');
INSERT INTO `store_pet` VALUES ('개', '꼼지락강아지');
INSERT INTO `store_pet` VALUES ('개', '옹심이네살롱');
INSERT INTO `store_pet` VALUES ('개', '애기야 애견미용실');
INSERT INTO `store_pet` VALUES ('개', '도도애견샵');
INSERT INTO `store_pet` VALUES ('개', '성북공원');
INSERT INTO `store_pet` VALUES ('고양이', '성북공원');
INSERT INTO `store_pet` VALUES ('개', '청량근린공원');
INSERT INTO `store_pet` VALUES ('고양이', '청량근린공원');
INSERT INTO `store_pet` VALUES ('개', '책의기분');
