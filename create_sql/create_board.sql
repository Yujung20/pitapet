CREATE TABLE `board` (
    `board_number` int AUTO_INCREMENT,
    `title` varchar(200) NOT NULL,
    `content` varchar(2000) NOT NULL,
    `date` datetime DEFAULT CURRENT_TIMESTAMP,
    `category` varchar(10) NOT NULL,
    `user_id` varchar(15) NOT NULL,
    PRIMARY KEY(`board_number`),
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `board_comment` (
    `comment_number` int AUTO_INCREMENT,
    `content` varchar(1000) NOT NULL,
    `date` datetime DEFAULT CURRENT_TIMESTAMP,
    `user_id` varchar(15) NOT NULL,
    `board_number` int NOT NULL,
    PRIMARY KEY(`comment_number`),
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY(`board_number`) REFERENCES `board`(`board_number`) ON DELETE CASCADE
);