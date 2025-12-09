import {
  LayoutDashboard,
  Users,
  Building2,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  modules: [
    {
      name: 'General',
      logo: GalleryVerticalEnd,
      plan: 'Dashboard',
      id: 'general'
    },
    {
      name: 'Administrativo',
      logo: Command,
      plan: 'Admin Tools',
      id: 'admin'
    },
  ],
  navGroups: [
    {
      title: 'General',
      moduleId: 'general',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Administrativo',
      moduleId: 'admin',
      items: [
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Company Settings',
          url: '/?modal=company-settings',
          icon: Building2,
        },
      ],
    },

  ],
}
