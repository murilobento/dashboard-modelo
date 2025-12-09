import { type User } from '../data/schema'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/api/users`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export async function createUser(data: { name: string; email: string; password: string }): Promise<User> {
  const res = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create user')
  return res.json()
}

export async function updateUser(id: string, data: { name: string; email: string }): Promise<User> {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update user')
  return res.json()
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to delete user')
}

export async function deleteUsers(ids: string[]): Promise<void> {
  await Promise.all(ids.map(deleteUser))
}
