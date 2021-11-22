CREATE TABLE `question` (
    `question_number` int AUTO_INCREMENT,
    `title` varchar(50) NOT NULL,
    `content` varchar(2000) NOT NULL,
    `date` datetime DEFAULT CURRENT_TIMESTAMP,
    `category` varchar(10) NOT NULL,
    `user_id` varchar(15) NOT NULL,
    PRIMARY KEY(`question_number`),
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `answer` (
    `answer_number` int AUTO_INCREMENT,
    `content` varchar(2000) NOT NULL,
    `date` datetime DEFAULT CURRENT_TIMESTAMP,
    `category` varchar(10) NOT NULL,
    `user_id` varchar(15) NOT NULL,
    `question_number` int NOT NULL,
    PRIMARY KEY(`answer_number`),
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY(`question_number`) REFERENCES `question`(`question_number`) ON DELETE CASCADE
);