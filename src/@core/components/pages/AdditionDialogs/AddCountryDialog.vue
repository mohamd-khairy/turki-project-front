<script setup>
import { useCountriesStore } from "@/store/Countries"
import {
  requiredValidator,
} from '@validators'

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'refreshTable',
  'update:isAddOpen',
])

import { useI18n } from "vue-i18n"
import { useSettingsStore } from "@/store/Settings"

const { t } = useI18n()
const countriesListStore = useCountriesStore()
const settingsListStore = useSettingsStore()
const isLoading = ref(false)

// Variables
const country = reactive({
  name_ar: null,
  name_en: null,
  currency_ar: null,
  currency_en: null,
  phone_code: null,
  code: null,
  latitude: 0,
  longitude: 0,
})

// Functions
const resetForm = () => {
  country.name_ar = null,
  country.name_en = null,
  country.currency_ar = null,
  country.currency_en = null,
  country.phone_code = null,
  country.code = null,
  country.latitude = 0,
  country.longitude = 0
  emit('update:isAddOpen', false)
}

const onFormSubmit = () => {
  isLoading.value = true
  countriesListStore.storeCountry(country).then(response => {
    emit('update:isAddOpen', false)
    emit('refreshTable')
    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم إضافة العنصر بنجاح"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
      isLoading.value = false

    }, 2000)
    resetForm()
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
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="material-symbols:globe" size="24" color="primary"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Add_Country') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit">
          <VRow>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="country.name_en"
                :label="t('forms.name_en')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="country.name_ar"
                :label="t('forms.name_ar')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="country.currency_en"
                :label="t('forms.currency_en')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="country.currency_ar"
                :label="t('forms.currency_ar')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="country.phone_code"
                :label="t('forms.phone_code')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="country.code"
                :label="t('forms.code')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <GoogleMaps></GoogleMaps>
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
                {{ t("buttons.save") }}
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
                {{ t("buttons.cancel") }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
