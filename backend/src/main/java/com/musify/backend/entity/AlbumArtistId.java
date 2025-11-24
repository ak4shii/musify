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
public class AlbumArtistId implements Serializable {
    private static final long serialVersionUID = -7860399086499577906L;
    @NotNull
    @Column(name = "album_id", nullable = false)
    private Integer albumId;

    @NotNull
    @Column(name = "artist_id", nullable = false)
    private Integer artistId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        AlbumArtistId entity = (AlbumArtistId) o;
        return Objects.equals(this.albumId, entity.albumId) &&
                Objects.equals(this.artistId, entity.artistId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(albumId, artistId);
    }

}