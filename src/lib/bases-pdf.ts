import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  BASES_SECTIONS,
  BANK_DETAILS,
  CATEGORIES,
  CONTACT_EMAIL,
  EVENT,
  ORGANIZER,
} from "./constants";

const MARGIN = 50;
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 14;
const TITLE = "I Concurso Nacional IoT IEEE ULEAM 2026";
const SUBTITLE = "Bases oficiales del concurso";

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawWrapped(
  page: PDFPage,
  font: PDFFont,
  text: string,
  x: number,
  y: number,
  size: number,
  maxWidth: number,
  color = rgb(0.1, 0.15, 0.25),
) {
  const lines = wrapText(text, font, size, maxWidth);
  let cursorY = y;
  for (const line of lines) {
    page.drawText(line, { x, y: cursorY, size, font, color });
    cursorY -= LINE_HEIGHT;
  }
  return cursorY;
}

export async function generateBasesPdfBytes() {
  const pdfDoc = await PDFDocument.create();
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  };

  page.drawText(TITLE, {
    x: MARGIN,
    y,
    size: 16,
    font: bold,
    color: rgb(0, 0.35, 0.75),
  });
  y -= 22;

  page.drawText(SUBTITLE, {
    x: MARGIN,
    y,
    size: 12,
    font: regular,
    color: rgb(0.2, 0.25, 0.35),
  });
  y -= 24;

  const intro = [
    `Organiza: ${ORGANIZER.branch}`,
    `${ORGANIZER.university} · ${ORGANIZER.city}`,
    `Correo: ${CONTACT_EMAIL} · Web: ${ORGANIZER.web}`,
    `Presentación: ${EVENT.presentationDate} · ${EVENT.presentationLocation}`,
    `Inscripciones: ${EVENT.registrationOpen} — cierre ${EVENT.registrationClose}`,
  ];

  for (const line of intro) {
    ensureSpace(LINE_HEIGHT);
    page.drawText(line, { x: MARGIN, y, size: 10, font: regular, color: rgb(0.25, 0.3, 0.4) });
    y -= LINE_HEIGHT;
  }

  y -= 10;

  for (const section of BASES_SECTIONS) {
    ensureSpace(30);
    page.drawText(section.title, {
      x: MARGIN,
      y,
      size: 12,
      font: bold,
      color: rgb(0, 0.4, 0.8),
    });
    y -= 18;

    for (const item of section.items) {
      ensureSpace(LINE_HEIGHT * 3);
      const bullet = "• ";
      const itemLines = wrapText(item, regular, 10, CONTENT_WIDTH - 12);
      itemLines.forEach((line, index) => {
        ensureSpace(LINE_HEIGHT);
        page.drawText(index === 0 ? `${bullet}${line}` : `  ${line}`, {
          x: MARGIN,
          y,
          size: 10,
          font: regular,
          color: rgb(0.15, 0.2, 0.3),
        });
        y -= LINE_HEIGHT;
      });
      y -= 4;
    }
    y -= 8;
  }

  ensureSpace(80);
  page.drawText("Categorías oficiales", {
    x: MARGIN,
    y,
    size: 12,
    font: bold,
    color: rgb(0, 0.4, 0.8),
  });
  y -= 18;

  CATEGORIES.forEach((cat, index) => {
    ensureSpace(LINE_HEIGHT * 2);
    y = drawWrapped(
      page,
      regular,
      `${index + 1}. ${cat.name}`,
      MARGIN,
      y,
      10,
      CONTENT_WIDTH,
    );
    y -= 4;
  });

  y -= 10;
  ensureSpace(60);
  page.drawText("Datos bancarios (equipos no IEEE)", {
    x: MARGIN,
    y,
    size: 12,
    font: bold,
    color: rgb(0, 0.4, 0.8),
  });
  y -= 18;

  const bankLines = [
    `Valor: ${BANK_DETAILS.amount}`,
    `Banco: ${BANK_DETAILS.bank} · ${BANK_DETAILS.accountType}`,
    `Cuenta: ${BANK_DETAILS.accountNumber}`,
    `Titular: ${BANK_DETAILS.holder}`,
  ];

  for (const line of bankLines) {
    ensureSpace(LINE_HEIGHT);
    page.drawText(line, { x: MARGIN, y, size: 10, font: regular });
    y -= LINE_HEIGHT;
  }

  y -= 16;
  ensureSpace(LINE_HEIGHT);
  page.drawText(
    "Documento generado desde el portal oficial del concurso. Consulta la web para actualizaciones.",
    { x: MARGIN, y, size: 8, font: regular, color: rgb(0.45, 0.5, 0.55) },
  );

  return pdfDoc.save();
}
