<script setup lang="ts">
import type { DailyCollection, Expense, ExpenseCategory, Staff, Salary } from '@/types'

interface Props {
  collections: DailyCollection[]
  expenses: Expense[]
  salaries: Salary[]
  staff: Staff[]
  categories: ExpenseCategory[]
  productSales: number
  totalCollection: number
  totalExpenses: number
  totalSalary: number
  finalBalance: number
  selectedMonth: number
  selectedYear: number
}

defineProps<Props>()

const getStaffName = (staffId: string, staffList: Staff[]) => {
  const member = staffList.find(s => s.id === staffId)
  return member ? member.name : 'Unknown'
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatNumber = (value: number) => {
  if (value === 0) {
    return '0'
  }
  return new Intl.NumberFormat('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const dailyCollectionByStaff = (collections: DailyCollection[], staffList: Staff[], year: number, month: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const report: Record<string, Record<number, number>> = {};

  staffList.forEach(staff => {
    report[staff.id] = {};
    for (let day = 1; day <= daysInMonth; day++) {
      report[staff.id][day] = 0;
    }
  });

  collections.forEach(collection => {
    const collectionDate = new Date(collection.date);
    const day = collectionDate.getDate();
    if (report[collection.staff_id]) {
      report[collection.staff_id][day] = collection.amount;
    }
  });

  return report;
};

const getDailyTotal = (day: number, reportData: Record<string, Record<number, number>>, staffList: Staff[]) => {
  return staffList.reduce((total, staff) => {
    return total + (reportData[staff.id]?.[day] || 0);
  }, 0);
};

const getStaffTotal = (staffId: string, reportData: Record<string, Record<number, number>>) => {
  return Object.values(reportData[staffId] || {}).reduce((total, amount) => total + amount, 0);
};

const getStaffSalary = (staffId: string, reportData: Record<string, Record<number, number>>) => {
  const staffTotal = getStaffTotal(staffId, reportData);
  return staffTotal * 0.5;
};
</script>

<template>
  <div class="p-8 bg-white text-black font-sans">
    <div class="table-no-break">
      <h1 class="text-3xl font-bold text-center mb-2">VASA SALOON</h1>
      <h2 class="text-xl font-semibold text-center mb-8">
        Financial Report for {{ monthNames[selectedMonth] }} {{ selectedYear }}
      </h2>
    </div>

    <!-- Daily Collections Table -->
    <div class="mb-8 table-no-break">
      <h3 class="text-lg font-bold mb-2">Daily Collections</h3>
      <table class="w-full border-collapse border border-gray-400 text-xs">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 p-1">Date</th>
            <th v-for="s in staff" :key="s.id" class="border border-gray-300 p-1">{{ s.name }}</th>
            <th class="border border-gray-300 p-1 font-bold">Daily Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="day in new Date(selectedYear, selectedMonth + 1, 0).getDate()" :key="day">
            <td class="border border-gray-300 p-1 font-semibold">{{ day }}</td>
            <td v-for="s in staff" :key="s.id" class="border border-gray-300 p-1 text-right">
              {{ formatNumber(dailyCollectionByStaff(collections, staff, selectedYear, selectedMonth)[s.id]?.[day] || 0)
              }}
            </td>
            <td class="border border-gray-300 p-1 text-right font-bold">
              {{ formatCurrency(getDailyTotal(day, dailyCollectionByStaff(collections, staff, selectedYear,
                selectedMonth), staff)) }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-gray-200 font-bold">
            <td class="border border-gray-300 p-1">Staff Total</td>
            <td v-for="s in staff" :key="s.id" class="border border-gray-300 p-1 text-right">
              {{ formatCurrency(getStaffTotal(s.id, dailyCollectionByStaff(collections, staff, selectedYear,
                selectedMonth))) }}
            </td>
            <td class="border border-gray-300 p-1 text-right">
              {{ formatCurrency(totalCollection) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Expenses Table -->
    <div class="mb-8 table-no-break">
      <h3 class="text-lg font-bold mb-2">Expenses</h3>
      <table class="w-full border-collapse border border-gray-400 text-sm">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 p-2">Date</th>
            <th class="border border-gray-300 p-2">Category</th>
            <th class="border border-gray-300 p-2">Description</th>
            <th class="border border-gray-300 p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expense in expenses" :key="expense.id">
            <td class="border border-gray-300 p-2">{{ new Date(expense.date).toLocaleDateString() }}</td>
            <td class="border border-gray-300 p-2">{{categories.find(c => c.id === expense.category_id)?.name}}</td>
            <td class="border border-gray-300 p-2">{{ expense.description }}</td>
            <td class="border border-gray-300 p-2 text-right">{{ formatNumber(expense.amount) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-gray-200 font-bold">
            <td colspan="3" class="border border-gray-300 p-2 text-right">Total Expenses</td>
            <td class="border border-gray-300 p-2 text-right">{{ formatCurrency(totalExpenses) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Salaries Table -->
    <div class="mb-8 table-no-break">
      <h3 class="text-lg font-bold mb-2">Salaries</h3>
      <table class="w-full border-collapse border border-gray-400 text-sm">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 p-2">Staff Member</th>
            <th class="border border-gray-300 p-2 text-right">Salary (50%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in staff" :key="s.id">
            <td class="border border-gray-300 p-2">{{ s.name }}</td>
            <td class="border border-gray-300 p-2 text-right">
              {{ formatCurrency(getStaffSalary(s.id, dailyCollectionByStaff(collections, staff, selectedYear,
                selectedMonth))) }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-gray-200 font-bold">
            <td class="border border-gray-300 p-2 text-right">Total Salary</td>
            <td class="border border-gray-300 p-2 text-right">{{ formatCurrency(totalSalary) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Financial Summary -->
    <div class="table-no-break">
      <h3 class="text-lg font-bold mb-2">Financial Summary</h3>
      <div class="border p-4">
        <div class="flex justify-between py-1">
          <span>Total Collection:</span>
          <span class="font-bold">{{ formatCurrency(totalCollection) }}</span>
        </div>
        <div class="flex justify-between py-1">
          <span>Product Sales:</span>
          <span class="font-bold">{{ formatCurrency(productSales) }}</span>
        </div>
        <div class="flex justify-between py-1 text-red-600">
          <span>Total Expenses:</span>
          <span class="font-bold">({{ formatCurrency(totalExpenses) }})</span>
        </div>
        <div class="flex justify-between py-1 text-red-600">
          <span>Total Salary (50%):</span>
          <span class="font-bold">({{ formatCurrency(totalSalary) }})</span>
        </div>
        <hr class="my-2" />
        <div class="flex justify-between py-1 font-bold text-lg"
          :class="finalBalance >= 0 ? 'text-green-600' : 'text-red-600'">
          <span>Final Balance:</span>
          <span>{{ formatCurrency(finalBalance) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.table-no-break {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>