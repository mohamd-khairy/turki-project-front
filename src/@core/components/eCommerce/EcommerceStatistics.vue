<script setup>
const props = defineProps({
  statistics: {
    type: Object,
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
  <VRow>
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <VCard class="d-flex pa-5" :loading="!props.statistics.value">
        <VAvatar
          color="warning"
          variant="tonal"
          size="42"
          class="me-3"
        >
          <VIcon
            size="24"
            icon="tabler-users"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <span class="text-h6">
            {{ t('customer_count') }}
          </span>
          <span class="text-h6 font-weight-medium mt-2"
          >{{ props.statistics.value ? ConvertToArabicNumbers(Intl.NumberFormat().format(props.statistics.value.customer_count)) : ConvertToArabicNumbers(0) }}</span>
        </div>
      </VCard>
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <VCard class="d-flex pa-5" :loading="!props.statistics.value">
        <VAvatar
          color="info"
          variant="tonal"
          size="42"
          class="me-3"
        >
          <VIcon
            size="24"
            icon="tabler-shopping-cart"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <span class="text-h6">
            {{ t('order_count') }}
          </span>
          <span class="text-h6 font-weight-medium mt-2"
          >{{ props.statistics.value ? ConvertToArabicNumbers(Intl.NumberFormat().format(props.statistics.value.order_count)) : ConvertToArabicNumbers(0) }}</span>
        </div>
      </VCard>
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <VCard class="d-flex pa-5" :loading="!props.statistics.value">
        <VAvatar
          color="success"
          variant="tonal"
          size="42"
          class="me-3"
        >
          <VIcon
            size="24"
            icon="tabler-currency-dollar"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <span class="text-h6">
            {{ t('payment_sum') }}
          </span>
          <span class="text-h6 font-weight-medium mt-2"
          >{{ props.statistics.value ? ConvertToArabicNumbers(Intl.NumberFormat().format(props.statistics.value.payment_sum)) : ConvertToArabicNumbers(0) }} {{ t('riyal') }}</span>
        </div>
      </VCard>
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <VCard class="d-flex pa-5" :loading="!props.statistics.value">
        <VAvatar
          color="primary"
          variant="tonal"
          size="42"
          class="me-3"
        >
          <VIcon
            size="24"
            icon="fluent-mdl2:shop"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <span class="text-h6">
            {{ t('product_count') }}
          </span>
          <span class="text-h6 font-weight-medium mt-2"
          >{{ props.statistics.value ? ConvertToArabicNumbers(Intl.NumberFormat().format(props.statistics.value.product_count)) : ConvertToArabicNumbers(0) }}</span>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>
