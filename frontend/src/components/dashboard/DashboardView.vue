<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <AssetCard
      total="1.234"
      title="Semua Aset"
      subTitle="Aset TIK"
      subtitleDesc="Semua Aset"
      percentage="100%"    
      :isCollapsed="isSidebarCollapsed"
    />
    <AssetCard
      total="534"
      title="Aset Digunakan"
      subTitle="Aset TIK"
      subtitleDesc="Digunakan"
      percentage="43%"      
       :isCollapsed="isSidebarCollapsed"
    />
    <AssetCard
      total="700"
      title="Aset Cadangan"
      subTitle="Aset TIK"
      subtitleDesc="Cadangan"
      percentage="57%"      
       :isCollapsed="isSidebarCollapsed"
    />
  </div>
</template>

<script>
import AssetCard from './AssetCard.vue'

export default {
  name: 'Dashboard',
  components: {
    AssetCard
  }
}
</script>

<style>

</style>