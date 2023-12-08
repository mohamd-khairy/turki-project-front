<script setup>
import { useI18n } from "vue-i18n"
import {
  requiredValidator,
} from '@validators'
import { useCouponsStore } from "@/store/Coupons"

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isAddOpen',
  'addProductCoupon',
])

const { t } = useI18n()

const coupons = ref([])
const coupon = ref(null)
const refForm = ref(null)
const isLoading = ref(false)

const couponsListStore = useCouponsStore()

const resetForm = () => {
  emit('update:isAddOpen', false)
}

const onFormSubmit = () => {
  emit('addProductCoupon', coupon)
  emit('update:isAddOpen', false)
}

const dialogModelValueUpdate = val => {
  emit('update:isAddOpen', val)
}

onMounted(() => {
  couponsListStore.fetchCoupons().then(response => {
    coupons.value = response.data.data
  })
})
</script>

<template>
  <div>
    <VDialog
      :width="$vuetify.display.smAndDown ? 'auto' : 650 "
      :model-value="props.isAddOpen"
      @update:model-value="dialogModelValueUpdate"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

      <VCard
        class="pa-sm-9 pa-5"
      >
        <VCardItem>
          <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
            <VIcon icon="solar:tag-broken" size="24"
                   color="primary"
            ></VIcon>
            <span class="mx-1 my-1">
            {{ t('Add_Coupon') }}
          </span>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <!-- 👉 Form -->
          <VForm @submit.prevent="onFormSubmit" ref="refFrom">
            <VRow>
              <VCol
                cols="12"
              >
                <VSelect
                  v-model="coupon"
                  :label="t('forms.coupon')"
                  :items="coupons"
                  item-title="name"
                  item-value="code"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                class="text-center"
              >
                <VBtn
                  v-if="!isLoading"
                  type="submit"
                  class="me-3"
                >
                  {{ t('buttons.save') }}
                </VBtn>
                <VBtn
                  v-else
                  type="submit"
                  class="position-relative me-3"
                >
                  <VIcon icon="mingcute:loading-line" class="loading" size="32"></VIcon>
                </VBtn>

                <VBtn
                  variant="tonal"
                  color="secondary"
                  @click="resetForm"
                >
                  {{ t('buttons.cancel') }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
