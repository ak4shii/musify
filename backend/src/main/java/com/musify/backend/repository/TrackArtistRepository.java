package com.musify.backend.repository;

import com.musify.backend.entity.Track;
import com.musify.backend.entity.TrackArtist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrackArtistRepository extends JpaRepository<TrackArtist, Long> {

    @Query("SELECT ta.track FROM TrackArtist ta WHERE ta.artist.artistId = :artistId")
    List<Track> findTracksByArtistId(@Param("artistId") Long artistId);
}
