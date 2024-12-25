<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    title: 'What is the oooo Badge System?',
    content: 'The oooo Badge system is an on-chain reward mechanism designed to encourage users to participate in on-chain activities, complete social tasks, and achieve specific milestones by earning different types of Badges.'
  },
  {
    title: 'What types of Badges are available?',
    content: "The oooo Badge system offers six types of Badges:\n\n- Cross-Chain Activity OAT Badge: Users who complete tasks and obtain OATs in oooo's official Galxe Space can claim the corresponding Badges.\n- Milestone Badge: Awarded based on key milestone achievements within the oooo ecosystem, users meeting the criteria can claim this Badge.\n- Chest Chase: Users who previously received the Chest Chase rewards are eligible to claim this Badge.\n- Discord Role Badge: Users with specific Discord roles can claim Badges corresponding to their roles.\n- Social Media Master Badge: Awarded to users who complete designated social media tasks within the Quest system."
  },
  {
    title: 'What is the purpose of the Badge system?',
    content: "The core value of the Badge system lies in its close connection to oooo's future token airdrop and its additional Boost mechanism. By assigning different Boost coefficients to each Badge, users can exponentially increase their Goooo points, ultimately earning greater rewards during TGE redemption."
  },
  {
    title: 'On which blockchain are Badges deployed?',
    content: 'All Badges are currently deployed on the Base chain. oooo may issue Badges on other chains in alignment with future campaigns. Please stay tuned to our official Twitter and community updates for more information.'
  },
  {
    title: 'How can I claim my Badge?',
    content: 'Users can claim their Badges via the Badge section on the oooo website homepage. Some Badges linked to specific OATs on Galxe may require wallet verification during the process.'
  },
  {
    title: 'Are Badges transferable?',
    content: 'Yes, Badges are fully transferable, allowing users to trade or gift them freely.'
  },
  {
    title: 'How many Badges can each user hold?',
    content: 'Users are allowed to hold multiple Badges of the same type. However, during the claiming process, only one Badge of the same type can be claimed.'
  },
  {
    title: 'Do Badges support cross-chain functionality?',
    content: 'In the future, oooo plans to enhance Badge liquidity and cross-chain interoperability through NFT mapping or an in-app cross-chain tool.'
  },
  {
    title: 'How are Boost values for Badges determined?',
    content: 'The Boost coefficient for each Badge is set by the oooo team based on task difficulty, activity value, and its impact on the ecosystem. Specific Boost values will be announced before the TGE.'
  },
  {
    title: 'Will new Badge types be introduced in the future?',
    content: 'Yes, as the oooo ecosystem and its partnerships expand, the Badge system will incorporate additional types to offer richer rewards and greater value for users.'
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
        <AccordionContent class="whitespace-pre-line">
          {{ faq.content }}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<style lang="scss" scoped>

</style>
