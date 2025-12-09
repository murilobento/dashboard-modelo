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
  const { name, email, password } = body

  // Update user basic info
  const result = await pool.query(
    'UPDATE "user" SET name = $1, email = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING *',
    [name, email, id]
  )

  // Update password if provided using better-auth's internal context
  if (password) {
    const ctx = await auth.$context
    const hashedPassword = await ctx.password.hash(password)
    await pool.query(
      'UPDATE "account" SET password = $1 WHERE "userId" = $2 AND "providerId" = $3',
      [hashedPassword, id, 'credential']
    )
  }

  return c.json(result.rows[0])
})

app.post('/api/users', async (c) => {
  const body = await c.req.json()
  const { name, email, password } = body
  const ctx = await auth.api.signUpEmail({
    body: { name, email, password },
  })
  return c.json(ctx.user)
  return c.json(ctx.user)
})

// Company Settings API

// Initialize Company Settings Table
const initCompanySettings = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS company_settings (
      id SERIAL PRIMARY KEY,
      nome_fantasia TEXT,
      razao_social TEXT,
      cnpj TEXT,
      inscricao_estadual TEXT,
      cep TEXT,
      logradouro TEXT,
      numero TEXT,
      complemento TEXT,
      bairro TEXT,
      cidade TEXT,
      uf TEXT,
      email TEXT,
      site TEXT,
      telefone TEXT,
      instagram TEXT,
      facebook TEXT,
      tiktok TEXT,
      whatsapp TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `)
  try {
    await pool.query('ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS nome_fantasia TEXT')
    await pool.query('ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS razao_social TEXT')
  } catch (e) {
    console.error('Migration error:', e)
  }
}
initCompanySettings().catch(console.error)

app.get('/api/company-settings', async (c) => {
  const result = await pool.query('SELECT * FROM company_settings WHERE id = 1')
  return c.json(result.rows[0] || {})
})

app.post('/api/company-settings', async (c) => {
  const body = await c.req.json()
  const {
    nome_fantasia,
    razao_social,
    cnpj,
    inscricao_estadual,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    uf,
    email,
    site,
    telefone,
    instagram,
    facebook,
    tiktok,
    whatsapp,
  } = body

  const result = await pool.query(
    `INSERT INTO company_settings (id, nome_fantasia, razao_social, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, email, site, telefone, instagram, facebook, tiktok, whatsapp, updated_at)
     VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
     ON CONFLICT (id) DO UPDATE SET
       nome_fantasia = EXCLUDED.nome_fantasia,
       razao_social = EXCLUDED.razao_social,
       cnpj = EXCLUDED.cnpj,
       inscricao_estadual = EXCLUDED.inscricao_estadual,
       cep = EXCLUDED.cep,
       logradouro = EXCLUDED.logradouro,
       numero = EXCLUDED.numero,
       complemento = EXCLUDED.complemento,
       bairro = EXCLUDED.bairro,
       cidade = EXCLUDED.cidade,
       uf = EXCLUDED.uf,
       email = EXCLUDED.email,
       site = EXCLUDED.site,
       telefone = EXCLUDED.telefone,
       instagram = EXCLUDED.instagram,
       facebook = EXCLUDED.facebook,
       tiktok = EXCLUDED.tiktok,
       whatsapp = EXCLUDED.whatsapp,
       updated_at = NOW()
     RETURNING *`,
    [
      nome_fantasia,
      razao_social,
      cnpj,
      inscricao_estadual,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      email,
      site,
      telefone,
      instagram,
      facebook,
      tiktok,
      whatsapp,
    ]
  )
  return c.json(result.rows[0])
})

app.get('/api/health', (c) => c.json({ status: 'ok' }))

const port = 3000
console.log(`Server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
