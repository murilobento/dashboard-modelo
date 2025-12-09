'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { deleteUsers } from '../api/users-api'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { onSuccess } = useUsers()

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    setIsLoading(true)
    try {
      const ids = selectedRows.map((row) => (row.original as User).id)
      await deleteUsers(ids)
      toast.success(`Deleted ${selectedRows.length} ${selectedRows.length > 1 ? 'users' : 'user'}`)
      table.resetRowSelection()
      setValue('')
      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error('Failed to delete users')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD || isLoading}
      title={
        <span className='text-destructive'>
          {isLoading ? (
            <Loader2 className='me-1 inline-block animate-spin' size={18} />
          ) : (
            <AlertTriangle className='stroke-destructive me-1 inline-block' size={18} />
          )}
          Delete {selectedRows.length} {selectedRows.length > 1 ? 'users' : 'user'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete the selected users? <br />
            This action cannot be undone.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>Confirm by typing "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
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
