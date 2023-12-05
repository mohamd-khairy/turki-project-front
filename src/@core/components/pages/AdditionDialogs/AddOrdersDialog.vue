<script setup>
import AddProductQunatity from "@/pages/orders/[id]/AddProductQunatity.vue"
import { useI18n } from "vue-i18n"
import {
  requiredValidator,
} from '@validators'

import { useSettingsStore } from "@/store/Settings"
import { useOrdersStore } from "@/store/Orders"
import moment from "moment"

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  countries: {
    type: Array,
    required: true,
  },
  cities: {
    type: Array,
    required: true,
  },
  deliveryPeriods: {
    type: Array,
    required: true,
  },
  coupons: {
    type: Array,
    required: true,
  },
  customers: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'update:isAddOpen',
  'refreshTable',
])

const settingsListStore = useSettingsStore()
const ordersListStore = useOrdersStore()

const { t } = useI18n()

const isQuantityOpen = ref(false)
const selectedProduct = ref({})
const delivery_date = ref(null)

const itemData = reactive({
  customer_id: null,
  country_id: null,
  city_id: null,
  delivery_date: null,
  delivery_period_id: null,
  using_wallet: false,
  address_id: null,
  discount_code: null,
  products: [],
})

const form = ref()
const isLoading = ref(false)
const addresses = ref([])

const resetForm = () => {
  emit('update:isAddOpen', false)
}

const changeDate = ev => {
  itemData.delivery_date = moment(delivery_date.value).format("MM-DD")
}

watch(() => itemData.customer_id, (newVal, oldVal) => {
  addresses.value = getAddresses()
})

const getAddresses = () => {
  let selected_customer = props.customers.filter(obj => obj.id === itemData.customer_id)
  let addresses = selected_customer[0].addresses

  return addresses
}

const onFormSubmit = () => {
  isLoading.value = true
  ordersListStore.storeOrder(itemData).then(response => {
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

const getProductData = ev => {
  isQuantityOpen.value = true
  selectedProduct.value = ev
}

const dialogModelValueUpdate = val => {
  emit('update:isAddOpen', val)
}

const AddQuantity = data => {
  itemData.products.push({
    product_id: selectedProduct.value.value,
    quantity: data.value,
  })
}
</script>

<template>
  <div>
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
            <VIcon icon="solar:tag-broken" size="24"
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
              >
                <VSelect
                  v-model="itemData.customer_id"
                  :items="props.customers"
                  :label="t('Customers')"
                  item-title="name"
                  item-value="id"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VSelect
                  v-model="itemData.country_id"
                  :items="props.countries"
                  :label="t('Countries')"
                  item-title="name_ar"
                  item-value="id"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VSelect
                  v-model="itemData.city_id"
                  :items="props.cities"
                  :label="t('Cities')"
                  item-title="name_ar"
                  item-value="id"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VTextField
                  v-model="delivery_date"
                  type="date"
                  :label="t('forms.delivery_date')"
                  :rules="[requiredValidator]"
                  @input="changeDate($event.target.value)"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VSelect
                  v-model="itemData.delivery_period_id"
                  :items="props.deliveryPeriods"
                  :label="t('Delivery_Periods')"
                  item-title="name_ar"
                  item-value="id"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                v-if="itemData.customer_id !== null"
              >
                <VSelect
                  v-model="itemData.address_id"
                  :items="addresses"
                  :label="t('forms.customer_addresses')"
                  item-title="address"
                  item-value="id"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VSelect
                  v-model="itemData.discount_code"
                  :items="props.coupons"
                  :label="t('Coupons')"
                  item-title="name"
                  item-value="name"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VSelect
                  :items="products"
                  :label="t('Products')"
                  item-title="name_ar"
                  item-value="id"
                  multiple
                >
                  <template v-slot:selection="{ item }">
                    <v-chip @click.prevent.stop="getProductData(item)">
                      <span>{{ item.title }}</span>
                    </v-chip>
                  </template>
                </VSelect>
                <span class="text-sm mt-1 font-weight-bold">* إضغط علي المنتج لإضافة الكمية</span>
              </VCol>
              <VCol
                cols="12"
              >
                <VSwitch
                  v-model="itemData.using_wallet"
                  :label="t('forms.using_wallet')"
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

    <AddProductQunatity v-model:is-add-open="isQuantityOpen" @addProductQuantity="AddQuantity"></AddProductQunatity>
  </div>
</template>
