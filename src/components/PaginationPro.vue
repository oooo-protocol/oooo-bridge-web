<script setup lang="ts">
import { Pagination, PaginationList, PaginationPrev, PaginationNext, PaginationListItem, PaginationEllipsis } from 'oooo-components/ui/pagination'
import { Button } from 'oooo-components/ui/button'
import Icon from 'oooo-components/ui/Icon.vue'
</script>

<template>
  <Pagination
    v-bind="$attrs"
    v-slot="{ page }"
  >
    <PaginationList
      v-slot="{ items }"
      class="flex justify-center items-center gap-[4px]"
    >
      <PaginationPrev>
        <Icon name="front" />
      </PaginationPrev>

      <template v-for="(item, index) in items">
        <PaginationListItem
          v-if="item.type === 'page'"
          :key="index"
          :value="item.value"
          as-child
        >
          <Button
            class="select-none"
            :class="item.value === page ? 'text-[#ffffff]' : 'text-[#9e9e9e] hidden md:block'"
            variant="ghost"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          class="hidden md:flex"
          :key="item.type"
          :index="index"
        />
      </template>

      <PaginationNext>
        <Icon name="next" />
      </PaginationNext>
    </PaginationList>
  </Pagination>
</template>

<style lang="scss" scoped>

</style>
