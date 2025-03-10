"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Download, FileSpreadsheet, Upload, FolderOpen, Check } from "lucide-react"
import * as XLSX from "xlsx"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExcelTemplateGuide } from "@/components/excel-template-guide"
import { toast } from "@/hooks/use-toast"

export default function ImportPage() {
  const [receivableData, setReceivableData] = useState<any[]>([])
  const [payableData, setPayableData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"upload" | "template" | "receivable" | "payable">("upload")
  const [fileName, setFileName] = useState<string>("")
  const [filePath, setFilePath] = useState<string>("")
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Load saved file path from localStorage on component mount
  useEffect(() => {
    const savedFilePath = localStorage.getItem("lastExcelFilePath")
    if (savedFilePath) {
      setFilePath(savedFilePath)
      // Automatically load the file if path exists
      // handleFilePathLoad(savedFilePath)
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })

        // 读取应收账款表（第一个sheet或指定名称的sheet）
        const receivableSheetName =
          workbook.SheetNames.find(
            (name) => name.includes("应收") || name.includes("receivable") || name === "Sheet1",
          ) || workbook.SheetNames[0]
        const receivableWorksheet = workbook.Sheets[receivableSheetName]
        const receivableJson = XLSX.utils.sheet_to_json(receivableWorksheet)

        // 读取应付账款表（第二个sheet或指定名称的sheet）
        const payableSheetName =
          workbook.SheetNames.find((name) => name.includes("应付") || name.includes("payable") || name === "Sheet2") ||
          (workbook.SheetNames.length > 1 ? workbook.SheetNames[1] : null)

        let payableJson: any[] = []
        if (payableSheetName) {
          const payableWorksheet = workbook.Sheets[payableSheetName]
          payableJson = XLSX.utils.sheet_to_json(payableWorksheet)
        }

        setReceivableData(receivableJson)
        setPayableData(payableJson)
        setImportStatus("success")
        setActiveTab("receivable") // 自动切换到应收账款标签页

        // Save file path to localStorage
        console.log(file)
        localStorage.setItem("lastExcelFilePath", file.name)
        setFilePath(file.name)

        // 保存数据到localStorage
        saveImportedData(receivableJson, payableJson)

        toast({
          title: "导入成功",
          description: `已成功导入Excel文件，包含${receivableJson.length}条应收账款和${payableJson.length}条应付账款记录`,
        })
      } catch (error) {
        console.error("Error parsing Excel file:", error)
        setImportStatus("error")
        toast({
          title: "导入失败",
          description: "解析Excel文件时发生错误，请确保文件格式正确",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    reader.readAsBinaryString(file)
  }

  const handleFilePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilePath(e.target.value)
  }

  const handleFilePathLoad = async (path: string = filePath) => {
    if (!path) return

    setIsLoading(true)
    setImportStatus("idle")

    try {
      // 在实际应用中，这里应该使用服务器操作或API路由来读取指定路径的文件
      // 对于这个演示，我们模拟加载文件

      // 模拟文件加载延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟应收账款数据
      const mockReceivableData = [
        {
          客户名称: "上海科技有限公司",
          合同编号: "HT2025001",
          应收金额: 12500,
          开票日期: "2025-02-15",
          到期日期: "2025-03-15",
          联系人: "张三",
          联系电话: "13800138000",
          状态: "pending",
          备注: "首期款项",
        },
        {
          客户名称: "北京网络科技有限公司",
          合同编号: "HT2025002",
          应收金额: 8750,
          开票日期: "2025-02-20",
          到期日期: "2025-03-20",
          联系人: "李四",
          联系电话: "13900139000",
          状态: "pending",
          备注: "服务费",
        },
        {
          客户名称: "广州电子有限公司",
          合同编号: "HT2025003",
          应收金额: 15600,
          开票日期: "2025-02-25",
          到期日期: "2025-03-25",
          联系人: "王五",
          联系电话: "13700137000",
          状态: "completed",
          备注: "设备款",
        },
      ]

      // 模拟应付账款数据
      const mockPayableData = [
        {
          供应商名称: "北京供应商贸易有限公司",
          采购单号: "CG2025001",
          应付金额: 8750,
          发票日期: "2025-02-10",
          付款截止日: "2025-03-12",
          付款方式: "银行转账",
          联系人: "赵六",
          状态: "pending",
          备注: "原材料采购",
        },
        {
          供应商名称: "深圳材料供应有限公司",
          采购单号: "CG2025002",
          应付金额: 3200,
          发票日期: "2025-02-14",
          付款截止日: "2025-03-14",
          付款方式: "银行转账",
          联系人: "钱七",
          状态: "pending",
          备注: "办公用品",
        },
        {
          供应商名称: "成都物流有限公司",
          采购单号: "CG2025003",
          应付金额: 5600,
          发票日期: "2025-02-05",
          付款截止日: "2025-03-05",
          付款方式: "支票",
          联系人: "孙八",
          状态: "completed",
          备注: "物流费用",
        },
      ]

      setReceivableData(mockReceivableData)
      setPayableData(mockPayableData)
      setFileName(path.split("\\").pop() || path)
      setImportStatus("success")
      setActiveTab("receivable") // 自动切换到应收账款标签页

      // 保存到localStorage
      localStorage.setItem("lastExcelFilePath", path)
      saveImportedData(mockReceivableData, mockPayableData)

      toast({
        title: "导入成功",
        description: `已成功导入Excel文件，包含${mockReceivableData.length}条应收账款和${mockPayableData.length}条应付账款记录`,
      })
    } catch (error) {
      console.error("Error loading file:", error)
      setImportStatus("error")
      toast({
        title: "导入失败",
        description: "加载文件时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 将导入的数据转换为系统内部使用的格式并保存
  const saveImportedData = (receivableData: any[], payableData: any[]) => {
    // 转换应收账款数据
    const formattedReceivableData = receivableData.map((item, index) => {
      // 根据Excel中的字段名进行映射
      return {
        id: index + 1,
        customerName: item.客户名称 || item.customerName || "",
        contractNumber: item.合同编号 || item.contractNumber || "",
        amount: Number(item.应收金额 || item.amount || 0),
        invoiceDate: item.开票日期 || item.invoiceDate || "",
        dueDate: item.到期日期 || item.dueDate || "",
        contact: item.联系人 || item.contact || "",
        phone: item.联系电话 || item.phone || "",
        status: item.状态 || item.status || "pending",
        notes: item.备注 || item.notes || "",
      }
    })

    // 转换应付账款数据
    const formattedPayableData = payableData.map((item, index) => {
      return {
        id: index + 1,
        supplierName: item.供应商名称 || item.supplierName || "",
        purchaseOrder: item.采购单号 || item.purchaseOrder || "",
        amount: Number(item.应付金额 || item.amount || 0),
        invoiceDate: item.发票日期 || item.invoiceDate || "",
        dueDate: item.付款截止日 || item.dueDate || "",
        paymentMethod: item.付款方式 || item.paymentMethod || "",
        contact: item.联系人 || item.contact || "",
        status: item.状态 || item.status || "pending",
        notes: item.备注 || item.notes || "",
      }
    })

    // 保存到localStorage
    localStorage.setItem("receivableData", JSON.stringify(formattedReceivableData))
    localStorage.setItem("payableData", JSON.stringify(formattedPayableData))

    // 同时更新事务数据，确保待处理事务组件能够获取最新数据
    const transactions = [
      ...formattedReceivableData.map((item) => ({
        id: `receivable-${item.id}`,
        type: "receivable",
        company: item.customerName,
        amount: item.amount,
        dueDate: item.dueDate,
        status: item.status,
        days: Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        priority: getDaysPriority(item.dueDate),
      })),
      ...formattedPayableData.map((item) => ({
        id: `payable-${item.id}`,
        type: "payable",
        company: item.supplierName,
        amount: item.amount,
        dueDate: item.dueDate,
        status: item.status,
        days: Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        priority: getDaysPriority(item.dueDate),
      })),
    ]

    localStorage.setItem("transactions", JSON.stringify(transactions))
  }

  // 根据到期日期计算优先级
  const getDaysPriority = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    if (days <= 1) return "critical"
    if (days <= 3) return "high"
    if (days <= 7) return "medium"
    return "low"
  }

  const downloadTemplateFile = () => {
    // 创建一个新的工作簿
    const wb = XLSX.utils.book_new()

    // 创建应收账款表格数据
    const receivableData = [
      ["客户名称", "合同编号", "应收金额", "开票日期", "到期日期", "联系人", "联系电话", "状态", "备注"],
      [
        "上海科技有限公司",
        "HT2025001",
        12500,
        "2025-02-15",
        "2025-03-15",
        "张三",
        "13800138000",
        "pending",
        "首期款项",
      ],
      [
        "北京网络科技有限公司",
        "HT2025002",
        8750,
        "2025-02-20",
        "2025-03-20",
        "李四",
        "13900139000",
        "pending",
        "服务费",
      ],
    ]

    // 创建应付账款表格数据
    const payableData = [
      ["供应商名称", "采购单号", "应付金额", "发票日期", "付款截止日", "付款方式", "联系人", "状态", "备注"],
      [
        "北京供应商贸易有限公司",
        "CG2025001",
        8750,
        "2025-02-10",
        "2025-03-12",
        "银行转账",
        "赵六",
        "pending",
        "原材料采购",
      ],
      [
        "深圳材料供应有限公司",
        "CG2025002",
        3200,
        "2025-02-14",
        "2025-03-14",
        "银行转账",
        "钱七",
        "pending",
        "办公用品",
      ],
    ]

    // 将数据转换为工作表
    const receivableWs = XLSX.utils.aoa_to_sheet(receivableData)
    const payableWs = XLSX.utils.aoa_to_sheet(payableData)

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, receivableWs, "应收账款")
    XLSX.utils.book_append_sheet(wb, payableWs, "应付账款")

    // 生成Excel文件并下载 - 使用浏览器兼容的方式
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" })

    // 将二进制字符串转换为ArrayBuffer
    function s2ab(s: string) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff
      }
      return buf
    }

    // 创建Blob对象
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" })

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "财务应收应付管理系统模板.xlsx"
    document.body.appendChild(a)
    a.click()

    // 清理
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 0)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileSpreadsheet className="h-6 w-6" />
          <span>财务应收应付管理系统</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload">上传数据</TabsTrigger>
            <TabsTrigger value="template">模板说明</TabsTrigger>
            {importStatus === "success" && (
              <>
                <TabsTrigger value="receivable">应收账款</TabsTrigger>
                <TabsTrigger value="payable">应付账款</TabsTrigger>
              </>
            )}
          </TabsList>
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>导入Excel数据</CardTitle>
                <CardDescription>上传Excel文件或指定本地文件路径以导入应收应付款项数据</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 文件路径输入 */}
                {/* <div className="space-y-2">
                  <Label htmlFor="file-path">Excel文件路径</Label>
                  <div className="flex gap-2">
                    <Input
                      id="file-path"
                      value={filePath}
                      onChange={handleFilePathChange}
                      placeholder="输入本地Excel文件路径，例如：C:\财务数据\财务管理.xlsx"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleFilePathLoad()}
                      disabled={!filePath || isLoading}
                      className="whitespace-nowrap"
                    >
                      {isLoading ? "加载中..." : "读取文件"}
                      <FolderOpen className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">系统会记住上次导入的文件路径，下次进入时自动加载</p>
                </div> */}

                {/* <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">或者</span>
                  </div>
                </div> */}

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center">
                  <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-1">拖放Excel文件或点击上传</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    支持 .xlsx 和 .xls 格式文件，包含应收应付账款两个工作表
                  </p>
                  <div className="flex gap-4">
                    <Button asChild disabled={isLoading}>
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        {isLoading ? "上传中..." : "选择文件"}
                        <input
                          type="file"
                          className="hidden"
                          accept=".xlsx,.xls"
                          onChange={handleFileUpload}
                          disabled={isLoading}
                        />
                      </label>
                    </Button>
                    <Button variant="outline" onClick={downloadTemplateFile}>
                      <Download className="h-4 w-4 mr-2" />
                      下载模板
                    </Button>
                  </div>
                </div>

                {importStatus === "success" && (
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">导入成功</AlertTitle>
                    <AlertDescription className="text-green-700">
                      已成功导入文件 {fileName}，包含 {receivableData.length} 条应收账款和 {payableData.length}{" "}
                      条应付账款记录。
                    </AlertDescription>
                  </Alert>
                )}

                {importStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertTitle>导入失败</AlertTitle>
                    <AlertDescription>导入文件时发生错误，请确保使用正确的模板格式。</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">取消</Link>
                </Button>
                <Link href="/data-management">
                  <Button disabled={importStatus !== "success"}>管理数据</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="template" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Excel模板说明</CardTitle>
                <CardDescription>使用标准模板格式导入数据，确保数据正确导入系统</CardDescription>
              </CardHeader>
              <CardContent>
                <ExcelTemplateGuide />
              </CardContent>
              <CardFooter>
                <Button onClick={downloadTemplateFile}>
                  <Download className="h-4 w-4 mr-2" />
                  下载模板
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="receivable" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>应收账款数据预览</CardTitle>
                <CardDescription>从Excel文件"应收账款"工作表导入的数据</CardDescription>
              </CardHeader>
              <CardContent>
                {receivableData.length > 0 ? (
                  <div className="rounded-md border overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(receivableData[0]).map((key) => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {receivableData.map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((value, i) => (
                              <TableCell key={i}>{String(value)}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">没有应收账款数据</div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("upload")}>
                  返回
                </Button>
                <Link href="/data-management">
                  <Button>管理数据</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="payable" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>应付账款数据预览</CardTitle>
                <CardDescription>从Excel文件"应付账款"工作表导入的数据</CardDescription>
              </CardHeader>
              <CardContent>
                {payableData.length > 0 ? (
                  <div className="rounded-md border overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(payableData[0]).map((key) => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payableData.map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((value, i) => (
                              <TableCell key={i}>{String(value)}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">没有应付账款数据</div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("upload")}>
                  返回
                </Button>
                <Link href="/data-management">
                  <Button>管理数据</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

