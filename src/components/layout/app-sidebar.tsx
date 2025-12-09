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

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const [activeModule, setActiveModule] = useState(sidebarData.modules[0])
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
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
