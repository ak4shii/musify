package com.musify.backend.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.tag.TagException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    @Value("${file.upload.max-size:10485760}")
    private long maxFileSize;

    private static final String[] ALLOWED_EXTENSIONS = {".mp3", ".MP3"};
    private static final String[] ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".JPG", ".JPEG", ".PNG", ".GIF"};

    private boolean isValidMp3File(String filename) {
        String extension = getFileExtension(filename);
        for (String allowedExt : ALLOWED_EXTENSIONS) {
            if (extension.equalsIgnoreCase(allowedExt)) {
                return true;
            }
        }
        return false;
    }

    private boolean isValidImageFile(String filename) {
        String extension = getFileExtension(filename);
        for (String allowedExt : ALLOWED_IMAGE_EXTENSIONS) {
            if (extension.equalsIgnoreCase(allowedExt)) {
                return true;
            }
        }
        return false;
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < filename.length() - 1) {
            return filename.substring(lastDotIndex);
        }
        return "";
    }

    public String createArtistFolderStructure(String artistName) throws IOException {
        String artistFolderName = slugify(artistName);
        Path staticPath = Paths.get("src/main/resources/static");
        Path artistPath = staticPath.resolve(artistFolderName);
        
        if (!Files.exists(artistPath)) {
            Files.createDirectories(artistPath);
            Files.createDirectories(artistPath.resolve("album"));
            Files.createDirectories(artistPath.resolve("profile_photo"));
        }
        
        return artistFolderName;
    }

    public String createAlbumFolderStructure(String artistName, String albumName) throws IOException {
        String artistFolderName = slugify(artistName);
        String albumFolderName = slugify(albumName);
        Path staticPath = Paths.get("src/main/resources/static");
        Path albumPath = staticPath.resolve(artistFolderName).resolve("album").resolve(albumFolderName);
        
        if (!Files.exists(albumPath)) {
            Files.createDirectories(albumPath);
            Files.createDirectories(albumPath.resolve("album-cover"));
            Files.createDirectories(albumPath.resolve("songs"));
        }
        
        return artistFolderName + "/album/" + albumFolderName;
    }

    public String uploadMp3FileToAlbum(MultipartFile file, String artistName, String albumName) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required and cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidMp3File(originalFilename)) {
            throw new IllegalArgumentException("Only MP3 files are allowed");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + (maxFileSize / 1024 / 1024) + "MB");
        }

        String artistFolderName = slugify(artistName);
        String albumFolderName = slugify(albumName);
        String trackFileNameWithoutExt = originalFilename.replaceAll("\\.[^.]+$", "");
        String trackFileName = slugify(trackFileNameWithoutExt) + ".mp3";
        
        Path staticPath = Paths.get("src/main/resources/static");
        Path songsPath = staticPath.resolve(artistFolderName).resolve("album").resolve(albumFolderName).resolve("songs");
        
        if (!Files.exists(songsPath)) {
            Files.createDirectories(songsPath);
        }

        Path filePath = songsPath.resolve(trackFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/" + artistFolderName + "/album/" + albumFolderName + "/songs/" + trackFileName;
    }

    public String uploadArtistProfileImage(MultipartFile file, String artistName) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required and cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidImageFile(originalFilename)) {
            throw new IllegalArgumentException("Only image files (JPG, JPEG, PNG, GIF) are allowed");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + (maxFileSize / 1024 / 1024) + "MB");
        }

        String artistFolderName = slugify(artistName);
        String fileExtension = getFileExtension(originalFilename);
        String profileFileName = artistFolderName + fileExtension.toLowerCase();
        
        Path staticPath = Paths.get("src/main/resources/static");
        Path profilePhotoPath = staticPath.resolve(artistFolderName).resolve("profile_photo");
        
        if (!Files.exists(profilePhotoPath)) {
            Files.createDirectories(profilePhotoPath);
        }

        Path filePath = profilePhotoPath.resolve(profileFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/" + artistFolderName + "/profile_photo/" + profileFileName;
    }

    public String uploadAlbumCoverImage(MultipartFile file, String artistName, String albumName) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required and cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidImageFile(originalFilename)) {
            throw new IllegalArgumentException("Only image files (JPG, JPEG, PNG, GIF) are allowed");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + (maxFileSize / 1024 / 1024) + "MB");
        }

        String artistFolderName = slugify(artistName);
        String albumFolderName = slugify(albumName);
        String fileExtension = getFileExtension(originalFilename);
        String coverFileName = slugify(albumName) + fileExtension.toLowerCase();
        
        Path staticPath = Paths.get("src/main/resources/static");
        Path albumCoverPath = staticPath.resolve(artistFolderName).resolve("album").resolve(albumFolderName).resolve("album-cover");
        
        if (!Files.exists(albumCoverPath)) {
            Files.createDirectories(albumCoverPath);
        }

        Path filePath = albumCoverPath.resolve(coverFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/" + artistFolderName + "/album/" + albumFolderName + "/album-cover/" + coverFileName;
    }

    public String extractMp3Duration(Path mp3FilePath) throws IOException {
        try {
            AudioFile audioFile = AudioFileIO.read(mp3FilePath.toFile());
            int durationInSeconds = audioFile.getAudioHeader().getTrackLength();
            
            int minutes = durationInSeconds / 60;
            int seconds = durationInSeconds % 60;
            
            String duration;
            if (seconds == 0) {
                duration = minutes + " minute" + (minutes != 1 ? "s" : "");
            } else {
                duration = minutes + " minute" + (minutes != 1 ? "s" : "") + " " + seconds + " second" + (seconds != 1 ? "s" : "");
            }
            
            return duration;
        } catch (CannotReadException | TagException | ReadOnlyFileException | InvalidAudioFrameException e) {
            throw new IOException("Failed to read MP3 file metadata: " + e.getMessage(), e);
        }
    }

    public void deleteArtistFolder(String artistName) throws IOException {
        String artistFolderName = slugify(artistName);
        Path staticPath = Paths.get("src/main/resources/static");
        Path artistPath = staticPath.resolve(artistFolderName);
        
        if (Files.exists(artistPath)) {
            deleteDirectoryRecursively(artistPath);
        }
    }

    public void deleteAlbumFolder(String artistName, String albumName) throws IOException {
        String artistFolderName = slugify(artistName);
        String albumFolderName = slugify(albumName);
        Path staticPath = Paths.get("src/main/resources/static");
        Path albumPath = staticPath.resolve(artistFolderName).resolve("album").resolve(albumFolderName);
        
        if (Files.exists(albumPath)) {
            deleteDirectoryRecursively(albumPath);
        }
    }

    public void deleteTrackFile(String filePath) throws IOException {
        if (filePath == null || filePath.isEmpty()) {
            return;
        }
        
        String cleanPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;
        if (!cleanPath.startsWith("static/")) {
            cleanPath = "static/" + cleanPath;
        }
        
        Path staticPath = Paths.get("src/main/resources");
        Path trackFilePath = staticPath.resolve(cleanPath);
        
        if (Files.exists(trackFilePath)) {
            Files.delete(trackFilePath);
        }
    }

    private void deleteDirectoryRecursively(Path path) throws IOException {
        if (Files.exists(path)) {
            Files.walk(path)
                    .sorted((a, b) -> b.compareTo(a))
                    .forEach(p -> {
                        try {
                            Files.delete(p);
                        } catch (IOException e) {
                            System.err.println("Failed to delete: " + p + " - " + e.getMessage());
                        }
                    });
        }
    }

    private String slugify(String name) {
        return name.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}

