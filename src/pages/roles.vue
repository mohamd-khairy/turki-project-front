<script setup>
import moment from "moment"
import { useI18n } from "vue-i18n"
import { useRolesStore } from "@/store/Roles"

const { t } = useI18n()

const rolesListStore = useRolesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalCities = ref(0)
const roles = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedRole = ref({})
const isEditOpen = ref(false)

const getRoles = () => {
  rolesListStore.fetchRoles({
    q: searchQuery.value,
  }).then(response => {
    roles.value = response.data.data
    totalPage.value = roles.value / rowPerPage
    totalCities.value = roles.value.length
    currentPage.value = 1
  }).catch(error => {
    console.log(error)
  })
}

// 👉 Fetch Categories
watchEffect(() => {
  getRoles()
})


// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateEmployees = computed(() => {
  totalPage.value = Math.ceil(roles.value.length / rowPerPage.value)

  return roles.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < roles.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = roles.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= roles.value.length ? firstIndex + (rowPerPage.value - 1) : totalCities.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalCities.value)} الإجمالي `
})

const changeStatus = data => {
  // rolesListStore.changeCountryStatus(data).then(response => {
  //   getCities()
  // })
}

const openDelete = role => {
  isDeleteOpen.value = true
  selectedRole.value = role
}

const openEdit = role => {
  isEditOpen.value = true
  selectedRole.value = role
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
        <VIcon icon="zondicons:shield" size="24" color="primary"></VIcon>
        <span class="mx-1">{{ t('Roles') }}</span>
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
          {{ t('Add_Role') }}
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
            {{ t('forms.permissions') }}
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
          v-for="(role, i) in paginateEmployees"
          :key="role.id"
        >
          <td>
            #{{ (++i) }}
          </td>
          <td>
            {{ role.display_name }}
          </td>

          <td>
            <VChip v-for="(permission , i) in role.permissions" :key="permission.id" class="mx-1" :style="{display: i < 4 ? '' : 'none'}">
              <span v-if="i < 4">
                {{ permission }}
              </span>
            </VChip>
            <VChip v-if="role.permissions.length > 4">+{{ role.permissions.length - 4 }}</VChip>
          </td>
          <td>
            {{ (formatDateTime(role.created_at).date) }}
          </td>

          <td style="width: 7.5rem;">
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
              @click="openEdit(role)"
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
              @click="openDelete(role)"
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
        <tfoot v-show="!roles.length">
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

    <AddRoleDialog v-model:isAddOpen="isAddOpen" @refreshTable="getRoles" />
    <EditRoleDialog v-model:isEditOpen="isEditOpen" :role="selectedRole" @refreshTable="getRoles" />
    <DeleteRoleDialog v-model:isDeleteOpen="isDeleteOpen" :role="selectedRole" @refreshTable="getRoles" />
  </div>
</template>
