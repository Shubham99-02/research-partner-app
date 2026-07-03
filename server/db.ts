import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { ENV } from "./_core/env";
import {
  papers,
  collections,
  paperCollections,
  searchHistory,
  analyses,
  users,
  InsertPaper,
  InsertCollection,
  InsertAnalysis,
  Paper,
  Collection,
  SearchHistoryEntry,
  Analysis,
  User,
} from "../drizzle/schema";

let dbInstance: any = null;

async function getDb() {
  if (dbInstance) return dbInstance;

  if (!ENV.databaseUrl) {
    console.warn("[DB] DATABASE_URL not configured, database features disabled");
    return null;
  }

  try {
    const pool = mysql.createPool(ENV.databaseUrl);
    dbInstance = drizzle(pool);
    return dbInstance;
  } catch (error) {
    console.error("[DB] Failed to connect:", error);
    return null;
  }
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.openId, openId));
  return result[0];
}

export async function upsertUser(data: {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  lastSignedIn?: Date;
}): Promise<User> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserByOpenId(data.openId);

  if (existing) {
    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.loginMethod !== undefined) updateData.loginMethod = data.loginMethod;
    if (data.lastSignedIn !== undefined) updateData.lastSignedIn = data.lastSignedIn;

    if (Object.keys(updateData).length > 0) {
      await db.update(users).set(updateData).where(eq(users.openId, data.openId));
    }

    return (await getUserByOpenId(data.openId))!;
  }

  await db.insert(users).values({
    openId: data.openId,
    name: data.name || null,
    email: data.email || null,
    loginMethod: data.loginMethod || null,
    lastSignedIn: data.lastSignedIn || new Date(),
  });

  return (await getUserByOpenId(data.openId))!;
}

// ============================================================================
// PAPERS
// ============================================================================

export async function savePaper(data: InsertPaper): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(papers).values(data);
  return result[0]?.insertId || 0;
}

export async function getUserPapers(userId: number): Promise<Paper[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(papers).where(eq(papers.userId, userId));
}

export async function getPaperById(paperId: number): Promise<Paper | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(papers).where(eq(papers.id, paperId));
  return result[0];
}

export async function deletePaper(paperId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(papers).where(eq(papers.id, paperId));
}

export async function updatePaper(
  paperId: number,
  data: Partial<InsertPaper>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(papers).set(data).where(eq(papers.id, paperId));
}

// ============================================================================
// COLLECTIONS
// ============================================================================

export async function createCollection(data: InsertCollection): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(collections).values(data);
  return result[0]?.insertId || 0;
}

export async function getUserCollections(userId: number): Promise<Collection[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(collections).where(eq(collections.userId, userId));
}

export async function getCollectionById(collectionId: number): Promise<Collection | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(collections).where(eq(collections.id, collectionId));
  return result[0];
}

export async function updateCollection(
  collectionId: number,
  data: Partial<InsertCollection>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(collections).set(data).where(eq(collections.id, collectionId));
}

export async function deleteCollection(collectionId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete all paper-collection associations
  await db
    .delete(paperCollections)
    .where(eq(paperCollections.collectionId, collectionId));

  // Delete the collection
  await db.delete(collections).where(eq(collections.id, collectionId));
}

// ============================================================================
// PAPER COLLECTIONS (ASSOCIATIONS)
// ============================================================================

export async function addPaperToCollection(
  paperId: number,
  collectionId: number
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(paperCollections).values({
    paperId,
    collectionId,
  });
}

export async function removePaperFromCollection(
  paperId: number,
  collectionId: number
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(paperCollections)
    .where(
      and(
        eq(paperCollections.paperId, paperId),
        eq(paperCollections.collectionId, collectionId)
      )
    );
}

export async function getCollectionPapers(collectionId: number): Promise<Paper[]> {
  const db = await getDb();
  if (!db) return [];

  const associations = await db
    .select()
    .from(paperCollections)
    .where(eq(paperCollections.collectionId, collectionId));

  if (associations.length === 0) return [];

  const paperIds = associations.map((a: any) => a.paperId);
  const result = await db
    .select()
    .from(papers)
    .where(eq(papers.id, paperIds[0]));

  return result;
}

// ============================================================================
// SEARCH HISTORY
// ============================================================================

export async function saveSearchHistory(
  userId: number,
  query: string,
  sources: string[],
  resultCount: number,
  filters?: Record<string, any>
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(searchHistory).values({
    userId,
    query,
    sources: JSON.stringify(sources),
    resultCount,
    filters: filters || {},
  });
  return result[0]?.insertId || 0;
}

export async function getUserSearchHistory(userId: number): Promise<SearchHistoryEntry[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(searchHistory).where(eq(searchHistory.userId, userId));
}

// ============================================================================
// ANALYSES
// ============================================================================

export async function saveAnalysis(data: InsertAnalysis): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(analyses).values(data);
  return result[0]?.insertId || 0;
}

export async function getUserAnalyses(userId: number): Promise<Analysis[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(analyses).where(eq(analyses.userId, userId));
}

export async function getAnalysisById(analysisId: number): Promise<Analysis | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(analyses).where(eq(analyses.id, analysisId));
  return result[0];
}
