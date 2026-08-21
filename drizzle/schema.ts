import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const attorneys = mysqlTable("attorneys", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  lawyerName: varchar("lawyerName", { length: 160 }).notNull(),
  firmName: varchar("firmName", { length: 200 }).notNull(),
  bio: text("bio").notNull(),
  practiceAreas: text("practiceAreas").notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  neighborhood: varchar("neighborhood", { length: 100 }),
  address: varchar("address", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  website: varchar("website", { length: 255 }),
  officeHours: varchar("officeHours", { length: 255 }),
  barAdmissions: text("barAdmissions"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  photoUrl: text("photoUrl"),
  claimedByUserId: int("claimedByUserId"),
  status: mysqlEnum("status", ["pending", "published", "hidden"]).default("published").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  attorneyId: int("attorneyId").notNull(),
  reviewerName: varchar("reviewerName", { length: 120 }).notNull(),
  rating: int("rating").notNull(),
  body: text("body").notNull(),
  status: mysqlEnum("status", ["pending", "published", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  attorneyId: int("attorneyId").notNull(),
  name: varchar("name", { length: 140 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  caseType: varchar("caseType", { length: 100 }).notNull(),
  message: text("message").notNull(),
  response: text("response"),
  status: mysqlEnum("status", ["new", "responded", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const claims = mysqlTable("claims", {
  id: int("id").autoincrement().primaryKey(),
  attorneyId: int("attorneyId").notNull(),
  userId: int("userId").notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Attorney = typeof attorneys.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Claim = typeof claims.$inferSelect;
