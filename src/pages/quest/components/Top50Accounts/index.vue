<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
import PaginationPro from '@/components/PaginationPro.vue'

import { columns } from './columns'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { retrieveTopAccountList } from '@/request/api/task'

defineOptions({ name: 'Top50Accounts' })

const pageNumber = ref(1)

const { isPending, data } = useQuery({
  queryKey: ['/point/account/top', pageNumber],
  queryFn: async () => {
    const { accountList, total } = await retrieveTopAccountList({
      pagesize: 10,
      page: pageNumber.value
    })
    return {
      list: accountList,
      total
    }
  },
  placeholderData: keepPreviousData
})
</script>

<template>
  <div>
    <div class="flex flex-col justify-between md:flex-row md:items-center gap-[8px]">
      <h3 class="text-[24px] md:text-[32px] font-[600] -tracking-tighter">
        LEADERBOARD - TOP 50
      </h3>
      <p
        class="text-[14px] -tracking-tighter"
        v-if="data?.total"
      >
        🎖TOTAL ACCOUNTS: <span class="text-[#ff5402]">{{ data.total }}</span>
      </p>
    </div>
    <DataTable
      class="mt-[8px]"
      :columns="columns"
      :data="data?.list ?? []"
      :loading="isPending"
    />
    <PaginationPro
      class="mt-[40px]"
      v-model:page="pageNumber"
      :total="50"
      :disabled="isPending"
      show-edges
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
