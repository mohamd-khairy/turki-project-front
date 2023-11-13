<script setup>
import moment from "moment/moment"
import { useCategoriesStore } from "@/store/Categories"

const subCategoriesListStore = useCategoriesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalProducts = ref(0)
const sub_categories = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedSubCategory = ref({})
const isEditOpen = ref(false)

const { t } = useI18n()

// 👉 Fetch Categories
const getSubCategories = () => {
  subCategoriesListStore.fetchSubCategories({
    q: searchQuery.value,
    // status: selectedStatus.value,
    // perPage: rowPerPage.value,
    // currentPage: currentPage.value,
  }).then(response => {
    sub_categories.value = response.data.data
    totalPage.value = sub_categories.value / rowPerPage
    totalProducts.value = sub_categories.value.length
    currentPage.value = 1
  }).catch(error => {
    console.log(error)
  })
}

watchEffect(() => {
  getSubCategories()
})

watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateProducts = computed(() => {
  totalPage.value = Math.ceil(sub_categories.value.length / rowPerPage.value)

  return sub_categories.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < sub_categories.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = sub_categories.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= sub_categories.value.length ? firstIndex + (rowPerPage.value - 1) : totalProducts.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalProducts.value)} الإجمالي `
})

const openDelete = sub_category => {
  isDeleteOpen.value = true
  selectedSubCategory.value = sub_category
}

const openEdit = sub_category => {
  isEditOpen.value = true
  selectedSubCategory.value = sub_category
}

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
        <VIcon icon="carbon:category-new-each" size="24" color="primary"></VIcon>
        <span class="mx-1">{{ t('Sub_Category') }}</span>
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
        <!--         👉 Create sub_categorie :to="{ name: 'apps-sub_categorie-add' }"-->
        <VBtn
          prepend-icon="tabler-plus"
          @click="isAddOpen = true"
        >
          {{ t('Add_Sub_Category') }}
        </VBtn>

        <VSpacer/>

        <div class="w-25 d-flex align-center flex-wrap gap-2">
          <!-- 👉 Search  -->
          <div class="w-100 sub_categories-list-search">
            <VTextField
              v-model="searchQuery"
              placeholder="بحث"
              density="compact"
            />
          </div>
        </div>
      </VCardText>

      <VDivider />

      <VTable class="text-no-wrap sub_categories-list-table">
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
              {{ t('forms.product_image') }}
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
              {{ t('forms.description') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.category') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.products') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.cities') }}
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
            v-for="(sub_category, i) in paginateProducts"
            :key="sub_category.id"
          >
            <td>
              #{{ ++i }}
            </td>
            <td>
              <img :src="sub_category.image_url" alt="منتج" width="50" v-if="sub_category.image_url.toString().split('storage/')[1] !== '' && sub_category.image_url !== null">
              <VIcon icon="iconoir:n-square" size="32" v-else></VIcon>
            </td>
            <td>
              {{ sub_category.type_ar }}
            </td>
            <td>
              {{ sub_category.description ?? '-' }}
            </td>
            <td>
              <VChip>
                {{ sub_category.category.type_ar }}
              </VChip>
            </td>
            <td>
              <VChip v-for="(sub_cat , i) in sub_category.products" :key="sub_cat.id" class="mx-1" :style="{display: i < 1 ? '' : 'none'}">
                <span v-if="i < 1">
                  {{ sub_cat.name_ar }}
                </span>
              </VChip>
              <VChip v-if="sub_category.products.length > 1">+{{ sub_category.products.length - 1 }}</VChip>
            </td>
            <td>
              <VChip v-for="(city , i) in sub_category.cities" :key="city.id" class="mx-1" :style="{display: i < 1 ? '' : 'none'}">
                <span v-if="i < 1">
                  {{ city.name_ar }}
                </span>
              </VChip>
              <VChip v-if="sub_category.cities.length > 1">+{{ sub_category.cities.length - 1 }}</VChip>
            </td>
            <td>
              {{ ConvertToArabicNumbers(formatDateTime(sub_category.created_at).date) }}
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
                @click="openEdit(sub_category)"
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
                @click="openDelete(sub_category)"
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
        <tfoot v-show="!sub_categories.length">
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

    <AddSubCategoryDialog v-model:isAddOpen="isAddOpen" @refreshTable="getSubCategories" />
    <EditSubCategoryDialog v-model:isEditOpen="isEditOpen" :subCategory="selectedSubCategory" @refreshTable="getSubCategories" />
    <DeleteSubCategoriesDialog v-model:isDeleteOpen="isDeleteOpen" :subCategory="selectedSubCategory" @refreshTable="getSubCategories" />
  </div>
</template>
