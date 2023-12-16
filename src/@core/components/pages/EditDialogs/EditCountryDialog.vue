<script setup>
import { useCountriesStore } from "@/store/Countries"
import { useI18n } from "vue-i18n"
import { useSettingsStore } from "@/store/Settings"
import { GoogleMap, Marker } from "vue3-google-map"

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

const location = reactive({
  lat: null,
  lng: null,
})

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
  countryData.longitude = props.country.longitude,
  location.lat = Number(props.country.latitude),
  location.lng = Number(props.country.longitude)
})

// Functions
const resetForm = () => {
  emit('update:isEditOpen', false)
}

const refForm = ref(null)

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
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
      if (error.response.data.errors) {
        const errs = Object.keys(error.response.data.errors)
        errs.forEach(err => {
          settingsListStore.alertMessage = t(`errors.${err}`)
        })
      } else {
        settingsListStore.alertMessage = "حدث خطأ ما !"
      }
      isLoading.value = false
      settingsListStore.alertColor = "error"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    })
  }
  else {
    isLoading.value = false
    settingsListStore.alertMessage = "يرجي تعبئة الحقول المطلوبة !"
    settingsListStore.alertColor = "error"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
  }
}

const dialogModelValueUpdate = val => {
  emit('update:isEditOpen', val)
}

const getSelectedLocation = loc => {
  location.lat = loc.lat
  location.lng = loc.lng
  countryData.latitude = loc.lat
  countryData.longitude = loc.lng
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
            {{ t('Edit_Country') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" @submit.prevent="onFormSubmit">
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
              lg="12"
              sm="6"
            >
              <MapAutoComplete @select-location="getSelectedLocation"></MapAutoComplete>
              <GoogleMap
                api-key="AIzaSyCM2TngqydZtVlZ5hkKjY7x56ut59TTI88"
                style="width: 100%; height: 500px"
                :center="{lat: location.lat, lng: location.lng }"
                :zoom="5"
              >
                <Marker
                  :options="{position: {lat: location.lat, lng: location.lng }}"
                />
                <!--      <Polyline :options="flightPath"/>-->
              </GoogleMap>
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
