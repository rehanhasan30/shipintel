package com.shipintel.api.controller;

import com.shipintel.api.dto.ApiResponse;
import com.shipintel.api.entity.ContactRequest;
import com.shipintel.api.repository.ContactRequestRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/support")
@RequiredArgsConstructor
public class SupportController {

    private final ContactRequestRepository contactRequestRepository;

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<ContactRequest>> submitContactRequest(@RequestBody ContactForm form) {
        if (form.getName() == null || form.getName().trim().isEmpty() ||
            form.getEmail() == null || form.getEmail().trim().isEmpty() ||
            form.getSubject() == null || form.getSubject().trim().isEmpty() ||
            form.getMessage() == null || form.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("All form fields are required"));
        }

        ContactRequest request = ContactRequest.builder()
                .name(form.getName().trim())
                .email(form.getEmail().trim())
                .subject(form.getSubject().trim())
                .message(form.getMessage().trim())
                .type("SUPPORT") // Default to SUPPORT type
                .status("PENDING") // Default status
                .build();

        ContactRequest saved = contactRequestRepository.save(request);

        return ResponseEntity.ok(ApiResponse.success(saved, "Support ticket generated"));
    }

    @Data
    public static class ContactForm {
        private String name;
        private String email;
        private String subject;
        private String message;
    }
}
