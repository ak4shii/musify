package com.musify.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "artist")
public class Artist extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "artist_id", nullable = false)
    private Integer artistId;

    @Size(max = 150)
    @NotNull
    @Column(name = "name", nullable = false, length = 150)
    private String artistName;

    @Column(name = "profile_url", length = Integer.MAX_VALUE)
    private String profileUrl;

    @Column(name = "biography", length = Integer.MAX_VALUE)
    private String biography;
}