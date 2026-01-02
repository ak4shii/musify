package com.musify.backend.service;

import com.musify.backend.dto.AlbumCreateMultipartDto;
import com.musify.backend.dto.AlbumCreateRequestDto;
import com.musify.backend.dto.AlbumDto;
import com.musify.backend.dto.AlbumUpdateMultipartDto;
import com.musify.backend.dto.AlbumUpdateRequestDto;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IAlbumService {

    List<AlbumDto> getAlbumsForHome();

    List<AlbumDto> getAlbumsForSearch(String query);

    List<AlbumDto> getAlbumsByArtistId(Long artistId);

    Optional<AlbumDto> getAlbumById(Long albumId);

    AlbumDto createAlbum(AlbumCreateRequestDto request);

    AlbumDto updateAlbum(Integer albumId, AlbumUpdateRequestDto request);

    void deleteAlbum(Integer albumId);

    List<AlbumDto> getAllAlbums();

    String getFirstArtistNameForAlbum(Integer albumId);

    AlbumDto createAlbumFromMultipart(AlbumCreateMultipartDto multipartDto) throws IOException;

    AlbumDto updateAlbumFromMultipart(Integer albumId, AlbumUpdateMultipartDto multipartDto) throws IOException;
}
