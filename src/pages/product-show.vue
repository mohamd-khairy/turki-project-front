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
  if ((currentPage.value * rowPerPage.value) < products.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
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
        <VIcon icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products" size="24"
               color="primary"
        ></VIcon>
        <span class="mx-1">عرض المنتج</span>
      </VCardTitle>

      <VDivider/>


      <VDivider/>

      <!-- SECTION Pagination -->
      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
        <!-- 👉 Pagination meta -->
        <span class="text-sm text-disabled">{{ paginationData }}</span>


      </VCardText>
    </VCard>
  </div>
</template>
