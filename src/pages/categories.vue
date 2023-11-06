<script setup>
import moment from "moment/moment"
import { useCategoriesStore } from "@/store/Categories"

const categoriesListStore = useCategoriesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalProducts = ref(0)
const categories = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedCategory = ref({})
const isEditOpen = ref(false)

const { t } = useI18n()

// 👉 Fetch Categories
const getCategories = () => {
  categoriesListStore.fetchCategories({
    q: searchQuery.value,
    // status: selectedStatus.value,
    // perPage: rowPerPage.value,
    // currentPage: currentPage.value,
  }).then(response => {
    categories.value = response.data.data
    totalPage.value = categories.value / rowPerPage
    totalProducts.value = categories.value.length
    currentPage.value = 1
  }).catch(error => {
    console.log(error)
  })
}

watchEffect(() => {
  getCategories()
})

watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateCategories = computed(() => {
  totalPage.value = Math.ceil(categories.value.length / rowPerPage.value)

  return categories.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < categories.value.length) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = categories.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= categories.value.length ? firstIndex + (rowPerPage.value - 1) : totalProducts.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalProducts.value)} الإجمالي `
})

const openDelete = category => {
  isDeleteOpen.value = true
  selectedCategory.value = category
}

const openEdit = category => {
  isEditOpen.value = true
  selectedCategory.value = category
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
        <VIcon icon="carbon:categories" size="24"></VIcon>
        <span class="mx-1">{{ t('Categories') }}</span>
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
          {{ t('Add_Category') }}
        </VBtn>

        <VSpacer/>

        <div class="w-25 d-flex align-center flex-wrap gap-2">
          <!-- 👉 Search  -->
          <div class="w-100 categories-list-search">
            <VTextField
              v-model="searchQuery"
              placeholder="بحث"
              density="compact"
            />
          </div>
        </div>
      </VCardText>

      <VDivider />

      <VTable class="text-no-wrap categories-list-table">
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
            v-for="(category, i) in paginateCategories"
            :key="category.id"
          >
            <td>
              #{{ ++i }}
            </td>
            <td>
              <img :src="category.image_url" alt="منتج" width="50" v-if="category.image_url.toString().split('storage/')[1] !== '' && category.image_url !== null">
              <VIcon icon="iconoir:n-square" size="32" v-else></VIcon>
            </td>
            <td>
                {{ category.type_ar }}
            </td>
            <td>
                {{ category.description }}
            </td>
            <td>
              <VChip v-for="(city , i) in category.cities" :key="city.id" class="mx-1" :style="{display: i < 1 ? '' : 'none'}">
                  <span v-if="i < 1">
                    {{ city.name_ar }}
                  </span>
              </VChip>
              <VChip v-if="category.cities.length > 1">+{{ category.cities.length - 1 }}</VChip>
            </td>
            <td>
              {{ ConvertToArabicNumbers(formatDateTime(category.created_at).date) }}
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
                @click="openEdit(category)"
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
                @click="openDelete(category)"
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

      <VDivider/>

      <!-- SECTION Pagination -->
      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
        <span class="text-sm text-disabled">{{ paginationData }}</span>
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

    <AddCategoryDialog v-model:isAddOpen="isAddOpen" @refreshTable="getCategories" />
    <EditCategoryDialog v-model:isEditOpen="isEditOpen" :category="selectedCategory" @refreshTable="getCategories" />
    <DeleteCategoriesDialog v-model:isDeleteOpen="isDeleteOpen" :category="selectedCategory" @refreshTable="getCategories" />
  </div>
</template>
