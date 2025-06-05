"use client"
import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Clock, Loader2, Search, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


import { formatDate } from "@/lib/utils"
import { Contact } from "@/types/types"


interface Ticket {
  id: string
  title: string
  status: string
  createdAt: string
}

export default function MyTicketsPage() {

  const [tickets, setTickets] = useState<Contact|null>(null)
  const [isLoading, setIsLoading] = useState(false)
 


   if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/40 p-4">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">My Tickets</h1>
            <p className="text-muted-foreground">View and track your support tickets</p>
          </div>
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading tickets...</p>
          </Card>
        </div>
      </div>
    )
  }


  return (
    <div className="flex min-h-screen flex-col bg-muted/40 p-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
         
          <h1 className="text-3xl font-bold">My Tickets</h1>
          <p className="text-muted-foreground">View and track your support tickets</p>
        </div>

          <div className="space-y-6">
            {/* {tickets && tickets?.ticket?.length&& tickets?.ticket?.length> 0 ? (
              <div className="grid gap-4">
                {tickets?.ticket?.map((ticket:TicketType) => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{ticket.title}</CardTitle>
                          <CardDescription>{ticket.id}</CardDescription>
                        </div>
                          <BadgeStatus status={ticket.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">Created on {formatDate(ticket.createdAt)}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 px-6 py-3">
                      <Button asChild className="w-full sm:w-auto">
                        <Link href={`/ticket/details/${ticket.id}`}>View Ticket Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No tickets found</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  We couldn't find any tickets associated with this mobile number.
                </p>
                <Button asChild>
                  <Link href="/ticket/new">Create a New Ticket</Link>
                </Button>
              </Card>
            )} */}
          </div>
      </div>
    </div>
  )
}
