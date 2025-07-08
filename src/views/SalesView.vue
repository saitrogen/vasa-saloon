<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductSaleStore } from '@/stores/productSales'
import { monthlyRecordService } from '@/services/monthlyRecordService'
import ProductSaleForm from '@/components/ProductSaleForm.vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableEmpty } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { ProductSale } from '@/types'

const productSaleStore = useProductSaleStore()
const { sales, loading } = storeToRefs(productSaleStore)

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
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
]
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth())

const showSaleForm = ref(false)
const selectedSale = ref<ProductSale | null>(null)

function openSaleForm(sale: ProductSale | null = null) {
  selectedSale.value = sale
  showSaleForm.value = true
}

async function handleSaveSale(formValues: any) {
  const monthlyRecord = await monthlyRecordService.getOrCreateMonthlyRecord(selectedYear.value, selectedMonth.value)
  let saleData = {
    ...formValues,
    amount: Number(formValues.amount),
    date: formValues.date instanceof Date ? formValues.date.toISOString().slice(0, 10) : formValues.date,
    monthly_record_id: monthlyRecord.id,
  }
  if (selectedSale.value) {
    saleData = { ...saleData, id: selectedSale.value.id }
    try {
      await productSaleStore.updateSale(selectedSale.value.id, saleData)
    } catch (e) {
      alert('Failed to update sale. Please try again.')
    }
  } else {
    try {
      await productSaleStore.addSale(saleData)
    } catch (e) {
      alert('Failed to add sale. Please try again.')
    }
  }
  showSaleForm.value = false
  selectedSale.value = null
}

async function handleDeleteSale(id: string) {
  if (confirm('Are you sure you want to delete this sale?')) {
    await productSaleStore.deleteSale(id)
  }
}

watch([selectedYear, selectedMonth], () => {
  productSaleStore.fetchSales(selectedYear.value, selectedMonth.value)
}, { immediate: true })

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
  }).format(value)
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Product Sales</h1>
      <div class="flex items-center space-x-4">
        <select v-model="selectedMonth" class="border rounded px-2 py-1">
          <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
        </select>
        <select v-model="selectedYear" class="border rounded px-2 py-1">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
        <Button @click="openSaleForm()">Add Sale</Button>
      </div>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Sales for {{ months[selectedMonth].label }} {{ selectedYear }}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Description</TableHead>
              <TableHead class="text-right">Amount</TableHead>
              <TableHead class="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="loading">
              <TableCell colspan="5" class="h-24 text-center">Loading...</TableCell>
            </TableRow>
            <TableEmpty v-else-if="!sales.length" :colspan="5">
              No product sales recorded for this month.
            </TableEmpty>
            <TableRow v-for="sale in sales" :key="sale.id">
              <TableCell>{{ new Date(sale.date).toLocaleDateString() }}</TableCell>
              <TableCell>{{ sale.name }}</TableCell>
              <TableCell>{{ sale.description }}</TableCell>
              <TableCell class="text-right">{{ formatCurrency(sale.amount) }}</TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" class="h-8 w-8" @click="openSaleForm(sale)">Edit</Button>
                  <Button variant="ghost" size="icon" class="h-8 w-8 text-red-500"
                    @click="handleDeleteSale(sale.id)">Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    <ProductSaleForm v-model="showSaleForm" :sale="selectedSale" @save="handleSaveSale" />
  </div>
</template>