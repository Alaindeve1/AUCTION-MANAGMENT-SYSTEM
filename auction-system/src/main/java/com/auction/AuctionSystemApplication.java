package com.auction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class AuctionSystemApplication {

	public static void main(String[] args) {
		// Load .env file if it exists
		try {
			Dotenv dotenv = Dotenv.configure()
					.directory("../")
					.ignoreIfMissing()
					.load();
			dotenv.entries().forEach(entry -> {
				System.setProperty(entry.getKey(), entry.getValue());
			});
			System.out.println("Loaded " + dotenv.entries().size() + " environment variables from .env");
		} catch (Exception e) {
			// .env file not found or couldn't be loaded, continue without it
			System.out.println("Note: .env file not found or couldn't be loaded. Using environment variables.");
		}
		
		SpringApplication.run(AuctionSystemApplication.class, args);
	}

}
