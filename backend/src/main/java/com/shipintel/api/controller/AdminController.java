package com.shipintel.api.controller;

import com.shipintel.api.dto.ApiResponse;
import com.shipintel.api.entity.ContactRequest;
import com.shipintel.api.entity.NewsletterSubscriber;
import com.shipintel.api.repository.ContactRequestRepository;
import com.shipintel.api.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ContactRequestRepository contactRequestRepository;
    private final NewsletterSubscriberRepository newsletterSubscriberRepository;

    @GetMapping("/contact-requests")
    public ResponseEntity<ApiResponse<List<ContactRequest>>> getAllContactRequests() {
        List<ContactRequest> requests = contactRequestRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(requests, "Contact requests loaded"));
    }

    @GetMapping("/subscribers")
    public ResponseEntity<ApiResponse<List<NewsletterSubscriber>>> getAllSubscribers() {
        List<NewsletterSubscriber> subscribers = newsletterSubscriberRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(subscribers, "Subscribers loaded"));
    }
}
