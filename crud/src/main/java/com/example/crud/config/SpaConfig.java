package com.example.crud.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpaConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // This is the simplest and most reliable way to handle SPA routing.
        // It forwards all requests that don't have a specific backend mapping
        // to the index.html file, allowing the React router to take over.
        registry.addViewController("/").setViewName("forward:/index.html");
       // registry.addViewController("/**").setViewName("forward:/index.html");
    }
}