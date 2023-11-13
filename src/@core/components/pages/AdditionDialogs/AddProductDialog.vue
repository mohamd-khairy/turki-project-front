<script setup>
import { useI18n } from "vue-i18n"
import {
  requiredValidator,
} from '@validators'
import { useCitiesStore } from "@/store/Cities"
import { useCategoriesStore } from "@/store/Categories"
import { useProductsStore } from "@/store/Products"
import { useSettingsStore } from "@/store/Settings"

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isAddOpen',
  'refreshTable',
])

const settingsListStore = useSettingsStore()
const productsListStore = useProductsStore()
const citiesListStore = useCitiesStore()
const categoryListStore = useCategoriesStore()

const { t } = useI18n()

const cities = reactive([])
const categories = reactive([])
const sub_categories = reactive([])
const preparations = reactive([])
const sizes = reactive([])
const cuts = reactive([])
const payment_type_ids = reactive([])

const itemData = reactive({
  name_ar: "",
  name_en: "",
  weight: "",
  calories: "",
  description_ar: "",
  description_en: "",
  sale_price: 0.00,
  price: 0,
  is_active: 0,
  is_available: 0,
  is_kwar3: 0,
  is_Ras: 0,
  is_lyh: 0,
  is_karashah: 0,
  category_id: null,
  sub_category_id: null,
  is_shalwata: 0,
  is_delivered: 0,
  is_picked_up: 0,
  preparation_ids: [],
  size_ids: [],
  cut_ids: [],
  payment_type_ids: [],
  city_ids: [],
  not_dates: [
    {
      date_mm_dd: null,
      delivery_period_ids: [
        {
          delivery_period_id: null,
          city_id: null,
        },
        {
          delivery_period_id: null,
          city_id: null,
        },
      ],
    },
  ],
})

onMounted(() => {
  citiesListStore.fetchCities({ pageSize: -1 }).then(response => {
    cities.value = response.data.data
  })
  categoryListStore.fetchCategories({ pageSize: -1 }).then(response => {
    categories.value = response.data.data
  })
  categoryListStore.fetchSubCategories({ pageSize: -1 }).then(response => {
    sub_categories.value = response.data.data
  })
  settingsListStore.fetchProductSize({ pageSize: -1 }).then(response => {
    sizes.value = response.data.data
  })
  settingsListStore.fetchProductCut({ pageSize: -1 }).then(response => {
    cuts.value = response.data.data
  })
  settingsListStore.fetchProductPerparation({ pageSize: -1 }).then(response => {
    preparations.value = response.data.data
  })
  settingsListStore.fetchPaymentTypes({ pageSize: -1 }).then(response => {
    payment_type_ids.value = response.data.data
  })
})

const form = ref()
const isLoading = ref(false)

const resetForm = () => {
  emit('update:isAddOpen', false)
}

const onFormSubmit = () => {
  isLoading.value = true
  productsListStore.storeProduct(itemData).then(response => {
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
          <VIcon icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products" size="24"
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
              md="6"
            >
              <VTextField
                v-model="itemData.name_ar"
                :label="t('forms.name_ar')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.name_en"
                :label="t('forms.name_en')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.weight"
                :label="t('forms.weight')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.calories"
                :label="t('forms.calories')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.description_ar"
                :label="t('forms.description_ar')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.description_en"
                :label="t('forms.description_en')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.sale_price"
                :label="t('forms.sale_price')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.price"
                :label="t('forms.price')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.category_id"
                :items="categories.value"
                :label="t('forms.categories')"
                item-title="type_ar"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.sub_category_id"
                :items="sub_categories.value"
                :label="t('forms.sub_categories')"
                item-title="type_ar"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.cut_ids"
                :items="cuts.value"
                :label="t('forms.product_cut')"
                item-title="name_ar"
                item-value="id"
                multiple
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.size_ids"
                :items="sizes.value"
                :label="t('forms.product_size')"
                item-title="name_ar"
                item-value="id"
                multiple
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.preparation_ids"
                :items="preparations.value"
                :label="t('forms.product_preparation')"
                item-title="name_ar"
                item-value="id"
                multiple
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.city_ids"
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
              md="6"
            >
              <VSelect
                v-model="itemData.payment_type_ids"
                :items="payment_type_ids.value"
                :label="t('forms.payment_type_ids')"
                item-title="name_ar"
                item-value="id"
                multiple
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12" md="6"></VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_active"
                :label="t('forms.is_active')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_available"
                :label="t('forms.is_available')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_kwar3"
                :label="t('forms.is_kwar3')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_Ras"
                :label="t('forms.is_Ras')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_lyh"
                :label="t('forms.is_lyh')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_karashah"
                :label="t('forms.is_karashah')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_shalwata"
                :label="t('forms.is_shalwata')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_delivered"
                :label="t('forms.is_delivered')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_picked_up"
                :label="t('forms.is_picked_up')"
                :rules="[requiredValidator]"
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
