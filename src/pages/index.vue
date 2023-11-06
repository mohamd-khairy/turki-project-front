<script setup>
import EcommerceInvoiceTable from '@core/components/eCommerce/EcommerceInvoiceTable.vue'
import EcommerceStatistics from '@core/components/eCommerce/EcommerceStatistics.vue'
import { useDashboardStore } from "@/store/Dashboard"

const dashboardList = useDashboardStore()
const dashboard = reactive([])
const cards = reactive({})
const chart = reactive([])
const table = reactive([])
const { t } = useI18n()

const chartJsCustomColors = {
  white: '#fff',
  yellow: '#ffe802',
  primary: '#836af9',
  areaChartBlue: '#2c9aff',
  barChartYellow: '#ffcf5c',
  polarChartGrey: '#4f5d70',
  polarChartInfo: '#299aff',
  lineChartYellow: '#d4e157',
  polarChartGreen: '#28dac6',
  lineChartPrimary: '#9e69fd',
  lineChartWarning: '#ff9800',
  horizontalBarInfo: '#26c6da',
  polarChartWarning: '#ff8131',
  scatterChartGreen: '#28c76f',
  warningShade: '#ffbd1f',
  areaChartBlueLight: '#84d0ff',
  areaChartGreyLight: '#edf1f4',
  scatterChartWarning: '#ff9f43',
}

onMounted(() => {
  dashboardList.fetchDashboard({}).then(response => {
    dashboard.value = response.data.data
    chart.value = response.data.data.monthly_orders
    cards.value = response.data.data.total
    table.value = response.data.data.orders
  })
})
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      lg="12"
    >
      <EcommerceStatistics :statistics="cards" class="h-100"/>
    </VCol>

    <VCol
      cols="12"
      lg="6"
    >
      <BarChart :colors="chartJsCustomColors" :title="t('monthly_orders')" :chartData="chart.value"/>
    </VCol>
    <VCol
      cols="12"
      lg="6"
    >
      <DashboardOrdersTable :orders="table.value"></DashboardOrdersTable>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
