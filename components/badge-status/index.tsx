import React from 'react'
import { Badge } from "@/components/ui/badge"
    import { CheckCircle, CheckCircle2, Clock, Send, XCircle } from "lucide-react"


interface BadgeStatusProps {
  status:   'sent' | 'delivered' | 'read' | 'failed' | 'pending' | 'scheduled'
}

const BadgeStatus = ({ status }: BadgeStatusProps) => {
  const getBadgeContent = () => {
    switch (status) {
      case "sent":
        return {
          icon: <Send className="mr-1 h-3 w-3" />,
          text: "Sent",
          className: "border-blue-200 bg-blue-50 text-blue-700"
        }
      case "delivered":
        return {
          icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
          text: "Delivered",
          className: "border-yellow-200 bg-yellow-50 text-yellow-700"
        }
      case "read":
        return {
          icon: <CheckCircle className="mr-1 h-3 w-3" />,
          text: "Read",
          className: "border-green-200 bg-green-50 text-green-700"
        }
      case "failed":
        return {
          icon: <XCircle className="mr-1 h-3 w-3" />,
          text: "Failed",
          className: "border-gray-200 bg-gray-50 text-gray-700"
        }
      case "pending":
        return {
          icon: <Clock className="mr-1 h-3 w-3" />,
          text: "Pending",
          className: "border-gray-200 bg-gray-50 text-gray-700"
        }
      case "scheduled":
        return {
          icon: <Clock className="mr-1 h-3 w-3" />,
          text: "Scheduled",
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