/**
 * Research API Integration Service
 * Handles fetching papers from multiple academic sources
 */

import axios from "axios";

export interface ResearchPaper {
  title: string;
  authors: string[];
  abstract: string;
  source: "IEEE" | "Springer" | "GoogleScholar" | "Web" | "arXiv";
  sourceId: string;
  url: string;
  doi?: string;
  publicationDate?: Date;
  keywords?: string[];
  citations?: number;
  relevanceScore?: number;
}

export interface SearchOptions {
  query: string;
  sources: string[];
  limit?: number;
  offset?: number;
  filters?: {
    yearFrom?: number;
    yearTo?: number;
    domain?: string;
    type?: string;
  };
}

// ============================================================================
// GOOGLE SCHOLAR (via Perplexity API - public research)
// ============================================================================

export async function searchGoogleScholar(
  query: string,
  limit: number = 10
): Promise<ResearchPaper[]> {
  try {
    // Using Perplexity API for academic search
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar",
        messages: [
          {
            role: "user",
            content: `Search for academic papers on "${query}". Return results as JSON array with fields: title, authors (array), abstract, url, publicationDate, keywords (array). Limit to ${limit} results.`,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY || ""}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse response and format papers
    const content = response.data.choices[0].message.content;
    const papers = JSON.parse(content);

    return papers.map((paper: any) => ({
      ...paper,
      source: "GoogleScholar",
      sourceId: paper.url || `gs_${Date.now()}`,
      publicationDate: paper.publicationDate ? new Date(paper.publicationDate) : undefined,
    }));
  } catch (error) {
    console.error("[Research API] Google Scholar search failed:", error);
    return [];
  }
}

// ============================================================================
// ARXIV (Open Access)
// ============================================================================

export async function searchArxiv(query: string, limit: number = 10): Promise<ResearchPaper[]> {
  try {
    const response = await axios.get("http://export.arxiv.org/api/query", {
      params: {
        search_query: `all:${query}`,
        start: 0,
        max_results: limit,
        sortBy: "relevance",
        sortOrder: "descending",
      },
    });

    // Parse XML response
    const papers: ResearchPaper[] = [];
    const entries = response.data.match(/<entry>[\s\S]*?<\/entry>/g) || [];

    entries.forEach((entry: string) => {
      const titleMatch = entry.match(/<title>(.*?)<\/title>/);
      const summaryMatch = entry.match(/<summary>(.*?)<\/summary>/);
      const idMatch = entry.match(/<id>(.*?)<\/id>/);
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
      const authorsMatch = entry.match(/<author>[\s\S]*?<name>(.*?)<\/name>/g) || [];

      if (titleMatch && idMatch) {
        const arxivId = idMatch[1].split("/abs/")[1];
        papers.push({
          title: titleMatch[1].trim(),
          authors: authorsMatch.map((a: string) => a.match(/<name>(.*?)<\/name>/)?.[1] || ""),
          abstract: summaryMatch ? summaryMatch[1].trim() : "",
          source: "arXiv",
          sourceId: arxivId,
          url: `https://arxiv.org/abs/${arxivId}`,
          publicationDate: publishedMatch ? new Date(publishedMatch[1]) : undefined,
        });
      }
    });

    return papers;
  } catch (error) {
    console.error("[Research API] arXiv search failed:", error);
    return [];
  }
}

// ============================================================================
// GENERAL WEB SEARCH (via Perplexity)
// ============================================================================

export async function searchWeb(query: string, limit: number = 10): Promise<ResearchPaper[]> {
  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar",
        messages: [
          {
            role: "user",
            content: `Find research articles and papers about "${query}". Return as JSON array with: title, authors (array), abstract, url, publicationDate, keywords (array). Limit to ${limit} results.`,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY || ""}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const papers = JSON.parse(content);

    return papers.map((paper: any) => ({
      ...paper,
      source: "Web",
      sourceId: paper.url || `web_${Date.now()}`,
      publicationDate: paper.publicationDate ? new Date(paper.publicationDate) : undefined,
    }));
  } catch (error) {
    console.error("[Research API] Web search failed:", error);
    return [];
  }
}

// ============================================================================
// AGGREGATED SEARCH
// ============================================================================

export async function searchResearch(options: SearchOptions): Promise<ResearchPaper[]> {
  const { query, sources, limit = 10 } = options;

  const allPapers: ResearchPaper[] = [];

  // Search each enabled source
  if (sources.includes("GoogleScholar")) {
    const papers = await searchGoogleScholar(query, limit);
    allPapers.push(...papers);
  }

  if (sources.includes("arXiv")) {
    const papers = await searchArxiv(query, limit);
    allPapers.push(...papers);
  }

  if (sources.includes("Web")) {
    const papers = await searchWeb(query, limit);
    allPapers.push(...papers);
  }

  // Remove duplicates based on title similarity
  const uniquePapers = deduplicatePapers(allPapers);

  // Sort by relevance and limit
  return uniquePapers.slice(0, limit);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function deduplicatePapers(papers: ResearchPaper[]): ResearchPaper[] {
  const seen = new Set<string>();
  const unique: ResearchPaper[] = [];

  papers.forEach((paper) => {
    const normalized = paper.title.toLowerCase().trim();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      unique.push(paper);
    }
  });

  return unique;
}

export function calculateRelevanceScore(
  paper: ResearchPaper,
  query: string
): number {
  const queryTerms = query.toLowerCase().split(" ");
  const titleLower = paper.title.toLowerCase();
  const abstractLower = (paper.abstract || "").toLowerCase();

  let score = 0;

  // Title matches (higher weight)
  queryTerms.forEach((term) => {
    if (titleLower.includes(term)) score += 3;
    if (abstractLower.includes(term)) score += 1;
  });

  // Normalize score
  return Math.min(100, (score / (queryTerms.length * 3)) * 100);
}
