import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { searchResearch, calculateRelevanceScore, ResearchPaper } from "./research-api";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const SearchQuerySchema = z.object({
  query: z.string().min(1).max(500),
  sources: z.array(z.enum(["GoogleScholar", "arXiv", "Web"])).min(1),
  limit: z.number().int().min(1).max(50).default(10),
  filters: z
    .object({
      yearFrom: z.number().optional(),
      yearTo: z.number().optional(),
      domain: z.string().optional(),
      type: z.string().optional(),
    })
    .optional(),
});

const SavePaperSchema = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  abstract: z.string().optional(),
  source: z.enum(["IEEE", "Springer", "GoogleScholar", "Web", "arXiv"]),
  sourceId: z.string(),
  url: z.string().url(),
  doi: z.string().optional(),
  publicationDate: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  citations: z.number().optional(),
});

const CreateCollectionSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

const AnalysisRequestSchema = z.object({
  query: z.string().min(1).max(500),
  paperIds: z.array(z.number()),
  model: z.string().default("claude-sonnet-4-6"),
});

// ============================================================================
// RESEARCH ROUTES
// ============================================================================

export const appRouter = router({
  // Health check
  health: publicProcedure.query(() => ({ status: "ok" })),

  // ========================================================================
  // SEARCH & DISCOVERY
  // ========================================================================

  research: router({
    search: protectedProcedure
      .input(SearchQuerySchema)
      .mutation(async ({ ctx, input }) => {
        try {
          // Search across sources
          const papers = await searchResearch({
            query: input.query,
            sources: input.sources,
            limit: input.limit,
            filters: input.filters,
          });

          // Calculate relevance scores
          const scoredPapers = papers.map((paper) => ({
            ...paper,
            relevanceScore: calculateRelevanceScore(paper, input.query),
          }));

          // Save search history
          await db.saveSearchHistory(
            ctx.user.id,
            input.query,
            input.sources,
            scoredPapers.length,
            input.filters
          );

          return {
            results: scoredPapers,
            count: scoredPapers.length,
            query: input.query,
          };
        } catch (error) {
          console.error("[Research] Search failed:", error);
          throw new Error("Search failed");
        }
      }),

    // Get search history
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserSearchHistory(ctx.user.id);
    }),
  }),

  // ========================================================================
  // PAPERS & COLLECTIONS
  // ========================================================================

  papers: router({
    // Save a paper
    save: protectedProcedure
      .input(SavePaperSchema)
      .mutation(async ({ ctx, input }) => {
        const paperId = await db.savePaper({
          userId: ctx.user.id,
          title: input.title,
          authors: JSON.stringify(input.authors),
          abstract: input.abstract,
          source: input.source,
          sourceId: input.sourceId,
          url: input.url,
          doi: input.doi,
          publicationDate: input.publicationDate ? new Date(input.publicationDate) : undefined,
          keywords: input.keywords ? JSON.stringify(input.keywords) : undefined,
          citations: input.citations,
          relevanceScore: JSON.stringify({ initial: 0 }),
          metadata: {},
        });

        return { id: paperId, ...input };
      }),

    // Get user's saved papers
    list: protectedProcedure.query(async ({ ctx }) => {
      const papers = await db.getUserPapers(ctx.user.id);
      return papers.map((p) => ({
        ...p,
        authors: p.authors ? JSON.parse(p.authors) : [],
        keywords: p.keywords ? JSON.parse(p.keywords) : [],
      }));
    }),

    // Get single paper
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const paper = await db.getPaperById(input.id);
        if (!paper) throw new Error("Paper not found");

        return {
          ...paper,
          authors: paper.authors ? JSON.parse(paper.authors) : [],
          keywords: paper.keywords ? JSON.parse(paper.keywords) : [],
        };
      }),

    // Delete paper
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePaper(input.id);
        return { success: true };
      }),
  }),

  // ========================================================================
  // COLLECTIONS
  // ========================================================================

  collections: router({
    // Create collection
    create: protectedProcedure
      .input(CreateCollectionSchema)
      .mutation(async ({ ctx, input }) => {
        const collectionId = await db.createCollection({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          color: input.color,
          isDefault: false,
        });

        return { id: collectionId, ...input };
      }),

    // Get user's collections
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserCollections(ctx.user.id);
    }),

    // Get collection with papers
    getWithPapers: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const collection = await db.getCollectionById(input.id);
        if (!collection) throw new Error("Collection not found");

        const papers = await db.getCollectionPapers(input.id);
        return {
          ...collection,
          papers: papers.map((p) => ({
            ...p,
            authors: p.authors ? JSON.parse(p.authors) : [],
            keywords: p.keywords ? JSON.parse(p.keywords) : [],
          })),
        };
      }),

    // Update collection
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          color: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.updateCollection(input.id, {
          name: input.name,
          description: input.description,
          color: input.color,
        });
        return { success: true };
      }),

    // Delete collection
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCollection(input.id);
        return { success: true };
      }),

    // Add paper to collection
    addPaper: protectedProcedure
      .input(z.object({ paperId: z.number(), collectionId: z.number() }))
      .mutation(async ({ input }) => {
        await db.addPaperToCollection(input.paperId, input.collectionId);
        return { success: true };
      }),

    // Remove paper from collection
    removePaper: protectedProcedure
      .input(z.object({ paperId: z.number(), collectionId: z.number() }))
      .mutation(async ({ input }) => {
        await db.removePaperFromCollection(input.paperId, input.collectionId);
        return { success: true };
      }),
  }),

  // ========================================================================
  // AI ANALYSIS
  // ========================================================================

  analysis: router({
    // Generate multi-perspective analysis
    generate: protectedProcedure
      .input(AnalysisRequestSchema)
      .mutation(async ({ ctx, input }) => {
        try {
          // Fetch papers for analysis
          const papers = await Promise.all(
            input.paperIds.map((id) => db.getPaperById(id))
          );

          const validPapers = papers.filter((p) => p !== undefined);

          if (validPapers.length === 0) {
            throw new Error("No valid papers found for analysis");
          }

          // Prepare paper summaries for LLM
          const paperSummaries = validPapers
            .map(
              (p) =>
                `Title: ${p?.title}\nAbstract: ${p?.abstract}\nSource: ${p?.source}`
            )
            .join("\n\n---\n\n");

          // Call LLM for multi-perspective analysis
          const response = await invokeLLM({
            model: input.model,
            messages: [
              {
                role: "system" as const,
                content: `You are an expert research analyst. Analyze the following papers and provide:
1. A concise summary of key findings
2. Main themes and concepts
3. Contrasting or conflicting viewpoints
4. Research gaps and limitations
5. Recommendations for future research

Format your response as JSON with keys: summary, keyThemes, contrastingViews, researchGaps, recommendations`,
              },
              {
                role: "user" as const,
                content: `Analyze these papers on "${input.query}":\n\n${paperSummaries}`,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "research_analysis",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    summary: { type: "string" },
                    keyThemes: { type: "array", items: { type: "string" } },
                    contrastingViews: { type: "array", items: { type: "string" } },
                    researchGaps: { type: "array", items: { type: "string" } },
                    recommendations: { type: "array", items: { type: "string" } },
                  },
                  required: [
                    "summary",
                    "keyThemes",
                    "contrastingViews",
                    "researchGaps",
                    "recommendations",
                  ],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = response.choices[0].message.content;
          const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
          const analysisData = JSON.parse(contentStr);

          // Save analysis to database
          const analysisId = await db.saveAnalysis({
            userId: ctx.user.id,
            query: input.query,
            summary: analysisData.summary,
            keyThemes: JSON.stringify(analysisData.keyThemes),
            contrastingViews: JSON.stringify(analysisData.contrastingViews),
            researchGaps: JSON.stringify(analysisData.researchGaps),
            recommendations: JSON.stringify(analysisData.recommendations),
            sourceAttribution: {},
            papersAnalyzed: JSON.stringify(input.paperIds),
            model: input.model,
          });

          return {
            id: analysisId,
            ...analysisData,
            papersAnalyzed: input.paperIds,
          };
        } catch (error) {
          console.error("[Analysis] Generation failed:", error);
          throw new Error("Analysis generation failed");
        }
      }),

    // Get user's analyses
    list: protectedProcedure.query(async ({ ctx }) => {
      const analyses = await db.getUserAnalyses(ctx.user.id);
      return analyses.map((a) => ({
        ...a,
        keyThemes: a.keyThemes ? JSON.parse(a.keyThemes) : [],
        contrastingViews: a.contrastingViews ? JSON.parse(a.contrastingViews) : [],
        researchGaps: a.researchGaps ? JSON.parse(a.researchGaps) : [],
        recommendations: a.recommendations ? JSON.parse(a.recommendations) : [],
        papersAnalyzed: a.papersAnalyzed ? JSON.parse(a.papersAnalyzed) : [],
      }));
    }),

    // Get single analysis
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const analysis = await db.getAnalysisById(input.id);
        if (!analysis) throw new Error("Analysis not found");

        return {
          ...analysis,
          keyThemes: analysis.keyThemes ? JSON.parse(analysis.keyThemes) : [],
          contrastingViews: analysis.contrastingViews
            ? JSON.parse(analysis.contrastingViews)
            : [],
          researchGaps: analysis.researchGaps ? JSON.parse(analysis.researchGaps) : [],
          recommendations: analysis.recommendations
            ? JSON.parse(analysis.recommendations)
            : [],
          papersAnalyzed: analysis.papersAnalyzed
            ? JSON.parse(analysis.papersAnalyzed)
            : [],
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
