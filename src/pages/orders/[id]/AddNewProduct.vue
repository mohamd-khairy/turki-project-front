<script setup>
import { useI18n } from "vue-i18n"
import {
  requiredValidator,
} from '@validators'
import { useCitiesStore } from "@/store/Cities"
import { useCategoriesStore } from "@/store/Categories"
import { useProductsStore } from "@/store/Products"
import { useSettingsStore } from "@/store/Settings"

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
  order: {
    type: Object,
    required: true,
  },
  sizes: {
    type: Array,
    required: true,
  },
  cuts: {
    type: Array,
    required: true,
  },
  preparations: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'update:isAddOpen',
  'refreshTable',
])

const productsListStore = useProductsStore()
const settingsListStore = useSettingsStore()

const { t } = useI18n()

const refForm = ref(null)

const itemData = reactive({
  order_id: null,
  product_id: null,
  quantity: null,
  cut_ids: [],
  size_ids: [],
  preparation_ids: [],
})

onUpdated(() => {
  itemData.order_id = props.order ? props.order.id : 0
})

onMounted(() => {
  productsListStore.fetchProducts({ per_page: -1 }).then(response => {
    products.value = response.data.data
  })
})

const products = ref([])
const isLoading = ref(false)


const resetForm = () => {
  itemData.order_id = null
  itemData.product_id = null
  itemData.quantity = null
  itemData.cut_ids = []
  itemData.size_ids = []
  itemData.preparation_ids = []
  emit('update:isAddOpen', false)
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    productsListStore.addNewProduct(itemData).then(response => {
      emit('refreshTable')
      emit('update:isAddOpen', false)
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم إضافة المنتج بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    }).catch(error => {
      if (error.response.data.errors) {
        const errs = Object.keys(error.response.data.errors)
        errs.forEach(err => {
          settingsListStore.alertMessage = t(`errors.${err}`)
        })
      } else {
        settingsListStore.alertMessage = "حدث خطأ ما !"
      }
      isLoading.value = false
      settingsListStore.alertColor = "error"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    })
  } else {
    isLoading.value = false
    settingsListStore.alertMessage = "يرجي تعبئة الحقول المطلوبة !"
    settingsListStore.alertColor = "error"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
  }
}

const dialogModelValueUpdate = val => {
  emit('update:isAddOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isAddOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)"/>

    <VCard
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products" size="24"
                 color="primary"
          ></VIcon>
          <span class="mx-1 my-1">
            {{ t('Add_Item') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit" ref="refForm">
          <VRow>
            <VCol cols="12"
                  md="6"
            >
              <VSelect
                v-model="itemData.product_id"
                :items="products"
                :label="t('forms.products')"
                item-title="name_ar"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12"
                  md="6"
            >
              <VTextField v-model="itemData.quantity"
                          :label="t('forms.quantity')"
                          :rules="[requiredValidator]"
              ></VTextField>
            </VCol>
            <VCol cols="12"
                  md="6"
            >
              <VSelect
                v-model="itemData.cut_ids"
                :items="props.cuts"
                :label="t('forms.product_cut')"
                item-title="name_ar"
                item-value="id"
                multiple
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12"
                  md="6"
            >
              <VSelect
                v-model="itemData.size_ids"
                :items="props.sizes"
                :label="t('forms.product_size')"
                item-title="name_ar"
                item-value="id"
                multiple
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12"
                  md="6"
            >
              <VSelect
                v-model="itemData.preparation_ids"
                :items="props.preparations"
                :label="t('forms.product_preparation')"
                item-title="name_ar"
                item-value="id"
                multiple
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                v-if="!isLoading"
                type="submit"
                class="me-3"
              >
                {{ t('buttons.save') }}
              </VBtn>
              <VBtn
                v-else
                type="submit"
                class="position-relative me-3"
              >
                <VIcon icon="mingcute:loading-line" class="loading" size="32"></VIcon>
              </VBtn>

              <VBtn
                variant="tonal"
                color="secondary"
                @click="resetForm"
              >
                {{ t('buttons.cancel') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
