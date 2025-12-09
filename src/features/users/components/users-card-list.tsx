import { type Table } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Trash2, UserPen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

type UsersCardListProps = {
  table: Table<User>
}

export function UsersCardList({ table }: UsersCardListProps) {
  const { setOpen, setCurrentRow } = useUsers()
  const rows = table.getRowModel().rows

  if (!rows.length) {
    return (
      <div className='flex items-center justify-center py-10 text-muted-foreground'>
        No results.
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      {rows.map((row) => {
        const user = row.original
        return (
          <div
            key={row.id}
            data-state={row.getIsSelected() && 'selected'}
            className={cn(
              'rounded-lg border bg-card p-3 shadow-sm',
              'data-[state=selected]:bg-muted'
            )}
          >
            <div className='flex items-start gap-3'>
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='mt-1'
              />
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='font-medium truncate'>{user.name}</span>
                  <Badge
                    variant='outline'
                    className={cn(
                      'capitalize text-xs shrink-0',
                      user.emailVerified
                        ? 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'
                        : 'bg-neutral-300/40 border-neutral-300'
                    )}
                  >
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground truncate'>
                  {user.email}
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  {format(user.createdAt, 'MMM dd, yyyy')}
                </p>
              </div>
              <div className='flex gap-1 shrink-0'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => {
                    setCurrentRow(user)
                    setOpen('edit')
                  }}
                >
                  <UserPen size={16} />
                  <span className='sr-only'>Edit</span>
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-red-500 hover:text-red-600'
                  onClick={() => {
                    setCurrentRow(user)
                    setOpen('delete')
                  }}
                >
                  <Trash2 size={16} />
                  <span className='sr-only'>Delete</span>
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
