package com.musify.backend.repository;

import com.musify.backend.entity.Album;
import com.musify.backend.entity.AlbumArtist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

public interface AlbumArtistRepository extends JpaRepository<AlbumArtist,Long> {

    @Query("SELECT aa.album FROM AlbumArtist aa WHERE aa.artist.artistId = :artistId")
    List<Album> findAlbumsByArtistId(@Param("artistId") Long artistId);
}