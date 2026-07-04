package com.shipintel.api.controller;

import com.shipintel.api.dto.ApiResponse;
import com.shipintel.api.entity.NewsletterSubscriber;
import com.shipintel.api.repository.NewsletterSubscriberRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterSubscriberRepository subscriberRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<NewsletterSubscriber>> subscribe(@RequestBody SubscribeRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
        }

        Optional<NewsletterSubscriber> existing = subscriberRepository.findByEmail(request.getEmail().trim());
        NewsletterSubscriber subscriber;

        if (existing.isPresent()) {
            subscriber = existing.get();
            if (!"SUBSCRIBED".equals(subscriber.getStatus())) {
                subscriber.setStatus("SUBSCRIBED");
                subscriber = subscriberRepository.save(subscriber);
            }
        } else {
            subscriber = NewsletterSubscriber.builder()
                    .email(request.getEmail().trim())
                    .name(request.getName())
                    .status("SUBSCRIBED")
                    .build();
            subscriber = subscriberRepository.save(subscriber);
        }

        return ResponseEntity.ok(ApiResponse.success(subscriber, "Newsletter subscription saved"));
    }

    @Data
    public static class SubscribeRequest {
        private String email;
        private String name;
    }
}
