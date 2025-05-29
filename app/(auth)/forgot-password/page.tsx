"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Grid3X3, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <Grid3X3 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">FlexiCMS</span>
        </div>

        {!isSubmitted ? (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight mb-2">Reset your password</h1>
              <p className="text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send reset link"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft size={16} />
                  <span>Back to login</span>
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
            <p className="text-muted-foreground">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or{" "}
              <button className="text-primary hover:underline font-medium" onClick={() => setIsSubmitted(false)}>
                try again
              </button>
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                <span>Back to login</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
