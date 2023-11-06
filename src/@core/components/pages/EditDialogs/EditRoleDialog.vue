<script setup>
import { usePermissionsStore } from "@/store/Permissions"
import { useRolesStore } from "@/store/Roles"

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  role: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'refreshTable',
  'update:isEditOpen',
])

import { useI18n } from "vue-i18n"

const { t } = useI18n()
const permissionsListStore = usePermissionsStore()
const rolesListStore = useRolesStore()
const permissions = reactive([])

onMounted(() => {
  permissionsListStore.fetchPermissions({}).then(response => {
    permissions.value = response.data.data
  })
})

// Variables
const roleData = reactive({
  name: null,
  display_name: null,
  permissions: [],
  guard_name:"web",
})

onUpdated(() => {
  roleData.id = props.role.id,
  roleData.name = props.role.name,
  roleData.display_name = props.role.display_name
  roleData.permissions = props.role.permissions

})

// Functions
const resetForm = () => {
  emit('update:isEditOpen', false)
}

const onFormSubmit = () => {
  rolesListStore.editRole(roleData).then(response => {
    emit('update:isEditOpen', false)
    emit('refreshTable')
  })
}

const dialogModelValueUpdate = val => {
  emit('update:isEditOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isEditOpen"
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
            {{ t('Edit_Role') }}
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
                v-model="roleData.name"
                :label="t('forms.name')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="roleData.display_name"
                :label="t('forms.display_name')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="roleData.permissions"
                :items="permissions.value"
                :label="t('forms.permissions')"
                item-title="name"
                item-value="name"
                multiple
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
