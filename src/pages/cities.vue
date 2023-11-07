<script setup>
import moment from "moment"
import AddCountryDialog from "@core/components/pages/AdditionDialogs/AddCountryDialog.vue"
import { useI18n } from "vue-i18n"
import { useCitiesStore } from "@/store/Cities"

const { t } = useI18n()

const citiesListStore = useCitiesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalCities = ref(0)
const cities = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedCity = ref({})
const isEditOpen = ref(false)

const getCities = () => {
  citiesListStore.fetchCities({
    q: searchQuery.value,
  }).then(response => {
    console.log('Cities => ', response)
    cities.value = response.data.data
    totalPage.value = cities.value / rowPerPage
    totalCities.value = cities.value.length
    currentPage.value = 1
  }).catch(error => {
    console.log(error)
  })
}

// 👉 Fetch Categories
watchEffect(() => {
  getCities()
})


// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateCities = computed(() => {
  totalPage.value = Math.ceil(cities.value.length / rowPerPage.value)

  return cities.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < cities.value.length) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = cities.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= cities.value.length ? firstIndex + (rowPerPage.value - 1) : totalCities.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalCities.value)} الإجمالي `
})

const changeStatus = data => {
  // citiesListStore.changeCountryStatus(data).then(response => {
  //   getCities()
  // })
}

const openDelete = city => {
  isDeleteOpen.value = true
  selectedCity.value = city
}

const openEdit = city => {
  isEditOpen.value = true
  selectedCity.value = city
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
        <VIcon icon="solar:city-broken" size="24"></VIcon>
        <span class="mx-1">{{ t('Cities') }}</span>
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
          @click="isAddOpen = true"
        >
          {{ t('Add_City') }}
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
          </th><th
          scope="col"
          class="font-weight-semibold"
        >
          {{ t('forms.name') }}
        </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.country') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.is_active') }}
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
          v-for="(city, i) in paginateCities"
          :key="city.id"
        >
          <td>
            #{{ (++i) }}
          </td>
          <td>
            {{ city.name_ar }}
          </td>
          <td>
            {{ city.country ? city.country : "السعودية" }}
          </td>
          <td @click="changeStatus(city)" style="cursor: pointer">
            <VIcon icon="ph:dot-bold" :color="city.is_active == true ? '#008000' : '#f00000'" size="32"></VIcon>
            <span>
              {{ city.is_active == true ? t('forms.statuses.active') : t('forms.statuses.inactive') }}
            </span>
          </td>
          <td>
<!--            <VBtn-->
<!--              icon-->
<!--              variant="plain"-->
<!--              color="default"-->
<!--              size="x-small"-->
<!--            >-->
<!--              <VIcon-->
<!--                :size="22"-->
<!--                icon="tabler-eye"-->
<!--              />-->
<!--            </VBtn>-->
            <VBtn
              icon
              variant="plain"
              color="default"
              size="x-small"
              @click="openEdit(city)"
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
              @click="openDelete(city)"
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
        <tfoot v-show="!cities.length">
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
          :total-visible="rowPerPage"
          :length="totalPage"
          @next="nextPage"
          @prev="prevPage"
        />
      </VCardText>
    </VCard>
    <AddCityDialog v-model:isAddOpen="isAddOpen" @refreshTable="getCities" />
    <EditCityDialog
      v-model:isEditOpen="isEditOpen"
      :city="selectedCity"
      @refreshTable="getCities"
    />
    <DeleteCityDialog
      v-model:isDeleteOpen="isDeleteOpen"
      :city="selectedCity"
      @refreshTable="getCities"
    />
  </div>
</template>