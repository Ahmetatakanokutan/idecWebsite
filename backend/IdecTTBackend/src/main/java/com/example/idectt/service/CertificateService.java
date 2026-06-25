package com.example.idectt.service;

import com.example.idectt.entity.Certificate;
import com.example.idectt.entity.User;
import com.example.idectt.payload.dto.UserProgressSummaryDto;
import com.example.idectt.repository.CertificateRepository;
import com.example.idectt.repository.LessonRepository;
import com.example.idectt.repository.UserRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressService progressService;

    public CertificateService(CertificateRepository certificateRepository,
                              UserRepository userRepository,
                              LessonRepository lessonRepository,
                              LessonProgressService progressService) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.progressService = progressService;
    }

    @Transactional
    public byte[] generateCertificate(Long userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalLessons = lessonRepository.count();
        UserProgressSummaryDto summary = progressService.getUserProgressSummary(userId, totalLessons);
        if (!summary.isCertificateEligible()) {
            throw new IllegalStateException("User has not completed 80% of the courses yet.");
        }

        Certificate certificate = certificateRepository.findByUserId(userId).orElseGet(() -> {
            String certificateNumber = "IDEC-" + LocalDate.now().getYear() + "-" +
                    UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
            Certificate newCertificate = new Certificate(
                    user,
                    certificateNumber,
                    LocalDate.now(),
                    summary.getCompletionPercentage()
            );
            return certificateRepository.save(newCertificate);
        });

        return buildPdf(
                user.getFullName(),
                certificate.getCertificateNumber(),
                certificate.getIssuedAt(),
                certificate.getCompletionPercentage()
        );
    }

    @Transactional(readOnly = true)
    public boolean isEligible(Long userId) {
        long totalLessons = lessonRepository.count();
        if (totalLessons == 0) {
            return false;
        }
        return progressService.getUserProgressSummary(userId, totalLessons).isCertificateEligible();
    }

    private byte[] buildPdf(String fullName, String certificateNumber, LocalDate issuedAt, double completionPct)
            throws Exception {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate(), 40, 40, 40, 40);
        PdfWriter writer = PdfWriter.getInstance(document, output);
        document.open();

        float width = document.getPageSize().getWidth();
        float height = document.getPageSize().getHeight();

        var canvas = writer.getDirectContent();
        canvas.setColorStroke(new Color(5, 102, 60));
        canvas.setLineWidth(8f);
        canvas.rectangle(20, 20, width - 40, height - 40);
        canvas.stroke();

        canvas.setLineWidth(2f);
        canvas.rectangle(28, 28, width - 56, height - 56);
        canvas.stroke();

        canvas.setColorFill(new Color(5, 102, 60));
        canvas.rectangle(28, height - 80, width - 56, 6);
        canvas.fill();
        canvas.rectangle(28, 56, width - 56, 6);
        canvas.fill();

        Font fontBig = new Font(Font.HELVETICA, 38f, Font.BOLD, new Color(5, 102, 60));
        Font fontMid = new Font(Font.HELVETICA, 20f, Font.BOLD, new Color(40, 40, 40));
        Font fontNormal = new Font(Font.HELVETICA, 14f, Font.NORMAL, new Color(60, 60, 60));
        Font fontName = new Font(Font.HELVETICA, 32f, Font.BOLD, new Color(5, 102, 60));
        Font fontSmall = new Font(Font.HELVETICA, 10f, Font.NORMAL, new Color(120, 120, 120));

        Paragraph institution = new Paragraph("YEDITEPE UNIVERSITESI", fontBig);
        institution.setAlignment(Element.ALIGN_CENTER);
        institution.setSpacingBefore(30f);
        document.add(institution);

        Paragraph program = new Paragraph("IDEC-TT - Ikiz Donusum Yoluyla Endustriyel Dekarbonizasyon", fontNormal);
        program.setAlignment(Element.ALIGN_CENTER);
        program.setSpacingAfter(20f);
        document.add(program);

        Paragraph title = new Paragraph("BASARI VE TAMAMLAMA BELGESI", fontMid);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(10f);
        title.setSpacingAfter(8f);
        document.add(title);

        document.add(new LineSeparator(1f, 60f, new Color(5, 102, 60), Element.ALIGN_CENTER, -5f));

        Paragraph intro = new Paragraph("Bu belge,", fontNormal);
        intro.setAlignment(Element.ALIGN_CENTER);
        intro.setSpacingBefore(24f);
        document.add(intro);

        Paragraph name = new Paragraph(fullName, fontName);
        name.setAlignment(Element.ALIGN_CENTER);
        name.setSpacingAfter(8f);
        document.add(name);

        Paragraph description = new Paragraph(
                "adli katilimcinin IDEC-TT Endustriyel Dekarbonizasyon Egitim Platformu bunyesindeki\n" +
                        "egitim programlarini %" + String.format(Locale.US, "%.0f", completionPct) +
                        " oraninda basariyla tamamladigini onaylar.",
                fontNormal
        );
        description.setAlignment(Element.ALIGN_CENTER);
        description.setSpacingAfter(30f);
        document.add(description);

        String date = issuedAt.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(70f);
        infoTable.setHorizontalAlignment(Element.ALIGN_CENTER);

        PdfPCell dateCell = new PdfPCell(new Phrase("Verilis Tarihi: " + date, fontNormal));
        dateCell.setBorder(PdfPCell.NO_BORDER);
        dateCell.setHorizontalAlignment(Element.ALIGN_LEFT);

        PdfPCell numberCell = new PdfPCell(new Phrase("Belge No: " + certificateNumber, fontNormal));
        numberCell.setBorder(PdfPCell.NO_BORDER);
        numberCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        infoTable.addCell(dateCell);
        infoTable.addCell(numberCell);
        document.add(infoTable);

        Paragraph note = new Paragraph(
                "Bu belge IDEC-TT platformu tarafindan otomatik olarak olusturulmustur. " +
                        "Dogrulama icin idectt@yeditepe.edu.tr adresine basvurunuz.",
                fontSmall
        );
        note.setAlignment(Element.ALIGN_CENTER);
        note.setSpacingBefore(20f);
        document.add(note);

        document.close();
        return output.toByteArray();
    }
}
