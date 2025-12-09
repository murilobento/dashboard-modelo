import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Pool } from 'pg'
import { auth } from './auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const app = new Hono()

app.use(
  '/api/*',
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

// Users API
app.get('/api/users', async (c) => {
  const result = await pool.query(
    'SELECT id, name, email, image, "emailVerified", "createdAt", "updatedAt" FROM "user" ORDER BY "createdAt" DESC'
  )
  return c.json(result.rows)
})

app.delete('/api/users/:id', async (c) => {
  const id = c.req.param('id')
  await pool.query('DELETE FROM "session" WHERE "userId" = $1', [id])
  await pool.query('DELETE FROM "user" WHERE id = $1', [id])
  return c.json({ success: true })
})

app.patch('/api/users/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { name, email } = body
  const result = await pool.query(
    'UPDATE "user" SET name = $1, email = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING *',
    [name, email, id]
  )
  return c.json(result.rows[0])
})

app.post('/api/users', async (c) => {
  const body = await c.req.json()
  const { name, email, password } = body
  const ctx = await auth.api.signUpEmail({
    body: { name, email, password },
  })
  return c.json(ctx.user)
})

app.get('/api/health', (c) => c.json({ status: 'ok' }))

const port = 3000
console.log(`Server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
