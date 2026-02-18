package com.example.idectt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = System.getProperty("user.dir") + "/uploads/";
        
        // Windows uyumluluğu için ters slash düzeltmesi gerekebilir ama Java URI'de genelde düz slash çalışır.
        // file:///C:/... formatı için
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///" + uploadPath.replace("\\", "/"));
    }
}
