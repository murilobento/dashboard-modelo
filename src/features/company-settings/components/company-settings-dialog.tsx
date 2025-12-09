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
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            {/* Address Fields */}
                            <FormField
                                control={form.control}
                                name='cep'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CEP</FormLabel>
                                        <FormControl>
                                            <Input {...field} onBlur={handleCepBlur} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <div className="md:col-span-1"></div> {/* Filler for layout */}

                            {/* Company Info Fields */}
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

                            {/* Contact Fields */}
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
                            <FormField
                                control={form.control}
                                name='tiktok'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>TikTok</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='whatsapp'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>WhatsApp</FormLabel>
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
