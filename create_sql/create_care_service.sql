CREATE TABLE `care_service` (
    `mail_number` INT AUTO_INCREMENT,
    `owner_id` varchar(15) NOT NULL,
    `name` varchar(10) NOT NULL,
    `mail_category` varchar(20) NOT NULL,
    `account` varchar(20),
    PRIMARY KEY(`mail_number`, `owner_id`),
    FOREIGN KEY(`owner_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `care_service_date` (
    `mail_number` INT NOT NULL,
    `mail_date` date NOT NULL,
    PRIMARY KEY(`mail_number`, `mail_date`),
    FOREIGN KEY(`mail_number`) REFERENCES `care_service`(`mail_number`) ON DELETE CASCADE
);
