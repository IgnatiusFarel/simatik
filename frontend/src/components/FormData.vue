<template>
  <a-modal
    v-model:open="open"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    @ok="onOk"
    @cancel="onCancel"
  >
    <slot name="form" />
  </a-modal>
</template>

<script setup>
import { ref, watch } from "vue"; 

const props = defineProps({
  modelValue: { default: false }, 
  title: { default: "Add Data"}, 
  okText: { default: "Simpan"}, 
  cancelText: { default: "Batal"}
}); 

const emits = defineEmits(["update:modelValue", "ok", "cancel"]);

const open = ref(props.modelValue); 

watch(
  () => props.modelValue,
  (val) => (open.value = val)
); 

const onOk = () => emits("ok"); 
const onCancel = () => { 
  emits("cancel")
  emits("update:modelValue", false);
};
</script>
