package com.uv.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.uv.app.entity")
@EnableJpaRepositories("com.uv.app.repository")
public class BsolApplicationMain {
    public static void main(String[] args) {
        SpringApplication.run(BsolApplicationMain.class, args);
    }
}
