"use client"

import { useSearchParams } from "next/navigation"
import { CheckCircle2, Copy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function TicketSuccessPage() {
  const searchParams = useSearchParams()
  const ticketId = searchParams.get("id") || "TICKET-0000"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ticketId)
    toast.success("Ticket ID copied to clipboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Ticket Submitted Successfully</CardTitle>
          <CardDescription>Your support ticket has been created</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-2">
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm font-medium text-muted-foreground">Ticket ID</div>
            <div className="mt-1 flex items-center justify-center gap-2 text-xl font-bold">
              {ticketId}
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard}>
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy ticket ID</span>
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              We&apos;ve sent a confirmation email with your ticket details. Our support team will review your request
              and respond as soon as possible.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <Button className="w-full" asChild>
            <Link href={`/ticket/details/${ticketId}`}>Check Ticket Status</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
