<script setup>
const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
})

const { t } = useI18n()

const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}
</script>

<template>
  <VCard height="400">
    <VCardTitle class="text-end">
      <router-link to="/orders">عرض جميع الطلبات</router-link>
    </VCardTitle>
    <VTable class="text-no-wrap order-list-table">
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
            {{ t('forms.order_state') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.total_amount') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.payment_type') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(order, i) in props.orders" :key="i">
          <td>
            #{{ ++i }}
          </td>
          <td>
            {{ order.order_state }}
          </td>
          <td>
            {{ order.total_amount ? ConvertToArabicNumbers(Intl.NumberFormat().format(order.total_amount)) : ConvertToArabicNumbers(0) }} {{ t('riyal') }}
          </td>
          <td>
            {{ order.payment_type }}
          </td>
        </tr>
      </tbody>

      <tfoot v-show="!1">
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
  </VCard>
</template>

<style scoped lang="scss"></style>
