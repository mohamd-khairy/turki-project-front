<script setup>
import { useI18n } from "vue-i18n"
import { useRolesStore } from "@/store/Roles"
import { useCategoriesStore } from "@/store/Categories"

const props = defineProps({
  isDeleteOpen: {
    type: Boolean,
    required: true,
  },
  category: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDeleteOpen',
  'refreshTable',
])

const { t } = useI18n()
const categoriesListStore = useCategoriesStore()

const resetForm = () => {
  emit('update:isDeleteOpen', false)
}

const onFormSubmit = () => {
  // Delete
  categoriesListStore.deleteCategory(props.category).then(() => {
    emit('refreshTable')
    emit('update:isDeleteOpen', false)
  })
}

const dialogModelValueUpdate = val => {
  emit('update:isDeleteOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isDeleteOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 text-center mb-3">
          <VIcon icon="ph:info-light" color="#f00" size="50"></VIcon>
          <h5>
            {{ t('ask_delete') }}
          </h5>
        </VCardTitle>
      </VCardItem>
      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit">
          <VRow>
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                type="submit"
                class="me-3"
              >
                {{t('buttons.confirm')}}
              </VBtn>

              <VBtn
                variant="tonal"
                color="secondary"
                @click="resetForm"
              >
                {{t('buttons.cancel')}}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
