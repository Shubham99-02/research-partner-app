/**
 * tRPC Router for PDF Export
 * Handles PDF generation for papers, collections, analyses, and search results
 */

import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  generatePDF,
  generatePaperPDF,
  generateCollectionPDF,
  generateAnalysisPDF,
  generateSearchResultsPDF,
} from "./pdf-generator";

export const pdfRouter = router({
  // Export single paper as PDF
  exportPaper: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        authors: z.array(z.string()),
        abstract: z.string(),
        url: z.string(),
        doi: z.string().optional(),
        publicationDate: z.date().optional(),
        source: z.string(),
        keywords: z.array(z.string()).optional(),
        citations: z.number().optional(),
        relevanceScore: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const buffer = await generatePaperPDF(input);
        return {
          success: true,
          buffer: buffer.toString("base64"),
          filename: `${input.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`,
          mimeType: "application/pdf",
        };
      } catch (error) {
        console.error("[PDF] Paper export failed:", error);
        return {
          success: false,
          error: "Failed to generate PDF",
        };
      }
    }),

  // Export collection as PDF
  exportCollection: publicProcedure
    .input(
      z.object({
        name: z.string(),
        papers: z.array(
          z.object({
            id: z.number(),
            title: z.string(),
            authors: z.array(z.string()),
            abstract: z.string(),
            url: z.string(),
            doi: z.string().optional(),
            publicationDate: z.date().optional(),
            source: z.string(),
            keywords: z.array(z.string()).optional(),
            citations: z.number().optional(),
            relevanceScore: z.number().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const buffer = await generateCollectionPDF(input.name, input.papers);
        return {
          success: true,
          buffer: buffer.toString("base64"),
          filename: `${input.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-collection.pdf`,
          mimeType: "application/pdf",
        };
      } catch (error) {
        console.error("[PDF] Collection export failed:", error);
        return {
          success: false,
          error: "Failed to generate PDF",
        };
      }
    }),

  // Export analysis as PDF
  exportAnalysis: publicProcedure
    .input(
      z.object({
        query: z.string(),
        summary: z.string(),
        recommendations: z.array(z.string()),
        suggestedSearches: z.array(z.string()),
        keyInsights: z.array(z.string()),
        timestamp: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const buffer = await generateAnalysisPDF(input);
        return {
          success: true,
          buffer: buffer.toString("base64"),
          filename: `jarvis-analysis-${new Date().toISOString().split("T")[0]}.pdf`,
          mimeType: "application/pdf",
        };
      } catch (error) {
        console.error("[PDF] Analysis export failed:", error);
        return {
          success: false,
          error: "Failed to generate PDF",
        };
      }
    }),

  // Export search results as PDF
  exportSearchResults: publicProcedure
    .input(
      z.object({
        query: z.string(),
        papers: z.array(
          z.object({
            id: z.number(),
            title: z.string(),
            authors: z.array(z.string()),
            abstract: z.string(),
            url: z.string(),
            doi: z.string().optional(),
            publicationDate: z.date().optional(),
            source: z.string(),
            keywords: z.array(z.string()).optional(),
            citations: z.number().optional(),
            relevanceScore: z.number().optional(),
          })
        ),
        filters: z
          .object({
            source: z.array(z.string()).optional(),
            dateRange: z
              .object({
                from: z.date(),
                to: z.date(),
              })
              .optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const buffer = await generateSearchResultsPDF(input.query, input.papers, input.filters);
        return {
          success: true,
          buffer: buffer.toString("base64"),
          filename: `search-results-${input.query.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`,
          mimeType: "application/pdf",
        };
      } catch (error) {
        console.error("[PDF] Search results export failed:", error);
        return {
          success: false,
          error: "Failed to generate PDF",
        };
      }
    }),

  // Batch export multiple formats
  batchExport: publicProcedure
    .input(
      z.object({
        type: z.enum(["paper", "collection", "analysis", "search-results"]),
        data: z.any(),
        filename: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await generatePDF({
          type: input.type,
          data: input.data,
          filename: input.filename,
        });

        return {
          success: true,
          buffer: result.buffer.toString("base64"),
          filename: result.filename,
          mimeType: result.mimeType,
        };
      } catch (error) {
        console.error("[PDF] Batch export failed:", error);
        return {
          success: false,
          error: "Failed to generate PDF",
        };
      }
    }),
});
