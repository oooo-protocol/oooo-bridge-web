<script setup lang="ts">

</script>

<template>
  <div>
    <h3 class="text-[24px] md:text-[32px] font-[600] tracking-[1.6px]">
      BADGES FAQS
    </h3>
    <div class="mt-[20px] p-[16px] pl-[20px] pr-[12px] md:p-[50px] max-h-[580px] bg-[#1d1d1d] rounded-[8px] overflow-auto text-[14px] md:text-base">
      <h2 class="font-bold">
        How do I use this?
      </h2>
      <p>To request funds, simply connect your wallet, complete tasks and hit "Claim". We support wallets as received addresses but not smart contracts.</p>
      <br>
      <h2 class="font-bold">
        How does it work?
      </h2>
      <p>You can request 0.1 Sepolia ETH every 72 hours with walletaddress!</p>
      <br>
      <h2 class="font-bold">
        What is a testnet Ethereum faucet?
      </h2>
      <p>
        An Ethereum faucet is a developer tool to get testnet Ether (ETH) in order to test and troubleshoot your decentralized application or protocol before going live on Ethereum mainnet, where one must use real Ether. Most faucets require social authentication (e.g. Twitter post or login confirming you are a real human) or place you in a queue to wait for a testnet token through the faucet. The oooo Sepolia faucet is free, fast, and does not require authentication.
      </p>
      <br>
      <h2 class="font-bold">
        What is a testnet token?
      </h2>
      <p>
        Testnet tokens are a test currency that allows you to test your Ethereum application before going live on mainnet. Testnet tokens can be used in place of mainnet Ether tokens on testnets like Sepolia. You can read more here.
      </p>
      <br>
      <h2 class="font-bold">
        I get an error saying "To receive Sepolia ETH, your wallet must have a minimum balance of 0.001 ETH on Ethereum mainnet. Please add ETH to your wallet and try again."
      </h2>
      <p>
        This faucet is designed to provide test tokens to real-world developers who need to test their smart contracts and interact with the blockchain. In order to prevent abuse, we require developers to hold a minimum balance on the ETH mainnet in the same wallet address before they can receive test tokens.
      </p>
      <br>
      <h2 class="font-bold">
        I get an error saying "Your wallet address was missing from the request, so we did not send you any test token" even though I did copy my wallet address correctly. What is going on?
      </h2>
      <p>
        An Ethereum-based wallet address is 42 characters long including the "0x" at the front. We only support wallets that follow this spec, so please make sure your wallet meets the criteria! We have seen a few users try to put Argent Wallets, but unfortunately, we do not support that at this time.
      </p>
      <br>
      <h2 class="font-bold">
        The faucet confirmed that it sent me test tokens, but I still have not received them. Why is that?
      </h2>
      <p>
        The time it takes for you to receive your test tokens may vary! This is because the network may be congested at this time, or the amount of gas we have set for these transactions may be a little low compared to other transactions that miners may choose to validate instead. If it has been over a few hours and you still have not received your testnet tokens, please fill out this form and we will send some!
      </p>
      <br>
      <h2 class="font-bold">
        I have been failing the Google Captcha that pops up when I request test tokens. What do I do?
      </h2>
      <p>
        This happens when you are using a VPN, and that is a Google blocker which we do not control. We recommend not using a VPN if that is the case.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
