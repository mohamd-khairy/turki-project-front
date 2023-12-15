<script setup>
import { useI18n } from "vue-i18n"
import {
  requiredValidator,
} from '@validators'
import { useSettingsStore } from "@/store/Settings"
import { useOrdersStore } from "@/store/Orders"
import { useEmployeesStore } from "@/store/Employees"
import { useProductsStore } from "@/store/Products"

const props = defineProps({
  isEditProductOpen: {
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
  'update:isEditProductOpen',
  'refreshTable',
])

const ordersListStore = useOrdersStore()
const settingsListStore = useSettingsStore()
const employeesListStore = useEmployeesStore()
const productsListStore = useProductsStore()
const isLoading = ref(false)


const { t } = useI18n()

const itemData = reactive({
  order_product_id: null,
  cut_ids: [],
  size_ids: [],
  preparation_ids: [],
  quantity: null,
})

const form = ref()

const resetForm = () => {
  emit('update:isEditProductOpen', false)
}

onUpdated(() => {
  itemData.order_product_id = props.item ? props.item.id : 0
  itemData.quantity = props.item ? props.item.quantity : 0
  if (typeof props.item.preparation == 'object') {
    // itemData.cut_ids.push(props.item.preparation)
    itemData.preparation_ids = [props.item.preparation]
  }else {
    itemData.preparation_ids = props.item.preparation
  }
  if (typeof props.item.cut == 'object') {
    // itemData.cut_ids.push(props.item.preparation)
    itemData.cut_ids = [props.item.cut]
  }else {
    itemData.cut_ids = props.item.cut
  }
  if (typeof props.item.size == 'object') {
    // itemData.size_ids.push(props.item.preparation)
    itemData.size_ids = [props.item.size]
  }else {
    itemData.size_ids = props.item.size
  }
})

const refForm = ref(null)

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    ordersListStore.editOrderProduct(itemData).then(response => {
      emit('refreshTable')
      emit('update:isEditProductOpen', false)
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم تعديل حالة الطلب بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
        isLoading.value = false
      }, 1000)
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
  emit('update:isEditProductOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isEditProductOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)"/>

    <VCard
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="solar:delivery-broken" size="24" color="primary"></VIcon>
          <span class="mx-1 my-1">
            تعديل تفاصيل المنتج
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit" ref="refForm">
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField v-model="itemData.quantity" :label="t('forms.quantity')"></VTextField>
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
