<script setup>
import { usePermissionsStore } from "@/store/Permissions"
import {
  requiredValidator,
} from '@validators'


const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'refreshTable',
  'update:isAddOpen',
])

import { useI18n } from "vue-i18n"

const { t } = useI18n()
const permissionsListStore = usePermissionsStore()

// Variables
const permission = reactive({
  name: "",
  display_name: "",
  group: "",
  guard_name: "web",
})

// Functions
const resetForm = () => {
  emit('update:isAddOpen', false)
}

const onFormSubmit = () => {
  permissionsListStore.storePermission(permission).then(response => {
    emit('update:isAddOpen', false)
    emit('refreshTable')
  })
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
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard
      class="pa-sm-9 pa-5"
    >
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="zondicons:shield" size="24"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Add_Permission') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit">
          <VRow>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="permission.name"
                :label="t('forms.name')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="permission.display_name"
                :label="t('forms.display_name')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="permission.group"
                :label="t('forms.group')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                type="submit"
                class="me-3"
              >
                {{ t("buttons.save") }}
              </VBtn>

              <VBtn
                variant="tonal"
                color="secondary"
                @click="resetForm"
              >
                {{ t("buttons.cancel") }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>