import * as React from 'react'
import { ChevronsUpDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'

type ModuleSwitcherProps = {
    modules: {
        name: string
        logo: React.ElementType
        plan: string
        id: string
    }[]
    activeModule: {
        name: string
        logo: React.ElementType
        plan: string
        id: string
    }
    setActiveModule: (module: {
        name: string
        logo: React.ElementType
        plan: string
        id: string
    }) => void
}

export function ModuleSwitcher({ modules, activeModule, setActiveModule }: ModuleSwitcherProps) {
    const { isMobile } = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size='lg'
                            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                        >
                            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                                <activeModule.logo className='size-4' />
                            </div>
                            <div className='grid flex-1 text-start text-sm leading-tight'>
                                <span className='truncate font-semibold'>
                                    {activeModule.name}
                                </span>
                                <span className='truncate text-xs'>{activeModule.plan}</span>
                            </div>
                            <ChevronsUpDown className='ms-auto' />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                        align='start'
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className='text-muted-foreground text-xs'>
                            Modules
                        </DropdownMenuLabel>
                        {modules.map((module, index) => (
                            <DropdownMenuItem
                                key={module.name}
                                onClick={() => setActiveModule(module)}
                                className='gap-2 p-2'
                            >
                                <div className='flex size-6 items-center justify-center rounded-sm border'>
                                    <module.logo className='size-4 shrink-0' />
                                </div>
                                {module.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
