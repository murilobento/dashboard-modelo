import { create } from 'zustand'

interface AuthUser {
  id: string
  email: string
  name: string
  image?: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  auth: {
    user: null,
    setUser: (user) =>
      set((state) => ({ ...state, auth: { ...state.auth, user } })),
    reset: () =>
      set((state) => ({
        ...state,
        auth: { ...state.auth, user: null },
      })),
  },
}))
