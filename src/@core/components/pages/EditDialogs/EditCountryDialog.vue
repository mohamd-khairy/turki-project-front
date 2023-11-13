<script setup>
import { useCountriesStore } from "@/store/Countries"

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  country: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isEditOpen',
  'refreshTable',
])

import { useI18n } from "vue-i18n"
import { useSettingsStore } from "@/store/Settings"

const { t } = useI18n()
const countriesList = useCountriesStore()
const settingsListStore = useSettingsStore()
const isLoading = ref(false)

// Variables
const countryData = reactive({
  id: null,
  name_ar: null,
  name_en: null,
  currency_ar: null,
  currency_en: null,
  phone_code: null,
  code: null,
  latitude: 0,
  longitude: 0,
})

onUpdated(() => {
  countryData.id = props.country.id
  countryData.name_ar = props.country.name_ar,
  countryData.name_en = props.country.name_en,
  countryData.currency_ar = props.country.currency_ar,
  countryData.currency_en = props.country.currency_en,
  countryData.phone_code = props.country.phone_code,
  countryData.code = props.country.code,
  countryData.latitude = props.country.latitude,
  countryData.longitude = props.country.longitude

})

// Functions
const resetForm = () => {
  emit('update:isEditOpen', false)
}

const onFormSubmit = () => {

  isLoading.value = true
  countriesList.editCountry(countryData).then(response => {
    emit('refreshTable')
    emit('update:isEditOpen', false)
    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم حذف العنصر بنجاح"
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
                v-model="countryData.name_en"
                :label="t('forms.name_en')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="countryData.name_ar"
                :label="t('forms.name_ar')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="countryData.currency_en"
                :label="t('forms.currency_en')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="countryData.currency_ar"
                :label="t('forms.currency_ar')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="countryData.phone_code"
                :label="t('forms.phone_code')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="countryData.code"
                :label="t('forms.code')"
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
