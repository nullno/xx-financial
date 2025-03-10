"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, DollarSign, CheckCircle2 } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

// 根据优先级确定边框颜色
const getPriorityBorderColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "border-red-600"
    case "high":
      return "border-orange-500"
    case "medium":
      return "border-yellow-500"
    case "low":
      return "border-green-500"
    default:
      return "border-primary"
  }
}

// 根据优先级确定背景颜色
const getPriorityBgColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "bg-red-50"
    case "high":
      return "bg-orange-50"
    case "medium":
      return "bg-yellow-50"
    case "low":
      return "bg-green-50"
    default:
      return "bg-background"
  }
}

// 根据优先级获取徽章变体
const getPriorityBadgeVariant = (priority: string): "destructive" | "outline" | "secondary" | "default" => {
  switch (priority) {
    case "critical":
      return "destructive"
    case "high":
      return "default"
    case "medium":
      return "secondary"
    case "low":
      return "outline"
    default:
      return "outline"
  }
}

// 根据优先级获取徽章文本
const getPriorityText = (priority: string) => {
  switch (priority) {
    case "critical":
      return "紧急"
    case "high":
      return "高优先级"
    case "medium":
      return "中优先级"
    case "low":
      return "低优先级"
    default:
      return "普通"
  }
}

// 模拟数据 - 在实际应用中应从Excel导入
const MOCK_TRANSACTIONS = [
  {
    id: "receivable-1",
    type: "receivable",
    company: "上海科技有限公司",
    amount: 12500,
    dueDate: "2025-03-15",
    status: "pending",
    days: 5,
    priority: "medium", // 优先级: critical, high, medium, low
  },
  {
    id: "payable-1",
    type: "payable",
    company: "北京供应商贸易有限公司",
    amount: 8750,
    dueDate: "2025-03-12",
    status: "pending",
    days: 2,
    priority: "high",
  },
  {
    id: "receivable-3",
    type: "receivable",
    company: "广州电子科技有限公司",
    amount: 5600,
    dueDate: "2025-03-11",
    status: "pending",
    days: 1,
    priority: "critical",
  },
  {
    id: "payable-2",
    type: "payable",
    company: "深圳材料供应有限公司",
    amount: 3200,
    dueDate: "2025-03-14",
    status: "pending",
    days: 4,
    priority: "medium",
  },
  {
    id: "receivable-5",
    type: "receivable",
    company: "杭州网络科技有限公司",
    amount: 9800,
    dueDate: "2025-03-13",
    status: "pending",
    days: 3,
    priority: "high",
  },
]

export function UpcomingTransactions() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS)

  // 从本地存储加载数据
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions")
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  // 保存数据到本地存储
  const saveTransactions = (updatedTransactions: typeof MOCK_TRANSACTIONS) => {
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions))
    setTransactions(updatedTransactions)
  }

  const handleMarkComplete = (id: string) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === id ? { ...transaction, status: "completed" } : transaction,
    )

    saveTransactions(updatedTransactions)

    // 同步更新应收/应付数据
    const [type, itemId] = id.split("-")

    if (type === "receivable") {
      const receivableData = JSON.parse(localStorage.getItem("receivableData") || "[]")
      const updatedReceivableData = receivableData.map((item: any) =>
        item.id === Number(itemId) ? { ...item, status: "completed" } : item,
      )
      localStorage.setItem("receivableData", JSON.stringify(updatedReceivableData))
    } else if (type === "payable") {
      const payableData = JSON.parse(localStorage.getItem("payableData") || "[]")
      const updatedPayableData = payableData.map((item: any) =>
        item.id === Number(itemId) ? { ...item, status: "completed" } : item,
      )
      localStorage.setItem("payableData", JSON.stringify(updatedPayableData))
    }

    // 显示成功提示
    toast({
      title: "操作成功",
      description: "事务已标记为已完成，数据已保存",
    })
  }

  // 按到期日期排序，并且只显示待处理的事务
  const sortedTransactions = [...transactions]
    .filter((t) => t.status === "pending")
    .sort((a, b) => {
      // 首先按优先级排序
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 4
      const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 4

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      // 然后按到期日期排序
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

  return (
    <div className="space-y-4">
      {sortedTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <CheckCircle2 className="h-12 w-12 mb-2 text-green-500" />
          <p>所有事务已处理完成</p>
        </div>
      ) : (
        <>
          {sortedTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              className={`overflow-hidden transition-all hover:shadow-md ${getPriorityBgColor(transaction.priority)}`}
            >
              <CardContent className="p-0">
                <div className={`flex items-center border-l-4 ${getPriorityBorderColor(transaction.priority)} p-4`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{transaction.company}</h3>
                      <Badge variant={transaction.type === "receivable" ? "default" : "secondary"}>
                        {transaction.type === "receivable" ? "应收" : "应付"}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(transaction.priority)}>
                        {getPriorityText(transaction.priority)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>¥{transaction.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{transaction.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>剩余 {transaction.days} 天</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleMarkComplete(transaction.id)} className="ml-4">
                    标记完成
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-end mt-2">
            <Link href="/data-management">
              <Button variant="outline" size="sm">
                管理所有数据
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

