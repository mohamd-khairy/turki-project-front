<script setup>
import { useI18n } from "vue-i18n"
import {
  requiredValidator,
} from '@validators'
import { useSettingsStore } from "@/store/Settings"
import { useOrdersStore } from "@/store/Orders"
import { useEmployeesStore } from "@/store/Employees"

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
const employeesListStore = useEmployeesStore()
const isLoading = ref(false)

const { t } = useI18n()

const itemData = reactive({
  id: null,
  order_state_id: null,
  user_id: null,
})

const statues = reactive([])
const users = reactive([])

const form = ref()

const resetForm = () => {
  emit('update:isEditOpen', false)
}

onMounted(() => {
  ordersListStore.fetchOrderStatus().then(response => {
    statues.value = response.data.data
  })
  employeesListStore.fetchEmployees({ pageSize: -1, role_id: 7 }).then(response => {
    users.value = response.data.data
  })
})

onUpdated(() => {
  itemData.id = props.item.order ? props.item.order.id : 0
  itemData.order_state_id = props.item.order ? props.item.order.order_state_id : 0
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
            {{ t('تعديل حالة الطلب') }}
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
              <VSelect
                v-model="itemData.order_state_id"
                :items="statues.value"
                :label="t('forms.order_state')"
                item-title="customer_state_ar"
                item-value="code"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VSelect
                v-model="itemData.user_id"
                :items="users.value"
                :label="t('forms.user')"
                item-title="username"
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
