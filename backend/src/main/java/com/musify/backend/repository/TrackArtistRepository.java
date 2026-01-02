package com.musify.backend.repository;

import com.musify.backend.entity.Artist;
import com.musify.backend.entity.Track;
import com.musify.backend.entity.TrackArtist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TrackArtistRepository extends JpaRepository<TrackArtist, Long> {

    @Query("SELECT ta.track FROM TrackArtist ta WHERE ta.artist.artistId = :artistId")
    List<Track> findTracksByArtistId(@Param("artistId") Long artistId);

    @Query("SELECT ta.artist FROM TrackArtist ta WHERE ta.track.trackId = :trackId")
    List<Artist> findArtistsByTrackId(@Param("trackId") Integer trackId);

    @Query("SELECT ta FROM TrackArtist ta WHERE ta.track.trackId = :trackId AND ta.artist.artistId = :artistId")
    Optional<TrackArtist> findByTrackIdAndArtistId(@Param("trackId") Integer trackId, @Param("artistId") Integer artistId);
}
