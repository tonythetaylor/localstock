import {
    integer,
    pgTable,
    primaryKey,
    text,
    timestamp,
  } from "drizzle-orm/pg-core"
  import type { AdapterAccountType } from "next-auth/adapters"
  
  export const user = pgTable("user", {
    userId: text("userId")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    phone: text("phone").unique(),
    password: text("password"),
    accessToken: text("accessToken")
  
    // name: text("name"),
    // emailVerified: timestamp("emailVerified", { mode: "date" }),
    // image: text("image"),
  })
  
//   export const account = pgTable(
//     "account",
//     {
//       userId: text("userId")
//         .notNull()
//         .references(() => user.userId, { onDelete: "cascade" }),
//       type: text("type").$type<AdapterAccountType>().notNull(),
//       provider: text("provider").notNull(),
//       providerAccountId: text("providerAccountId").notNull(),
//       refresh_token: text("refresh_token"),
//       access_token: text("access_token"),
//       expires_at: integer("expires_at"),
//       token_type: text("token_type"),
//       scope: text("scope"),
//       id_token: text("id_token"),
//       session_state: text("session_state"),
//     },
//     (account) => ({
//       compoundKey: primaryKey({
//         columns: [account.provider, account.providerAccountId],
//       }),
//     })
//   )
  
  export const session = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.userId, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  })
  