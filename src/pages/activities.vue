<script setup>
import moment from "moment"
import { useI18n } from "vue-i18n"
import { useActivitiesStore } from "@/store/Activities"

const { t } = useI18n()

const activitesListStore = useActivitiesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalActivites = ref(0)
const dataFrom = ref(0)
const dataTo = ref(0)
const activites = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedOrder = ref({})
const isEditOpen = ref(false)

const getActivites = () => {
  activitesListStore.fetchActivities({
    q: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    activites.value = response.data.data.data
    totalPage.value = response.data.data.last_page
    dataFrom.value = response.data.data.from
    dataTo.value = response.data.data.to
    totalActivites.value = response.data.data.total
  }).catch(error => {
    console.log(error)
  })
}

// 👉 Fetch Categories
watchEffect(() => {
  getActivites()
})


// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateActivites = computed(() => {
  totalPage.value = Math.ceil(activites.value.length / rowPerPage.value)

  return activites.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < activites.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  // const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  // const lastIndex = firstIndex + (rowPerPage.value - 1) <= products.value.length ? firstIndex + (rowPerPage.value - 1) : totalProducts.value

  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(totalActivites.value)} الإجمالي `
})

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
        <VIcon icon="octicon:log-24" size="24" color="primary"></VIcon>
        <span class="mx-1">{{ t('Activites') }}</span>
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


      </VCardText>

      <VDivider/>

      <VTable class="text-no-wrap product-list-table">
        <thead>
        <tr>
          <th
            scope="col"
            class="font-weight-semibold"
          >
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.log_name') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.causer') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.causer_type') }}
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
            {{ t('forms.subject') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.subject_type') }}
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
          v-for="(order, i) in activites"
          :key="order.id"
        >
          <td>
            #{{ ConvertToArabicNumbers(Intl.NumberFormat().format(++i)) }}
          </td>
          <td>
            {{ order.log_name }}
          </td>
          <td>
            {{ order.causer ? order.causer.email ? order.causer.email : '-' : '-' }}
          </td>
          <td>
            {{ order.causer_type }}
          </td>
          <td>
            {{ order.description ? order.description : '-' }}
          </td>
<!--          <td>-->
<!--            {{ order.subject ? order.subject.name_ar ? order.subject.name_ar : '-' : '-' }}-->
<!--          </td>-->
          <td>
            <div v-for="(attr, ind) in order.properties.attributes" :key="ind">
              <VChip>{{ attr }}</VChip>
              :
              <VChip> {{ ind }} </VChip>
            </div>
          </td>
          <td>
            {{ order.subject_type }}
          </td>

          <td>
            {{ ConvertToArabicNumbers(formatDateTime(order.created_at).date) }}
          </td>
        </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="!activites.length">
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
          @next="selectedRows = []"
          @prev="selectedRows = []"
        />
      </VCardText>
    </VCard>

  </div>
</template>
