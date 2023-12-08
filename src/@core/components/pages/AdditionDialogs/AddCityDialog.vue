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

const refForm = ref(null)

const location = reactive({
  lat: null,
  lng: null,
})

onMounted(() => {
  navigator.geolocation.getCurrentPosition(position => {
    location.lat = position.coords.latitude
    location.lng = position.coords.longitude
  })
  countriesListStore.fetchCountries().then(response => {
    countries.value = response.data.data
  })
})

const getPathsData = data => {
  paths.push(data)
}

const paths = reactive([])

const city = reactive({
  name_ar: null,
  name_en: null,
  country_id: null,
  is_available_for_delivery: 0,
  polygon: "",
})

// Functions
const resetForm = () => {
  city.name_ar = null,
  city.name_en = null,
  city.country_id = null,
  city.is_available_for_delivery = 0
  emit('update:isAddOpen', false)
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()

  if (res.valid) {
    let cityDt = {
      name_ar: city.name_ar,
      name_en: city.name_en,
      country_id: city.country_id,
      is_available_for_delivery: city.is_available_for_delivery,
      polygon: "",
    }
    paths.map((path, index) => {
      console.log(paths.length, index , paths[index])
      cityDt.polygon += `[${path.lat},${path.lng}]`
      if(index < paths.length - 1) {
        cityDt.polygon += ','
      }
    })
    cityDt.polygon = `[${cityDt.polygon}]`
    citiesListStore.storeCity(cityDt).then(response => {
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
  emit('update:isAddOpen', val)
}

const getSelectedLocation = loc => {
  location.lat = loc.lat
  location.lng = loc.lng
  city.latitude = loc.lat
  city.longitude = loc.lng
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
        <VForm ref="refForm" @submit.prevent="onFormSubmit">
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
              <VSwitch :label="t('available_for_delivery')" v-model="city.is_available_for_delivery"></VSwitch>
            </VCol>
            <VCol cols="12">
              <MapAutoComplete></MapAutoComplete>
              <AddCityMap :location="location" @getPaths="getPathsData"></AddCityMap>
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
