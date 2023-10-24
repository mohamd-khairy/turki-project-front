<script setup>
import { useCategoriesStore } from '@/store/Categories'

const categoryListStore = useCategoriesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalCategories = ref(0)
const categories = ref([])
const selectedRows = ref([])

// 👉 Fetch Categories
watchEffect(() => {
  categoryListStore.fetchCategories({
    q: searchQuery.value,
    status: selectedStatus.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    categories.value = response.data.categories
    totalPage.value = response.data.totalPage
    totalCategories.value = response.data.totalCategories
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
  // const firstIndex = categories.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  // const lastIndex = categories.value.length + (currentPage.value - 1) * rowPerPage.value
  const firstIndex = 0
  const lastIndex = 0

  return ` عرض من ${ firstIndex } إلي ${ lastIndex } من ${ totalCategories.value } الإجمالي `
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex align-center">
        <VIcon icon="carbon:categories" size="24"></VIcon>
        <span class="mx-1">الفئات</span>
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
<!--         👉 Create category :to="{ name: 'apps-category-add' }"-->
                <VBtn
                  prepend-icon="tabler-plus"
                >
                  إضافة فئة
                </VBtn>

        <VSpacer />

        <div class="w-25 d-flex align-center flex-wrap gap-2">
          <!-- 👉 Search  -->
          <div class="w-100 category-list-search">
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
      <VTable class="text-no-wrap category-list-table">
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
          v-for="category in categories"
          :key="category.id"
        >
          <!-- 👉 Id -->
          <td>
            <RouterLink :to="{ name: 'apps-category-preview-id', params: { id: category.id } }">
              #{{ category.id }}
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
                {{ category.categoryStatus }}
              </p>
              <p class="mb-0">
                Balance: {{ category.balance }}
              </p>
              <p class="mb-0">
                Due date: {{ category.dueDate }}
              </p>
            </VTooltip>
          </td>

          <!-- 👉 total -->
          <td class="text-center text-medium-emphasis">
            ${{ category.total }}
          </td>

          <!-- 👉 Date -->
          <td class="text-center text-medium-emphasis">
            {{ category.issuedDate }}
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
              :to="{ name: 'apps-category-preview-id', params: { id: category.id } }"
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

                  <VListItem :to="{ name: '/apps/category/edit/[id]', params: { id: category.id } }">
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
        <tfoot v-show="!categories.length">
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
