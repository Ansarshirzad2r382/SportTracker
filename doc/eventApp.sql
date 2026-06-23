-- USER
CREATE TABLE USER (
    user_id INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

--EVENT_KATEGORIE
CREATE TABLE EVENT_KATEGORIE (
    category_id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    metric_unit VARCHAR(100) NOT NULL, -- z.B. Kills, Rank-Punkte
    description TEXT,
    PRIMARY KEY (category_id)
);

--EVENTS
CREATE TABLE EVENTS (
    event_id INT AUTO_INCREMENT,
    category_id INT NOT NULL,
    creator_id INT NOT NULL, -- Wer hat das Event erstellt?
    target_value INT NOT NULL, -- z.B. 1000
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    PRIMARY KEY (event_id),
    FOREIGN KEY (category_id) REFERENCES EVENT_KATEGORIE(category_id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES USER(user_id) ON DELETE CASCADE
);

--EVENT_TEILNAHME
CREATE TABLE EVENT_TEILNAHME (
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    current_score INT DEFAULT 0, -- Aktueller Fortschritt des Users
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id), -- Zusammengesetzter Primärschlüssel
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE
);

--FREUNDSCHAFT
CREATE TABLE FREUNDSCHAFT (
    requester_id INT NOT NULL,
    addressee_id INT NOT NULL,
    status VARCHAR(50) NOT NULL, -- z.B. PENDING, ACCEPTED, DECLINED
    PRIMARY KEY (requester_id, addressee_id), -- Zusammengesetzter Primärschlüssel
    FOREIGN KEY (requester_id) REFERENCES USER(user_id) ON DELETE CASCADE,
    FOREIGN KEY (addressee_id) REFERENCES USER(user_id) ON DELETE CASCADE
);