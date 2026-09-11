package com.example.idectt.util;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Safelist;

// Duyuru icerigi gibi zengin metin (WYSIWYG) HTML alanlarini kaydetmeden once
// bilinen bir kutuphane (Jsoup) ile temizler. Izin verilenlerin disindaki her
// sey (script, style, iframe, onclick vb.) otomatik olarak elenir.
public final class HtmlSanitizer {

    private static final Safelist SAFELIST = new Safelist()
            .addTags("p", "br", "strong", "em", "u", "a", "ul", "ol", "li", "h3", "h4")
            .addAttributes("a", "href", "target", "rel")
            .addProtocols("a", "href", "http", "https", "mailto")
            // Semasi olmayan (site-ici, orn. /seminar-certificates) hrefleri oldugu gibi korur.
            // Semasi OLAN ama izin listesinde olmayanlar (javascript:, data: vb.) yine elenir.
            .preserveRelativeLinks(true);

    // Jsoup, protokol kontrolu icin relative href'leri bu baseUri'ye gore mutlaklastirip
    // sonucun izinli bir protokolle (http/https/mailto) baslayip baslamadigina bakar;
    // preserveRelativeLinks(true) sayesinde CIKTIDA orijinal relative deger korunur, bu
    // baseUri hicbir zaman ciktiya yansimaz. Kontrolun calismasi icin gecerli bir mutlak
    // URI olmasi yeterli, gercek bir domain olmasi gerekmez.
    private static final String RESOLUTION_BASE_URI = "https://localhost/";

    private HtmlSanitizer() {
    }

    public static String sanitize(String html) {
        if (html == null) {
            return null;
        }
        Document.OutputSettings outputSettings = new Document.OutputSettings().prettyPrint(false);
        return Jsoup.clean(html, RESOLUTION_BASE_URI, SAFELIST, outputSettings);
    }
}
