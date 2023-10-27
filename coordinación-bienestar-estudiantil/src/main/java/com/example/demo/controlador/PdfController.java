package com.example.demo.controlador;


import com.example.demo.model.entidad.CoordinacionBienestarEstudiantil;
import com.example.demo.model.entidad.servicios.CoordinacionBienestarEstudiantilService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfGState;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/pdf")
public class PdfController {

    @Autowired
    private CoordinacionBienestarEstudiantilService coordinacionService;

    @GetMapping("/exportar-pdf")
    public void exportarPDF(@RequestParam Long id, HttpServletResponse response) {
        try {
            List<CoordinacionBienestarEstudiantil> coordinaciones = coordinacionService.obtenerCoordinacionesPorUsuarioId(id);

            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=coordinaciones.pdf");

            Document document = new Document();
            PdfWriter writer = PdfWriter.getInstance(document, response.getOutputStream());
            // Agrega un evento de fondo para la imagen
            writer.setPageEvent(new WatermarkPageEvent());

            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Font fieldFont = FontFactory.getFont(FontFactory.HELVETICA, 14, BaseColor.BLACK);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.GRAY);

            for (CoordinacionBienestarEstudiantil coordinacion : coordinaciones) {
                Paragraph title = new Paragraph("Detalle Coordinación Bienestar Estudiantil", titleFont);
                title.setAlignment(Element.ALIGN_CENTER);
                document.add(title);

                document.add(new Paragraph(" "));
                document.add(new Paragraph(" "));

                PdfPTable table = new PdfPTable(1);
                table.setWidthPercentage(100);

                addFieldToTable("ID:", coordinacion.getId().toString(), fieldFont, bodyFont, table);
                addFieldToTable("Nombre Estudiante:", coordinacion.getUsuario().getNombre(), fieldFont, bodyFont, table);
                addFieldToTable("Tipo Consulta:", coordinacion.getTipoConsulta().getNombre(), fieldFont, bodyFont, table);
                addFieldToTable("Presentación del Problema:", coordinacion.getPresentacionProblema(), fieldFont, bodyFont, table);

                addFieldToTable("Descripción del Problema:", coordinacion.getProblemaDescripcion(), fieldFont, bodyFont, table);
                addFieldToTable("Descripción del Especialista:", coordinacion.getEspecialistaDescripcion(), fieldFont, bodyFont, table);
                addFieldToTable("Respuesta del Problema:", coordinacion.getRespuestaProblema(), fieldFont, bodyFont, table);

                document.add(table);

                document.newPage();
            }

            document.close();
        } catch (DocumentException | IOException e) {
            e.printStackTrace();
        }
    }

    private void addFieldToTable(String fieldName, String value, Font fieldFont, Font bodyFont, PdfPTable table) throws DocumentException {
        PdfPCell fieldCell = new PdfPCell(new Phrase(fieldName, fieldFont));
        fieldCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        fieldCell.setBorder(Rectangle.NO_BORDER);
        table.addCell(fieldCell);

        PdfPCell valueCell = new PdfPCell(new Phrase("    " + value, bodyFont));
        valueCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        valueCell.setBorder(Rectangle.NO_BORDER);
        table.addCell(valueCell);

        PdfPCell emptyCell = new PdfPCell(new Phrase(" ", bodyFont));
        emptyCell.setBorder(Rectangle.NO_BORDER);
        table.addCell(emptyCell);
    }

  
    class WatermarkPageEvent extends PdfPageEventHelper {
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            try {
                String imagePath = "https://pc-solucion.es/wp-content/uploads/2021/12/como-poner-marca-de-agua-en-word.jpg";
                Image background = Image.getInstance(imagePath);

                // Ajusta la escala de la imagen de fondo según el ancho del documento
                float documentWidth = document.getPageSize().getWidth();
                float documentHeight = document.getPageSize().getHeight();
                float imageWidth = background.getWidth();
                float imageHeight = background.getHeight();
                float scaleWidth = documentWidth / imageWidth;
                float scaleHeight = documentHeight / imageHeight;
                float minScale = Math.min(scaleWidth, scaleHeight);
                background.scaleAbsolute(imageWidth * minScale, imageHeight * minScale);

                // Centra la imagen
                float x = (documentWidth - background.getScaledWidth()) / 2;
                float y = (documentHeight - background.getScaledHeight()) / 2;
                background.setAbsolutePosition(x, y);

                // Añade opacidad a la imagen (valor de opacidad: 0.5)
                PdfGState gState = new PdfGState();
                gState.setFillOpacity(0.5f); // Ajusta la opacidad según tu preferencia (0.0f a 1.0f)
               
              
                
                PdfContentByte under = writer.getDirectContentUnder();
                under.addImage(background);
            } catch (DocumentException | IOException e) {
                e.printStackTrace();
            }
        }
    }



}



