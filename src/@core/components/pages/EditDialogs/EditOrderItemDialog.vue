<script setup>
import { useI18n } from "vue-i18n"
import {
  requiredValidator,
} from '@validators'
import { useSettingsStore } from "@/store/Settings"
import { useOrdersStore } from "@/store/Orders"
import { useEmployeesStore } from "@/store/Employees"

const props = defineProps({
  isEditProductOpen: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isEditProductOpen',
  'refrshTable',
])

const ordersListStore = useOrdersStore()
const settingsListStore = useSettingsStore()
const employeesListStore = useEmployeesStore()
const isLoading = ref(false)

const { t } = useI18n()

const itemData = reactive({
  order_product_id: null,
  quantity: null,
})

const form = ref()

const resetForm = () => {
  emit('update:isEditProductOpen', false)
}

onUpdated(() => {
  itemData.order_product_id = props.item ? props.item.id : 0
  itemData.quantity = props.item ? props.item.quantity : 0
})

const onFormSubmit = () => {
  isLoading.value = true
  ordersListStore.editOrderProduct(itemData).then(response => {
    emit('refrshTable')
    emit('update:isEditProductOpen', false)
    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم تعديل حالة الطلب بنجاح"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
      isLoading.value = false
    }, 1000)
  }).catch(error => {
    isLoading.value = false
    settingsListStore.alertColor = "error"
    settingsListStore.alertMessage = "حدث خطأ ما !"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
  })
}

const dialogModelValueUpdate = val => {
  emit('update:isEditProductOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isEditProductOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)"/>

    <VCard
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="solar:delivery-broken" size="24" color="primary"></VIcon>
          <span class="mx-1 my-1">
            تعديل تفاصيل المنتج
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit" ref="bannerData">
          <VRow>
            <VCol
              cols="12"
            >
              <VTextField v-model="itemData.quantity" :label="t('forms.quantity')"></VTextField>
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
</template>