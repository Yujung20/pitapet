CREATE TABLE `user` (
    `id` varchar(15) NOT NULL,
    `nickname` varchar(10) NOT NULL,
    `password` varchar(60) NOT NULL,
    `email` varchar(30) NOT NULL,
    `license` longblob DEFAULT NULL,
    `certificate` longblob DEFAULT NULL,
    `is_normal` boolean NOT NULL DEFAULT TRUE,
    PRIMARY KEY(`id`)
);