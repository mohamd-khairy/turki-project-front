<script setup>
import { useCitiesStore } from "@/store/Cities"
import { useCountriesStore } from "@/store/Countries"
import { useCategoriesStore } from "@/store/Categories"
import { useProductsStore } from "@/store/Products"
import { useCouponsStore } from "@/store/Coupons"
import AppDateTimePicker from '@core/components/AppDateTimePicker.vue'

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  coupon: {
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
const countriesListStore = useCountriesStore()
const categoriesListStore = useCategoriesStore()
const productsListStore = useProductsStore()
const couponsListStore = useCouponsStore()

const products = reactive([])
const countries = reactive([])
const cities = reactive([])
const categories = reactive([])
const subCategories = reactive([])

onMounted(() => {
  countriesListStore.fetchCountries({}).then(response => {
    countries.value = response.data.data
  })
  citiesListStore.fetchCities({}).then(response => {
    cities.value = response.data.data
  })
  categoriesListStore.fetchCategories({}).then(response => {
    categories.value = response.data.data
  })
  categoriesListStore.fetchSubCategories({}).then(response => {
    subCategories.value = response.data.data
  })
  productsListStore.fetchProducts({}).then(response => {
    products.value = response.data.data
  })
})

onUpdated(() => {
  couponData.id = props.coupon.id
  couponData.name = props.coupon.name
  couponData.code = props.coupon.code
  couponData.product_ids = props.coupon.product_ids
  couponData.discount_amount_percent = props.coupon.discount_amount_percent
  couponData.description_ar = props.coupon.description_ar
  couponData.description_en = props.coupon.description_en
  couponData.min_applied_amount = props.coupon.min_applied_amount
  couponData.max_discount = props.coupon.max_discount
  couponData.is_for_all = props.coupon.is_for_all
  couponData.is_by_city = props.coupon.is_by_city
  couponData.is_by_product = props.coupon.is_by_product
  couponData.is_by_country = props.coupon.is_by_country
  couponData.is_by_category = props.coupon.is_by_category
  couponData.is_by_subcategory = props.coupon.is_by_subcategory
  couponData.is_percent = props.coupon.is_percent
  couponData.for_clients_only = props.coupon.for_clients_only
  couponData.is_active = props.coupon.is_active
  couponData.category_parent_ids = props.coupon.category_parent_ids
  couponData.city_ids = props.coupon.city_ids
  couponData.country_ids = props.coupon.country_ids
  couponData.category_child_ids = props.coupon.category_child_ids
  couponData.expire_at = props.coupon.expire_at
  couponData.use_times_per_user = props.coupon.use_times_per_user
})

// Variables
const couponData = reactive({
  id: null,
  name: null,
  code: null,
  product_ids: [],
  discount_amount_percent: 0,
  description_ar: null,
  description_en: null,
  min_applied_amount: 0,
  max_discount: 0,
  is_for_all: 0,
  is_by_city: 0,
  is_by_product: 0,
  is_by_country: 0,
  is_by_category: 0,
  is_by_subcategory: 0,
  is_percent: 0,
  for_clients_only: 0,
  is_active: true,
  category_parent_ids: [],
  city_ids: [],
  country_ids: [],
  category_child_ids: [],
  expire_at: "",
  use_times_per_user: 1,
})

// Functions
const resetForm = () => {
  emit('update:isEditOpen', false)
}

const onFormSubmit = () => {
  couponsListStore.editCoupon(couponData).then(response => {
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
    persistent
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
          <VIcon icon="bxs:coupon" size="24"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Edit_Coupon') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent.stop="onFormSubmit">
          <VRow>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="couponData.name"
                :label="t('forms.name')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="couponData.code"
                :label="t('forms.code')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="couponData.discount_amount_percent"
                :label="t('forms.discount_amount_percent')"
                type="number"
                min="0"
                max="100"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="couponData.min_applied_amount"
                :label="t('forms.min_applied_amount')"
                type="number"
                min="0"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="couponData.max_discount"
                :label="t('forms.max_discount')"
                type="number"
                min="0"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="couponData.description_ar"
                :label="t('forms.description_ar')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="couponData.description_en"
                :label="t('forms.description_en')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="couponData.product_ids"
                :items="products.value"
                :label="t('forms.products')"
                item-title="name_ar"
                item-value="id"
                multiple
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="couponData.country_id"
                :items="countries.value"
                :label="t('forms.countries')"
                item-title="name_ar"
                item-value="id"
                multiple
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="couponData.city_ids"
                :items="cities.value"
                :label="t('forms.cities')"
                item-title="name_ar"
                item-value="id"
                multiple
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="couponData.category_parent_ids"
                :items="categories.value"
                :label="t('forms.categories')"
                item-title="type_ar"
                item-value="id"
                multiple
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="couponData.category_child_ids"
                :items="subCategories.value"
                :label="t('forms.sub_categories')"
                item-title="type_ar"
                item-value="id"
                multiple
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="couponData.use_times_per_user"
                :label="t('forms.use_times_per_user')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <AppDateTimePicker
                v-model="couponData.expire_at"
                :label="t('forms.expire_at')"
                :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                @click.stop
              />
            </VCol>
            <VCol
              cols="12"
              lg="6"
              sm="6"
            >
              <VSwitch :label="t('forms.is_active')" v-model="couponData.is_active"></VSwitch>
            </VCol>
            <VCol
              cols="12"
              lg="6"
              sm="6"
            >
              <VSwitch :label="t('forms.is_for_all')" v-model="couponData.is_for_all"></VSwitch>
            </VCol>
            <VCol
              cols="12"
              lg="6"
              sm="6"
            >
              <VSwitch :label="t('forms.is_by_city')" v-model="couponData.is_by_city"></VSwitch>
            </VCol>
            <VCol
              cols="12"
              lg="6"
              sm="6"
            >
              <VSwitch :label="t('forms.is_by_product')" v-model="couponData.is_by_product"></VSwitch>
            </VCol>
            <VCol
              cols="12"
              lg="6"
              sm="6"
            >
              <VSwitch :label="t('forms.is_by_country')" v-model="couponData.is_by_country"></VSwitch>
            </VCol>
            <VCol
              cols="12"
              lg="6"
              sm="6"
            >
              <VSwitch :label="t('forms.is_by_category')" v-model="couponData.is_by_category"></VSwitch>
            </VCol>
            <VCol
              cols="12"
              lg="6"
              sm="6"
            >
              <VSwitch :label="t('forms.is_by_subcategory')" v-model="couponData.is_by_subcategory"></VSwitch>
            </VCol>
            <VCol
              cols="12"
              lg="6"
              sm="6"
            >
              <VSwitch :label="t('forms.is_percent')" v-model="couponData.is_percent"></VSwitch>
            </VCol>
            <VCol
              cols="12"
              lg="6"
              sm="6"
            >
              <VSwitch :label="t('forms.for_clients_only')" v-model="couponData.for_clients_only"></VSwitch>
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

