'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { deleteUser } from '../api/users-api'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { onSuccess } = useUsers()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.email) return

    setIsLoading(true)
    try {
      await deleteUser(currentRow.id)
      toast.success('User deleted successfully')
      onOpenChange(false)
      setValue('')
      onSuccess()
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.email || isLoading}
      title={
        <span className='text-destructive'>
          {isLoading ? (
            <Loader2 className='me-1 inline-block animate-spin' size={18} />
          ) : (
            <AlertTriangle className='stroke-destructive me-1 inline-block' size={18} />
          )}
          Delete User
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the user from the system. This cannot be undone.
          </p>

          <Label className='my-2'>
            Email:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter email to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
