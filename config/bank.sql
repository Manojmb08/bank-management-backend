CREATE TABLE `bank`.`customer`
(
    `customer_id`       INT          NOT NULL AUTO_INCREMENT,
    `customer_name`     VARCHAR(100) NULL,
    `customer_email`    VARCHAR(45)  NULL,
    `customer_password` VARCHAR(45)  NULL,
    PRIMARY KEY (`customer_id`)
);

CREATE TABLE `bank`.`account`
(
    `account_id`         INT          NOT NULL AUTO_INCREMENT,
    `account_number`     BIGINT(10)   NOT NULL,
    `account_type`       VARCHAR(45)  NULL,
    `branch`             VARCHAR(45)  NULL,
    `ifsc`               VARCHAR(45)  NULL,
    `applicant_name`     VARCHAR(45)  NULL,
    `applicant_phone_no` VARCHAR(45)  NULL,
    `applicant_dob`      DATE         NULL,
    `applicant_email`    VARCHAR(45)  NULL,
    `applicant_address`  VARCHAR(100) NULL,
    `applicant_gender`   VARCHAR(2)   NULL,
    `applicant_balance`   VARCHAR(20)   NULL,
    PRIMARY KEY (`account_id`)
);

CREATE TABLE `bank`.`transaction`
(
    `transaction_id`   INT         NOT NULL AUTO_INCREMENT,
    `account_id`       INT         NOT NULL,
    `transaction_date` DATE        NULL,
    `transacted_to`    VARCHAR(45) NULL,
    `transacted_from`  VARCHAR(45) NULL,
    `debit_amt`        BIGINT(10)  NULL,
    `credit_amt`       BIGINT(10)  NULL,
    `balance`          BIGINT(10)  NULL,
    PRIMARY KEY (`transaction_id`),
    INDEX `transaction_account_id_idx` (`account_id` ASC) VISIBLE,
    CONSTRAINT `transaction_account_id`
        FOREIGN KEY (`account_id`)
            REFERENCES `bank`.`account` (`account_id`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

CREATE TABLE `bank`.`manager`
(
    `manager_id`       INT         NOT NULL AUTO_INCREMENT,
    `branch`           VARCHAR(45) NULL,
    `ifsc`             VARCHAR(45) NULL,
    `manager_email`    VARCHAR(45) NULL,
    `manager_password` VARCHAR(45) NULL,
    `city`             VARCHAR(45) NULL,
    PRIMARY KEY (`manager_id`)
);

CREATE TABLE `bank`.`employee`
(
    `employee_id`       INT          NOT NULL AUTO_INCREMENT,
    `employee_email`    VARCHAR(45)  NULL,
    `employee_password` VARCHAR(45)  NULL,
    `employee_name`     VARCHAR(100) NULL,
    `employee_gender`   VARCHAR(2)   NULL,
    `employee_phone_no` VARCHAR(10)  NULL,
    `employee_address`  VARCHAR(100) NULL,
    PRIMARY KEY (`employee_id`)
);

INSERT INTO `bank`.`manager` (`branch`, `ifsc`, `manager_email`, `manager_password`, `city`)
VALUES ('udupi', 'UDP123', 'manoj@gmail.com', '12345678', 'udupi');
