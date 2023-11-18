<script setup>
import moment from "moment"
import { useI18n } from "vue-i18n"
import { useOrdersStore } from "@/store/Orders"

const { t } = useI18n()

const ordersListStore = useOrdersStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalOrders = ref(0)
const orders = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedOrder = ref({})
const isEditOpen = ref(false)

const getOrders = () => {
  ordersListStore.fetchOrders({
    q: searchQuery.value,
    per_page: rowPerPage.value,
  }).then(response => {
    orders.value = response.data.data.data
    totalPage.value = orders.value / rowPerPage
    totalOrders.value = orders.value.length
    currentPage.value = 1
  }).catch(error => {
    console.log(error)
  })
}

// 👉 Fetch Categories
watchEffect(() => {
  getOrders()
})


// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateOrders = computed(() => {
  totalPage.value = Math.ceil(orders.value.length / rowPerPage.value)

  return orders.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < orders.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = orders.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= orders.value.length ? firstIndex + (rowPerPage.value - 1) : totalOrders.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalOrders.value)} الإجمالي `
})

const changeStatus = data => {
  // ordersListStore.changeCountryStatus(data).then(response => {
  //   getOrders()
  // })
}

const openDelete = order => {
  isDeleteOpen.value = true
  selectedOrder.value = order
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
    <VCard>
      <VCardTitle class="d-flex align-center">
        <VIcon icon="solar:delivery-broken" size="24" color="primary"></VIcon>
        <span class="mx-1">{{ t('Orders') }}</span>
      </VCardTitle>
      <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
        <!-- 👉 Rows per page -->
        <div style="width: 5rem;">
          <VSelect
            v-model="rowPerPage"
            variant="outlined"
            :items="[5, 10, 20, 30, 50]"
          />
        </div>

        <VSpacer/>

        <div class="w-25 d-flex align-center flex-wrap gap-2">
          <!-- 👉 Search  -->
          <div class="w-100 product-list-search">
            <VTextField
              v-model="searchQuery"
              placeholder="بحث"
              density="compact"
            />
          </div>
        </div>
      </VCardText>

      <VDivider/>

      <VTable class="text-no-wrap product-list-table">
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
              {{ t('forms.order_state_ar') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.order_subtotal') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.payment_type_name') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.total_amount') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.total_amount_after_discount') }}
            </th>

            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.created_at') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(order, i) in paginateOrders"
            :key="order.id"
          >
            <td>
              #{{ ConvertToArabicNumbers(Intl.NumberFormat().format(++i)) }}
            </td>
            <td>
              {{ order.customer_name }}
            </td>
            <td>
              {{ order.address_address }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(order.delivery_date) }}
            </td>
            <td>
              {{ order.order_state_ar }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(Intl.NumberFormat().format(order.order_subtotal)) }}
            </td>
            <td>
              {{ order.payment_type_name }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(Intl.NumberFormat().format(order.total_amount)) }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(Intl.NumberFormat().format(order.total_amount_after_discount)) }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(formatDateTime(order.created_at).date) }}
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="!orders.length">
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

      <VDivider/>

      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
        <span class="text-sm text-disabled">{{ paginationData }}</span>

        <VPagination
          v-model="currentPage"
          size="small"
          :total-visible="rowPerPage"
          :length="totalPage"
          @next="nextPage"
          @prev="prevPage"
        />
      </VCardText>
    </VCard>

  </div>
</template>
