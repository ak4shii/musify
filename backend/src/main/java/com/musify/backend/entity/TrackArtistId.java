package com.musify.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class TrackArtistId implements Serializable {
    private static final long serialVersionUID = 8105367998588085192L;
    @NotNull
    @Column(name = "track_id", nullable = false)
    private Integer trackId;

    @NotNull
    @Column(name = "artist_id", nullable = false)
    private Integer artistId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        TrackArtistId entity = (TrackArtistId) o;
        return Objects.equals(this.trackId, entity.trackId) &&
                Objects.equals(this.artistId, entity.artistId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(trackId, artistId);
    }

}