"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth, ApiError } from "@/lib/auth-context"
import { resolveLoginRedirect } from "@/lib/resolve-login-redirect"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const schema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "Phone number required")
    .regex(/^01\d{9}$/, "Enter a valid 11-digit phone (01XXXXXXXXX)"),
  password: z.string().trim().min(1, "Password required"),
})

type FormData = z.infer<typeof schema>

function LoginContent() {
  const { login, user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"
  const [error, setError] = useState<string | null>(null)
  const [deviceLimit, setDeviceLimit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<FormData | null>(null)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(resolveLoginRedirect(user.role, redirect))
    }
  }, [authLoading, user, router, redirect])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    setDeviceLimit(false)
    setCredentials(data)
    try {
      const loggedInUser = await login(data.phone, data.password)
      toast.success("Welcome back!")
      router.push(resolveLoginRedirect(loggedInUser.role, redirect))
    } catch (err) {
      if (err instanceof ApiError && err.code === "DEVICE_LIMIT_REACHED") {
        setDeviceLimit(true)
        setError("Another device is already logged in. Force logout to continue.")
      } else {
        setError(err instanceof ApiError ? err.message : "Login failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForceLogout = async () => {
    if (!credentials) return
    setLoading(true)
    setError(null)
    try {
      const loggedInUser = await login(credentials.phone, credentials.password, {
        forceLogout: true,
      })
      toast.success("Welcome back!")
      router.push(resolveLoginRedirect(loggedInUser.role, redirect))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed")
    } finally {
      setLoading(false)
      setDeviceLimit(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className={cn("w-full max-w-md rounded-[20px] bg-card p-8 shadow-sm")}>
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="text-lg font-bold text-primary-foreground">IL</span>
            </div>
            <span className="text-xl font-bold text-foreground">Law LMS</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with your phone number and password
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              className="mt-1 rounded-xl"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="mt-1 rounded-xl"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full rounded-xl" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {deviceLimit && (
          <Button
            variant="outline"
            className="mt-3 w-full rounded-xl"
            onClick={handleForceLogout}
            disabled={loading}
          >
            Force Logout Other Devices
          </Button>
        )}

        <p className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="text-muted-foreground hover:text-primary hover:underline">
            Forgot Password?
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
