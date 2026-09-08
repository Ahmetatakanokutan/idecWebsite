package com.example.idectt.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HtmlSanitizerTest {

    @Test
    void preservesRelativeLinks() {
        String html = "<p><a href=\"/seminar-certificates\">Sertifikalar</a></p>";
        String result = HtmlSanitizer.sanitize(html);
        assertTrue(result.contains("href=\"/seminar-certificates\""), result);
    }

    @Test
    void preservesAbsoluteHttpLinks() {
        String html = "<p><a href=\"https://example.com/page\">Örnek</a></p>";
        String result = HtmlSanitizer.sanitize(html);
        assertTrue(result.contains("href=\"https://example.com/page\""), result);
    }

    @Test
    void preservesMailtoLinks() {
        String html = "<p><a href=\"mailto:idectt@yeditepe.edu.tr\">Bize Yazın</a></p>";
        String result = HtmlSanitizer.sanitize(html);
        assertTrue(result.contains("href=\"mailto:idectt@yeditepe.edu.tr\""), result);
    }

    @Test
    void stripsJavascriptProtocol() {
        String html = "<p><a href=\"javascript:alert(1)\">Tıkla</a></p>";
        String result = HtmlSanitizer.sanitize(html);
        assertFalse(result.contains("javascript:"), result);
    }

    @Test
    void stripsDataProtocol() {
        String html = "<p><a href=\"data:text/html,<script>alert(1)</script>\">Tıkla</a></p>";
        String result = HtmlSanitizer.sanitize(html);
        assertFalse(result.contains("data:"), result);
    }

    @Test
    void stripsDisallowedTagsAndAttributes() {
        String html = "<script>alert(1)</script><p onclick=\"alert(1)\" style=\"color:red\">Metin</p>";
        String result = HtmlSanitizer.sanitize(html);
        assertFalse(result.contains("<script"), result);
        assertFalse(result.contains("onclick"), result);
        assertFalse(result.contains("style"), result);
        assertTrue(result.contains("Metin"), result);
    }

    @Test
    void keepsAllowedFormattingTags() {
        String html = "<h3>Başlık</h3><p><strong>kalın</strong> <em>italik</em></p>"
                + "<ul><li>madde</li></ul><ol><li>1</li></ol>";
        String result = HtmlSanitizer.sanitize(html);
        assertEquals(html, result);
    }
}
