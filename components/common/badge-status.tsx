import React from 'react'
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { TicketType } from '@/types/types'


interface BadgeStatusProps {
  status: TicketType["status"]
}

const BadgeStatus = ({ status }: BadgeStatusProps) => {
  const getBadgeContent = () => {
    switch (status) {
      case "open":
        return {
          icon: <Clock className="mr-1 h-3 w-3" />,
          text: "Open",
          className: "border-blue-200 bg-blue-50 text-blue-700"
        }
      case "in_progress":
        return {
          icon: <Clock className="mr-1 h-3 w-3" />,
          text: "In Progress",
          className: "border-yellow-200 bg-yellow-50 text-yellow-700"
        }
      case "resolved":
        return {
          icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
          text: "Resolved",
          className: "border-green-200 bg-green-50 text-green-700"
        }
      case "closed":
        return {
          icon: <XCircle className="mr-1 h-3 w-3" />,
          text: "Closed",
          className: "border-gray-200 bg-gray-50 text-gray-700"
        }
      default:
        return {
          icon: <Clock className="mr-1 h-3 w-3" />,
          text: status,
          className: "border-gray-200 bg-gray-50 text-gray-700"
        }
    }
  }

  const { icon, text, className } = getBadgeContent()

  return (
    <Badge variant="outline" className={className}>
      {icon}
      {text}
    </Badge>
  )
}

export default BadgeStatus