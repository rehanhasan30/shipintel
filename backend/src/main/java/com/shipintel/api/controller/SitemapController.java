package com.shipintel.api.controller;

import com.shipintel.api.entity.Article;
import com.shipintel.api.entity.Courier;
import com.shipintel.api.repository.ArticleRepository;
import com.shipintel.api.repository.CourierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SitemapController {

    private final ArticleRepository articleRepository;
    private final CourierRepository courierRepository;

    @Value("${app.sitemap.base-url:https://shipintel.in}")
    private String baseUrl;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    @Cacheable(value = "sitemaps", key = "'index'")
    public String getSitemapIndex() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");
        
        xml.append("  <sitemap>\n");
        xml.append("    <loc>").append(baseUrl).append("/sitemap-calculators.xml</loc>\n");
        xml.append("  </sitemap>\n");
        
        xml.append("  <sitemap>\n");
        xml.append("    <loc>").append(baseUrl).append("/sitemap-articles.xml</loc>\n");
        xml.append("  </sitemap>\n");
        
        xml.append("  <sitemap>\n");
        xml.append("    <loc>").append(baseUrl).append("/sitemap-couriers.xml</loc>\n");
        xml.append("  </sitemap>\n");
        
        xml.append("</sitemapindex>");
        return xml.toString();
    }

    @GetMapping(value = "/sitemap-calculators.xml", produces = MediaType.APPLICATION_XML_VALUE)
    @Cacheable(value = "sitemaps", key = "'calculators'")
    public String getCalculatorsSitemap() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        addUrl(xml, baseUrl + "/", "daily", "1.0");
        addUrl(xml, baseUrl + "/calculators", "weekly", "0.9");
        addUrl(xml, baseUrl + "/about", "monthly", "0.5");
        addUrl(xml, baseUrl + "/contact", "monthly", "0.5");

        xml.append("</urlset>");
        return xml.toString();
    }

    @GetMapping(value = "/sitemap-articles.xml", produces = MediaType.APPLICATION_XML_VALUE)
    @Cacheable(value = "sitemaps", key = "'articles'")
    public String getArticlesSitemap() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        addUrl(xml, baseUrl + "/resources", "daily", "0.8");

        List<Article> articles = articleRepository.findAll();
        String today = LocalDate.now().format(DateTimeFormatter.ISO_DATE);
        for (Article article : articles) {
            addUrl(xml, baseUrl + "/resources/" + article.getSlug(), "monthly", "0.7", today);
        }

        xml.append("</urlset>");
        return xml.toString();
    }

    @GetMapping(value = "/sitemap-couriers.xml", produces = MediaType.APPLICATION_XML_VALUE)
    @Cacheable(value = "sitemaps", key = "'couriers'")
    public String getCouriersSitemap() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        addUrl(xml, baseUrl + "/directory", "daily", "0.8");

        List<Courier> couriers = courierRepository.findAll();
        String today = LocalDate.now().format(DateTimeFormatter.ISO_DATE);
        for (Courier courier : couriers) {
            addUrl(xml, baseUrl + "/directory/" + courier.getId(), "weekly", "0.7", today);
        }

        xml.append("</urlset>");
        return xml.toString();
    }

    private void addUrl(StringBuilder xml, String loc, String changeFreq, String priority) {
        addUrl(xml, loc, changeFreq, priority, null);
    }

    private void addUrl(StringBuilder xml, String loc, String changeFreq, String priority, String lastMod) {
        xml.append("  <url>\n");
        xml.append("    <loc>").append(loc).append("</loc>\n");
        if (lastMod != null) {
            xml.append("    <lastmod>").append(lastMod).append("</lastmod>\n");
        }
        xml.append("    <changefreq>").append(changeFreq).append("</changefreq>\n");
        xml.append("    <priority>").append(priority).append("</priority>\n");
        xml.append("  </url>\n");
    }
}
