import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, attorneys, claims, leads, reviews, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) { values.role = user.role ?? "admin"; updateSet.role = values.role; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0];
}

export async function listAttorneys(filters?: { search?: string; city?: string; practiceArea?: string }) {
  const db = await getDb(); if (!db) return [];
  const conditions = [eq(attorneys.status, "published" as const)];
  if (filters?.city && filters.city !== "All locations") conditions.push(eq(attorneys.city, filters.city));
  if (filters?.practiceArea && filters.practiceArea !== "All practice areas") conditions.push(like(attorneys.practiceAreas, `%${filters.practiceArea}%`));
  if (filters?.search) conditions.push(or(like(attorneys.lawyerName, `%${filters.search}%`), like(attorneys.firmName, `%${filters.search}%`), like(attorneys.practiceAreas, `%${filters.search}%`))!);
  return db.select().from(attorneys).where(and(...conditions)).orderBy(desc(attorneys.updatedAt));
}

export async function getAttorneyBySlug(slug: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(attorneys).where(eq(attorneys.slug, slug)).limit(1); return result[0];
}

export async function getReviews(attorneyId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(reviews).where(and(eq(reviews.attorneyId, attorneyId), eq(reviews.status, "published" as const))).orderBy(desc(reviews.createdAt));
}

export async function getReviewAggregate(attorneyId: number) {
  const rows = await getReviews(attorneyId);
  if (!rows.length) return { score: null, count: 0 };
  const score = Math.round((rows.reduce((sum, review) => sum + review.rating, 0) / rows.length) * 10) / 10;
  return { score, count: rows.length };
}

export async function createLead(input: typeof leads.$inferInsert) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.insert(leads).values(input); return result[0]?.insertId;
}

export async function createReview(input: typeof reviews.$inferInsert) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.insert(reviews).values({ ...input, status: "pending" }); return result[0]?.insertId;
}

export async function createClaim(input: typeof claims.$inferInsert) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.insert(claims).values({ ...input, status: "pending" }); return result[0]?.insertId;
}

export async function getOwnerLeads(userId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({ lead: leads, attorney: attorneys }).from(leads).innerJoin(attorneys, eq(leads.attorneyId, attorneys.id)).where(eq(attorneys.claimedByUserId, userId)).orderBy(desc(leads.createdAt));
}

export async function updateLeadResponse(leadId: number, userId: number, response: string) {
  const db = await getDb(); if (!db) return false;
  const owned = await db.select({ lead: leads }).from(leads).innerJoin(attorneys, eq(leads.attorneyId, attorneys.id)).where(and(eq(leads.id, leadId), eq(attorneys.claimedByUserId, userId))).limit(1);
  if (!owned.length) return false;
  await db.update(leads).set({ response, status: "responded" }).where(eq(leads.id, leadId));
  return true;
}

export async function updateAttorneyProfile(attorneyId: number, userId: number, changes: { phone?: string; website?: string; officeHours?: string; photoUrl?: string }) {
  const db = await getDb(); if (!db) return false;
  await db.update(attorneys).set(changes).where(and(eq(attorneys.id, attorneyId), eq(attorneys.claimedByUserId, userId)));
  return true;
}
