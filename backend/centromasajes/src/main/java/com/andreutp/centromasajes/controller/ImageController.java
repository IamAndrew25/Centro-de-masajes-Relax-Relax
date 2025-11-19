package com.andreutp.centromasajes.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/upload")
public class ImageController {
    private static final String UPLOAD_DIR = "uploads/promotions/";

    @PostMapping("/promotion-image")
    public ResponseEntity<String> uploadPromotionImage(@RequestParam("image") MultipartFile file) {
        try {
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) directory.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            Files.write(filePath, file.getBytes());

            return ResponseEntity.ok("/uploads/promotions/" + fileName);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("ERROR SUBIENDO IMAGEN");
        }
    }
}
