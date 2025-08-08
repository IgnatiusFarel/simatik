<template>
  <div class="bg-white w-full rounded-lg shadow-sm p-6 h-full">
    <div class="flex justify-between">
      <p class="font-bold text-[22px] text-[#191919]">{{ total }}</p>
      <p class="font-medium text-sm text-[#525256]">{{ title }}</p>
    </div>
    <hr class="my-4 border-t border-[#D3D3D3]" />
    <div class="bg-[#D30007] rounded-[4px] p-3 relative">
      <p class="font-medium text-white text-sm">{{ subTitle }}</p>
      <p class="font-bold text-white text-base">{{ subtitleDesc }}</p>

      <div class="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center gap-1">
        <span class="font-bold text-white text-base">{{  percentage  }}</span>
        <div class="bg-white rounded-full p-1">
          <TrendingUp class="w-4 h-4 text-green-500" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TrendingUp } from 'lucide-vue-next'
export default {
  name: 'AssetCard',
  components: {
    TrendingUp
  },
  props: {
    total: String, 
    title: String, 
    subTitle: String, 
    subtitleDesc: String, 
    percentage: String, 
  }, computed: {
    cardClasses() {
      return [
        'bg-white',
        'rounded-lg',
        'shadow-sm',
        'p-6',
        'h-full',
        'w-full',
        this.isCollapsed ? 'max-w-full' : 'max-w-[352px]'
      ]
    }
  }
}
</script>

<style></style>
