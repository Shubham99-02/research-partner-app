/**
 * PDF Generator Service - Convert research data to PDF format
 * Generates PDFs for papers, collections, analyses, and search results
 */

import { PDFDocument, rgb } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

export interface PaperForPDF {
  id: number;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  doi?: string;
  publicationDate?: Date;
  source: string;
  keywords?: string[];
  citations?: number;
  relevanceScore?: number;
}

export interface AnalysisForPDF {
  query: string;
  summary: string;
  recommendations: string[];
  suggestedSearches: string[];
  keyInsights: string[];
  timestamp: Date;
}

// ============================================================================
// SINGLE PAPER PDF
// ============================================================================

export async function generatePaperPDF(paper: PaperForPDF): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]); // Letter size
  let yPosition = 750;
  const margin = 40;
  const pageWidth = 612 - margin * 2;

  // Helper functions
  const drawText = (text: string, size: number, bold: boolean = false, color = rgb(0, 0, 0)) => {
    if (yPosition < 50) {
      page = pdfDoc.addPage([612, 792]);
      yPosition = 750;
    }
    page.drawText(text, {
      x: margin,
      y: yPosition,
      size,
      color,
      font: bold ? undefined : undefined,
      maxWidth: pageWidth,
    });
    yPosition -= size + 8;
  };

  const drawSeparator = () => {
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: 612 - margin, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    yPosition -= 15;
  };

  // Title
  drawText(paper.title, 16, true, rgb(0, 0.3, 0.6));
  yPosition -= 10;

  // Authors
  drawText(`Authors: ${paper.authors.join(", ")}`, 10);

  // Meta information
  const metaInfo = [
    `Source: ${paper.source}`,
    paper.doi ? `DOI: ${paper.doi}` : null,
    paper.publicationDate ? `Published: ${new Date(paper.publicationDate).toLocaleDateString()}` : null,
    paper.citations ? `Citations: ${paper.citations}` : null,
    paper.relevanceScore ? `Relevance: ${paper.relevanceScore}%` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  drawText(metaInfo, 9, false, rgb(0.5, 0.5, 0.5));
  yPosition -= 5;

  drawSeparator();

  // Abstract
  if (paper.abstract) {
    drawText("Abstract", 12, true);
    drawText(paper.abstract, 10, false, rgb(0.2, 0.2, 0.2));
    yPosition -= 10;
  }

  // Keywords
  if (paper.keywords && paper.keywords.length > 0) {
    drawSeparator();
    drawText("Keywords", 12, true);
    drawText(paper.keywords.join(", "), 10);
    yPosition -= 10;
  }

  // URL
  if (paper.url) {
    drawSeparator();
    drawText("URL", 12, true);
    drawText(paper.url, 9, false, rgb(0, 0, 1));
  }

  return Buffer.from(await pdfDoc.save());
}

// ============================================================================
// COLLECTION PDF
// ============================================================================

export async function generateCollectionPDF(
  collectionName: string,
  papers: PaperForPDF[]
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]);
  let yPosition = 750;
  const margin = 40;
  const pageWidth = 612 - margin * 2;

  const drawText = (text: string, size: number, bold: boolean = false, color = rgb(0, 0, 0)) => {
    if (yPosition < 50) {
      page = pdfDoc.addPage([612, 792]);
      yPosition = 750;
    }
    page.drawText(text, {
      x: margin,
      y: yPosition,
      size,
      color,
      maxWidth: pageWidth,
    });
    yPosition -= size + 6;
  };

  // Header
  drawText(collectionName, 18, true, rgb(0, 0.3, 0.6));
  drawText(`Generated: ${new Date().toLocaleDateString()}`, 9, false, rgb(0.5, 0.5, 0.5));
  drawText(`Total Papers: ${papers.length}`, 9, false, rgb(0.5, 0.5, 0.5));
  yPosition -= 15;

  // Papers
  papers.forEach((paper, index) => {
    if (yPosition < 100) {
      page = pdfDoc.addPage([612, 792]);
      yPosition = 750;
    }

    // Paper number and title
    drawText(`${index + 1}. ${paper.title}`, 11, true);
    drawText(`${paper.authors.join(", ")}`, 9, false, rgb(0.3, 0.3, 0.3));
    drawText(`${paper.source} | ${paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : "N/A"}`, 8, false, rgb(0.6, 0.6, 0.6));

    if (paper.abstract) {
      const abstractPreview = paper.abstract.substring(0, 150) + "...";
      drawText(abstractPreview, 8, false, rgb(0.4, 0.4, 0.4));
    }

    yPosition -= 8;
  });

  return Buffer.from(await pdfDoc.save());
}

// ============================================================================
// ANALYSIS PDF
// ============================================================================

export async function generateAnalysisPDF(analysis: AnalysisForPDF): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]);
  let yPosition = 750;
  const margin = 40;
  const pageWidth = 612 - margin * 2;

  const drawText = (text: string, size: number, bold: boolean = false, color = rgb(0, 0, 0)) => {
    if (yPosition < 50) {
      page = pdfDoc.addPage([612, 792]);
      yPosition = 750;
    }
    page.drawText(text, {
      x: margin,
      y: yPosition,
      size,
      color,
      maxWidth: pageWidth,
    });
    yPosition -= size + 6;
  };

  // Header
  drawText("🤖 JARVIS Research Analysis", 16, true, rgb(0, 0.3, 0.6));
  drawText(`Query: ${analysis.query}`, 11, true);
  drawText(`Generated: ${analysis.timestamp.toLocaleString()}`, 9, false, rgb(0.5, 0.5, 0.5));
  yPosition -= 15;

  // Summary
  drawText("Executive Summary", 12, true);
  drawText(analysis.summary, 10, false, rgb(0.2, 0.2, 0.2));
  yPosition -= 10;

  // Key Insights
  if (analysis.keyInsights.length > 0) {
    drawText("Key Insights", 12, true);
    analysis.keyInsights.forEach((insight) => {
      drawText(`• ${insight}`, 9);
    });
    yPosition -= 10;
  }

  // Recommendations
  if (analysis.recommendations.length > 0) {
    drawText("Recommendations", 12, true);
    analysis.recommendations.forEach((rec) => {
      drawText(`• ${rec}`, 9);
    });
    yPosition -= 10;
  }

  // Suggested Searches
  if (analysis.suggestedSearches.length > 0) {
    drawText("Suggested Further Research", 12, true);
    analysis.suggestedSearches.forEach((search) => {
      drawText(`• ${search}`, 9);
    });
  }

  return Buffer.from(await pdfDoc.save());
}

// ============================================================================
// SEARCH RESULTS PDF
// ============================================================================

export async function generateSearchResultsPDF(
  query: string,
  papers: PaperForPDF[],
  filters?: {
    source?: string[];
    dateRange?: { from: Date; to: Date };
  }
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]);
  let yPosition = 750;
  const margin = 40;
  const pageWidth = 612 - margin * 2;

  const drawText = (text: string, size: number, bold: boolean = false, color = rgb(0, 0, 0)) => {
    if (yPosition < 50) {
      page = pdfDoc.addPage([612, 792]);
      yPosition = 750;
    }
    page.drawText(text, {
      x: margin,
      y: yPosition,
      size,
      color,
      maxWidth: pageWidth,
    });
    yPosition -= size + 6;
  };

  // Header
  drawText("Research Search Results", 18, true, rgb(0, 0.3, 0.6));
  drawText(`Query: "${query}"`, 11, true);
  drawText(`Results: ${papers.length} papers found`, 10, false, rgb(0.5, 0.5, 0.5));
  drawText(`Generated: ${new Date().toLocaleDateString()}`, 9, false, rgb(0.5, 0.5, 0.5));

  if (filters?.source) {
    drawText(`Sources: ${filters.source.join(", ")}`, 9, false, rgb(0.5, 0.5, 0.5));
  }

  yPosition -= 15;

  // Results
  papers.forEach((paper, index) => {
    if (yPosition < 80) {
      page = pdfDoc.addPage([612, 792]);
      yPosition = 750;
    }

    // Result number and title
    drawText(`${index + 1}. ${paper.title}`, 10, true);
    drawText(`${paper.authors.slice(0, 3).join(", ")}${paper.authors.length > 3 ? " et al." : ""}`, 8, false, rgb(0.3, 0.3, 0.3));

    const metaInfo = [
      paper.source,
      paper.publicationDate ? new Date(paper.publicationDate).getFullYear().toString() : "N/A",
      paper.relevanceScore ? `${paper.relevanceScore}% match` : null,
      paper.doi ? `DOI: ${paper.doi}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    drawText(metaInfo, 8, false, rgb(0.6, 0.6, 0.6));

    if (paper.abstract) {
      const abstractPreview = paper.abstract.substring(0, 120) + "...";
      drawText(abstractPreview, 8, false, rgb(0.4, 0.4, 0.4));
    }

    yPosition -= 6;
  });

  return Buffer.from(await pdfDoc.save());
}

// ============================================================================
// BATCH PDF EXPORT
// ============================================================================

export interface PDFExportOptions {
  type: "paper" | "collection" | "analysis" | "search-results";
  data: any;
  filename?: string;
}

export async function generatePDF(options: PDFExportOptions): Promise<{
  buffer: Buffer;
  filename: string;
  mimeType: string;
}> {
  let buffer: Buffer;
  let filename: string;

  switch (options.type) {
    case "paper":
      buffer = await generatePaperPDF(options.data);
      filename = options.filename || `paper-${options.data.id}.pdf`;
      break;

    case "collection":
      buffer = await generateCollectionPDF(options.data.name, options.data.papers);
      filename = options.filename || `collection-${options.data.name.replace(/\s+/g, "-")}.pdf`;
      break;

    case "analysis":
      buffer = await generateAnalysisPDF(options.data);
      filename = options.filename || `analysis-${new Date().toISOString().split("T")[0]}.pdf`;
      break;

    case "search-results":
      buffer = await generateSearchResultsPDF(
        options.data.query,
        options.data.papers,
        options.data.filters
      );
      filename = options.filename || `search-results-${options.data.query.replace(/\s+/g, "-")}.pdf`;
      break;

    default:
      throw new Error(`Unsupported PDF type: ${options.type}`);
  }

  return {
    buffer,
    filename,
    mimeType: "application/pdf",
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const lines: string[] = [];
  const words = text.split(" ");
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    // Rough estimation: ~2 characters per 10 pixels at 10pt
    if (testLine.length * (fontSize / 10) > maxWidth / 6) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function savePDFToFile(buffer: Buffer, filepath: string): Promise<void> {
  await writeFile(filepath, buffer);
}

export async function getPDFFromFile(filepath: string): Promise<Buffer> {
  return readFile(filepath);
}
