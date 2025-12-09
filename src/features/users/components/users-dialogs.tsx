import { UsersActionDialog } from './users-action-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'
import { useUsers } from './users-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  return (
    <>
      <UsersActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'add' : null)}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit' || open === 'view'}
            onOpenChange={(isOpen) => {
              if (isOpen) setOpen(open)
              else {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            currentRow={currentRow}
            readOnly={open === 'view'}
          />

          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              if (isOpen) setOpen('delete')
              else {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
