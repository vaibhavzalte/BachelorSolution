package com.uv.bsol_backend.config;

import com.uv.bsol_backend.service.FileStorageService;
import com.uv.bsol_backend.service.GCPFileStorageService;
import com.uv.bsol_backend.service.LocalFileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StorageConfig {

    @Value("${storage.type:local}")
    private String storageType;

    @Value("${storage.local.path:./uploads}")
    private String localPath;

    @Value("${storage.gcp.bucket-name:}")
    private String gcpBucketName;

    @Value("${storage.gcp.project-id:}")
    private String gcpProjectId;

    @Bean
    public FileStorageService fileStorageService() {
        if ("gcp".equalsIgnoreCase(storageType)) {
            return new GCPFileStorageService(gcpBucketName, gcpProjectId);
        } else {
            return new LocalFileStorageService(localPath);
        }
    }
}
