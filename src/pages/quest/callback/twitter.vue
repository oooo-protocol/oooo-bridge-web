<script setup lang="ts">
import { sendTwitterCallback } from '@/request/api/task'
import { getArrayFirst } from '@preflower/utils'
import { useMutation } from '@tanstack/vue-query'

const route = useRoute()

const { mutateAsync } = useMutation({
  mutationFn: sendTwitterCallback
})

const bc = new BroadcastChannel('oooo-authorization')

const send = (result: boolean) => {
  bc.postMessage({
    source: 'oooo-authorization',
    data: result
  })
}

onBeforeMount(async () => {
  try {
    const code = getArrayFirst(route.query.code)
    const state = getArrayFirst(route.query.state)
    if (code == null || state == null) {
      send(false)
      return
    }
    const result = await mutateAsync({ code, state })
    send(result)
  } catch {
    send(false)
  }
  window.close()
})
</script>

<template>
  <div />
</template>

<style lang="scss" scoped>

</style>
