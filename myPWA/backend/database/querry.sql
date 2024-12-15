--CREATE TABLE Shows(id INTEGER PRIMARY KEY AUTOINCREMENT,
                  title TEXT NOT NULL,
                  genre TEXT NOT NULL,
                  rating INTEGER DEFAULT 0,
                   review TEXT NOT NULL); 

--INSERT INTO Shows(title, genre, rating, review) VALUES
            ('The Rookie', 'Thriller', '4', 'Great police show'),
            ('Carmen Sandiago', 'Action', '3', 'Interesting and fun'),
            ('Gossip Girl', 'Comedy', '3', 'Really long and repetitive'),
            ('YOU', 'Psychological Thriller', '4', 'kept me entertained the whole time, though the last season was not as great');

SELECT * FROM Shows;

-- Insert sample data into Shows table
INSERT INTO Shows(title, genre, rating, review) VALUES
('Carmen Sandiago', 'Action', 3, 'Interesting and fun'),
('Gossip Girl', 'Comedy', 3, 'Really long and repetitive'),
('YOU', 'Psychological Thriller', 4, 'Kept me entertained the whole time, though the last season was not as great');




