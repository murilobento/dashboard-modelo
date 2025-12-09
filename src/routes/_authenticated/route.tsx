import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/lib/auth-client'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { z } from 'zod'

export const Route = createFileRoute('/_authenticated')({
  validateSearch: z.object({
    modal: z.string().optional(),
  }),
  beforeLoad: async ({ location }) => {
    const { data: session } = await getSession()

    if (!session) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      })
    }

    return { session }
  },
  component: AuthenticatedLayout,
})
