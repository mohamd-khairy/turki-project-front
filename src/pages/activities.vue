<script setup>
import { useActivitiesStore } from '@/store/Orders'
import { useI18n } from "vue-i18n"
const { t } = useI18n()

const activitiesListStore = useActivitiesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(7)
const currentPage = ref(1)
const totalPage = ref(1)
const totalActivities = ref(0)
const activities = ref([])
const selectedRows = ref([])

// 👉 Fetch Activities
watchEffect(() => {
  activitiesListStore.fetchActivities({
    q: searchQuery.value,
    status: selectedStatus.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    activities.value = response.data.activities
    totalPage.value = response.data.activities
    totalActivities.value = response.data.totalActivities
  }).catch(error => {
    console.log(error)
  })
})

// 👉 Fetch Activities
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  // const firstIndex = activities.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  // const lastIndex = activities.value.length + (currentPage.value - 1) * rowPerPage.value
  const firstIndex = 0
  const lastIndex = 0

  return ` عرض من ${ firstIndex } إلي ${ lastIndex } من ${ totalActivities.value } الإجمالي `
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex align-center">
        <VIcon icon="game-icons:vertical-activitie" size="24"></VIcon>
        <span class="mx-1"> {{ t('Activities') }} </span>
      </VCardTitle>
      <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
        <!-- 👉 Rows per page -->
        <div style="width: 5rem;">
          <VSelect
            v-model="rowPerPage"
            variant="outlined"
            :items="[7, 10, 20, 30, 50]"
          />
        </div>

        <div class="w-25 d-flex align-center flex-wrap gap-1">
          <!-- 👉 Search  -->
          <div class="w-100 Activitie-list-search">
            <VTextField
              v-model="searchQuery"
              placeholder="بحث"
              density="compact"
              full-width
            />
          </div>
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION Table -->
      <VTable class="text-no-wrap activitie-list-table">
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
          v-for="activitie in activities"
          :key="activitie.id"
        >
          <!-- 👉 Id -->
          <td>
            <RouterLink :to="{ name: 'apps-activitie-preview-id', params: { id: activitie.id } }">
              #{{ activitie.id }}
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
                {{ activitie.activitieStatus }}
              </p>
              <p class="mb-0">
                Balance: {{ activitie.balance }}
              </p>
              <p class="mb-0">
                Due date: {{ activitie.dueDate }}
              </p>
            </VTooltip>
          </td>

          <!-- 👉 total -->
          <td class="text-center text-medium-emphasis">
            ${{ activitie.total }}
          </td>

          <!-- 👉 Date -->
          <td class="text-center text-medium-emphasis">
            {{ activitie.issuedDate }}
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
              :to="{ name: 'apps-activitie-preview-id', params: { id: activitie.id } }"
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

                  <VListItem :to="{ name: '/apps/activities/edit/[id]', params: { id: activitie.id } }">
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
        <tfoot v-show="!activities.length">
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
