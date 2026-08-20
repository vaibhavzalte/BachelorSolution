package com.uv.app.service;

import com.uv.app.exception.FileStorageException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
public class LocalFileStorageService implements FileStorageService {

    private final Path rootLocation;

    public LocalFileStorageService(String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not initialize storage at path: " + rootLocation.toAbsolutePath(), e);
        }
    }

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
        return "/uploads/" + filename;
    }

    @Override
    public List<String> storeFiles(List<MultipartFile> files) throws IOException {
        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                fileUrls.add(storeFile(file));
            }
        }
        log.info("file stored locally{}", fileUrls);
        return fileUrls;
    }

    @Override
    public byte[] loadFile(String fileUrl) throws IOException {
        String filename = fileUrl.replace("/uploads/", "");
        return Files.readAllBytes(this.rootLocation.resolve(filename));
    }
}
