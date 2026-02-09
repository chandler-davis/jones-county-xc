-- Jones County Cross Country Database Schema

DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS meets;
DROP TABLE IF EXISTS athletes;

-- Athletes table
CREATE TABLE athletes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade TINYINT NOT NULL CHECK (grade BETWEEN 9 AND 12),
    personal_record VARCHAR(10),
    events VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meets table
CREATE TABLE meets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    meet_date DATE NOT NULL,
    location VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Results table (links athletes to meets)
CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    athlete_id INT NOT NULL,
    meet_id INT NOT NULL,
    time VARCHAR(10) NOT NULL,
    place INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE,
    FOREIGN KEY (meet_id) REFERENCES meets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_result (athlete_id, meet_id)
);
