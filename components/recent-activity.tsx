"use client"

import { CheckCircle2, Clock, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// 模拟数据 - 在实际应用中应从API获取
const ACTIVITIES = [
  {
    id: 1,
    type: "receivable",
    action: "received",
    company: "上海科技有限公司",
    amount: 15000,
    date: "2025-03-09",
    time: "14:30",
    user: "张经理",
  },
  {
    id: 2,
    type: "payable",
    action: "paid",
    company: "北京供应商贸易有限公司",
    amount: 8200,
    date: "2025-03-08",
    time: "11:15",
    user: "李财务",
  },
  {
    id: 3,
    type: "receivable",
    action: "overdue",
    company: "广州电子科技有限公司",
    amount: 12500,
    date: "2025-03-07",
    time: "09:45",
    user: "系统",
  },
  {
    id: 4,
    type: "payable",
    action: "scheduled",
    company: "深圳材料供应有限公司",
    amount: 5600,
    date: "2025-03-06",
    time: "16:20",
    user: "王出纳",
  },
  {
    id: 5,
    type: "receivable",
    action: "received",
    company: "杭州网络科技有限公司",
    amount: 9800,
    date: "2025-03-05",
    time: "10:30",
    user: "张经理",
  },
  {
    id: 6,
    type: "payable",
    action: "paid",
    company: "成都物流有限公司",
    amount: 3200,
    date: "2025-03-04",
    time: "15:45",
    user: "李财务",
  },
  {
    id: 7,
    type: "receivable",
    action: "scheduled",
    company: "武汉制造有限公司",
    amount: 7500,
    date: "2025-03-03",
    time: "13:10",
    user: "系统",
  },
]

export function RecentActivity() {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "received":
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getActionText = (action: string, type: string) => {
    switch (action) {
      case "received":
        return "已收款"
      case "paid":
        return "已付款"
      case "overdue":
        return type === "receivable" ? "逾期未收" : "逾期未付"
      case "scheduled":
        return type === "receivable" ? "计划收款" : "计划付款"
      default:
        return action
    }
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-6">
        {ACTIVITIES.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className="mt-0.5">{getActionIcon(activity.action)}</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activity.company}</span>
                <Badge variant={activity.type === "receivable" ? "default" : "secondary"} className="text-xs">
                  {activity.type === "receivable" ? "应收" : "应付"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getActionText(activity.action, activity.type)}
                </Badge>
              </div>
              <p className="text-sm">
                金额: <span className="font-medium">¥{activity.amount.toLocaleString()}</span>
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>
                  {activity.date} {activity.time}
                </span>
                <span>操作人: {activity.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

