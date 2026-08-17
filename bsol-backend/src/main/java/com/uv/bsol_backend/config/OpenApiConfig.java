package com.uv.bsol_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI bachelorSolutionOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Bachelor Solution API")
                        .description("Unified listing APIs for Room, Mess, RoomVacancy, FoodStall and StudyRoom. "
                                + "Create and update requests use multipart/form-data: "
                                + "`listing` is a JSON string and `images` is an optional file array.")
                        .version("v1")
                        .contact(new Contact().name("Bachelor Solution")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local development")
                ));
    }
}
