<script setup>
const props = defineProps({
  isShow: {
    type: Boolean,
    required: true,
  },
  color: {
    type: String,
    default: "",
    required: true,
  },
  message: {
    type: String,
    default: "",
    required: true,
  },
})

const emit = defineEmits(['changeStatus'])

const changeActive = () => {
  emit("changeStatus", false)
}
</script>

<template>
  <div class="alert-wrapper" v-if="isShow" @click="changeActive">
    <VAlert :color="props.color" border="start">
      {{message}}
    </VAlert>
  </div>
</template>

<style scoped lang="scss">
.alert-wrapper {
  position: absolute;
  top: 5%;
  left: 2%;
  z-index: 999999;

  .v-alert {
    width: 300px;
    min-height: 60px;

    &.bg-success {
      background: rgba(#12b312, 0.5) !important;
    }
  }
}
</style>
