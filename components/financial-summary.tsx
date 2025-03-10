"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

// 模拟数据 - 在实际应用中应从API获取
const RECEIVABLE_DATA = [
  { name: "已逾期", value: 15000, color: "#ef4444" },
  { name: "本周到期", value: 25000, color: "#f97316" },
  { name: "下周到期", value: 18000, color: "#3b82f6" },
  { name: "未来到期", value: 42000, color: "#22c55e" },
]

const PAYABLE_DATA = [
  { name: "已逾期", value: 8000, color: "#ef4444" },
  { name: "本周到期", value: 12000, color: "#f97316" },
  { name: "下周到期", value: 15000, color: "#3b82f6" },
  { name: "未来到期", value: 30000, color: "#22c55e" },
]

// 自定义图例组件
const CustomLegend = ({ payload }: any) => {
  if (!payload || !Array.isArray(payload)) {
    return null
  }

  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs mt-2">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center">
          <span className="inline-block w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span>
            {entry.value}: ¥{RECEIVABLE_DATA.find((item) => item.name === entry.value)?.value.toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  )
}

// 自定义工具提示组件
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm text-xs">
        <p>{`${payload[0].name}: ¥${payload[0].value.toLocaleString()}`}</p>
      </div>
    )
  }
  return null
}

export function FinancialSummary() {
  // 计算总金额
  const totalReceivable = RECEIVABLE_DATA.reduce((sum, item) => sum + item.value, 0)
  const totalPayable = PAYABLE_DATA.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-2">应收款项分布 (总计: ¥{totalReceivable.toLocaleString()})</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RECEIVABLE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={70}
                  paddingAngle={0}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {RECEIVABLE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-2">应付款项分布 (总计: ¥{totalPayable.toLocaleString()})</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PAYABLE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={70}
                  paddingAngle={0}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {PAYABLE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  content={(props) => {
                    if (!props.payload || !Array.isArray(props.payload)) {
                      return null
                    }

                    return (
                      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs mt-2">
                        {props.payload.map((entry: any, index: number) => (
                          <li key={`item-${index}`} className="flex items-center">
                            <span
                              className="inline-block w-3 h-3 mr-1 rounded-sm"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span>
                              {entry.value}: ¥
                              {PAYABLE_DATA.find((item) => item.name === entry.value)?.value.toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )
                  }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

