<script setup lang="ts">
import { sendBadgeDiscordCallback } from '@/request/api/badge'
import { sendDiscordCallback } from '@/request/api/task'
import { getArrayFirst } from '@preflower/utils'

const route = useRoute()

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
    let request = sendDiscordCallback
    if (route.params.page === 'badges') {
      request = sendBadgeDiscordCallback
    }
    const result = await request({ code, state })
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
