import { Link } from '@tanstack/react-router'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'

export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  const [company, setCompany] = useState<{ nome_fantasia?: string; email?: string } | null>(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/company-settings')
      .then(res => res.json())
      .then(data => setCompany(data))
      .catch(console.error)
  }, [])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-0 py-0 hover:bg-transparent active:bg-transparent'
          asChild
        >
          <Link
            to='/'
            onClick={() => setOpenMobile(false)}
            className='grid flex-1 text-center place-items-center text-sm leading-tight'
          >
            <span className='truncate font-bold'>{company?.nome_fantasia || 'Shadcn-Admin'}</span>
            <span className='truncate text-xs'>{company?.email || 'Vite + ShadcnUI'}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
