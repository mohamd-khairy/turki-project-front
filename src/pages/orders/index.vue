<script setup>
import { useCitiesStore } from "@/store/Cities"
import { useCountriesStore } from "@/store/Countries"
import { useCouponsStore } from "@/store/Coupons"
import { useEmployeesStore } from "@/store/Employees"
import { useOrdersStore } from "@/store/Orders"
import { useProductsStore } from "@/store/Products"
import { useSettingsStore } from "@/store/Settings"
import moment from "moment"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const router = useRouter()


const ordersListStore = useOrdersStore()
const citiesListStore = useCitiesStore()
const countriesListStore = useCountriesStore()
const productsListStore = useProductsStore()
const settingsListStore = useSettingsStore()
const customersListStore = useEmployeesStore()
const couponsListStore = useCouponsStore()
const searchQuery = ref('')
const searchTerm = ref('')
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalOrders = ref(0)
const orders = ref([])
const cities = ref([])
const customers = ref([])
const customersCopy = ref([])
const countries = ref([])
const products = ref([])
const coupons = ref([])
const deliveryPeriods = ref([])
const orderStatuses = ref([])
const allOrderStatuses = ref([])
const dataFrom = ref(1)
const dataTo = ref(1)
const selectedRows = ref([])
const isAddOpen = ref(false)
const isOpen = ref(false)
const selectedOrder = ref({})
const isEditOpen = ref(false)
const isLoading = ref(false)
const isFiltered = ref(false)
const is_production_manager = ref(false)

const filters = reactive({
  city_ids: [],
  country_ids: [],
  order_state_ids: [],
  date_from: null,
  date_to: null,
  delivery_date: null,
  customer_id: null,
  delivery_period_id: null,
})

onMounted(() => {
  getOrders()
  ordersListStore.fetchOrderStatus().then(response => {
    orderStatuses.value = response.data.data
  })
  ordersListStore.fetchAllOrderStatus().then(response => {
    allOrderStatuses.value = response.data.data
  })
  countriesListStore.fetchCountries().then(response => {
    countries.value = response.data.data
  })
  settingsListStore.fetchDelivery_Periods().then(response => {
    deliveryPeriods.value = response.data.data
  })
  productsListStore.fetchProductsAll().then(response => {
    products.value = response.data.data
  })
  couponsListStore.fetchCoupons({ per_page: -1 }).then(response => {
    coupons.value = response.data.data
  })
  customersListStore.fetchCustomers({ wallet: "all" }).then(response => {
    customers.value = response.data.data
    customersCopy.value = response.data.data
  })

  checkRole()
})

watch(() => filters.country_ids, (newVal, oldVal) => {
  citiesListStore.fetchCitiesByCountry(filters.country_ids).then(response => {
    cities.value = response.data.data
  })
})

const getOrders = () => {
  isLoading.value = true
  ordersListStore.fetchOrders({
    q: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
    city_ids: filters.city_ids,
    country_ids: filters.country_ids,
    order_state_ids: filters.order_state_ids,
    date_from: filters.date_from,
    date_to: filters.date_to,
    delivery_date: filters.delivery_date,
    delivery_period_id: filters.delivery_period_id,
    customer_id: filters.customer_id,

  }).then(response => {
    orders.value = response.data.data.data
    totalPage.value = response.data.data.last_page
    dataFrom.value = response.data.data.from
    dataTo.value = response.data.data.to
    totalOrders.value = response.data.data.total
    isLoading.value = false
  }).catch(error => {
    isLoading.value = false
    console.log(error)
  })
}

// watchEffect(() => {
//   getOrders()
// })


// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

watch(() => currentPage.value, (newVal,oldVal) => {
  getOrders()
})

const paginateOrders = computed(() => {
  totalPage.value = Math.ceil(orders.value.length / rowPerPage.value)

  return orders.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

// const filteredItems = () => {
//   return orders.value.filter(item => item.name.toLowerCase().includes(searchQuery.value.toString()))
// }

const searchCustomer = e => {
  if(!searchTerm.value){
    customers.value = customersCopy.value
  }
  customers.value = customers.value.filter(customer => {
    return customer.name.toLowerCase().indexOf(searchTerm.value.toLowerCase()) > -1 || customer.mobile.toLowerCase().indexOf(searchTerm.value.toLowerCase()) > -1
  })
}


const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < orders.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  // const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  // const lastIndex = firstIndex + (rowPerPage.value - 1) <= products.value.length ? firstIndex + (rowPerPage.value - 1) : totalProducts.value

  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(totalOrders.value)} الإجمالي `
})

const changeStatus = data => {
  // ordersListStore.changeCountryStatus(data).then(response => {
  //   getOrders()
  // })
}

const filterOrders = () => {
  isFiltered.value = true
  getOrders()
}

const clearFilter = () => {
  filters.city_ids = [],
  filters.country_ids = [],
  filters.order_state_ids = [],
  filters.date_from = null,
  filters.date_to = null,
  filters.delivery_date = null,
  filters.delivery_period_id = null,
  filters.customer_id = null
  filterOrders()
}

const checkRole = () => {

  const user = JSON.parse(localStorage.getItem('najdUser'))

  is_production_manager.value = user.roles.filter(role => {        
    return role.toLowerCase().indexOf(['logistic_manager']) > -1
  }).length > 0 ? true : false

}

const openDetails = order => {
  router.push(`orders/${order.ref_no}`)
}

const openInvoice = order => {
  router.push(`orders/${order.ref_no}/invoice`)
}

const openEdit = order => {
  isEditOpen.value = true
  selectedOrder.value = order
}

// Functions
const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

const formatDateTime = data => {
  let date = moment(data).format("DD-MM-YYYY")
  let time = moment(data).format("hh:mm:ss A")

  return { date, time }
}
</script>

<template>
  <div>
    <VCard class="mb-5 pa-5">
      <VRow>
        <VCol
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <VRow>
            <VCol
              cols="12"
              class="d-flex align-center gap-3"
            >
              <div class="icon">
                <VIcon
                  icon="material-symbols:globe"
                  color="primary"
                />
              </div>
              <VSelect
                v-model="filters.country_ids"
                :items="countries"
                :label="t('forms.countries')"
                item-title="name_ar"
                item-value="id"
                :disabled="isLoading"
              />
            </VCol>
            <VCol
              cols="12"
              class="d-flex align-center gap-3"
            >
              <div class="icon">
                <VIcon
                  icon="solar:city-broken"
                  color="primary"
                />
              </div>
              <VSelect
                v-model="filters.city_ids"
                :items="cities"
                :label="t('forms.cities')"
                item-title="name_ar"
                item-value="id"
                multiple
                :disabled="isLoading"
              />
            </VCol>
          </VRow>
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <VRow>
            <VCol
              cols="12"
              class="d-flex align-center gap-3"
            >
              <div class="icon">
                <VIcon
                  icon="solar:delivery-broken"
                  color="primary"
                />
              </div>
              <VSelect
                v-model="filters.order_state_ids"
                :items="allOrderStatuses"
                label="حالة الطلب"
                item-title="state_ar"
                item-value="code"
                multiple
                :disabled="isLoading"
              />
            </VCol>
            <VCol
              cols="12"
              class="d-flex align-center gap-3"
            >
              <div class="icon">
                <VIcon
                  icon="clarity:users-line"
                  color="primary"
                />
              </div>
              <VSelect
                v-model="filters.customer_id"
                :items="customers"
                label="العميل"
                item-title="name_mobile"
                item-value="id"
                :disabled="isLoading"
              >
                <template #prepend-item>
                  <VTextField
                    v-model="searchTerm"
                    class="mx-2"
                    clearable
                    placeholder="ابحث عن العميل"
                    @input="searchCustomer"
                  />
                  <VDivider class="mt-2" />
                </template>
              </VSelect>
            </VCol>
          </VRow>
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <VRow>
            <VCol
              cols="12"
              class="d-flex align-center gap-3"
            >
              <div class="icon">
                <VIcon
                  icon="fluent-mdl2:date-time"
                  color="primary"
                />
              </div>
              <VTextField
                v-model="filters.delivery_date"
                type="date"
                :label="t('forms.delivery_date')"
                :disabled="isLoading"
              />
            </VCol>
        
            <!--
              <VCol
              cols="12"
              class="d-flex align-center gap-3"
              >
              <div class="icon">
              <VIcon
              icon="solar:delivery-broken"
              color="primary"
              />
              </div>
              <VSelect
              v-model="filters.order_state_ids"
              :items="orderStatuses"
              label="حالة الطلب"
              item-title="state_ar"
              item-value="code"
              multiple
              :disabled="isLoading"
              />
              </VCol> 
            -->
            <VCol
              cols="12"
              class="d-flex align-center gap-3"
            >
              <div class="icon">
                <VIcon
                  icon="fluent-mdl2:date-time"
                  color="primary"
                />
              </div>
              <VSelect
                v-model="filters.delivery_period_id"
                :items="deliveryPeriods"
                :label="t('Delivery_Periods')"
                item-title="name_ar"
                item-value="id"
                :disabled="isLoading"
              />
            </VCol>
          </VRow>
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <VRow>
            <VCol
              cols="12"
              class="d-flex align-center gap-3"
            >
              <div class="icon">
                <VIcon
                  icon="fluent-mdl2:date-time"
                  color="primary"
                />
              </div>
              <VTextField
                v-model="filters.date_from"
                type="date"
                :label="t('forms.from')"
                :disabled="isLoading"
              />
            </VCol>
            <VCol
              cols="12"
              class="d-flex align-center gap-3"
            >
              <div class="icon">
                <VIcon
                  icon="fluent-mdl2:date-time"
                  color="primary"
                />
              </div>
              <VTextField
                v-model="filters.date_to"
                type="date"
                :label="t('forms.to')"
                :disabled="isLoading"
              />
            </VCol>
          </VRow>
        </VCol>
       
        <VCol
          cols="12"
          md="4"
          sm="6"
          class="d-flex align-center gap-3"
        >
          <VBtn
            v-if="!isLoading"
            prepend-icon="solar:filter-bold-duotone"
            class="w-50"
            :disabled="isLoading"
            @click.stop="filterOrders"
          >
            {{ t('Filter') }}
          </VBtn>
          <VBtn
            v-else
            type="submit"
            class="position-relative me-3 w-100"
          >
            <VIcon
              icon="mingcute:loading-line"
              class="loading"
              size="32"
            />
          </VBtn>
          <VBtn
            prepend-icon="healthicons:x"
            class="w-50"
            :disabled="isLoading || !isFiltered"
            @click.stop="clearFilter"
          >
            {{ t('Clear_Filter') }}
          </VBtn>
        </VCol>
      </VRow>
    </VCard>
    <VCard :loading="isLoading">
      <VCardTitle class="d-flex align-center">
        <VIcon
          icon="solar:delivery-broken"
          size="24"
          color="primary"
        />
        <span class="mx-1">{{ t('Orders') }}</span>
      </VCardTitle>
      <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
        <!-- 👉 Rows per page -->
        <div style="width: 5rem;">
          <VSelect
            v-model="rowPerPage"
            variant="outlined"
            :items="[5, 10, 20, 30, 50]"
            :disabled="isLoading"
          />
        </div>
        <VBtn
          prepend-icon="tabler-plus"
          :disabled="isLoading"
          @click="isAddOpen = true"
        >
          إضافة طلب
        </VBtn>

        <VSpacer />
      </VCardText>

      <VDivider />

      <VTable class="text-no-wrap product-list-table text-center">
        <thead>
          <tr>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.id') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.customer_name') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.address_address') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.delivery_date') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.order_state_ar') }} <br><span class="text-primary">( {{ t('forms.click_change_status') }} )</span>
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.order_payment_status') }}
            </th>
            <!--
              <th
              scope="col"
              class="font-weight-semibold"
              >
              {{ t('forms.order_subtotal') }}
              </th>
            -->
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.payment_type_name') }}
            </th>
            <!--
              <th
              scope="col"
              class="font-weight-semibold"
              >
              {{ t('forms.total_amount') }}
              </th>
            -->
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.total_amount_after_discount') }}
            </th>

            <!--
              <th
              scope="col"
              class="font-weight-semibold"
              >
              {{ t('forms.created_at') }}
              </th>
            -->
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.actions') }}
            </th>
          </tr>
        </thead>

        <tbody v-if="!isLoading">
          <tr
            v-for="(order, i) in orders"
            :key="order.id"
          >
            <!--
              <td>
              #{{ ConvertToArabicNumbers(Intl.NumberFormat().format(++i)) }}
              </td>
            -->
            <td>
              {{ order.ref_no }}
            </td>
            <td>
              {{ order.customer_name + '(' + order.customer_mobile +')' }}
            </td>
            <td>
              {{ order.address_address.toString().length > 20 ? order.address_address.toString().slice(0,20) + "..." : order.address_address }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(formatDateTime(order.delivery_date).date) }}
            </td>
            <td
              v-if=" (order.order_state_id == '101' || order.order_state_id == '105') && is_production_manager"
              @click="openEdit(order)"
            >
              <VChip style="cursor: pointer;">
                {{ order.order_state_ar }}
              </VChip>
            </td>
            <td
              v-else-if="!is_production_manager"
              @click="openEdit(order)"
            >
              <VChip style="cursor: pointer;">
                {{ order.order_state_ar }}
              </VChip>
            </td>
            <td v-else>
              <VChip style="cursor: pointer;">
                {{ order.order_state_ar }}
              </VChip>
            </td>
            <td>
              <VChip
                style="cursor: pointer;"
                :class="{'text-error': order.paid == 0, 'text-success': order.paid == 1}"
              >
                {{ order.paid == 1 ? "مدفوع" : "غير مدفوع" }}
              </VChip>
            </td>
            <!--
              <td>
              {{ ConvertToArabicNumbers(Intl.NumberFormat().format(order.order_subtotal)) }}
              </td>
            -->
            <td>
              {{ order.payment_type_name }}
            </td>
            <!--
              <td>
              {{ ConvertToArabicNumbers(Intl.NumberFormat().format(order.total_amount)) }}
              </td>
            -->
            <td>
              {{ ConvertToArabicNumbers(Intl.NumberFormat().format(parseFloat(order.total_amount_after_discount) + parseFloat(order.wallet_amount_used))) }}
            </td>
            <!--
              <td>
              {{ ConvertToArabicNumbers(formatDateTime(order.created_at).date) }}
              </td>
            -->
            <td>
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openInvoice(order)"
              >
                <VIcon
                  :size="22"
                  icon="iconamoon:invoice-thin"
                />
              </VBtn>
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openDetails(order)"
              >
                <VIcon
                  :size="22"
                  icon="tabler-eye"
                />
              </VBtn>
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="orders.length == 0">
          <tr>
            <td
              colspan="8"
              class="text-center text-body-1"
            >
              لا يوجد بيانات
            </td>
          </tr>
        </tfoot>
      </VTable>
      <!-- !SECTION -->

      <VDivider />

      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
        <span class="text-sm text-disabled">{{ paginationData }}</span>

        <VPagination
          v-model="currentPage"
          size="small"
          :total-visible="5"
          :length="totalPage"
          @next="selectedRows = []"
          @prev="selectedRows = []"
        />
      </VCardText>
    </VCard>
    <OrderInvoice
      v-model:is-open="isOpen"
      :item="selectedOrder"
    />
    <AddOrdersDialog
      v-model:is-add-open="isAddOpen"
      :products="products"
      :countries="countries"
      :cities="cities"
      :customers="customers"
      :delivery-periods="deliveryPeriods"
      :coupons="coupons"
      @refreshTable="getOrders"
    />
    <EditOrderDialog
      v-model:is-edit-open="isEditOpen"
      :item="selectedOrder"
      @refreshTable="getOrders"
    />
  </div>
</template>
