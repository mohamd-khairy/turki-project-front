<script setup>
import { useI18n } from "vue-i18n"
import { useProductsStore } from "@/store/Products"
import { useBannersStore } from "@/store/Banners"
import { useCategoriesStore } from "@/store/Categories"
import { useCitiesStore } from "@/store/Cities"

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  banner: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isEditOpen',
  'refreshTable',
])

const bannersList = useBannersStore()
const productsList = useProductsStore()
const categoriesList = useCategoriesStore()
const citiesList = useCitiesStore()

onUpdated(() => {
  productsList.fetchProducts().then(response => {
    products.value = response.data.data
  })
  categoriesList.fetchCategories().then(response => {
    categories.value = response.data.data
  })
  citiesList.fetchCities().then(response => {
    cities.value = response.data.data
  })
  bannerData.id = props.banner.id,
  bannerData.title = props.banner.title,
  bannerData.title_color = props.banner.title_color,
  bannerData.sub_title = props.banner.sub_title,
  bannerData.sub_title_color = props.banner.sub_title_color,
  bannerData.button_text = props.banner.button_text,
  bannerData.button_text_color = props.banner.button_text_color,
  bannerData.redirect_url = props.banner.redirect_url,
  bannerData.is_active = props.banner.is_active,
  bannerData.type = props.banner.type,
  bannerData.redirect_mobile_url = props.banner.redirect_mobile_url,
  bannerData.product_id = props.banner.product_id,
  bannerData.category_id = props.banner.category_id,
  bannerData.city_ids = props.banner.city_ids
})

const { t } = useI18n()

const bannerData = reactive({
  id: null,
  title: null,
  title_color: null,
  sub_title: null,
  sub_title_color: null,
  button_text: null,
  button_text_color: null,
  redirect_url: null,
  is_active: null,
  type: null,
  image: {},
  redirect_mobile_url: null,
  product_id: null,
  category_id: null,
  city_ids: null,
})

const products = reactive([])
const categories = reactive([])
const cities = reactive([])

const types = reactive([
  {
    id: 0,
    name: "بنر عادي",
  },
  {
    id: 1,
    name: "رابط بنر خارجي",
  },
  {
    id: 2,
    name: "رابط بنر داخلي",
  },
])

const statuses = reactive([
  {
    id: 0,
    name: "غير نشط",
  },
  {
    id: 1,
    name: "نشط",
  },
])

const resetForm = () => {
  emit('update:isEditOpen', false)
}

const onFormSubmit = () => {
  bannersList.editBanner(bannerData).then(response => {
    emit('refreshTable')
    emit('update:isEditOpen', false)
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
      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit">
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="bannerData.title"
                :label="t('forms.title')"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >

              <VSelect
                v-model="bannerData.type"
                :label="t('forms.type')"
                :items="types"
                item-title="name"
                item-value="id"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
              v-if="bannerData.type == 1"
            >
              <VTextField
                v-model="bannerData.redirect_url"
                :label="t('forms.redirect_url')"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="bannerData.is_active"
                :label="t('forms.status')"
                :items="statuses"
                item-title="name"
                item-value="id"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VFileInput
                v-model="bannerData.image"
                :label="t('forms.image')"
                accept="image/*"
                prepend-icon=""
                prepend-inner-icon="mdi-image"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="bannerData.product_id"
                :items="products.value"
                :label="t('forms.products')"
                item-title="name_ar"
                item-value="id"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="bannerData.category_id"
                :items="categories.value"
                :label="t('forms.categories')"
                item-title="type_ar"
                item-value="id"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="bannerData.city_ids"
                :label="t('forms.cities')"
                :items="cities.value"
                item-title="name_ar"
                item-value="id"
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
                {{ t('buttons.save') }}
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