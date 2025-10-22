INSERT INTO Artist (name, profile_url, biography, created_by)
VALUES
    ('Kikiyama', 'static/kikiyama/profile_photo/kikiyama.jpg',
     'Japanese indie composer best known for the surreal soundtrack of Yume Nikki.', 'admin'),
    ('Uchu Nekoko', 'static/uchu-nekoko/profile_photo/uchu-nekoko.jpg',
     'Japanese dream pop duo known for ethereal melodies and chill electronic vibes.', 'admin'),
    ('Mass of the Fermenting Dregs', 'static/mass-of-the-fermenting-dregs/profile_photo/mass-of-the-fermenting-dregs.jpg',
     'Japanese alternative rock and shoegaze band formed in 2002, known for energetic performances.', 'admin'),
    ('kinoue64', 'static/kinoue64/profile_photo/kinoue64.jpg',
     'Japanese electronic producer known for ambient and melancholic chiptune soundtracks.', 'admin'),
    ('Mowmow Lulu Gyaban', 'static/mowmow-lulu-gyaban/profile_photo/mowmow-lulu-gyaban.jpg',
     'Eccentric Japanese rock band blending funk, disco, and absurd humor.', 'admin');

INSERT INTO Album (title, cover_url, release_date, created_by)
VALUES
    ('Yume Nikki OST', 'static/kikiyama/album/yume-nikki-ost/album-cover/yume-nikki-ost.jpg', '2004-03-10', 'admin'),
    ('Hibi no Awa', 'static/uchu-nekoko/album/hibi-no-awa/album-cover/hibi-no-awa.jpg', '2019-05-01', 'admin'),
    ('No New World', 'static/mass-of-the-fermenting-dregs/album/no-new-world/album-cover/no-new-world.jpg', '2018-06-15', 'admin'),
    ('You / Uta wo Utaeba', 'static/mass-of-the-fermenting-dregs/album/uta-wo-utaeba/album-cover/uta-wo-utaeba.jpg', '2019-09-12', 'admin'),
    ('クロなら結構です', 'static/mowmow-lulu-gyaban/album/クロなら結構です/album-cover/クロなら結構です.jpg', '2013-04-21', 'admin');

INSERT INTO AlbumArtist (album_id, artist_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 3),
    (5, 5);

INSERT INTO Track (album_id, title, duration, file_path, cover_url, genre, popularity, created_by)
VALUES

    (1, 'Snow World', '1 minute', 'static/kikiyama/album/yume-nikki-ost/songs/snow-world.mp3', 'static/kikiyama/album/yume-nikki-ost/album-cover/yume-nikki-ost.jpg', 'Ambient', 87, 'admin'),
    (1, 'Dark World', '1 minute 4 seconds', 'static/kikiyama/album/yume-nikki-ost/songs/dark-world.mp3', 'static/kikiyama/album/yume-nikki-ost/album-cover/yume-nikki-ost.jpg', 'Experimental', 91, 'admin'),

    (2, 'Hibi no Awa', '4 minutes 56 seconds', 'static/uchu-nekoko/album/hibi-no-awa/songs/hibi-no-awa.mp3', 'static/uchu-nekoko/album/hibi-no-awa/album-cover/hibi-no-awa.jpg', 'Dream Pop', 95, 'admin'),
    (2, 'Divine Hammer', '3 minutes 41 seconds', 'static/uchu-nekoko/album/hibi-no-awa/songs/divine-hammer.mp3', 'static/uchu-nekoko/album/hibi-no-awa/album-cover/hibi-no-awa.jpg', 'Indie Pop', 89, 'admin'),

    (3, 'New Order', '3 minutes 29 seconds', 'static/mass-of-the-fermenting-dregs/album/no-new-world/songs/new-order.mp3', 'static/mass-of-the-fermenting-dregs/album/no-new-world/album-cover/no-new-world.jpg', 'Alternative Rock', 92, 'admin'),
    (3, 'Slow Motion Replay', '3 minutes 39 seconds', 'static/mass-of-the-fermenting-dregs/album/no-new-world/songs/slow-motion-replay.mp3', 'static/mass-of-the-fermenting-dregs/album/no-new-world/album-cover/no-new-world.jpg', 'Rock', 86, 'admin'),

    (4, 'You', '3 minutes 13 seconds', 'static/mass-of-the-fermenting-dregs/album/uta-wo-utaeba/songs/you.mp3', 'static/mass-of-the-fermenting-dregs/album/uta-wo-utaeba/album-cover/uta-wo-utaeba.jpg', 'Shoegaze', 88, 'admin'),
    (4, 'Uta wo Utaeba', '3 minutes 6 seconds', 'static/mass-of-the-fermenting-dregs/album/uta-wo-utaeba/songs/uta-wo-utaeba.mp3', 'static/mass-of-the-fermenting-dregs/album/uta-wo-utaeba/album-cover/uta-wo-utaeba.jpg', 'Rock', 90, 'admin'),

    (5, '裸族', '4 minutes', 'static/mowmow-lulu-gyaban/album/クロなら結構です/songs/裸族.mp3', 'static/mowmow-lulu-gyaban/album/クロなら結構です/album-cover/クロなら結構です.jpg', 'Funk Rock', 85, 'admin'),
    (5, '悲しみは地下鉄で', '5 minutes 32 seconds', 'static/mowmow-lulu-gyaban/album/クロなら結構です/songs/悲しみは地下鉄で.mp3', 'static/mowmow-lulu-gyaban/album/クロなら結構です/album-cover/クロなら結構です.jpg', 'Alternative', 81, 'admin');

INSERT INTO TrackArtist (track_id, artist_id)
VALUES

    (1, 1),
    (2, 1),
    (3, 2),
    (4, 2),
    (5, 3),
    (6, 3),
    (7, 3),
    (8, 3),
    (9, 5),
    (10, 5);