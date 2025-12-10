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
import { Switch } from '@/components/ui/switch'
import { PasswordInput } from '@/components/password-input'
import { createUser, updateUser } from '../api/users-api'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

const formSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório.'),
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
    status: z.string().min(1, 'Status é obrigatório'),
    password: z.string().transform((pwd) => pwd.trim()),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit) return true
      return data.password.length > 0
    },
    { message: 'Senha é obrigatória.', path: ['password'] }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      if (!password) return true
      return password.length >= 8
    },
    { message: 'A senha deve ter pelo menos 8 caracteres.', path: ['password'] }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    { message: 'As senhas não coincidem.', path: ['confirmPassword'] }
  )

type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
  readOnly?: boolean
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
  readOnly,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const [isLoading, setIsLoading] = useState(false)
  const { onSuccess } = useUsers()

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          email: currentRow.email,
          status: currentRow.status || 'active',
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          name: '',
          email: '',
          status: 'active',
          password: '',
          confirmPassword: '',
          isEdit,
        },
  })

  const onSubmit = async (values: UserForm) => {
    setIsLoading(true)
    try {
      if (isEdit && currentRow) {
        await updateUser(currentRow.id, {
          name: values.name,
          email: values.email,
          status: values.status,
          ...(values.password ? { password: values.password } : {}),
        })
        toast.success('Usuário atualizado com sucesso')
      } else {
        await createUser({
          name: values.name,
          email: values.email,
          status: values.status,
          password: values.password,
        })
        toast.success('Usuário criado com sucesso')
      }
      form.reset()
      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error(
        isEdit ? 'Falha ao atualizar usuário' : 'Falha ao criar usuário'
      )
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
          <DialogTitle>
            {isEdit
              ? readOnly
                ? 'Visualizar Usuário'
                : 'Editar Usuário'
              : 'Adicionar Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? readOnly
                ? 'Detalhes do usuário.'
                : 'Atualize o usuário aqui.'
              : 'Crie um novo usuário aqui.'}
            {!readOnly && ' Clique em salvar quando terminar.'}
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
                  <FormLabel className='col-span-2 text-end'>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='João Silva'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                      disabled={readOnly || isLoading}
                    />
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
                    <Input
                      placeholder='joao@exemplo.com'
                      className='col-span-4'
                      {...field}
                      disabled={readOnly || isLoading}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Status</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value === 'active'}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? 'active' : 'inactive')
                      }
                      disabled={readOnly || isLoading}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    {isEdit ? 'Nova Senha' : 'Senha'}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={
                        isEdit
                          ? 'Deixe em branco para manter a atual'
                          : '********'
                      }
                      className='col-span-4'
                      {...field}
                      disabled={readOnly || isLoading}
                    />
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
                  <FormLabel className='col-span-2 text-end'>
                    Confirmar Senha
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={
                        isEdit
                          ? 'Deixe em branco para manter a atual'
                          : '********'
                      }
                      className='col-span-4'
                      {...field}
                      disabled={readOnly || isLoading || !isPasswordTouched}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          {!readOnly ? (
            <Button type='submit' form='user-form' disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Salvar alterações
            </Button>
          ) : (
            <Button
              type='button'
              onClick={(e) => {
                e.preventDefault()
                onOpenChange(false)
              }}
            >
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
