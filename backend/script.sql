USE StudyBuddy;

DROP TABLE IF EXISTS note_file;
DROP TABLE IF EXISTS note;
DROP TABLE IF EXISTS file;
DROP TABLE IF EXISTS subject;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE subject (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE file (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE note (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    user_id INT,
    subject_id INT,
    visibility ENUM('public', 'hidden') DEFAULT 'public',
    secret_key VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (subject_id) REFERENCES subject(id)
);

CREATE TABLE note_file (
    note_id INT,
    file_id INT,
    PRIMARY KEY (note_id, file_id),
    FOREIGN KEY (note_id) REFERENCES note(id),
    FOREIGN KEY (file_id) REFERENCES file(id)
);
