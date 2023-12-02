<script setup>
import { useI18n } from "vue-i18n"
import {
  requiredValidator,
} from '@validators'

import { useSettingsStore } from "@/store/Settings"

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
  cities: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'update:isAddOpen',
  'refreshTable',
])

const settingsListStore = useSettingsStore()

const { t } = useI18n()


const itemData = reactive({
  delivery_date: null,
  city_id: null,
})

const form = ref()
const isLoading = ref(false)

const resetForm = () => {
  emit('update:isAddOpen', false)
}

const onFormSubmit = () => {
  isLoading.value = true
  settingsListStore.storeNotDeliveryDate(itemData).then(response => {
    emit('refreshTable')
    emit('update:isAddOpen', false)
    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم إضافة العنصر بنجاح"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
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
  emit('update:isAddOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isAddOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)"/>

    <VCard
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="fluent-mdl2:date-time" size="24"
                 color="primary"
          ></VIcon>
          <span class="mx-1 my-1">
            {{ t('Add_Item') }}
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
              <VTextField
                v-model="itemData.delivery_date"
                type="date"
                :label="t('forms.date')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VSelect
                v-model="itemData.city_id"
                :items="cities"
                :label="t('Cities')"
                item-title="name_ar"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <!--            <VCol-->
            <!--              cols="12"-->
            <!--            >-->
            <!--              <VSwitch-->
            <!--                v-model="itemData.is_active"-->
            <!--                :label="t('forms.is_active')"-->
            <!--              />-->
            <!--            </VCol>-->

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
