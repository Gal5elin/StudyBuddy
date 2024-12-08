USE StudyBuddy;

#CREATE USER 'Gal'@'localhost' IDENTIFIED BY 'geslo';
#GRANT ALL PRIVILEGES ON *.* TO 'Gal'@'localhost';

DROP TABLE IF EXISTS note_file;
DROP TABLE IF EXISTS note;
DROP TABLE IF EXISTS file;
DROP TABLE IF EXISTS subject;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
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
    user_id INT
);

CREATE TABLE note (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    user_id INT,
    subject_id INT,
    visibility ENUM('public', 'hidden') DEFAULT 'public',
    secret_key VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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


-- Insert test users
INSERT INTO user (username, email, password) VALUES 
('user1', 'user1@example.com', 'password1'),
('user2', 'user2@example.com', 'password2'),
('user3', 'user3@example.com', 'password3');

-- Insert test subjects
INSERT INTO subject (name) VALUES 
('Mathematics'),
('Physics'),
('Chemistry'),
('Biology');

-- Insert test notes
INSERT INTO note (title, description, user_id, subject_id, visibility, secret_key) VALUES 
('Algebra Basics', 'Introduction to Algebra concepts.', 1, 1, 'public', NULL),
('Quantum Mechanics Overview', 'Basics of Quantum Mechanics.', 1, 2, 'hidden', 'quantum123'),
('Organic Chemistry Principles', 'Key principles of Organic Chemistry.', 2, 3, 'public', NULL),
('Cell Biology', 'Understanding cell structure and functions.', 3, 4, 'public', NULL);

