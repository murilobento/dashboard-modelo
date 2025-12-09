'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { createUser, updateUser } from '../api/users-api'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

const formSchema = z
  .object({
    name: z.string().min(1, 'Name is required.'),
    email: z.email({ message: 'Email is required.' }),
    password: z.string().transform((pwd) => pwd.trim()),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit) return true
      return data.password.length > 0
    },
    { message: 'Password is required.', path: ['password'] }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      if (!password) return true
      return password.length >= 8
    },
    { message: 'Password must be at least 8 characters.', path: ['password'] }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    { message: "Passwords don't match.", path: ['confirmPassword'] }
  )

type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const [isLoading, setIsLoading] = useState(false)
  const { onSuccess } = useUsers()

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? { name: currentRow.name, email: currentRow.email, password: '', confirmPassword: '', isEdit }
      : { name: '', email: '', password: '', confirmPassword: '', isEdit },
  })

  const onSubmit = async (values: UserForm) => {
    setIsLoading(true)
    try {
      if (isEdit && currentRow) {
        await updateUser(currentRow.id, { name: values.name, email: values.email })
        toast.success('User updated successfully')
      } else {
        await createUser({ name: values.name, email: values.email, password: values.password })
        toast.success('User created successfully')
      }
      form.reset()
      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error(isEdit ? 'Failed to update user' : 'Failed to create user')
    } finally {
      setIsLoading(false)
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='user-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' className='col-span-4' autoComplete='off' {...field} />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='john@example.com' className='col-span-4' {...field} />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
            {!isEdit && (
              <>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder='********' className='col-span-4' {...field} />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          disabled={!isPasswordTouched}
                          placeholder='********'
                          className='col-span-4'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              </>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='user-form' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
