<script setup>
import moment from "moment"
import { useI18n } from "vue-i18n"
import { useEmployeesStore } from "@/store/Employees"

const { t } = useI18n()

const employeesListStore = useEmployeesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalCities = ref(0)
const employees = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedEmployee = ref({})
const isEditOpen = ref(false)

const getEmployees = () => {
  employeesListStore.fetchEmployees({
    q: searchQuery.value,
  }).then(response => {
    employees.value = response.data.data.data
    totalPage.value = employees.value / rowPerPage
    totalCities.value = employees.value.length
    currentPage.value = 1
  }).catch(error => {
    console.log(error)
  })
}

// 👉 Fetch Categories
watchEffect(() => {
  getEmployees()
})


// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateEmployees = computed(() => {
  totalPage.value = Math.ceil(employees.value.length / rowPerPage.value)

  return employees.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < employees.value.length) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = employees.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= employees.value.length ? firstIndex + (rowPerPage.value - 1) : totalCities.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalCities.value)} الإجمالي `
})

const changeStatus = data => {
  // employeesListStore.changeCountryStatus(data).then(response => {
  //   getCities()
  // })
}

const openDelete = employee => {
  isDeleteOpen.value = true
  selectedEmployee.value = employee
}

const openEdit = employee => {
  isEditOpen.value = true
  selectedEmployee.value = employee
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
        <VIcon icon="ph:users-four" size="24"></VIcon>
        <span class="mx-1">{{ t('Employees') }}</span>
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
          {{ t('Add_Employee') }}
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
              {{ t('forms.age') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.gender') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.email') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.phone') }}
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
            v-for="(employee, i) in paginateEmployees"
            :key="employee.id"
          >
            <td>
              #{{ (++i) }}
            </td>
            <td>
              {{ employee.username }}
            </td>
            <td>
              {{ employee.age }}
            </td>
            <td>
              <VIcon :icon="employee.gender == 0 ? 'material-symbols-light:female' : 'material-symbols-light:male'"></VIcon>
              <span class="mx-1">
                {{ employee.gender == 0 ? 'أنثي' : 'ذكر'}}
              </span>
            </td>
            <td>
              {{ employee.email }}
            </td>
            <td>
              {{ employee.mobile }}
            </td>
            <td>
              <VIcon icon="ph:dot-bold" :color="employee.is_active == true ? '#008000' : '#f00000'" size="32"></VIcon>
              <span>
                {{ employee.is_active == true ? t('forms.statuses.active') : t('forms.statuses.inactive') }}
              </span>
            </td>
            <td>
              {{ (formatDateTime(employee.created_at).date) }}
            </td>

            <td>
<!--              <VBtn-->
<!--                icon-->
<!--                variant="plain"-->
<!--                color="default"-->
<!--                size="x-small"-->
<!--              >-->
<!--                <VIcon-->
<!--                  :size="22"-->
<!--                  icon="tabler-eye"-->
<!--                />-->
<!--              </VBtn>-->
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(employee)"
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
                @click="openDelete(employee)"
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
        <tfoot v-show="!employees.length">
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

    <AddEmployeeDialog v-model:isAddOpen="isAddOpen" @refreshTable="getEmployees" ></AddEmployeeDialog>
    <EditEmployeeDialog v-model:isEditOpen="isEditOpen" :employee="selectedEmployee" @refreshTable="getEmployees" ></EditEmployeeDialog>
    <DeleteEmployeeDialog v-model:isDeleteOpen="isDeleteOpen" :employee="selectedEmployee" @refreshTable="getEmployees" ></DeleteEmployeeDialog>
  </div>
</template>
