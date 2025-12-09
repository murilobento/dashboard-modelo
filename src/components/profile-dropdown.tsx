import { Link } from '@tanstack/react-router'
import {
  Bell,
  LogOut,
  UserCog,
  Wrench,
  Palette,
  Monitor,
} from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { useSession } from '@/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const { data: session } = useSession()

  const user = session?.user
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm leading-none font-medium'>{user?.name || 'User'}</p>
              <p className='text-muted-foreground text-xs leading-none'>
                {user?.email || ''}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                <UserCog />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/account'>
                <Wrench />
                Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/appearance'>
                <Palette />
                Appearance
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/notifications'>
                <Bell />
                Notifications
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/display'>
                <Monitor />
                Display
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
