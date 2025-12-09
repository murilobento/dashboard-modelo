import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-provider'

export function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position='top-center'
      closeButton
      className='toaster group [&_div[data-content]]:w-full'
      toastOptions={{
        classNames: {
          success:
            '!bg-green-500 !text-white !border-green-500 [&_svg]:!fill-white [&_svg]:!text-white [&_button]:!bg-green-600 [&_button]:!text-white [&_button]:!border-green-600',
          error:
            '!bg-red-500 !text-white !border-red-500 [&_svg]:!fill-white [&_svg]:!text-white [&_button]:!bg-red-600 [&_button]:!text-white [&_button]:!border-red-600',
          warning:
            '!bg-orange-500 !text-white !border-orange-500 [&_svg]:!fill-white [&_svg]:!text-white [&_button]:!bg-orange-600 [&_button]:!text-white [&_button]:!border-orange-600',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
