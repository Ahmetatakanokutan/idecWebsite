package com.example.IdecTTBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.example.idectt", "com.example.IdecTTBackend"})
@EnableJpaRepositories({"com.example.idectt.repository", "com.example.IdecTTBackend.repository"})
@EntityScan({"com.example.idectt.entity", "com.example.IdecTTBackend.model"})
public class IdecTtBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(IdecTtBackendApplication.class, args);
	}

}
