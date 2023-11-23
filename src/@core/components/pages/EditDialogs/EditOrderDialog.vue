<script setup>
import { useI18n } from "vue-i18n"
import {
  requiredValidator,
} from '@validators'
import { useSettingsStore } from "@/store/Settings"
import { useOrdersStore } from "@/store/Orders"

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isEditOpen',
  'refreshTable',
])

const ordersListStore = useOrdersStore()
const settingsListStore = useSettingsStore()
const isLoading = ref(false)

const { t } = useI18n()

const itemData = reactive({
  order_state_id: null,
})

const statues = reactive([
  {
    id: 100,
    name: "تم إرسال الطلب",
  },
  {
    id: 101,
    name: "تم قبول الطلب",
  },
])

const form = ref()

const resetForm = () => {
  emit('update:isEditOpen', false)
}

onUpdated(() => {
  itemData.id = props.item.id
  itemData.order_state_id = props.item.order_state_id
})

const onFormSubmit = () => {
  isLoading.value = true
  ordersListStore.editOrder(itemData).then(response => {
    emit('refreshTable')
    emit('update:isEditOpen', false)
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
  emit('update:isEditOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isEditOpen"
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
            {{ t('تعديل حالةالطلب') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit" ref="bannerData">
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.order_state_id"
                :items="statues"
                :label="t('forms.order_state')"
                item-title="name"
                item-value="id"
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
</template>
