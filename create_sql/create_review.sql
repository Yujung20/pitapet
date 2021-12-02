CREATE TABLE `review` (
    `review_number` int AUTO_INCREMENT,
    `title` varchar(50) NOT NULL,
    `content` varchar(2000) NOT NULL,
    `date` datetime DEFAULT CURRENT_TIMESTAMP,
    `price` int NOT NULL,
    `product_name` varchar(50) NOT NULL,
    `brand` varchar(50) NOT NULL,
    `category` varchar(10) NOT NULL,
    `photo` longblob,
    `user_id` varchar(15) NOT NULL,
    PRIMARY KEY(`review_number`),
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `review_comment` (
    `review_comment_number`int AUTO_INCREMENT,
    `review_number` int NOT NULL,
    `content` varchar(2000) NOT NULL,
    `date` datetime DEFAULT CURRENT_TIMESTAMP,
    `user_id` varchar(15) NOT NULL,
    PRIMARY KEY(`review_comment_number`),
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY(`review_number`) REFERENCES `review`(`review_number`) ON DELETE CASCADE
);