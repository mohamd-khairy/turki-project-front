<script setup>
import { useEmployeesStore } from "@/store/Employees"
import { useRolesStore } from "@/store/Roles"
import {
  emailValidator,
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
const rolesListStore = useRolesStore()
const employeesListStore = useEmployeesStore()
const roles = reactive([])

onMounted(() => {
  rolesListStore.fetchRoles().then(response => {
    roles.value = response.data.data
  })
})

// Variables
const employee = reactive({
  username: null,
  email: null,
  password: null,
  avatar: {},
  mobile: null,
  gender: null,
  age: null,
  roles: [],
})

const genders = reactive([
  {
    id: 1,
    name: "ذكر",
  },
  {
    id: 0,
    name: "أنثي",
  },
])

// Functions
const resetForm = () => {
  emit('update:isAddOpen', false)
}

const onFormSubmit = () => {
  employeesListStore.storeEmployee(employee).then(response => {
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
          <VIcon icon="carbon:categories" size="24"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Add_Employee') }}
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
                v-model="employee.email"
                :label="t('forms.email')"
                :rules="[requiredValidator, emailValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="employee.mobile"
                :label="t('forms.phone')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="employee.username"
                :label="t('forms.username')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="employee.password"
                :label="t('forms.password')"
                type="password"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="employee.gender"
                :label="t('forms.gender')"
                :items="genders"
                item-title="name"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="employee.age"
                :label="t('forms.age')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VFileInput
                v-model="employee.avatar"
                :label="t('forms.image')"
                accept="image/*"
                prepend-icon=""
                prepend-inner-icon="mdi-image"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="employee.roles"
                :items="roles.value"
                :label="t('forms.roles')"
                item-title="display_name"
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
