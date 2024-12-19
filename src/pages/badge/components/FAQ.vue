<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    title: 'How do I use this?',
    content: 'To request funds, simply connect your wallet, complete tasks and hit "Claim". We support wallets as received addresses but not smart contracts.'
  }, {
    title: 'How does it work?',
    content: 'You can request 0.1 Sepolia ETH every 72 hours with walletaddress!'
  }
]
</script>

<template>
  <div>
    <h3 class="text-[24px] md:text-[32px] font-[600] tracking-[1.6px]">
      BADGES FAQS
    </h3>
    <Accordion
      class="mt-[20px]"
      type="single"
      collapsible
    >
      <AccordionItem
        v-for="(faq, i) of faqs"
        :key="i"
        :value="`${i}`"
      >
        <AccordionTrigger>{{ faq.title }}</AccordionTrigger>
        <AccordionContent>
          {{ faq.content }}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<style lang="scss" scoped>

</style>
