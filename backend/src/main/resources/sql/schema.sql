DROP TABLE IF EXISTS Playlist, Track, Album, Artist,
    AlbumArtist, TrackArtist, PlaylistTrack, CustomerHistory,
    UserTrackLike, UserArtistFollow, "user" CASCADE;

CREATE TABLE "user" (
                        user_id SERIAL PRIMARY KEY,
                        user_name VARCHAR(100) NOT NULL,
                        email VARCHAR(150) NOT NULL UNIQUE,
                        password_hash TEXT NOT NULL,
                        date_of_birth DATE NOT NULL,
                        role VARCHAR(50) NOT NULL CHECK (role IN ('ROLE_ADMIN', 'ROLE_CUSTOMER')),
                        profile_url TEXT,
                        enabled BOOLEAN DEFAULT TRUE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                        created_by VARCHAR(50) NOT NULL,
                        updated_at TIMESTAMP DEFAULT NULL,
                        updated_by VARCHAR(50) DEFAULT NULL
);

CREATE TABLE Artist (
                        artist_id SERIAL PRIMARY KEY,
                        name VARCHAR(150) NOT NULL,
                        profile_url TEXT,
                        biography TEXT,
                        followers INT DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                        created_by VARCHAR(50) NOT NULL,
                        updated_at TIMESTAMP DEFAULT NULL,
                        updated_by  VARCHAR(50) DEFAULT NULL
);

CREATE TABLE Album (
                       album_id SERIAL PRIMARY KEY,
                       title VARCHAR(200) NOT NULL,
                       cover_url TEXT,
                       release_date DATE,
                       popularity INT DEFAULT 0,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                       created_by VARCHAR(50) NOT NULL,
                       updated_at TIMESTAMP DEFAULT NULL,
                       updated_by VARCHAR(50) DEFAULT NULL
);

CREATE TABLE AlbumArtist (
                             album_id INT REFERENCES Album(album_id) ON DELETE CASCADE,
                             artist_id INT REFERENCES Artist(artist_id) ON DELETE CASCADE,
                             PRIMARY KEY (album_id, artist_id)
);

CREATE TABLE Track (
                       track_id SERIAL PRIMARY KEY,
                       album_id INT NULL REFERENCES Album(album_id) ON DELETE SET NULL,
                       title VARCHAR(200) NOT NULL,
                       duration INTERVAL,
                       file_path TEXT NOT NULL,
                       cover_url TEXT,
                       genre VARCHAR(100),
                       popularity INT DEFAULT 0,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                       created_by VARCHAR(50) NOT NULL,
                       updated_at TIMESTAMP DEFAULT NULL,
                       updated_by VARCHAR(50) DEFAULT NULL
);

CREATE TABLE TrackArtist (
                             track_id INT REFERENCES Track(track_id) ON DELETE CASCADE,
                             artist_id INT REFERENCES Artist(artist_id) ON DELETE CASCADE,
                             PRIMARY KEY (track_id, artist_id)
);

CREATE TABLE Playlist (
                          playlist_id SERIAL PRIMARY KEY,
                          user_id INT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
                          name VARCHAR(150) NOT NULL,
                          cover_url TEXT,
                          is_public BOOLEAN DEFAULT FALSE,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                          created_by VARCHAR(50) NOT NULL,
                          updated_at TIMESTAMP DEFAULT NULL,
                          updated_by VARCHAR(50) DEFAULT NULL
);

CREATE TABLE PlaylistTrack (
                               playlist_id INT REFERENCES Playlist(playlist_id) ON DELETE CASCADE,
                               track_id INT REFERENCES Track(track_id) ON DELETE CASCADE,
                               PRIMARY KEY (playlist_id, track_id)
);

CREATE TABLE CustomerHistory (
                                 history_id SERIAL PRIMARY KEY,
                                 user_id INT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
                                 track_id INT REFERENCES Track(track_id) ON DELETE SET NULL,
                                 played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE UserTrackLike (
                               user_id INT REFERENCES "user"(user_id) ON DELETE CASCADE,
                               track_id INT REFERENCES Track(track_id) ON DELETE CASCADE,
                               liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               PRIMARY KEY (user_id, track_id)
);

CREATE TABLE UserArtistFollow (
                                  user_id INT REFERENCES "user"(user_id) ON DELETE CASCADE,
                                  artist_id INT REFERENCES Artist(artist_id) ON DELETE CASCADE,
                                  followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  PRIMARY KEY (user_id, artist_id)
);

CREATE INDEX idx_artist_name ON Artist(name);
CREATE INDEX idx_album_title ON Album(title);
CREATE INDEX idx_track_title ON Track(title);
CREATE INDEX idx_playlist_user ON Playlist(user_id);
CREATE INDEX idx_history_user ON CustomerHistory(user_id);
CREATE INDEX idx_like_user_track ON UserTrackLike(user_id);
CREATE INDEX idx_like_user_artist ON UserArtistFollow(user_id);