import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      status: {
        type: "string",
        defaultValue: "active",
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  trustedOrigins: ['http://localhost:5173'],
})
