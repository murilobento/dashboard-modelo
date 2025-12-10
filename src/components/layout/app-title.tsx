import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppTitle() {
  const { setOpenMobile, state } = useSidebar()
  const [company, setCompany] = useState<{
    nome_fantasia?: string
    email?: string
  } | null>(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/company-settings')
      .then((res) => res.json())
      .then((data) => setCompany(data))
      .catch(console.error)
  }, [])

  // Extract initials from company name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const companyName = company?.nome_fantasia || 'Shadcn-Admin'
  const companyEmail = company?.email || 'Vite + ShadcnUI'
  const initials = getInitials(companyName)
  const isCollapsed = state === 'collapsed'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-0 py-0 hover:bg-transparent active:bg-transparent group-data-[collapsible=icon]:!p-0'
          asChild
        >
          <Link
            to='/'
            onClick={() => setOpenMobile(false)}
            className='grid flex-1 place-items-center text-center text-sm leading-tight'
          >
            {isCollapsed ? (
              <span className='text-xl font-bold tracking-tight'>{initials}</span>
            ) : (
              <>
                <span className='truncate font-bold'>{companyName}</span>
                <span className='truncate text-xs'>{companyEmail}</span>
              </>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
