INSERT INTO Shows(title, genre, rating, review) VALUES
            ('The Rookie', 'Thriller', '4', 'Great police show'),
            ('Carmen Sandiago', 'Action', '3', 'Interesting and fun'),
            ('Gossip Girl', 'Comedy', '3', 'Really long and repetitive'),
            ('YOU', 'Psychological Thriller', '4', 'kept me entertained the whole time, though the last season was not as great');

SELECT * FROM Shows;

INSERT INTO Shows(title, genre, rating, review) VALUES
            ('Jane the Virgin', 'Telenovela', '1', 'The show was very boring and was corny and made me wanna die watching it.');

SELECT * FROM Shows;

UPDATE Shows 
SET rating = '4.5'
WHERE id = 2; 

UPDATE Shows
SET rating = '5'
WHERE id = 2;

INSERT INTO Shows(title, genre, rating, review) VALUES
('The Office', 'Sitcom', '4', 'Decent show');

SELECT * FROM Shows;

DELETE FROM Shows
WHERE title = 'Monsters';




