import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function ExcelTemplateGuide() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Excel模板使用说明</h3>
        <p className="text-sm text-muted-foreground">
          为确保数据正确导入，请按照以下模板格式准备您的Excel文件。系统支持应收账款和应付账款两种类型的数据导入，需要放在同一个Excel文件的不同工作表中。
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>重要提示</AlertTitle>
        <AlertDescription>
          请将应收账款和应付账款数据分别放在同一个Excel文件的两个不同工作表中，工作表名称分别为"应收账款"和"应付账款"。
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="receivable">
        <TabsList>
          <TabsTrigger value="receivable">应收账款工作表</TabsTrigger>
          <TabsTrigger value="payable">应付账款工作表</TabsTrigger>
          <TabsTrigger value="structure">文件结构</TabsTrigger>
        </TabsList>
        <TabsContent value="receivable" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>字段名</TableHead>
                  <TableHead>数据类型</TableHead>
                  <TableHead>必填</TableHead>
                  <TableHead>说明</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">客户名称</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>是</TableCell>
                  <TableCell>客户公司全称</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">合同编号</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>是</TableCell>
                  <TableCell>相关合同或订单编号</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">应收金额</TableCell>
                  <TableCell>数字</TableCell>
                  <TableCell>是</TableCell>
                  <TableCell>应收款项金额，不含货币符号</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">开票日期</TableCell>
                  <TableCell>日期</TableCell>
                  <TableCell>是</TableCell>
                  <TableCell>格式：YYYY-MM-DD</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">到期日期</TableCell>
                  <TableCell>日期</TableCell>
                  <TableCell>是</TableCell>
                  <TableCell>格式：YYYY-MM-DD</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">联系人</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>否</TableCell>
                  <TableCell>客户方联系人姓名</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">联系电话</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>否</TableCell>
                  <TableCell>联系人电话</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">状态</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>否</TableCell>
                  <TableCell>pending(待处理)或completed(已完成)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">备注</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>否</TableCell>
                  <TableCell>其他相关信息</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="payable" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>字段名</TableHead>
                  <TableHead>数据类型</TableHead>
                  <TableHead>必填</TableHead>
                  <TableHead>说明</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">供应商名称</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>是</TableCell>
                  <TableCell>供应商公司全称</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">采购单号</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>是</TableCell>
                  <TableCell>相关采购单或合同编号</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">应付金额</TableCell>
                  <TableCell>数字</TableCell>
                  <TableCell>是</TableCell>
                  <TableCell>应付款项金额，不含货币符号</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">发票日期</TableCell>
                  <TableCell>日期</TableCell>
                  <TableCell>是</TableCell>
                  <TableCell>格式：YYYY-MM-DD</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">付款截止日</TableCell>
                  <TableCell>日期</TableCell>
                  <TableCell>是</TableCell>
                  <TableCell>格式：YYYY-MM-DD</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">付款方式</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>否</TableCell>
                  <TableCell>如：银行转账、支票等</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">联系人</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>否</TableCell>
                  <TableCell>供应商联系人姓名</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">状态</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>否</TableCell>
                  <TableCell>pending(待处理)或completed(已完成)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">备注</TableCell>
                  <TableCell>文本</TableCell>
                  <TableCell>否</TableCell>
                  <TableCell>其他相关信息</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="structure" className="pt-4">
          <div className="space-y-4">
            <div className="rounded-md border p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Excel文件结构</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  一个Excel文件包含两个工作表：<strong>应收账款</strong>和<strong>应付账款</strong>
                </li>
                <li>第一个工作表命名为"应收账款"，包含所有应收账款记录</li>
                <li>第二个工作表命名为"应付账款"，包含所有应付账款记录</li>
                <li>每个工作表的第一行必须是字段名称，与上述模板一致</li>
                <li>系统会自动识别工作表名称，如果找不到指定名称的工作表，将使用第一个和第二个工作表</li>
              </ul>
            </div>

            <div className="rounded-md border p-4">
              <h4 className="font-medium mb-2">示例文件结构</h4>
              <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                财务管理.xlsx ├── 工作表1: "应收账款" │ ├── 第1行: 客户名称, 合同编号, 应收金额, 开票日期, 到期日期,
                联系人, 联系电话, 状态, 备注 │ ├── 第2行: 上海科技有限公司, HT2025001, 12500, 2025-02-15, 2025-03-15,
                张三, 13800138000, pending, 首期款项 │ └── 第3行: ... │ └── 工作表2: "应付账款" ├── 第1行: 供应商名称,
                采购单号, 应付金额, 发票日期, 付款截止日, 付款方式, 联系人, 状态, 备注 ├── 第2行:
                北京供应商贸易有限公司, CG2025001, 8750, 2025-02-10, 2025-03-12, 银行转账, 赵六, pending, 原材料采购 └──
                第3行: ...
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">导入注意事项</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Excel文件必须包含两个工作表，分别用于应收账款和应付账款</li>
          <li>每个工作表的第一行必须是字段名称，与上述模板一致</li>
          <li>日期格式必须为YYYY-MM-DD，如2025-03-15</li>
          <li>金额必须为数字，不要包含货币符号或千位分隔符</li>
          <li>状态字段可以是"pending"(待处理)或"completed"(已完成)，如果不填写则默认为"pending"</li>
          <li>文件大小不超过10MB</li>
          <li>每次导入会覆盖之前导入的数据，请确保数据完整</li>
          <li>导入后可以在数据管理页面进行编辑、删除和状态更新操作</li>
        </ul>
      </div>
    </div>
  )
}

