package com.example.maraureserve.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI marauReserveOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("MarauReserve API")
                        .description("Documentação interativa da API de residências, quartos, clientes e aluguéis.")
                        .version("v1")
                        .contact(new Contact().name("Equipe MarauReserve"))
                        .license(new License().name("Uso acadêmico")));
    }
}
