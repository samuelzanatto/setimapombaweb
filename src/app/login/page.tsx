"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

const formSchema = z.object({
    username: z.string().min(1, "Username é obrigatório"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres")
})

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          password: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
          setLoading(true)
          await login(values.username, values.password)
          router.push('/dashboard')
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Credenciais inválidas",
          })
        } finally {
          setLoading(false)
        }
    }

    return (
        <main className="w-full h-screen flex items-center justify-center">
          <Toaster />
            <div className="flex flex-col items-center justify-center bg-neutral-900 w-[30vw] h-[70vh] text-white rounded-2xl">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96">
                    <h1 className="text-3xl font-bold text-center">LOGIN</h1>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuário</FormLabel>
                          <FormControl>
                            <Input 
                            placeholder="usuário" 
                            {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input 
                            type="password" 
                            placeholder="******" 
                            {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                    type="submit" 
                    className="w-full font-semibold" 
                    variant="secondary"
                    disabled={loading}
                    >
                        {loading ? <LoaderCircle className="animate-spin" style={{ animation: 'spin 0.3s linear infinite' }}/> : 'Enviar' }
                    </Button>
                  </form>
                </Form>
            </div>
        </main>
    )
}