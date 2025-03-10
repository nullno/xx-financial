"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 模拟数据 - 在实际应用中应从Excel导入
const MONTHLY_DATA = [
  { month: "1月", receivable: 42000, payable: 35000 },
  { month: "2月", receivable: 38000, payable: 32000 },
  { month: "3月", receivable: 45000, payable: 38000 },
  { month: "4月", receivable: 40000, payable: 30000 },
  { month: "5月", receivable: 35000, payable: 28000 },
  { month: "6月", receivable: 48000, payable: 42000 },
]

const QUARTERLY_DATA = [
  { quarter: "Q1", receivable: 125000, payable: 105000 },
  { quarter: "Q2", receivable: 123000, payable: 100000 },
  { quarter: "Q3", receivable: 130000, payable: 110000 },
  { quarter: "Q4", receivable: 140000, payable: 120000 },
]

// 自定义工具提示组件
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const receivable = payload[0].value
    const payable = payload[1].value
    const netAmount = receivable - payable

    return (
      <div className="bg-white p-3 border rounded shadow-sm text-xs">
        <p className="font-medium mb-1">{label}</p>
        <p className="text-blue-600">应收: ¥{receivable.toLocaleString()}</p>
        <p className="text-orange-500">应付: ¥{payable.toLocaleString()}</p>
        <p className={`font-medium mt-1 ${netAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
          净额: ¥{netAmount.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export function FinancialCharts() {
  const [timeframe, setTimeframe] = useState("monthly")

  return (
    <div className="space-y-4">
      <Tabs value={timeframe} onValueChange={setTimeframe}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monthly">月度</TabsTrigger>
          <TabsTrigger value="quarterly">季度</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">月度财务数据</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `¥${value / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="receivable" name="应收" fill="#3b82f6" />
                    <Bar dataKey="payable" name="应付" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quarterly">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">季度财务数据</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={QUARTERLY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis tickFormatter={(value) => `¥${value / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="receivable" name="应收" fill="#3b82f6" />
                    <Bar dataKey="payable" name="应付" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

