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
public class PlaylistTrackId implements Serializable {
    private static final long serialVersionUID = -3845173848971201907L;
    @NotNull
    @Column(name = "playlist_id", nullable = false)
    private Integer playlistId;

    @NotNull
    @Column(name = "track_id", nullable = false)
    private Integer trackId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PlaylistTrackId entity = (PlaylistTrackId) o;
        return Objects.equals(this.playlistId, entity.playlistId) &&
                Objects.equals(this.trackId, entity.trackId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playlistId, trackId);
    }

}