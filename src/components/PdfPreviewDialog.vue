<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  modelValue: boolean
  pdfUrl: string | null
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'PDF Preview',
})

const emit = defineEmits(['update:modelValue'])

function downloadPdf() {
  if (!props.pdfUrl) return
  const link = document.createElement('a')
  link.href = props.pdfUrl
  link.download = `${props.title.replace(/\s/g, '_')}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <Dialog :open="modelValue" @update:open="(value) => emit('update:modelValue', value)">
    <DialogContent class="max-w-4xl h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          Review the generated document below. You can download it using the button in the footer.
        </DialogDescription>
      </DialogHeader>
      <div class="flex-grow border rounded-md overflow-hidden">
        <iframe v-if="pdfUrl" :src="pdfUrl" class="w-full h-full" frameborder="0"></iframe>
        <div v-else class="w-full h-full flex items-center justify-center">
          <p>Generating PDF...</p>
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button @click="downloadPdf" :disabled="!pdfUrl">
          Download PDF
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>