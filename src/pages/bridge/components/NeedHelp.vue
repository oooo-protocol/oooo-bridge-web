<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { PopoverArrow } from 'radix-vue'
import { Button } from '@/components/ui/button'
import Icon from '@/components/Icon.vue'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        class="w-full md:w-auto"
        variant="outline"
      >
        💁 NEED HELP?
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="group"
      side="top"
    >
      <p class="text-[12px] -tracking-tighter">
        CONTACT US ON DISCORD FOR HELP IN
        <a
          class="text-[#bce4cd]"
          href="https://discord.gg/whPdgDdSvw"
          target="_blank"
        >
          #SUPPORT
        </a>
      </p>
      <div class="mt-[20px] flex items-center gap-[8px] text-[#bce4cd]">
        <Icon
          class="text-[16px]"
          name="Discord"
        />
        <a
          class="text-[12px] -tracking-tighter underline"
          href="https://discord.gg/ooooprotocol"
          target="_blank"
        >
          JOIN OUR DISCORD
        </a>
      </div>
      <PopoverArrow
        as-child
      >
        <div class="need-help__arrow" />
      </PopoverArrow>
    </PopoverContent>
  </Popover>
</template>

<style lang="scss" scoped>
.need-help {
  &__arrow {
    width: 10px;
    height: 10px;
    border: 1px solid #5a6960;
    border-right-color: transparent;
    border-top-color: transparent;
    transform-origin: left top;
    transform: rotate(-45deg) translateY(-1px);
    background-color: hsl(var(--popover));
    transition: none;
  }
}
</style>
