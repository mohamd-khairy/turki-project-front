<script setup>
import { useCitiesStore } from "@/store/Cities"
import { useCategoriesStore } from "@/store/Categories"

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  category: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'refreshTable',
  'update:isEditOpen',
])

import { useI18n } from "vue-i18n"

const { t } = useI18n()
const citiesListStore = useCitiesStore()
const categoriesListStore = useCategoriesStore()
const cities = reactive([])

onUpdated(() => {
  categoryData.id = props.category.id
  categoryData.type_ar = props.category.type_ar
  categoryData.type_en = props.category.type_en
  categoryData.description = props.category.description
  categoryData.city_ids = props.category.city_ids
  categoryData.backgroundColor = props.category.backgroundColor
  categoryData.color = props.category.color
  categoryData.image = props.category.image

  citiesListStore.fetchCities().then(response => {
    cities.value = response.data.data
  })
})

// Variables
const categoryData = reactive({
  id: null,
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
  emit('update:isEditOpen', false)
}

const onFormSubmit = () => {
  categoriesListStore.storeCategory(categoryData).then(response => {
    emit('update:isEditOpen', false)
    emit('refreshTable')
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
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard
      class="pa-sm-9 pa-5"
    >
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="carbon:categories" size="24"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Edit_Category') }}
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
                v-model="categoryData.type_ar"
                :label="t('forms.type_ar')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="categoryData.type_en"
                :label="t('forms.type_en')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="categoryData.description"
                :label="t('forms.description')"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VFileInput
                v-model="categoryData.image"
                :label="t('forms.image')"
                accept="image/*"
                prepend-icon=""
                prepend-inner-icon="mdi-image"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="categoryData.city_ids"
                :items="cities.value"
                :label="t('forms.cities')"
                item-title="name_ar"
                item-value="id"
                multiple
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
