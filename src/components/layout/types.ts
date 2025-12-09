import { type LinkProps } from '@tanstack/react-router'

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }

type User = {
  name: string
  email: string
  avatar: string
}

type Module = {
  name: string
  logo: React.ElementType
  plan: string
  id: string
}

type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
}

type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] | (string & {}) })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  items: NavItem[]
  moduleId?: string
}

type SidebarData = {
  user: User
  modules: Module[]
  navGroups: NavGroup[]
}
