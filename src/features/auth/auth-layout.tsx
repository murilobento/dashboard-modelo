import { useEffect, useState } from 'react'
import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [companyName, setCompanyName] = useState('Shadcn Admin')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/company-settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.nome_fantasia) {
          setCompanyName(data.nome_fantasia)
        }
      })
      .catch(() => {
        // Silently fail - use default company name
      })
  }, [])

  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <Logo className='me-2' />
          <h1 className='text-xl font-medium'>{companyName}</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
