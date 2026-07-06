/**
 * Export Service - Convert research papers to various formats
 * Supports BibTeX, RIS, and PDF export
 */

export interface PaperForExport {
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
}

// ============================================================================
// BIBTEX EXPORT
// ============================================================================

export function exportToBibTeX(papers: PaperForExport[]): string {
  return papers
    .map((paper) => {
      const key = generateBibTeXKey(paper);
      const authors = paper.authors.join(" and ");
      const year = paper.publicationDate
        ? new Date(paper.publicationDate).getFullYear()
        : "n.d.";

      let bibtex = `@article{${key},\n`;
      bibtex += `  title={${escapeBibTeX(paper.title)}},\n`;
      bibtex += `  author={${authors}},\n`;
      bibtex += `  year={${year}},\n`;

      if (paper.abstract) {
        bibtex += `  abstract={${escapeBibTeX(paper.abstract.substring(0, 200))}...},\n`;
      }

      if (paper.doi) {
        bibtex += `  doi={${paper.doi}},\n`;
      }

      if (paper.url) {
        bibtex += `  url={${paper.url}},\n`;
      }

      bibtex += `  source={${paper.source}}\n`;
      bibtex += `}\n\n`;

      return bibtex;
    })
    .join("");
}

// ============================================================================
// RIS EXPORT (Research Information Systems)
// ============================================================================

export function exportToRIS(papers: PaperForExport[]): string {
  return papers
    .map((paper) => {
      let ris = "TY  - JOUR\n";
      ris += `TI  - ${paper.title}\n`;

      paper.authors.forEach((author) => {
        ris += `AU  - ${author}\n`;
      });

      if (paper.abstract) {
        ris += `AB  - ${paper.abstract}\n`;
      }

      if (paper.publicationDate) {
        const date = new Date(paper.publicationDate);
        ris += `PY  - ${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}\n`;
      }

      if (paper.doi) {
        ris += `DO  - ${paper.doi}\n`;
      }

      if (paper.url) {
        ris += `UR  - ${paper.url}\n`;
      }

      if (paper.keywords) {
        paper.keywords.forEach((keyword) => {
          ris += `KW  - ${keyword}\n`;
        });
      }

      ris += `DB  - ${paper.source}\n`;
      ris += "ER  - \n\n";

      return ris;
    })
    .join("");
}

// ============================================================================
// CSV EXPORT
// ============================================================================

export function exportToCSV(papers: PaperForExport[]): string {
  const headers = [
    "Title",
    "Authors",
    "Year",
    "DOI",
    "URL",
    "Source",
    "Keywords",
    "Abstract",
  ];

  const rows = papers.map((paper) => [
    `"${escapeCSV(paper.title)}"`,
    `"${paper.authors.join("; ")}"`,
    paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : "N/A",
    paper.doi || "N/A",
    paper.url || "N/A",
    paper.source,
    paper.keywords ? `"${paper.keywords.join("; ")}"` : "N/A",
    `"${escapeCSV(paper.abstract?.substring(0, 100) || "")}"`,
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

// ============================================================================
// MARKDOWN EXPORT
// ============================================================================

export function exportToMarkdown(
  papers: PaperForExport[],
  title: string = "Research Collection"
): string {
  let markdown = `# ${title}\n\n`;
  markdown += `Generated on ${new Date().toLocaleDateString()}\n\n`;
  markdown += `**Total Papers:** ${papers.length}\n\n`;
  markdown += "---\n\n";

  papers.forEach((paper, index) => {
    markdown += `## ${index + 1}. ${paper.title}\n\n`;
    markdown += `**Authors:** ${paper.authors.join(", ")}\n\n`;

    if (paper.publicationDate) {
      markdown += `**Year:** ${new Date(paper.publicationDate).getFullYear()}\n\n`;
    }

    markdown += `**Source:** ${paper.source}\n\n`;

    if (paper.doi) {
      markdown += `**DOI:** [${paper.doi}](https://doi.org/${paper.doi})\n\n`;
    }

    if (paper.url) {
      markdown += `**URL:** [Link](${paper.url})\n\n`;
    }

    if (paper.abstract) {
      markdown += `**Abstract:**\n\n${paper.abstract}\n\n`;
    }

    if (paper.keywords && paper.keywords.length > 0) {
      markdown += `**Keywords:** ${paper.keywords.join(", ")}\n\n`;
    }

    markdown += "---\n\n";
  });

  return markdown;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateBibTeXKey(paper: PaperForExport): string {
  const firstAuthor = paper.authors[0]?.split(" ").pop() || "Unknown";
  const year = paper.publicationDate
    ? new Date(paper.publicationDate).getFullYear()
    : "0000";
  const titleWord = paper.title.split(" ")[0] || "Paper";

  return `${firstAuthor}${year}${titleWord}`.replace(/[^a-zA-Z0-9]/g, "");
}

function escapeBibTeX(text: string): string {
  return text
    .replace(/[&%$#_{}~^\\]/g, (char) => `\\${char}`)
    .replace(/"/g, '\\"')
    .replace(/\n/g, " ");
}

function escapeCSV(text: string): string {
  return text.replace(/"/g, '""').replace(/\n/g, " ");
}

// ============================================================================
// BATCH EXPORT
// ============================================================================

export interface ExportOptions {
  format: "bibtex" | "ris" | "csv" | "markdown";
  papers: PaperForExport[];
  collectionName?: string;
}

export function batchExport(options: ExportOptions): {
  content: string;
  filename: string;
  mimeType: string;
} {
  const { format, papers, collectionName = "research" } = options;
  const timestamp = new Date().toISOString().split("T")[0];

  switch (format) {
    case "bibtex":
      return {
        content: exportToBibTeX(papers),
        filename: `${collectionName}-${timestamp}.bib`,
        mimeType: "text/plain",
      };
    case "ris":
      return {
        content: exportToRIS(papers),
        filename: `${collectionName}-${timestamp}.ris`,
        mimeType: "text/plain",
      };
    case "csv":
      return {
        content: exportToCSV(papers),
        filename: `${collectionName}-${timestamp}.csv`,
        mimeType: "text/csv",
      };
    case "markdown":
      return {
        content: exportToMarkdown(papers, collectionName),
        filename: `${collectionName}-${timestamp}.md`,
        mimeType: "text/markdown",
      };
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
