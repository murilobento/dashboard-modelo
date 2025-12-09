import { useState } from 'react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { ModuleSwitcher } from './module-switcher'
import { useSession } from '@/lib/auth-client'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const [activeModule, setActiveModule] = useState(sidebarData.modules[0])
  const { data: session } = useSession()

  const user = session?.user ? {
    name: session.user.name,
    email: session.user.email,
    avatar: session.user.image || sidebarData.user.avatar,
  } : sidebarData.user

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader className='gap-4'>
        <AppTitle />
        <ModuleSwitcher modules={sidebarData.modules} activeModule={activeModule} setActiveModule={setActiveModule} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.filter(props => props.moduleId === activeModule.id).map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
