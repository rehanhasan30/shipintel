package com.shipintel.api.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, TokenBucket> buckets = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        RateLimit rateLimit = handlerMethod.getMethodAnnotation(RateLimit.class);
        if (rateLimit == null) {
            rateLimit = handlerMethod.getBeanType().getAnnotation(RateLimit.class);
        }

        if (rateLimit != null) {
            String clientIp = getClientIp(request);
            String key = clientIp + ":" + handlerMethod.getMethod().getName();
            
            final RateLimit finalRateLimit = rateLimit;
            TokenBucket bucket = buckets.computeIfAbsent(key, k -> new TokenBucket(finalRateLimit.limit(), finalRateLimit.periodSeconds()));
            
            if (!bucket.tryConsume()) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"success\":false,\"message\":\"Too many requests. Please try again later.\",\"timestamp\":\"" + java.time.LocalDateTime.now() + "\"}");
                return false;
            }
        }

        return true;
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }

    private static class TokenBucket {
        private final int capacity;
        private final int periodSeconds;
        private double tokens;
        private long lastRefillTime;

        public TokenBucket(int capacity, int periodSeconds) {
            this.capacity = capacity;
            this.periodSeconds = periodSeconds;
            this.tokens = capacity;
            this.lastRefillTime = System.nanoTime();
        }

        public synchronized boolean tryConsume() {
            refill();
            if (tokens >= 1.0) {
                tokens -= 1.0;
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.nanoTime();
            double elapsedSeconds = (now - lastRefillTime) / 1_000_000_000.0;
            double refillTokens = elapsedSeconds * (capacity / (double) periodSeconds);
            
            if (refillTokens > 0) {
                tokens = Math.min(capacity, tokens + refillTokens);
                lastRefillTime = now;
            }
        }
    }
}
