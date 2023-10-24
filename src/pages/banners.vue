<script setup>
import { useBannersStore } from '@/store/Banners'
import { useI18n } from "vue-i18n"
const { t } = useI18n()

const bannersListStore = useBannersStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalBanners = ref(0)
const banners = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const currentBillingAddress = {
  companyName: 'Pixinvent',
  billingEmail: 'gertrude@gmail.com',
  taxID: 'TAX-875623',
  vatNumber: 'SDF754K77',
  address: '100 Water Plant Avenue, Building 1303 Wake Island',
  contact: '+1(609) 933-44-22',
  country: 'USA',
  state: 'Queensland',
  zipCode: '403114',
}
// Functions
const addNewBanner = () => {
  console.log("Done !")
}


// 👉 Fetch Banners
watchEffect(() => {
  bannersListStore.fetchBanners({
    q: searchQuery.value,
    status: selectedStatus.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    banners.value = response.data.banners
    totalPage.value = response.data.banners
    totalBanners.value = response.data.totalBanners
  }).catch(error => {
    console.log(error)
  })
})

// 👉 Fetch Banners
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  // const firstIndex = banners.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  // const lastIndex = banners.value.length + (currentPage.value - 1) * rowPerPage.value
  const firstIndex = 0
  const lastIndex = 0

  return ` عرض من ${ firstIndex } إلي ${ lastIndex } من ${ totalBanners.value } الإجمالي `
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex align-center">
        <VIcon icon="game-icons:vertical-banner" size="24"></VIcon>
        <span class="mx-1"> {{ t('Banners') }} </span>
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
        <!-- 👉 Create banner :to="{ name: 'apps-banner-add' }" -->
        <VBtn
          prepend-icon="tabler-plus"
          @click="isAddOpen = true"
        >
          {{ t('Add_Banner') }}
        </VBtn>

        <VSpacer />

        <div class="w-25 d-flex align-center flex-wrap gap-1">
          <!-- 👉 Search  -->
          <div class="w-100 banner-list-search">
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
      <VTable class="text-no-wrap banner-list-table">
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
          v-for="banner in banners"
          :key="banner.id"
        >
          <!-- 👉 Id -->
          <td>
            <RouterLink :to="{ name: 'apps-banner-preview-id', params: { id: banner.id } }">
              #{{ banner.id }}
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
                {{ banner.bannerStatus }}
              </p>
              <p class="mb-0">
                Balance: {{ banner.balance }}
              </p>
              <p class="mb-0">
                Due date: {{ banner.dueDate }}
              </p>
            </VTooltip>
          </td>

          <!-- 👉 total -->
          <td class="text-center text-medium-emphasis">
            ${{ banner.total }}
          </td>

          <!-- 👉 Date -->
          <td class="text-center text-medium-emphasis">
            {{ banner.issuedDate }}
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
              :to="{ name: 'apps-banner-preview-id', params: { id: banner.id } }"
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

                  <VListItem :to="{ name: '/apps/banner/edit/[id]', params: { id: banner.id } }">
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
        <tfoot v-show="!banners.length">
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

    <!--  Dialogs  -->
    <AddBannerDialog v-model:isAddOpen="isAddOpen"
                     :billing-address="currentBillingAddress" />
  </div>
</template>
<script setup>
</script>
