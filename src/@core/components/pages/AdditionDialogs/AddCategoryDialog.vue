<script setup>
import { useCitiesStore } from "@/store/Cities"
import { useCategoriesStore } from "@/store/Categories"
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

const { t } = useI18n()
const citiesListStore = useCitiesStore()
const categoriesListStore = useCategoriesStore()
const cities = reactive([])

onMounted(() => {
  citiesListStore.fetchCities().then(response => {
    cities.value = response.data.data
  })
})

// Variables
const category = reactive({
  type_ar: null,
  type_en: null,
  description: null,
  city_ids: null,
  backgroundColor: "#fff",
  color: "#fff",
  image: {},
})

// Functions
const resetForm = () => {
  emit('update:isAddOpen', false)
}

const onFormSubmit = () => {
  categoriesListStore.storeCategory(category).then(response => {
    emit('update:isAddOpen', false)
    emit('refreshTable')
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
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard
      class="pa-sm-9 pa-5"
    >
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="carbon:categories" size="24"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Add_Category') }}
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
                v-model="category.type_ar"
                :label="t('forms.type_ar')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="category.type_en"
                :label="t('forms.type_en')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="category.description"
                :label="t('forms.description')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VFileInput
                v-model="category.image"
                :label="t('forms.image')"
                accept="image/*"
                prepend-icon=""
                prepend-inner-icon="mdi-image"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="category.city_ids"
                :items="cities.value"
                :label="t('forms.cities')"
                item-title="name_ar"
                item-value="id"
                multiple
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                type="submit"
                class="me-3"
              >
                {{ t("buttons.save") }}
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
