package com.shipintel.api.controller;

import com.shipintel.api.entity.Article;
import com.shipintel.api.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${app.sitemap.base-url:https://shipintel.in}")
    private String baseUrl;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String getSitemap() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        // Static routes
        addUrl(xml, baseUrl + "/", "daily", "1.0");
        addUrl(xml, baseUrl + "/calculator", "weekly", "0.9");
        addUrl(xml, baseUrl + "/blog", "daily", "0.8");

        // Dynamic blog articles
        List<Article> articles = articleRepository.findAll();
        String today = LocalDate.now().format(DateTimeFormatter.ISO_DATE);
        for (Article article : articles) {
            addUrl(xml, baseUrl + "/blog/articles/" + article.getSlug(), "monthly", "0.7", today);
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
