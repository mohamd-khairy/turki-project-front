<script setup>
import { usePermissionsStore } from "@/store/Permissions"
import { useI18n } from "vue-i18n"
import { useSettingsStore } from "@/store/Settings"

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  permission: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'refreshTable',
  'update:isEditOpen',
])


const { t } = useI18n()
const permissionsListStore = usePermissionsStore()
const settingsListStore = useSettingsStore()
const isLoading = ref(false)

// Variables
const permissionData = reactive({
  name: "",
  display_name: "",
  group: "",
})

// Functions
onUpdated(() => {
  permissionData.name = props.permission.name,
  permissionData.display_name = props.permission.display_name,
  permissionData.group = props.permission.group
})

const resetForm = () => {
  emit('update:isEditOpen', false)
}

const onFormSubmit = () => {
  isLoading.value = true
  permissionsListStore.editPermission(permissionData).then(response => {
    emit('update:isEditOpen', false)
    emit('refreshTable')
    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم تعديل العنصر بنجاح"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
      isLoading.value = false
    }, 1000)
  }).catch(error => {
    isLoading.value = false
    settingsListStore.alertColor = "error"
    settingsListStore.alertMessage = "حدث خطأ ما !"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
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
          <VIcon icon="zondicons:shield" size="24" color="primary"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Edit_Permission') }}
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
                v-model="permissionData.name"
                :label="t('forms.name')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="permissionData.display_name"
                :label="t('forms.display_name')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="permissionData.group"
                :label="t('forms.group')"
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
                {{ t("buttons.save") }}
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
                {{ t("buttons.cancel") }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
