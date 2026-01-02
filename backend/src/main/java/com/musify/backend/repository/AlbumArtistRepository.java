package com.musify.backend.repository;

import com.musify.backend.entity.Album;
import com.musify.backend.entity.AlbumArtist;
import com.musify.backend.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AlbumArtistRepository extends JpaRepository<AlbumArtist,Long> {

    @Query("SELECT aa.album FROM AlbumArtist aa WHERE aa.artist.artistId = :artistId")
    List<Album> findAlbumsByArtistId(@Param("artistId") Long artistId);

    @Query("SELECT aa FROM AlbumArtist aa WHERE aa.album.albumId = :albumId AND aa.artist.artistId = :artistId")
    Optional<AlbumArtist> findByAlbumIdAndArtistId(@Param("albumId") Integer albumId, @Param("artistId") Integer artistId);

    @Query("SELECT aa.artist FROM AlbumArtist aa WHERE aa.album.albumId = :albumId")
    List<Artist> findArtistsByAlbumId(@Param("albumId") Integer albumId);
}