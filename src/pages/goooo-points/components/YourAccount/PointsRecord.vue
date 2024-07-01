<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'oooo-components/ui/dialog'
import DataTable from 'oooo-components/ui/DataTable.vue'
import PaginationPro from '@/components/PaginationPro.vue'
import { columns } from './columns'
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { retrieveAccountPointLogs } from '@/request/api/task'
import useSignatureStore from '@/store/signature'

const open = defineModel<boolean>()

const pageNumber = ref(1)

const signature = useSignatureStore()

const enabled = computed(() => signature.signInfo !== undefined)
const { isPending, data } = useQuery({
  queryKey: ['/point/account/log', pageNumber],
  queryFn: async () => {
    const { list, totalCount } = await retrieveAccountPointLogs({
      ...signature.signInfo!,
      pagesize: 10,
      page: pageNumber.value
    })
    return {
      list,
      total: totalCount
    }
  },
  placeholderData: keepPreviousData,
  enabled
})

// temp to fix Pagination component error
const total = computed(() => data.value?.total ?? 0)
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <template #header>
        <DialogHeader>
          <DialogTitle>
            _ POINTS RECORD
          </DialogTitle>
        </DialogHeader>
      </template>
      <template #content>
        <div class="flex flex-col pb-[24px] overflow-hidden">
          <DataTable
            class="xl:mt-[8px] overflow-auto"
            :columns="columns"
            :data="data?.list ?? []"
          />
          <PaginationPro
            v-model:page="pageNumber"
            class="mt-[20px] md:mt-[40px]"
            :total="total"
            :disabled="isPending"
            show-edges
          />
        </div>
      </template>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
