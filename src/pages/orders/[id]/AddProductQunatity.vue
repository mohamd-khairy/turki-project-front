<script setup>
import { useI18n } from "vue-i18n"
import {
  requiredValidator,
} from '@validators'
import { useSettingsStore } from "@/store/Settings"
import { useProductsStore } from "@/store/Products"

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
  item: {
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
  'addProductQuantity',
])

const { t } = useI18n()
const settingsListStore = useSettingsStore()
const productsListStore = useProductsStore()


const productCuts = ref([])
const productSizes = ref([])
const productPreparations = ref([])

const itemData = reactive({
  quantity: null,
  cut_ids: [],
  size_ids: [],
  preparation_ids: [],
})

const isLoadingCuts = ref(false)
const isLoadingSizes = ref(false)
const isLoadingPreparations = ref(false)

const resetForm = () => {
  emit('update:isAddOpen', false)
}

const onFormSubmit = () => {
  emit('addProductQuantity', itemData)
  emit('update:isAddOpen', false)
}

const dialogModelValueUpdate = val => {
  emit('update:isAddOpen', val)
}

onMounted(() => {
  isLoadingCuts.value = true
  isLoadingSizes.value = true
  isLoadingPreparations.value = true
})

onUpdated(() => {
  itemData.quantity = 1
  if(props.item) {
    if(props.item.id) {
      productsListStore.fetchProduct(props.item.id).then(response => {
        productPreparations.value = response.data.data.preparations
        productSizes.value = response.data.data.sizes
        productCuts.value = response.data.data.cuts
        isLoadingCuts.value = false
        isLoadingSizes.value = false
        isLoadingPreparations.value = false
      })
    }
  }
})
</script>

<template>
  <div>
    <VDialog
      :width="$vuetify.display.smAndDown ? 'auto' : 650 "
      :model-value="props.isAddOpen"
      @update:model-value="dialogModelValueUpdate"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

      <VCard
        :loading="isLoadingCuts || isLoadingSizes || isLoadingPreparations"
        class="pa-sm-9 pa-5"
      >
        <VCardItem>
          <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
            <VIcon icon="solar:tag-broken" size="24"
                   color="primary"
            ></VIcon>
            <span class="mx-1 my-1">
            {{ t('Add_Quantity') }}
          </span>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <!-- 👉 Form -->
          <VForm @submit.prevent="onFormSubmit" ref="bannerData">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="itemData.quantity"
                  :label="t('forms.quantity')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12"
                    md="6">
                <VSelect
                  v-model="itemData.cut_ids"
                  :items="productCuts"
                  :label="t('forms.product_cut')"
                  item-title="name_ar"
                  item-value="id"
                  multiple
                  :rules="[requiredValidator]"
                  :disabled="isLoadingCuts"
                />
              </VCol>
              <VCol cols="12"
                    md="6">
                <VSelect
                  v-model="itemData.size_ids"
                  :items="productSizes"
                  :label="t('forms.product_size')"
                  item-title="name_ar"
                  item-value="id"
                  multiple
                  :rules="[requiredValidator]"
                  :disabled="isLoadingSizes"
                />
              </VCol>
              <VCol cols="12"
                    md="6">
                <VSelect
                  v-model="itemData.preparation_ids"
                  :items="productPreparations"
                  :label="t('forms.product_preparation')"
                  item-title="name_ar"
                  item-value="id"
                  multiple
                  :rules="[requiredValidator]"
                  :disabled="isLoadingPreparations"
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
  </div>
</template>
