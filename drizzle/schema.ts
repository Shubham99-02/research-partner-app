import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Research papers table
export const papers = mysqlTable("papers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: text("title").notNull(),
  authors: text("authors"), // JSON array of author names
  abstract: text("abstract"),
  source: varchar("source", { length: 50 }).notNull(), // IEEE, Springer, GoogleScholar, Web, arXiv
  sourceId: varchar("sourceId", { length: 255 }).notNull(), // External paper ID
  publicationDate: timestamp("publicationDate"),
  url: varchar("url", { length: 2048 }),
  doi: varchar("doi", { length: 255 }),
  keywords: text("keywords"), // JSON array
  citations: int("citations").default(0),
  relevanceScore: text("relevanceScore"), // JSON object with scores
  fullText: text("fullText"),
  metadata: json("metadata"), // Additional source-specific metadata
  savedAt: timestamp("savedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Collections for organizing saved papers
export const collections = mysqlTable("collections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }), // Hex color
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Junction table for papers in collections
export const paperCollections = mysqlTable("paperCollections", {
  id: int("id").autoincrement().primaryKey(),
  paperId: int("paperId").notNull(),
  collectionId: int("collectionId").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

// Search history
export const searchHistory = mysqlTable("searchHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  query: text("query").notNull(),
  sources: text("sources"), // JSON array of selected sources
  filters: json("filters"), // JSON object with applied filters
  resultCount: int("resultCount"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Analysis results
export const analyses = mysqlTable("analyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  query: text("query").notNull(),
  summary: text("summary"),
  keyThemes: text("keyThemes"), // JSON array
  contrastingViews: text("contrastingViews"), // JSON array
  researchGaps: text("researchGaps"), // JSON array
  recommendations: text("recommendations"), // JSON array
  sourceAttribution: json("sourceAttribution"), // JSON mapping insights to sources
  papersAnalyzed: text("papersAnalyzed"), // JSON array of paper IDs
  model: varchar("model", { length: 100 }), // Which LLM model was used
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Paper = typeof papers.$inferSelect;
export type InsertPaper = typeof papers.$inferInsert;
export type Collection = typeof collections.$inferSelect;
export type InsertCollection = typeof collections.$inferInsert;
export type SearchHistoryEntry = typeof searchHistory.$inferSelect;
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = typeof analyses.$inferInsert;
