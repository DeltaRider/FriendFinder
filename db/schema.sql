DROP DATABASE IF EXISTS friend_finder;

CREATE DATABASE friend_finder;

USE friend_finder;

CREATE TABLE questions (
	id INT NOT NULL AUTO_INCREMENT,
	question VARCHAR(255) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE friends (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	picture_link LONGTEXT NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE scores (
	id INT NOT NULL AUTO_INCREMENT,
	question_id INT NOT NULL,
	friend_id INT NOT NULL,
	score VARCHAR(255) NOT NULL,
	FOREIGN KEY (question_id) REFERENCES questions(id),
	FOREIGN KEY (friend_id) REFERENCES friends(id),
	PRIMARY KEY(id)
);

source seeds.sql;