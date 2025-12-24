<template>
  <!-- 翻页数字容器 -->
  <div
    ref="flipNumber"
    class="flip-number"
  >
    <!-- 上半部分 - 显示下一个数字 -->
    <div
      class="flip-number__half flip-number__half--top"
      :style="{
        lineHeight: `${height}px`
      }"
    >
      {{ nextValue }}
    </div>

    <!-- 翻页动画层 -->
    <div
      class="flip-number__fold"
      :class="[
        isFlipping ? 'flip-number__fold--flipping' : 'flip-number__fold--end'
      ]"
    >
      <!-- 翻页前面 - 显示当前数字 -->
      <div
        class="flip-number__fold-side flip-number__fold-side--front"
        :style="{
          lineHeight: `${height}px`
        }"
      >
        {{ currentValue }}
      </div>
      <!-- 翻页背面 - 显示下一个数字 -->
      <div class="flip-number__fold-side flip-number__fold-side--back">
        {{ nextValue }}
      </div>
    </div>

    <!-- 下半部分 - 显示当前数字 -->
    <div class="flip-number__half flip-number__half--bottom">
      {{ currentValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { ref, watch } from 'vue'

interface Props {
  value: string
}

const props = defineProps<Props>()

const currentValue = ref(props.value)
const nextValue = ref(props.value)
const isFlipping = ref(false)

watch(() => props.value, (newValue) => {
  if (newValue !== currentValue.value) {
    // 设置下一个值
    nextValue.value = newValue
    // 触发翻页动画
    isFlipping.value = true

    // 动画结束后更新当前值
    setTimeout(() => {
      currentValue.value = newValue
      isFlipping.value = false
    }, 600)
  }
})

const flipNumber = useTemplateRef('flipNumber')

const { height } = useElementSize(flipNumber)
</script>

<style lang="scss">
.flip-number {
  position: relative;
  display: inline-block;
  box-sizing: border-box;

  --flip-bg-color: #222726;
  --flip-text-color: #fff;
  --flip-font-size: 16px;
  --flip-top-border-radius: 6px 6px 0 0;
  --flip-bottom-border-radius: 0 0 6px 6px;
  --flip-duration: 0.6s;

  @media screen and (min-width: 768px) {
    --flip-font-size: 64px;
    --flip-top-border-radius: 32px 32px 0 0;
    --flip-bottom-border-radius: 0 0 32px 32px;
  }

  &::before {
    z-index: 1;
    position: absolute;
    content: '';
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    height: 1px;
    background-color: #000000;
    border: 1px solid rgba(210, 237, 222, 0.5);
    border-left-color: #000000;
    border-right-color: #000000;

    @media screen and (min-width: 768px) {
      height: 8px;
    }
  }

  &__half {
    width: 100%;
    height: 50%;
    overflow: hidden;
    font-size: var(--flip-font-size);
    color: var(--flip-text-color);
    text-align: center;

    &--top {
      position: relative;
      border-radius: var(--flip-top-border-radius);
      border: 1px solid rgba(210, 237, 222, 0.5);
      background: linear-gradient(180deg, #222726, #000000);

    }

    &--bottom {
      line-height: 0;
      border-radius: var(--flip-bottom-border-radius);
      border: 1px solid rgba(210, 237, 222, 0.5);
      background: linear-gradient(180deg, #000000, #222726);
    }
  }

  &__fold {
    position: absolute;
    top: 0;
    width: 100%;
    height: 50%;
    transform-style: preserve-3d;
    transform-origin: bottom;

    &--flipping {
      transition: transform var(--flip-duration) ease-in-out;
      transform: perspective(200px) rotateX(-180deg);
    }

    &--end {
      transition: transform 0s;
      transform: perspective(200px) rotateX(0);
    }
  }

  &__fold-side {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    overflow: hidden;
    font-size: var(--flip-font-size);
    color: var(--flip-text-color);
    text-align: center;

    &--front {
      background: linear-gradient(180deg, #222726, #000000);
      border-radius: var(--flip-top-border-radius);
      border: 1px solid rgba(210, 237, 222, 0.5);
    }

    &--back {
      background: linear-gradient(180deg, #000000, #222726);
      transform: rotateX(0deg) rotateY(-180deg) scale(-1);
      line-height: 0;
      border-radius: var(--flip-bottom-border-radius);
      border: 1px solid rgba(210, 237, 222, 0.5);
    }
  }
}
</style>
