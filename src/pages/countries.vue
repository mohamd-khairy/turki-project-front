<script setup>
import moment from "moment"
import AddCountryDialog from "@core/components/pages/AdditionDialogs/AddCountryDialog.vue"
import { useCountriesStore } from "@/store/Countries"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const countriesListStore = useCountriesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalCountries = ref(0)
const countries = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedCountry = ref({})
const isEditOpen = ref(false)

const getCountries = () => {
  countriesListStore.fetchCountries({
    q: searchQuery.value,
  }).then(response => {
    countries.value = response.data.data
    totalPage.value = countries.value / rowPerPage
    totalCountries.value = countries.value.length
    currentPage.value = 1
  }).catch(error => {
    console.log(error)
  })
}

// 👉 Fetch Categories
watchEffect(() => {
  getCountries()
})


// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateCountries = computed(() => {
  totalPage.value = Math.ceil(countries.value.length / rowPerPage.value)

  return countries.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < countries.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = countries.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= countries.value.length ? firstIndex + (rowPerPage.value - 1) : totalCountries.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalCountries.value)} الإجمالي `
})

const changeStatus = data => {
  countriesListStore.changeCountryStatus(data).then(response => {
    getCountries()
  })
}

const openDelete = banner => {
  isDeleteOpen.value = true
  selectedCountry.value = banner
}

const openEdit = banner => {
  isEditOpen.value = true
  selectedCountry.value = banner
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
        <VIcon icon="material-symbols:globe" size="24" color="primary"></VIcon>
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
          v-can="'create-country'"
          prepend-icon="tabler-plus"
          @click="isAddOpen = true"
        >
          {{ t('Add_Country') }}
        </VBtn>

        <VSpacer />


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
              {{ t('forms.currency') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.phone_code') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.code') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.is_active') }} ( {{ t('forms.statuses.change') }} )
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
            v-for="(country, i) in paginateCountries"
            :key="country.id"
          >
            <td>
              #{{ (++i) }}
            </td>
            <td>
              {{ country.name_ar }}
            </td>
            <td>
              {{ country.currency_ar }}
            </td>
            <td>
              {{ (country.phone_code) }}
            </td>
            <td>
              {{ (country.code) }}
            </td>
            <td @click="changeStatus(country)" style="cursor: pointer">
              <VIcon icon="ph:dot-bold" :color="country.is_active == true ? '#008000' : '#f00000'" size="32"></VIcon>
              <span>
                {{ country.is_active == true ? t('forms.statuses.active') : t('forms.statuses.inactive') }}
              </span>
            </td>
            <td>
              {{ (formatDateTime(country.created_at).date) }}
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
                v-can="'update-country'"
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(country)"
              >
                <VIcon
                  :size="22"
                  icon="tabler-pencil"
                />
              </VBtn>
              <VBtn
                v-can="'delete-country'"
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openDelete(country)"
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
        <tfoot v-show="!countries.length">
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
    <AddCountryDialog v-model:isAddOpen="isAddOpen" @refreshTable="getCountries" />
    <EditCountryDialog
      v-model:isEditOpen="isEditOpen"
      :country="selectedCountry"
      @refreshTable="getCountries"
    />
    <DeleteCountryDialog
      v-model:isDeleteOpen="isDeleteOpen"
      :country="selectedCountry"
      @refreshTable="getCountries"
    />
  </div>
</template>
