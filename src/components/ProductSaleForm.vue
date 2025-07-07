<script setup lang="ts">
import { ref, watch } from 'vue'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import type { ProductSale } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import DatePicker from '@/components/ui/date-picker/DatePicker.vue'

interface Props {
  modelValue: boolean
  sale?: ProductSale | null
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'save'])

const saleSchema = toTypedSchema(z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  amount: z.number({ invalid_type_error: 'Amount is required' }).min(0.01, 'Amount must be positive'),
  date: z.date({ required_error: 'A date is required.' })
}))

const { handleSubmit, isSubmitting, setValues, resetForm, errors, defineField } = useForm({
  validationSchema: saleSchema,
})

const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')
const [amount, amountAttrs] = defineField('amount')
const [date, dateAttrs] = defineField('date')

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    let values = {};
    if (props.sale) {
      values = {
        ...props.sale,
        date: props.sale.date instanceof Date ? props.sale.date : new Date(props.sale.date)
      }
      console.log('[ProductSaleForm] Dialog opened for edit, setting values:', values)
    } else {
      values = { date: new Date() }
      console.log('[ProductSaleForm] Dialog opened for add, setting values:', values)
    }
    resetForm({ values })
  }
})

const onSubmit = handleSubmit(async (values) => {
  console.log('[ProductSaleForm] Emitting save with values:', values)
  emit('save', values)
})

const dialogTitle = ref('')
watch(() => props.sale, (newSale) => {
  dialogTitle.value = newSale ? 'Edit Product Sale' : 'Add Product Sale'
}, { immediate: true })
</script>

<template>
  <Dialog :open="modelValue" @update:open="(value) => emit('update:modelValue', value)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>
          Fill in the details for the product sale below.
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit" class="space-y-4">
        <div>
          <Label for="name">Product Name</Label>
          <Input id="name" v-model="name" v-bind="nameAttrs" />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <Label for="description">Description (Optional)</Label>
          <Input id="description" v-model="description" v-bind="descriptionAttrs" />
        </div>
        <div>
          <Label for="amount">Amount</Label>
          <Input id="amount" type="number" step="0.01" v-model.number="amount" v-bind="amountAttrs" />
          <p v-if="errors.amount" class="text-red-500 text-xs mt-1">{{ errors.amount }}</p>
        </div>
        <div>
          <Label for="date">Date</Label>
          <DatePicker v-model="date" v-bind="dateAttrs" />
          <p v-if="errors.date" class="text-red-500 text-xs mt-1">{{ errors.date }}</p>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>