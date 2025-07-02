<script setup lang="ts">
import { ref, watch, computed, nextTick, createApp, h } from 'vue'
import { storeToRefs } from 'pinia'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'
import { useSummaryStore } from '@/stores/summary'
import { useCollectionStore } from '@/stores/collections'
import { useExpenseStore } from '@/stores/expense'
import { useStaffStore } from '@/stores/staff'
import { useSalaryStore } from '@/stores/salary'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import PdfPreviewDialog from '@/components/PdfPreviewDialog.vue'
import ReportTemplate from '@/components/ReportTemplate.vue'

const summaryStore = useSummaryStore()
const collectionStore = useCollectionStore()
const expenseStore = useExpenseStore()
const staffStore = useStaffStore()
const salaryStore = useSalaryStore()

const {
  totalCollection,
  totalExpenses,
  totalSalary,
  finalBalance,
  productSales,
  expensesByCategory,
  loading,
} = storeToRefs(summaryStore)

const { collections } = storeToRefs(collectionStore)
const { expenses, categories } = storeToRefs(expenseStore)
const { staffList: staff } = storeToRefs(staffStore)
const { salaries } = storeToRefs(salaryStore)

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
const months = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, 'label': 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
]

const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth())

const isGeneratingPdf = ref(false)
const pdfUrl = ref<string | null>(null)
const showPdfPreview = ref(false)

watch([selectedYear, selectedMonth], () => {
  summaryStore.fetchSummaryData(selectedYear.value, selectedMonth.value)
}, { immediate: true })

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
  }).format(value)
}

const productSalesInput = computed({
  get: () => productSales.value,
  set: (value) => {
    productSales.value = Number(value) || 0
  },
})

async function generateReport() {
  isGeneratingPdf.value = true
  showPdfPreview.value = true
  pdfUrl.value = null

  // Ensure all data is fetched
  await staffStore.fetchAllStaff()
  await nextTick()

  const reportContainer = document.createElement('div')
  reportContainer.style.position = 'absolute'
  reportContainer.style.left = '-9999px'
  reportContainer.style.top = '-9999px'
  reportContainer.style.width = '1024px'
  document.body.appendChild(reportContainer)

  const reportProps = {
    collections: collections.value,
    expenses: expenses.value,
    salaries: salaries.value,
    staff: staff.value,
    categories: categories.value,
    productSales: productSales.value,
    totalCollection: totalCollection.value,
    totalExpenses: totalExpenses.value,
    totalSalary: totalSalary.value,
    finalBalance: finalBalance.value,
    selectedMonth: selectedMonth.value,
    selectedYear: selectedYear.value,
  };

  const app = createApp({
    render: () => h(ReportTemplate, reportProps)
  });
  app.mount(reportContainer);


  await nextTick()

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const elements = reportContainer.querySelectorAll('.table-no-break');
    let yPosition = 10;

    for (const element of Array.from(elements)) {
      const canvas = await html2canvas(element as HTMLElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      if (yPosition + imgHeight > pdfHeight - 15) { // Check if it fits, with margin
        pdf.addPage();
        yPosition = 10; // Reset for new page
      }
      pdf.addImage(imgData, 'PNG', 5, yPosition, pdfWidth - 10, imgHeight);
      yPosition += imgHeight + 5; // Move to next position
    }

    const blob = pdf.output('blob');
    pdfUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating PDF:', error)
  } finally {
    isGeneratingPdf.value = false
    document.body.removeChild(reportContainer)
    app.unmount();
  }
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Monthly Summary</h1>
      <div class="flex items-center space-x-4">
        <Select v-model="selectedMonth">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Months</SelectLabel>
              <SelectItem v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select v-model="selectedYear">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Years</SelectLabel>
              <SelectItem v-for="year in years" :key="year" :value="year">
                {{ year }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button @click="generateReport" :disabled="isGeneratingPdf">
          {{ isGeneratingPdf ? 'Generating...' : 'Generate Report' }}
        </Button>
      </div>
    </div>

    <div v-if="loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <Skeleton class="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton class="h-8 w-1/2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton class="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton class="h-8 w-1/2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton class="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton class="h-8 w-1/2" />
        </CardContent>
      </Card>
      <Card class="col-span-full">
        <CardHeader>
          <Skeleton class="h-6 w-1/4 mb-2" />
          <Skeleton class="h-4 w-1/3" />
        </CardHeader>
        <CardContent class="grid gap-4 md:grid-cols-2">
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
        </CardContent>
      </Card>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <!-- Top Level Cards -->
      <Card>
        <CardHeader>
          <CardTitle>Total Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold text-green-500">{{ formatCurrency(totalCollection) }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Salary (50%)</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold text-orange-500">{{ formatCurrency(totalSalary) }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold text-red-500">{{ formatCurrency(totalExpenses) }}</p>
        </CardContent>
      </Card>
      <Card :class="finalBalance >= 0 ? 'border-green-500' : 'border-red-500'">
        <CardHeader>
          <CardTitle>Final Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold" :class="finalBalance >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ formatCurrency(finalBalance) }}
          </p>
        </CardContent>
      </Card>

      <!-- Detailed Info Card -->
      <Card class="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Financial Details</CardTitle>
          <CardDescription>
            Breakdown of income and expenses for the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6 md:grid-cols-2">
          <!-- Left Side: Product Sales & Calculation -->
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="product-sales">Additional Income (Product Sales)</Label>
              <Input id="product-sales" type="number" placeholder="Enter amount from product sales"
                v-model="productSalesInput" />
              <p class="text-xs text-muted-foreground">
                Enter any extra income, like product sales, for this month.
              </p>
            </div>

            <div class="space-y-2 rounded-lg border p-4">
              <h3 class="font-semibold">Calculation</h3>
              <div class="flex justify-between items-center text-sm">
                <span class="text-muted-foreground">Total Collection</span>
                <span class="font-medium text-green-500">+ {{ formatCurrency(totalCollection) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-muted-foreground">Product Sales</span>
                <span class="font-medium text-green-500">+ {{ formatCurrency(productSales) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-muted-foreground">Total Salary</span>
                <span class="font-medium text-red-500">- {{ formatCurrency(totalSalary) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-muted-foreground">Total Expenses</span>
                <span class="font-medium text-red-500">- {{ formatCurrency(totalExpenses) }}</span>
              </div>
              <div class="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
                <span>Final Balance</span>
                <span :class="finalBalance >= 0 ? 'text-green-500' : 'text-red-500'">{{ formatCurrency(finalBalance)
                  }}</span>
              </div>
            </div>
          </div>

          <!-- Right Side: Expenses by Category -->
          <div class="space-y-2">
            <h3 class="font-semibold">Expenses by Category</h3>
            <div class="space-y-2 rounded-lg border p-4">
              <div v-if="expensesByCategory.length === 0" class="text-center text-muted-foreground py-4">
                No expenses recorded for this month.
              </div>
              <div v-else v-for="cat in expensesByCategory" :key="cat.name"
                class="flex justify-between items-center text-sm">
                <span class="text-muted-foreground">{{ cat.name }}</span>
                <span class="font-medium">{{ formatCurrency(cat.total) }}</span>
              </div>
              <div class="flex justify-between items-center text-base font-semibold border-t pt-2 mt-2">
                <span>Total Expenses</span>
                <span>{{ formatCurrency(totalExpenses) }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <PdfPreviewDialog v-model="showPdfPreview" :pdf-url="pdfUrl"
      :title="`Financial_Report_${selectedYear}_${selectedMonth + 1}`" />
  </div>
</template>