<script setup>
import { useCitiesStore } from "@/store/Cities"
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
const citiesListStore = useCitiesStore()
const countriesListStore = useCountriesStore()
const settingsListStore = useSettingsStore()
const countries = reactive([])
const isLoading = ref(false)

onMounted(() => {
  countriesListStore.fetchCountries().then(response => {
    countries.value = response.data.data
  })
})

// Variables
const city = reactive({
  name_ar: null,
  name_en: null,
  country_id: null,
  is_available_for_delivery: 0,
  polygon: "[[25.074497,46.838505],[25.024733,46.327641],[24.685798,46.338627],[24.5159836,4706669],[24.750666,47.014286],[25.069522,46.838505]]",
})

// Functions
const resetForm = () => {
  city.name_ar = null,
  city.name_en = null,
  city.country_id = null,
  city.is_available_for_delivery = 0
  emit('update:isAddOpen', false)
}

const onFormSubmit = () => {
  isLoading.value = true
  citiesListStore.storeCity(city).then(response => {
    emit('update:isAddOpen', false)
    emit('refreshTable')
    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم إضافة العنصر بنجاح"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
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
          <VIcon icon="solar:city-broken" size="24" color="primary"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Add_City') }}
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
                v-model="city.name_en"
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
                v-model="city.name_ar"
                :label="t('forms.name_ar')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="city.country_id"
                :items="countries.value"
                :label="t('forms.countries')"
                item-title="name_ar"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSwitch :label="t('available_for_delivery')" v-model="city.is_available_for_delivery"
                       :rules="[requiredValidator]"
              ></VSwitch>
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
