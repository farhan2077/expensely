import { Lucia, TimeSpan } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { webcrypto } from "node:crypto";

// Node.js 18 and below doesn't support the Web Crypto API. Polyfill it by importing webcrypto. More details https://lucia-auth.com/getting-started/nextjs-app > Polyfill section
// eslint-disable-next-line no-undef
globalThis.crypto = webcrypto as Crypto;

import { db } from "@/db";
import { sessionsTable } from "@/db/schema/sessions";
import { usersTable } from "@/db/schema/users";

const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(15, "d"), // 15 days
  sessionCookie: {
    // name: "lucia_session",
    // expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  // getSessionAttributes: (attributes) => {
  //   return {
  //     ipCountry: attributes.ip_country,
  //   };
  // },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    // DatabaseUserAttributes: DatabaseUserAttributes;
    // DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
}

// interface DatabaseUserAttributes {
//   name: string;
// }

// interface DatabaseSessionAttributes {
//   ip_country: string;
// }
