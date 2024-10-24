<script setup lang="ts">
import confetti from 'canvas-confetti'
import { Dialog, DialogContent } from 'oooo-components/ui/dialog'

defineProps<{
  title: string
  description: string
}>()
const open = defineModel<boolean>('open')

const createConfetti = () => {
  const bitcoinPath = 'M352.20549,161.807443 C358.530959,119.776991 326.337595,97.1824141 282.317489,82.1094935 L296.596963,25.1739258 L261.732403,16.5368557 L247.830272,71.9720406 C238.664794,69.701725 229.251066,67.5597315 219.896917,65.43748 L233.89835,9.63707035 L199.053651,1 L184.764246,57.9158255 C177.177654,56.1982824 169.730083,54.5004812 162.500975,52.7138416 L162.540694,52.5361646 L114.45918,40.6022012 L105.184473,77.6182169 C105.184473,77.6182169 131.052366,83.5111664 130.506211,83.8763912 C144.626806,87.3805741 147.178839,96.6691256 146.751846,104.032846 L130.48635,168.894776 C131.459501,169.14155 132.720621,169.496903 134.110836,170.049676 C132.949014,169.763419 131.707752,169.447548 130.42677,169.14155 L107.627276,260.00353 C105.899438,264.267773 101.520268,270.664141 91.6497536,268.235891 C91.9973069,268.739309 66.3081538,261.948105 66.3081538,261.948105 L49,301.619401 L94.3705993,312.8624 C102.811179,314.964909 111.082948,317.166129 119.225625,319.239025 L104.797199,376.826074 L139.622037,385.463144 L153.911443,328.488092 C163.424472,331.054537 172.659461,333.423562 181.695847,335.654394 L167.45609,392.362931 L202.32065,401 L216.749078,343.521532 C276.20055,354.705303 320.905834,350.194285 339.723361,296.743158 C354.886615,253.705871 338.968674,228.880462 307.688878,212.692125 C330.468514,207.4704 347.627715,192.575156 352.20549,161.807443 L352.20549,161.807443 Z M272.546275,272.845618 C261.772124,315.882907 188.875304,292.617106 165.24168,286.783383 L184.386901,210.490907 C208.020525,216.354243 283.807002,227.962466 272.546275,272.845618 L272.546275,272.845618 Z M283.330359,161.185574 C273.499564,200.333713 212.826691,180.443773 193.145244,175.56753 L210.503048,106.372257 C230.184495,111.248501 293.568285,120.349506 283.330359,161.185574 L283.330359,161.185574 Z'
  const bitcoin = confetti.shapeFromPath({ path: bitcoinPath })

  const colors = [
    '#26ccff',
    '#a25afd',
    '#ff5e7e',
    '#88ff5a',
    '#fcff42',
    '#ffa62d',
    '#ff36ff'
  ]

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * 7) + 1]
  }

  const defaultOptions = {
    particleCount: 2,
    spread: 55,
    shapes: [bitcoin],
    scalar: 3,
    colors: [getRandomColor(), getRandomColor()]
  }

  void confetti({
    ...defaultOptions,
    angle: 60,
    origin: { x: 0 }
  })
  void confetti({
    ...defaultOptions,
    angle: 120,
    origin: { x: 1 }
  })
}

watch(open, () => {
  if (open.value) {
    const end = Date.now() + (3 * 1000)

    const frame = () => {
      createConfetti()

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      } else {
        open.value = false
      }
    }

    frame()
  }
}, {
  immediate: true
})
</script>

<template>
  <Dialog
    v-bind="$attrs"
    v-model:open="open"
  >
    <DialogContent
      class="bg-transparent"
      @pointer-down-outside.prevent
      @escape-key-down.prevent
    >
      <div class="px-[72px] text-center">
        <p class="font-light -tracking-tighter">
          {{ title }}
        </p>
        <p class="mt-[10px] text-[22px] -tracking-tighter">
          {{ description }}
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
