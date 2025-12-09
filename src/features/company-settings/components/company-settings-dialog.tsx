import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { useEffect, useState } from 'react'
import { Loader2, Instagram, Facebook, Phone, Mail } from 'lucide-react'

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z"></path>
    </svg>
)

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z" fill="currentColor" />
    </svg>
)

const companySettingsSchema = z.object({
    nome_fantasia: z.string().min(1, 'Fantasy Name is required'),
    razao_social: z.string().min(1, 'Legal Name is required'),
    cnpj: z.string().min(1, 'CNPJ is required'),
    inscricao_estadual: z.string().optional(),
    cep: z.string().min(8, 'CEP must be at least 8 characters'),
    logradouro: z.string().min(1, 'Address is required'),
    numero: z.string().min(1, 'Number is required'),
    complemento: z.string().optional(),
    bairro: z.string().min(1, 'Neighborhood is required'),
    cidade: z.string().min(1, 'City is required'),
    uf: z.string().min(2, 'State is required'),
    email: z.string().email(),
    site: z.string().url().optional().or(z.literal('')),
    telefone: z.string().min(1, 'Phone is required'),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
    whatsapp: z.string().optional(),
})

type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>

interface CompanySettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CompanySettingsDialog({ open, onOpenChange }: CompanySettingsDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<CompanySettingsFormValues>({
        resolver: zodResolver(companySettingsSchema),
        defaultValues: {
            nome_fantasia: '',
            razao_social: '',
            cnpj: '',
            inscricao_estadual: '',
            cep: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            uf: '',
            email: '',
            site: '',
            telefone: '',
            instagram: '',
            facebook: '',
            tiktok: '',
            whatsapp: '',
        },
    })

    const uf = form.watch('uf')

    useEffect(() => {
        if (open) {
            // Fetch initial data
            fetch('http://localhost:3000/api/company-settings')
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.cnpj) {
                        form.reset(data)
                    }
                })
                .catch((err) => console.error('Failed to fetch settings', err))
        }
    }, [open, form])

    const onSubmit = async (data: CompanySettingsFormValues) => {
        setIsLoading(true)
        try {
            const res = await fetch('http://localhost:3000/api/company-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                toast.success('Settings updated successfully')
                onOpenChange(false)
            } else {
                toast.error('Failed to update settings')
            }
        } catch (error) {
            toast.error('Error submitting form')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '')
        if (cep.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                const data = await res.json()
                if (!data.erro) {
                    form.setValue('logradouro', data.logradouro)
                    form.setValue('bairro', data.bairro)
                    form.setValue('cidade', data.localidade)
                    form.setValue('uf', data.uf)
                    form.setFocus('numero')
                }
            } catch (error) {
                console.error('Failed to fetch CEP', error)
            }
        }
    }
    const maskCEP = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .substring(0, 9)
    }

    const maskCNPJ = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .substring(0, 18)
    }

    const maskPhone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d)(\d{4})$/, '$1-$2')
            .substring(0, 15)
    }

    const maskIE = (value: string, uf: string) => {
        const v = value.replace(/\D/g, '')
        if (!uf) return v

        switch (uf.toUpperCase()) {
            case 'AC': return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3/$4-$5').substring(0, 17)
            case 'AL': return v.replace(/^(\d{2})(\d{6})(\d{1})/, '$1.$2.$3-$4').substring(0, 11) // 24.123.456-7
            case 'AP': return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4').substring(0, 12)
            case 'AM': return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4').substring(0, 12)
            case 'BA':
                if (v.length === 8) return v.replace(/^(\d{6})(\d{2})/, '$1-$2').substring(0, 9)
                return v.replace(/^(\d{7})(\d{2})/, '$1-$2').substring(0, 10)
            case 'CE': return v.replace(/^(\d{8})(\d{1})/, '$1-$2').substring(0, 10)
            case 'DF': return v.replace(/^(\d{3})(\d{5})(\d{3})(\d{2})/, '$1.$2.$3-$4').substring(0, 17)
            case 'ES': return v.replace(/^(\d{8})(\d{1})/, '$1-$2').substring(0, 10) // 12345678-0
            case 'GO': return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4').substring(0, 12) // 10.987.654-7
            case 'MA': return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4').substring(0, 12) // 12.345.678-9
            case 'MT': return v.replace(/^(\d{10})(\d{1})/, '$1-$2').substring(0, 12) // 0013000001-9
            case 'MS': return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4').substring(0, 12) // 28.123.456-8
            case 'MG': return v.replace(/^(\d{3})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4').substring(0, 17) // 062.307.904/0081
            case 'PA': return v.replace(/^(\d{2})(\d{6})(\d{1})/, '$1-$2-$3').substring(0, 12) // 15-123456-5
            case 'PB': return v.replace(/^(\d{8})(\d{1})/, '$1-$2').substring(0, 10) // 12345678-9
            case 'PR': return v.replace(/^(\d{3})(\d{5})(\d{2})/, '$1.$2-$3').substring(0, 13) // 123.45678-50
            case 'PE': return v.replace(/^(\d{7})(\d{2})/, '$1-$2').substring(0, 10) // 1234567-9
            case 'PI': return v.replace(/^(\d{8})(\d{1})/, '$1-$2').substring(0, 10) // 12345678-9
            case 'RJ': return v.replace(/^(\d{2})(\d{3})(\d{2})(\d{1})/, '$1.$2.$3-$4').substring(0, 11) // 12.345.67-8
            case 'RN': return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4').substring(0, 12) // 20.123.456-7
            case 'RS': return v.replace(/^(\d{3})(\d{7})/, '$1/$2').substring(0, 11) // 123/4567890
            case 'RO': return v.replace(/^(\d{13})/, '$1').substring(0, 13) // Just digits as per example 2
            case 'RR': return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4').substring(0, 12)
            case 'SC': return v.replace(/^(\d{3})(\d{3})(\d{3})/, '$1.$2.$3').substring(0, 11)
            case 'SP': return v.replace(/^(\d{3})(\d{3})(\d{3})(\d{3})/, '$1.$2.$3.$4').substring(0, 15)
            case 'SE': return v.replace(/^(\d{8})(\d{1})/, '$1-$2').substring(0, 10)
            case 'TO': return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4').substring(0, 12)
            default: return v
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-4xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Company Settings</DialogTitle>
                    <DialogDescription>
                        Manage your company information here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id='company-settings-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
                            {/* Row 1: CEP [2] Address [8] Number [2] */}
                            <div className="col-span-1 md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name='cep'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CEP</FormLabel>
                                            <FormControl>
                                                <Input {...field} onChange={(e) => {
                                                    field.onChange(maskCEP(e.target.value))
                                                    if (e.target.value.length === 9) {
                                                        handleCepBlur({ target: { value: e.target.value } } as any)
                                                    }
                                                }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-8">
                                <FormField
                                    control={form.control}
                                    name='logradouro'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name='numero'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 2: Complemento [3] Bairro [4] Cidade [3] UF [2] */}
                            <div className="col-span-1 md:col-span-3">
                                <FormField
                                    control={form.control}
                                    name='complemento'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Complement</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-4">
                                <FormField
                                    control={form.control}
                                    name='bairro'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Neighborhood</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-3">
                                <FormField
                                    control={form.control}
                                    name='cidade'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name='uf'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State (UF)</FormLabel>
                                            <FormControl>
                                                <Input {...field} maxLength={2} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 3: Nome fantasia [6] Razão Social [6] */}
                            <div className="col-span-1 md:col-span-6">
                                <FormField
                                    control={form.control}
                                    name='nome_fantasia'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fantasy Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-6">
                                <FormField
                                    control={form.control}
                                    name='razao_social'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Legal Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 4: CNPJ [6] IE [6] */}
                            <div className="col-span-1 md:col-span-6">
                                <FormField
                                    control={form.control}
                                    name='cnpj'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CNPJ</FormLabel>
                                            <FormControl>
                                                <Input {...field} onChange={(e) => field.onChange(maskCNPJ(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-6">
                                <FormField
                                    control={form.control}
                                    name='inscricao_estadual'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Inscrição Estadual</FormLabel>
                                            <FormControl>
                                                <Input {...field} onChange={(e) => field.onChange(maskIE(e.target.value, uf))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 5: Email [4] Website [4] Phone [4] */}
                            <div className="col-span-1 md:col-span-4">
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" {...field} type='email' />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-4">
                                <FormField
                                    control={form.control}
                                    name='site'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Website</FormLabel>
                                            <FormControl>
                                                <div className="flex h-9 w-full rounded-md border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring">
                                                    <div className="flex items-center px-3 bg-muted border-r text-sm text-muted-foreground rounded-l-md">
                                                        https://
                                                    </div>
                                                    <Input className="h-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-none shadow-none" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-4">
                                <FormField
                                    control={form.control}
                                    name='telefone'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" {...field} onChange={(e) => field.onChange(maskPhone(e.target.value))} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 6: Tiktok [3] Whatsapp [3] Instagram [3] Facebook [3] */}
                            <div className="col-span-1 md:col-span-3">
                                <FormField
                                    control={form.control}
                                    name='tiktok'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>TikTok</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <TikTokIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-3">
                                <FormField
                                    control={form.control}
                                    name='whatsapp'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>WhatsApp</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <WhatsAppIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" {...field} onChange={(e) => field.onChange(maskPhone(e.target.value))} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-3">
                                <FormField
                                    control={form.control}
                                    name='instagram'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Instagram</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Instagram className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-3">
                                <FormField
                                    control={form.control}
                                    name='facebook'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Facebook</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Facebook className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button type='submit' form='company-settings-form' disabled={isLoading}>
                        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
