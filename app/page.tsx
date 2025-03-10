import { Suspense } from "react"
import Link from "next/link"
import { ArrowUpDown, BarChart3, FileSpreadsheet, PlusCircle, Settings, Database } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpcomingTransactions } from "@/components/upcoming-transactions"
import { FinancialSummary } from "@/components/financial-summary"
import { RecentActivity } from "@/components/recent-activity"
import { FinancialCharts } from "@/components/financial-charts"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileSpreadsheet className="h-6 w-6" />
          <span>财务应收应付管理系统</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Link href="/import">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>导入数据</span>
            </Button>
          </Link>
          <Link href="/data-management">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Database className="h-4 w-4" />
              <span>数据管理</span>
            </Button>
          </Link>
          {/* <Link href="/settings">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
              <span className="sr-only">设置</span>
            </Button>
          </Link> */}
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">应收总额</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥45,231.89</div>
              <p className="text-xs text-muted-foreground">
                较上月 <span className="text-green-500">+20.1%</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">应付总额</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥23,456.78</div>
              <p className="text-xs text-muted-foreground">
                较上月 <span className="text-red-500">+5.4%</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">本月收款</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥12,234.56</div>
              <p className="text-xs text-muted-foreground">
                较上月 <span className="text-green-500">+12.3%</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">本月付款</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥8,765.43</div>
              <p className="text-xs text-muted-foreground">
                较上月 <span className="text-red-500">+7.8%</span>
              </p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          {/* <TabsList>
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="receivable">应收账款</TabsTrigger>
            <TabsTrigger value="payable">应付账款</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
          </TabsList> */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>临近待处理事务</CardTitle>
                  <CardDescription>
                    显示未来7天内需要处理的应收应付款项
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <UpcomingTransactions />
                  </Suspense>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>财务概览</CardTitle>
                  <CardDescription>
                    应收应付款项汇总
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <FinancialSummary />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>近期活动</CardTitle>
                  <CardDescription>
                    最近的财务活动记录
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <RecentActivity />
                  </Suspense>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>财务图表</CardTitle>
                  <CardDescription>
                    应收应付款项统计图表
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <FinancialCharts />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="receivable" className="space-y-4">
            {/* 应收账款详情将在这里显示 */}
          </TabsContent>
          <TabsContent value="payable" className="space-y-4">
            {/* 应付账款详情将在这里显示 */}
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            {/* 数据分析将在这里显示 */}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

