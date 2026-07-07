package com.interviewtrainer.backend.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/util")
public class PdfParserController {

    @PostMapping("/parse-pdf")
    public ResponseEntity<?> parsePdf(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || !file.getContentType().equals("application/pdf")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid file type. Please upload a PDF."));
        }

        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            if (document.isEncrypted()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Cannot parse encrypted PDF."));
            }

            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            
            return ResponseEntity.ok(Map.of("text", text));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to parse PDF file."));
        }
    }
}
