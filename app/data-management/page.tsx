"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, FileSpreadsheet, Plus, Pencil, Trash2, Save, X, Download } from "lucide-react"
import * as XLSX from "xlsx"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 模拟从Excel导入的数据
const INITIAL_RECEIVABLE_DATA = [
  {
    id: 1,
    customerName: "上海科技有限公司",
    contractNumber: "HT2025001",
    amount: 12500,
    invoiceDate: "2025-02-15",
    dueDate: "2025-03-15",
    contact: "张三",
    phone: "13800138000",
    status: "pending",
    notes: "首期款项",
  },
  {
    id: 2,
    customerName: "北京网络科技有限公司",
    contractNumber: "HT2025002",
    amount: 8750,
    invoiceDate: "2025-02-20",
    dueDate: "2025-03-20",
    contact: "李四",
    phone: "13900139000",
    status: "pending",
    notes: "服务费",
  },
  {
    id: 3,
    customerName: "广州电子有限公司",
    contractNumber: "HT2025003",
    amount: 15600,
    invoiceDate: "2025-02-25",
    dueDate: "2025-03-25",
    contact: "王五",
    phone: "13700137000",
    status: "completed",
    notes: "设备款",
  },
]

const INITIAL_PAYABLE_DATA = [
  {
    id: 1,
    supplierName: "北京供应商贸易有限公司",
    purchaseOrder: "CG2025001",
    amount: 8750,
    invoiceDate: "2025-02-10",
    dueDate: "2025-03-12",
    paymentMethod: "银行转账",
    contact: "赵六",
    status: "pending",
    notes: "原材料采购",
  },
  {
    id: 2,
    supplierName: "深圳材料供应有限公司",
    purchaseOrder: "CG2025002",
    amount: 3200,
    invoiceDate: "2025-02-14",
    dueDate: "2025-03-14",
    paymentMethod: "银行转账",
    contact: "钱七",
    status: "pending",
    notes: "办公用品",
  },
  {
    id: 3,
    supplierName: "成都物流有限公司",
    purchaseOrder: "CG2025003",
    amount: 5600,
    invoiceDate: "2025-02-05",
    dueDate: "2025-03-05",
    paymentMethod: "支票",
    contact: "孙八",
    status: "completed",
    notes: "物流费用",
  },
]

export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState("receivable")
  const [receivableData, setReceivableData] = useState(INITIAL_RECEIVABLE_DATA)
  const [payableData, setPayableData] = useState(INITIAL_PAYABLE_DATA)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [lastExcelFilePath, setLastExcelFilePath] = useState("")

  // 从本地存储加载数据
  useEffect(() => {
    const savedReceivableData = localStorage.getItem("receivableData")
    const savedPayableData = localStorage.getItem("payableData")
    const savedFilePath = localStorage.getItem("lastExcelFilePath")

    if (savedReceivableData) {
      setReceivableData(JSON.parse(savedReceivableData))
    }

    if (savedPayableData) {
      setPayableData(JSON.parse(savedPayableData))
    }

    if (savedFilePath) {
      setLastExcelFilePath(savedFilePath)
    }
  }, [])

  // 保存数据到本地存储
  const saveDataToStorage = (receivable: any[], payable: any[]) => {
    localStorage.setItem("receivableData", JSON.stringify(receivable))
    localStorage.setItem("payableData", JSON.stringify(payable))

    // 同时更新事务数据，确保待处理事务组件能够获取最新数据
    const transactions = [
      ...receivable.map((item) => ({
        id: `receivable-${item.id}`,
        type: "receivable",
        company: item.customerName,
        amount: item.amount,
        dueDate: item.dueDate,
        status: item.status,
        days: Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        priority: getDaysPriority(item.dueDate),
      })),
      ...payable.map((item) => ({
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

  // 添加新记录
  const handleAddItem = (formData: any) => {
    if (activeTab === "receivable") {
      const newId = receivableData.length > 0 ? Math.max(...receivableData.map((item) => item.id)) + 1 : 1
      const newItem = { ...formData, id: newId, status: "pending" }
      const updatedData = [...receivableData, newItem]
      setReceivableData(updatedData)
      saveDataToStorage(updatedData, payableData)
    } else {
      const newId = payableData.length > 0 ? Math.max(...payableData.map((item) => item.id)) + 1 : 1
      const newItem = { ...formData, id: newId, status: "pending" }
      const updatedData = [...payableData, newItem]
      setPayableData(updatedData)
      saveDataToStorage(receivableData, updatedData)
    }

    setIsAddDialogOpen(false)
    toast({
      title: "添加成功",
      description: "新记录已添加并保存",
    })
  }

  // 更新记录
  const handleUpdateItem = (formData: any) => {
    if (activeTab === "receivable") {
      const updatedData = receivableData.map((item) =>
        item.id === editingItem.id ? { ...formData, id: item.id } : item,
      )
      setReceivableData(updatedData)
      saveDataToStorage(updatedData, payableData)
    } else {
      const updatedData = payableData.map((item) => (item.id === editingItem.id ? { ...formData, id: item.id } : item))
      setPayableData(updatedData)
      saveDataToStorage(receivableData, updatedData)
    }

    setIsEditDialogOpen(false)
    setEditingItem(null)
    toast({
      title: "更新成功",
      description: "记录已更新并保存",
    })
  }

  // 删除记录
  const handleDeleteItem = (id: number) => {
    if (activeTab === "receivable") {
      const updatedData = receivableData.filter((item) => item.id !== id)
      setReceivableData(updatedData)
      saveDataToStorage(updatedData, payableData)
    } else {
      const updatedData = payableData.filter((item) => item.id !== id)
      setPayableData(updatedData)
      saveDataToStorage(receivableData, updatedData)
    }

    toast({
      title: "删除成功",
      description: "记录已删除",
    })
  }

  // 标记完成/未完成
  const handleToggleStatus = (id: number) => {
    if (activeTab === "receivable") {
      const updatedData = receivableData.map((item) =>
        item.id === id ? { ...item, status: item.status === "pending" ? "completed" : "pending" } : item,
      )
      setReceivableData(updatedData)
      saveDataToStorage(updatedData, payableData)
    } else {
      const updatedData = payableData.map((item) =>
        item.id === id ? { ...item, status: item.status === "pending" ? "completed" : "pending" } : item,
      )
      setPayableData(updatedData)
      saveDataToStorage(receivableData, updatedData)
    }

    toast({
      title: "状态已更新",
      description: "记录状态已更新并保存",
    })
  }

  // 根据状态筛选数据
  const getFilteredData = () => {
    if (activeTab === "receivable") {
      if (statusFilter === "all") return receivableData
      return receivableData.filter((item) => item.status === statusFilter)
    } else {
      if (statusFilter === "all") return payableData
      return payableData.filter((item) => item.status === statusFilter)
    }
  }

  // 打开编辑对话框
  const openEditDialog = (item: any) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  // 导出数据到Excel
  const exportToExcel = () => {
    // 创建一个新的工作簿
    const wb = XLSX.utils.book_new()

    // 准备应收账款数据
    const receivableExportData = receivableData.map((item) => ({
      客户名称: item.customerName,
      合同编号: item.contractNumber,
      应收金额: item.amount,
      开票日期: item.invoiceDate,
      到期日期: item.dueDate,
      联系人: item.contact,
      联系电话: item.phone,
      状态: item.status,
      备注: item.notes,
    }))

    // 准备应付账款数据
    const payableExportData = payableData.map((item) => ({
      供应商名称: item.supplierName,
      采购单号: item.purchaseOrder,
      应付金额: item.amount,
      发票日期: item.invoiceDate,
      付款截止日: item.dueDate,
      付款方式: item.paymentMethod,
      联系人: item.contact,
      状态: item.status,
      备注: item.notes,
    }))

    // 将数据转换为工作表
    const receivableWs = XLSX.utils.json_to_sheet(receivableExportData)
    const payableWs = XLSX.utils.json_to_sheet(payableExportData)

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
    a.download = "财务管理数据.xlsx"
    document.body.appendChild(a)
    a.click()

    // 清理
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 0)

    toast({
      title: "导出成功",
      description: "数据已成功导出到Excel文件",
    })
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">数据管理</h1>
            {lastExcelFilePath && <p className="text-sm text-muted-foreground">当前数据来源: {lastExcelFilePath}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportToExcel}>
              <Download className="h-4 w-4 mr-2" />
              导出Excel
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  新增记录
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>新增{activeTab === "receivable" ? "应收" : "应付"}记录</DialogTitle>
                  <DialogDescription>
                    添加新的{activeTab === "receivable" ? "应收" : "应付"}款项记录，所有带*的字段为必填项。
                  </DialogDescription>
                </DialogHeader>
                <AddEditForm type={activeTab} onSubmit={handleAddItem} onCancel={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="receivable">应收账款</TabsTrigger>
            <TabsTrigger value="payable">应付账款</TabsTrigger>
          </TabsList>
          <TabsContent value="receivable">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>应收账款管理</CardTitle>
                <CardDescription>管理所有应收账款记录，支持添加、编辑、删除和标记完成状态</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>客户名称</TableHead>
                        <TableHead>合同编号</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>开票日期</TableHead>
                        <TableHead>到期日期</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>备注</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredData().length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                            没有找到符合条件的记录
                          </TableCell>
                        </TableRow>
                      ) : (
                        getFilteredData().map((item) => (
                          <TableRow key={item.id} className={item.status === "completed" ? "bg-muted/50" : ""}>
                            <TableCell>{item.customerName}</TableCell>
                            <TableCell>{item.contractNumber}</TableCell>
                            <TableCell>¥{item.amount.toLocaleString()}</TableCell>
                            <TableCell>{item.invoiceDate}</TableCell>
                            <TableCell>{item.dueDate}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  item.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {item.status === "completed" ? "已完成" : "待处理"}
                              </span>
                            </TableCell>
                            <TableCell>{item.notes}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleToggleStatus(item.id)}
                                  title={item.status === "completed" ? "标记为未完成" : "标记为已完成"}
                                >
                                  {item.status === "completed" ? (
                                    <X className="h-4 w-4" />
                                  ) : (
                                    <Save className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-red-500"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payable">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>应付账款管理</CardTitle>
                <CardDescription>管理所有应付账款记录，支持添加、编辑、删除和标记完成状态</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>供应商名称</TableHead>
                        <TableHead>采购单号</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>发票日期</TableHead>
                        <TableHead>付款截止日</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>备注</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredData().length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                            没有找到符合条件的记录
                          </TableCell>
                        </TableRow>
                      ) : (
                        getFilteredData().map((item) => (
                          <TableRow key={item.id} className={item.status === "completed" ? "bg-muted/50" : ""}>
                            <TableCell>{item.supplierName}</TableCell>
                            <TableCell>{item.purchaseOrder}</TableCell>
                            <TableCell>¥{item.amount.toLocaleString()}</TableCell>
                            <TableCell>{item.invoiceDate}</TableCell>
                            <TableCell>{item.dueDate}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  item.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {item.status === "completed" ? "已完成" : "待处理"}
                              </span>
                            </TableCell>
                            <TableCell>{item.notes}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleToggleStatus(item.id)}
                                  title={item.status === "completed" ? "标记为未完成" : "标记为已完成"}
                                >
                                  {item.status === "completed" ? (
                                    <X className="h-4 w-4" />
                                  ) : (
                                    <Save className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-red-500"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 编辑对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>编辑{activeTab === "receivable" ? "应收" : "应付"}记录</DialogTitle>
              <DialogDescription>
                修改{activeTab === "receivable" ? "应收" : "应付"}款项记录，所有带*的字段为必填项。
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <AddEditForm
                type={activeTab}
                initialData={editingItem}
                onSubmit={handleUpdateItem}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setEditingItem(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

// 添加/编辑表单组件
function AddEditForm({
  type,
  initialData = null,
  onSubmit,
  onCancel,
}: {
  type: string
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const isReceivable = type === "receivable"
  const [formData, setFormData] = useState(
    initialData ||
      (isReceivable
        ? {
            customerName: "",
            contractNumber: "",
            amount: "",
            invoiceDate: "",
            dueDate: "",
            contact: "",
            phone: "",
            notes: "",
          }
        : {
            supplierName: "",
            purchaseOrder: "",
            amount: "",
            invoiceDate: "",
            dueDate: "",
            paymentMethod: "",
            contact: "",
            notes: "",
          }),
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 验证必填字段
    const requiredFields = isReceivable
      ? ["customerName", "contractNumber", "amount", "invoiceDate", "dueDate"]
      : ["supplierName", "purchaseOrder", "amount", "invoiceDate", "dueDate"]

    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      toast({
        title: "表单验证失败",
        description: "请填写所有必填字段",
        variant: "destructive",
      })
      return
    }

    // 验证金额是否为数字
    if (isNaN(Number(formData.amount))) {
      toast({
        title: "表单验证失败",
        description: "金额必须为数字",
        variant: "destructive",
      })
      return
    }

    // 提交表单数据
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {isReceivable ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="customerName">客户名称 *</Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="输入客户公司名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractNumber">合同编号 *</Label>
              <Input
                id="contractNumber"
                name="contractNumber"
                value={formData.contractNumber}
                onChange={handleChange}
                placeholder="输入合同或订单编号"
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="supplierName">供应商名称 *</Label>
              <Input
                id="supplierName"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleChange}
                placeholder="输入供应商公司名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseOrder">采购单号 *</Label>
              <Input
                id="purchaseOrder"
                name="purchaseOrder"
                value={formData.purchaseOrder}
                onChange={handleChange}
                placeholder="输入采购单号"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="amount">金额 *</Label>
          <Input
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="输入金额（数字）"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoiceDate">开票日期 *</Label>
          <Input id="invoiceDate" name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">到期日期 *</Label>
          <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
        </div>

        {!isReceivable && (
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">付款方式</Label>
            <Input
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              placeholder="如：银行转账、支票等"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="contact">联系人</Label>
          <Input
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="输入联系人姓名"
          />
        </div>

        {isReceivable && (
          <div className="space-y-2">
            <Label htmlFor="phone">联系电话</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="输入联系人电话"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">备注</Label>
        <Input id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="输入备注信息" />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">{initialData ? "保存修改" : "添加记录"}</Button>
      </DialogFooter>
    </form>
  )
}

