import 'dotenv/config'
import { auth } from './auth'

async function seed() {
  console.log('Creating default user...')

  try {
    const ctx = await auth.api.signUpEmail({
      body: {
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin123',
      },
    })

    console.log('User created:', ctx.user.email)
  } catch (error) {
    console.error('Error creating user:', error)
  }

  process.exit(0)
}

seed()
