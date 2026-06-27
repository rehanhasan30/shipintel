package com.shipintel.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI shipIntelOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("ShipIntel API")
                        .description("ShipIntel Logistics Platform REST API")
                        .version("v1.0.0"));
    }
}
