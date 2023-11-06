<script setup>
import { useProductsStore } from "@/store/Products"
import moment from "moment/moment"

const productListStore = useProductsStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalProducts = ref(0)
const products = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedProduct = ref({})
const isEditOpen = ref(false)

const { t } = useI18n()

// 👉 Fetch Categories
const getProducts = () => {
  productListStore.fetchProducts({
    q: searchQuery.value,
    // status: selectedStatus.value,
    // perPage: rowPerPage.value,
    // currentPage: currentPage.value,
  }).then(response => {
    products.value = response.data.data
    totalPage.value = products.value / rowPerPage
    totalProducts.value = products.value.length
    currentPage.value = 1
  }).catch(error => {
    console.log(error)
  })
}

watchEffect(() => {
  getProducts()
})

watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateProducts = computed(() => {
  totalPage.value = Math.ceil(products.value.length / rowPerPage.value)

  return products.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < products.value.length) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= products.value.length ? firstIndex + (rowPerPage.value - 1) : totalProducts.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalProducts.value)} الإجمالي `
})

const openDelete = product => {
  isDeleteOpen.value = true
  selectedProduct.value = product
}

const openEdit = product => {
  isEditOpen.value = true
  selectedProduct.value = product
}

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
        <VIcon icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products" size="24"></VIcon>
        <span class="mx-1">المنتجات</span>
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
        <!--         👉 Create product :to="{ name: 'apps-product-add' }"-->
        <VBtn
          prepend-icon="tabler-plus"
        >
          إضافة منتج
        </VBtn>

        <VSpacer />

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

      <VDivider />

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
              {{ t('forms.name') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.description') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.status') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.delivered') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.picked_up') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.price') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.sale_price') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.category') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.sub_category') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.created_at') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.actions') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(product, i) in paginateProducts"
            :key="product.id"
          >
            <td>
              #{{ ++i }}
            </td>
            <td>
              {{ product.name_ar }}
            </td>
            <td>
              {{ product.description_ar.toString().length > 20 ? product.description_ar.toString().slice(0, 20) + '...' : product.description_ar }}
            </td>
            <td>
              <VIcon icon="ph:dot-bold" :color="product.is_active == true ? '#008000' : '#f00000'" size="32"></VIcon>
              <span>
                {{ product.is_active == true ? t('forms.statuses.active') : t('forms.statuses.inactive') }}
              </span>
            </td>
            <td>
              <VIcon :icon="product.is_delivered == true ? 'material-symbols-light:done-all' : 'material-symbols-light:close'" :color="product.is_delivered == true ? '#008000' : '#f00000'" size="24"></VIcon>
            </td>
            <td>
              <VIcon :icon="product.is_picked_up == true ? 'material-symbols-light:done-all' : 'material-symbols-light:close'" :color="product.is_picked_up == true ? '#008000' : '#f00000'" size="24"></VIcon>
            </td>
            <td>
              {{ ConvertToArabicNumbers(Intl.NumberFormat().format(product.price)) }} {{ t('riyal') }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(Intl.NumberFormat().format(product['sale price'] ?? 0)) }} {{ t('riyal') }}
            </td>
            <td>
              {{ product.category.type_ar }}
            </td>
            <td>
              {{ product.sub_category.type_ar }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(formatDateTime(product.created_at).date) }}
            </td>
            <td style="width: 7.5rem;">
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
              >
                <VIcon
                  :size="22"
                  icon="tabler-eye"
                />
              </VBtn>
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(product)"
              >
                <VIcon
                  :size="22"
                  icon="tabler-pencil"
                />
              </VBtn>
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openDelete(product)"
              >
                <VIcon
                  :size="22"
                  icon="tabler-trash"
                />
              </VBtn>
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="!products.length">
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

      <!-- SECTION Pagination -->
      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
        <!-- 👉 Pagination meta -->
        <span class="text-sm text-disabled">{{ paginationData }}</span>

        <!-- 👉 Pagination -->
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
  </div>
</template>
