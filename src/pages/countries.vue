<script setup>
import { useCountriesStore } from "@/store/Countries"

const productListStore = useCountriesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalProducts = ref(0)
const products = ref([])
const selectedRows = ref([])

// 👉 Fetch Categories
watchEffect(() => {
  productListStore.fetchCountries({
    q: searchQuery.value,
    status: selectedStatus.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    products.value = response.data.categories
    totalPage.value = response.data.total
    totalProducts.value = response.data.total
  }).catch(error => {
    console.log(error)
  })
})

// 👉 Fetch Categories
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  // const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  // const lastIndex = products.value.length + (currentPage.value - 1) * rowPerPage.value
  const firstIndex = 0
  const lastIndex = 0

  return ` عرض من ${ firstIndex } إلي ${ lastIndex } من ${ totalProducts.value } الإجمالي `
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex align-center">
        <VIcon icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products" size="24"></VIcon>
        <span class="mx-1">البلاد</span>
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
          إضافة بلد
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

      <!-- SECTION Table -->
      <VTable class="text-no-wrap product-list-table">
        <!-- 👉 Table head -->
        <thead>
        <tr>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            ID
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            <VIcon icon="tabler-trending-up" />
          </th>
          <th
            scope="col"
            class="text-center font-weight-semibold"
          >
            TOTAL
          </th>
          <th
            scope="col"
            class="text-center font-weight-semibold"
          >
            ISSUED DATE
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            <span class="ms-2">ACTIONS</span>
          </th>
        </tr>
        </thead>

        <!-- 👉 Table Body -->
        <tbody>
        <tr
          v-for="product in products"
          :key="product.id"
        >
          <!-- 👉 Id -->
          <td>
            <RouterLink :to="{ name: 'apps-product-preview-id', params: { id: product.id } }">
              #{{ product.id }}
            </RouterLink>
          </td>

          <!-- 👉 Trending -->
          <td>
            <VTooltip>
              <template #activator="{ props }">
                <VAvatar
                  :size="30"
                  v-bind="props"
                  variant="tonal"
                >
                  <VIcon
                    :size="20"
                  />
                </VAvatar>
              </template>
              <p class="mb-0">
                {{ product.productStatus }}
              </p>
              <p class="mb-0">
                Balance: {{ product.balance }}
              </p>
              <p class="mb-0">
                Due date: {{ product.dueDate }}
              </p>
            </VTooltip>
          </td>

          <!-- 👉 total -->
          <td class="text-center text-medium-emphasis">
            ${{ product.total }}
          </td>

          <!-- 👉 Date -->
          <td class="text-center text-medium-emphasis">
            {{ product.issuedDate }}
          </td>

          <!-- 👉 Actions -->
          <td style="width: 7.5rem;">
            <VBtn
              icon
              variant="plain"
              color="default"
              size="x-small"
            >
              <VIcon
                icon="tabler-mail"
                :size="22"
              />
            </VBtn>

            <VBtn
              icon
              variant="plain"
              color="default"
              size="x-small"
              :to="{ name: 'apps-product-preview-id', params: { id: product.id } }"
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
            >
              <VIcon
                :size="22"
                icon="tabler-dots-vertical"
              />
              <VMenu activator="parent">
                <VList density="compact">
                  <VListItem value="Download">
                    <template #prepend>
                      <VIcon
                        size="22"
                        class="me-3"
                        icon="tabler-download"
                      />
                    </template>

                    <VListItemTitle>Download</VListItemTitle>
                  </VListItem>

                  <VListItem :to="{ name: '/apps/product/edit/[id]', params: { id: product.id } }">
                    <template #prepend>
                      <VIcon
                        size="22"
                        class="me-3"
                        icon="tabler-pencil"
                      />
                    </template>

                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>
                  <VListItem value="Duplicate">
                    <template #prepend>
                      <VIcon
                        size="22"
                        class="me-3"
                        icon="tabler-stack"
                      />
                    </template>

                    <VListItemTitle>Duplicate</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
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
