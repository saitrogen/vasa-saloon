<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  CalendarDate,
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

const props = defineProps<{
  modelValue?: Date | null
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', val: Date | undefined): void
}>()

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const value = computed({
  get: () => {
    if (!props.modelValue) return undefined
    const [year, month, day] = props.modelValue.toISOString().split('T')[0].split('-').map(Number)
    return new CalendarDate(year, month, day)
  },
  set: (val) => {
    if (!val) {
      emits('update:modelValue', undefined)
      return
    }
    emits('update:modelValue', val.toDate(getLocalTimeZone()))
  },
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" :class="cn(
        'w-[240px] justify-start text-left font-normal',
        !modelValue && 'text-muted-foreground',
        props.class,
      )">
        <CalendarIcon class="w-4 h-4 mr-2" />
        {{ modelValue ? df.format(modelValue) : "Pick a date" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="value" initial-focus />
    </PopoverContent>
  </Popover>
</template>