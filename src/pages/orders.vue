<script setup>
import { useOrdersStore } from '@/store/Orders'

const orderListStore = useOrdersStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalOrders = ref(0)
const orders = ref([])
const selectedRows = ref([])

// 👉 Fetch Orders
watchEffect(() => {
  orderListStore.fetchOrders({
    q: searchQuery.value,
    status: selectedStatus.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    orders.value = response.data.orders
    totalPage.value = response.data.totalPage
    totalOrders.value = response.data.totalOrders
  }).catch(error => {
    console.log(error)
  })
})

// 👉 Fetch Orders
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  // const firstIndex = orders.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  // const lastIndex = orders.value.length + (currentPage.value - 1) * rowPerPage.value
  const firstIndex = 0
  const lastIndex = 0

  return ` عرض من ${ firstIndex } إلي ${ lastIndex } من ${ totalOrders.value } الإجمالي `
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex align-center">
        <VIcon icon="solar:delivery-broken" size="24"></VIcon>
        <span class="mx-1">الطلبات</span>
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
        <!-- 👉 Create order :to="{ name: 'apps-order-add' }" -->
        <!--        <VBtn-->
        <!--          prepend-icon="tabler-plus"-->
        <!--        >-->
        <!--          Create order-->
        <!--        </VBtn>-->

        <VSpacer />

        <div class="w-25 d-flex align-center flex-wrap gap-2">
          <!-- 👉 Search  -->
          <div class="w-100 order-list-search">
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
      <VTable class="text-no-wrap order-list-table">
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
          v-for="order in orders"
          :key="order.id"
        >
          <!-- 👉 Id -->
          <td>
            <RouterLink :to="{ name: 'apps-order-preview-id', params: { id: order.id } }">
              #{{ order.id }}
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
                {{ order.orderStatus }}
              </p>
              <p class="mb-0">
                Balance: {{ order.balance }}
              </p>
              <p class="mb-0">
                Due date: {{ order.dueDate }}
              </p>
            </VTooltip>
          </td>

          <!-- 👉 total -->
          <td class="text-center text-medium-emphasis">
            ${{ order.total }}
          </td>

          <!-- 👉 Date -->
          <td class="text-center text-medium-emphasis">
            {{ order.issuedDate }}
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
              :to="{ name: 'apps-order-preview-id', params: { id: order.id } }"
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

                  <VListItem :to="{ name: '/apps/order/edit/[id]', params: { id: order.id } }">
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
<script setup>
</script>
