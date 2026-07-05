package com.shipintel.api.service;

import com.shipintel.api.config.CarrierPatternRegistry;
import com.shipintel.api.config.CarrierPatternRegistry.CarrierPattern;
import com.shipintel.api.dto.SearchResultDto;
import com.shipintel.api.dto.SearchType;
import com.shipintel.api.entity.Article;
import com.shipintel.api.entity.Courier;
import com.shipintel.api.repository.ArticleRepository;
import com.shipintel.api.repository.CourierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final CourierRepository courierRepository;
    private final ArticleRepository articleRepository;

    @Transactional(readOnly = true)
    public List<SearchResultDto> search(String query, SearchType filterType) {
        List<SearchResultDto> results = new ArrayList<>();
        if (query == null || query.trim().isEmpty()) {
            return results;
        }

        String cleanQuery = query.trim();
        String lowerQuery = cleanQuery.toLowerCase();
        SearchType targetType = filterType != null ? filterType : SearchType.ALL;

        // 1. TRACKING INTENT MATCHING
        if (targetType == SearchType.ALL || targetType == SearchType.TRACKING) {
            boolean matchedAny = false;
            List<Courier> allCouriers = courierRepository.findAll();

            for (CarrierPattern cp : CarrierPatternRegistry.REGISTRY) {
                if (cp.pattern().matcher(cleanQuery).matches()) {
                    matchedAny = true;
                    Courier matchedCourier = allCouriers.stream()
                            .filter(c -> c.getName().equalsIgnoreCase(cp.carrier()))
                            .findFirst()
                            .orElse(null);

                    String websiteUrl = matchedCourier != null ? matchedCourier.getWebsiteUrl() : "https://shipintel.in";
                    String trackingUrl = matchedCourier != null && matchedCourier.getTrackingUrlTemplate() != null
                            ? matchedCourier.getTrackingUrlTemplate().replace("{AWB}", cleanQuery)
                            : websiteUrl;

                    results.add(SearchResultDto.builder()
                            .type(SearchType.TRACKING)
                            .title("Tracking Number Detected: " + cleanQuery)
                            .description("Official Tracking Available for " + cp.carrier() + ". Estimated delivery 2-4 days.")
                            .url(trackingUrl)
                            .score(100.0)
                            .carrierName(cp.carrier())
                            .trackingNumber(cleanQuery)
                            .supportEmail(matchedCourier != null ? matchedCourier.getSupportEmail() : "support@" + cp.carrier().toLowerCase().replace(" ", "") + ".com")
                            .supportPhone(matchedCourier != null ? matchedCourier.getSupportPhone() : "N/A")
                            .logoInitials(cp.carrier().substring(0, 1))
                            .logoBgClass(getLogoBgClass(cp.carrier()))
                            .build());
                }
            }

            // Fallback for general tracking formatting (alphanumeric >= 7 chars)
            if (!matchedAny && cleanQuery.length() >= 7 && (cleanQuery.matches(".*\\d.*") || cleanQuery.matches("[A-Z0-9]+"))) {
                for (Courier courier : allCouriers) {
                    if (courier.getTrackingUrlTemplate() != null) {
                        String trackingUrl = courier.getTrackingUrlTemplate().replace("{AWB}", cleanQuery);
                        results.add(SearchResultDto.builder()
                                .type(SearchType.TRACKING)
                                .title("Ambiguous Tracking: " + cleanQuery)
                                .description("Choose carrier to track: " + courier.getName())
                                .url(trackingUrl)
                                .score(80.0)
                                .carrierName(courier.getName())
                                .trackingNumber(cleanQuery)
                                .supportEmail(courier.getSupportEmail())
                                .supportPhone(courier.getSupportPhone())
                                .logoInitials(courier.getName().substring(0, 1))
                                .logoBgClass(getLogoBgClass(courier.getName()))
                                .build());
                    }
                }
            }
        }

        // 2. CALCULATOR INTENT MATCHING
        if (targetType == SearchType.ALL || targetType == SearchType.CALCULATOR) {
            if (lowerQuery.contains("calc") || lowerQuery.contains("rate") || lowerQuery.contains("weight") ||
                lowerQuery.contains("volumetric") || lowerQuery.contains("dimension") || lowerQuery.contains("volume") ||
                lowerQuery.contains("storage") || lowerQuery.contains("customs") || lowerQuery.contains("duty") ||
                lowerQuery.contains("charge") || lowerQuery.contains("cost") || lowerQuery.contains("fee")) {

                double score = lowerQuery.contains("volumetric") || lowerQuery.contains("calc") ? 95.0 : 80.0;

                results.add(SearchResultDto.builder()
                        .type(SearchType.CALCULATOR)
                        .title("Freight Rates Calculator")
                        .description("Compare real-time domestic shipping rates between major metro cities.")
                        .url("/calculators")
                        .tab("freight")
                        .score(score)
                        .build());

                results.add(SearchResultDto.builder()
                        .type(SearchType.CALCULATOR)
                        .title("Volumetric Weight Calculator")
                        .description("Calculate chargeable weight index based on package dimensions (L x W x H / 5000).")
                        .url("/calculators")
                        .tab("volumetric")
                        .score(score + 2.0)
                        .build());

                results.add(SearchResultDto.builder()
                        .type(SearchType.CALCULATOR)
                        .title("Customs Duties Calculator")
                        .description("Premium customs duty estimator for international cargo entries.")
                        .url("/calculators")
                        .tab("customs")
                        .score(score - 5.0)
                        .build());
            }
        }

        // 3. COURIER INTENT MATCHING
        if (targetType == SearchType.ALL || targetType == SearchType.COURIER) {
            List<Courier> allCouriers = courierRepository.findAll();
            for (Courier c : allCouriers) {
                double matchScore = 0.0;
                if (c.getName().equalsIgnoreCase(cleanQuery)) {
                    matchScore = 100.0;
                } else if (c.getName().toLowerCase().contains(lowerQuery)) {
                    matchScore = 90.0;
                } else if (c.getDescription() != null && c.getDescription().toLowerCase().contains(lowerQuery)) {
                    matchScore = 65.0;
                }

                if (matchScore > 0.0) {
                    String carrierType = "Standard Logistics";
                    if (c.getName().contains("Blue Dart")) carrierType = "Premium Express Air";
                    else if (c.getName().contains("Delhivery")) carrierType = "Integrated Logistics Provider";
                    else if (c.getName().contains("XpressBees")) carrierType = "E-commerce Logistics Specialist";
                    else if (c.getName().contains("DTDC")) carrierType = "Express Courier Network";
                    else if (c.getName().contains("India Post")) carrierType = "National Postal System";

                    results.add(SearchResultDto.builder()
                            .type(SearchType.COURIER)
                            .title(c.getName())
                            .description(c.getDescription())
                            .url("/directory/" + c.getId())
                            .score(matchScore)
                            .carrierName(c.getName())
                            .category(carrierType)
                            .build());
                }
            }
        }

        // 4. ARTICLE INTENT MATCHING
        if (targetType == SearchType.ALL || targetType == SearchType.ARTICLE) {
            List<Article> articles = articleRepository.findAll();
            for (Article a : articles) {
                double matchScore = 0.0;
                if (a.getTitle().toLowerCase().contains(lowerQuery)) {
                    matchScore = 85.0;
                } else if (a.getContent() != null && a.getContent().toLowerCase().contains(lowerQuery)) {
                    matchScore = 60.0;
                }

                if (matchScore > 0.0) {
                    String excerpt = a.getContent() != null && a.getContent().length() > 150
                            ? a.getContent().substring(0, 150) + "..."
                            : a.getContent();

                    results.add(SearchResultDto.builder()
                            .type(SearchType.ARTICLE)
                            .title(a.getTitle())
                            .description(excerpt)
                            .url("/resources/" + a.getSlug())
                            .score(matchScore)
                            .category(a.getCategory().getName())
                            .build());
                }
            }
        }

        results.sort(Comparator.comparingDouble(SearchResultDto::getScore).reversed());
        return results;
    }

    @Transactional(readOnly = true)
    public List<String> getSuggestions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }
        String q = query.trim().toLowerCase();
        List<String> suggestions = new ArrayList<>();

        // Match carrier names
        List<Courier> couriers = courierRepository.findAll();
        for (Courier c : couriers) {
            if (c.getName().toLowerCase().contains(q)) {
                suggestions.add(c.getName());
            }
        }

        // Match common cities / routes
        List<String> cities = List.of("Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad");
        for (String city : cities) {
            if (city.toLowerCase().startsWith(q)) {
                suggestions.add(city);
                suggestions.add(city + " to Mumbai");
                suggestions.add("Delhi to " + city);
            }
        }

        // Match blog titles
        List<Article> articles = articleRepository.findAll();
        for (Article a : articles) {
            if (a.getTitle().toLowerCase().contains(q)) {
                suggestions.add(a.getTitle());
            }
        }

        // Match calculator keywords
        List<String> calculatorKeywords = List.of("Volumetric Weight", "Freight Rates", "Customs Duty");
        for (String kw : calculatorKeywords) {
            if (kw.toLowerCase().contains(q)) {
                suggestions.add(kw);
                suggestions.add(kw + " Calculator");
            }
        }

        return suggestions.stream()
                .distinct()
                .limit(6)
                .collect(Collectors.toList());
    }

    private String getLogoBgClass(String name) {
        String n = name.toLowerCase();
        if (n.contains("delhivery")) return "bg-primary-container text-on-primary";
        if (n.contains("dtdc")) return "bg-secondary-container text-on-secondary-container";
        if (n.contains("blue dart")) return "bg-tertiary-container text-on-tertiary-container";
        if (n.contains("india post")) return "bg-error-container text-on-error-container";
        return "bg-surface-variant text-on-surface-variant";
    }
}
