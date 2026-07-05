package com.shipintel.api.controller;

import com.shipintel.api.dto.ApiResponse;
import com.shipintel.api.dto.SearchResultDto;
import com.shipintel.api.dto.SearchType;
import com.shipintel.api.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SearchResultDto>>> search(
            @RequestParam("q") String query,
            @RequestParam(value = "type", required = false, defaultValue = "ALL") SearchType type) {
        List<SearchResultDto> results = searchService.search(query, type);
        return ResponseEntity.ok(ApiResponse.success(results, "Search completed successfully"));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getSuggestions(@RequestParam("q") String query) {
        List<String> suggestions = searchService.getSuggestions(query);
        return ResponseEntity.ok(ApiResponse.success(suggestions, "Suggestions retrieved successfully"));
    }
}
