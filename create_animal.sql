CREATE TABLE `animal` (
    `number` int AUTO_INCREMENT,
    `owner_id` varchar(15) NOT NULL,
    `name` varchar(10),
    `gender` varchar(5),
    `birthday` date,
    `type` varchar(10),
    `special_note` text,
    PRIMARY KEY(`number`),
    FOREIGN KEY(`owner_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);