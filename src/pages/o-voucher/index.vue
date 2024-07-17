<script setup lang="ts">
import { OContainer, OHeader, OContent } from '@/components/OContainer'
import OVoucherContainer from './components/OVoucherContainer.vue'
import MyOVoucher from './components/MyOVoucher.vue'
import { useSignatureCheck } from '@/composables/hooks/use-signature-check'
import { useCodeQuery } from './hooks/use-code-query'

const router = useRouter()

useSignatureCheck()
useCodeQuery()
</script>

<template>
  <OContainer>
    <OHeader
      title="_o-VOUCHER"
      @close="router.back"
      is-close
    />
    <OContent>
      <h3 class="-tracking-tighter">
        CLAIM o-VOUCHER
      </h3>
      <div class="mt-[24px] md:mt-[30px] p-[20px] bg-[#2d2f2e] rounded-md">
        <p class="text-[14px] md:text-[16px] leading-[1]">
          What is an o-Voucher?
        </p>
        <p class="mt-[10px] text-[14px] md:text-[16px] text-[#a4a4a4] leading-[1]">
          o-Voucher can be used to reduce the Bridge Service Fee. o-Voucher can be obtained by participating in our official activities
        </p>
      </div>
      <OVoucherContainer class="mt-[30px]" />
      <MyOVoucher />
    </OContent>
  </OContainer>
</template>

<style lang="scss" scoped></style>
