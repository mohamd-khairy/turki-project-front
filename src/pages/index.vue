<script setup>
import EcommerceCongratulationsJohn from '@core/components/eCommerce/EcommerceCongratulationsJohn.vue'
import EcommerceEarningReports from '@core/components/eCommerce/EcommerceEarningReports.vue'
import EcommerceExpensesRadialBarCharts from '@core/components/eCommerce/EcommerceExpensesRadialBarCharts.vue'
import EcommerceGeneratedLeads from '@core/components/eCommerce/EcommerceGeneratedLeads.vue'
import EcommerceInvoiceTable from '@core/components/eCommerce/EcommerceInvoiceTable.vue'
import EcommerceOrder from '@core/components/eCommerce/EcommerceOrder.vue'
import EcommercePopularProducts from '@core/components/eCommerce/EcommercePopularProducts.vue'
import EcommerceRevenueReport from '@core/components/eCommerce/EcommerceRevenueReport.vue'
import EcommerceStatistics from '@core/components/eCommerce/EcommerceStatistics.vue'
import EcommerceTotalProfitLineCharts from '@core/components/eCommerce/EcommerceTotalProfitLineCharts.vue'
import EcommerceTransactions from '@core/components/eCommerce/EcommerceTransactions.vue'
</script>

<template>
  <VRow>
    <!-- 👉 Congratulation John -->
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <EcommerceCongratulationsJohn />
    </VCol>

    <!-- 👉 Ecommerce Transition -->
    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <EcommerceStatistics class="h-100" />
    </VCol>

    <VCol
      cols="12"
      lg="4"
    >
      <VRow>
        <!-- 👉 Expenses Radial Bar Charts -->
        <VCol
          cols="12"
          lg="6"
          md="3"
          sm="6"
        >
          <EcommerceExpensesRadialBarCharts />
        </VCol>

        <!-- 👉 Total Profit Line -->
        <VCol
          cols="12"
          lg="6"
          md="3"
          sm="6"
        >
          <EcommerceTotalProfitLineCharts />
        </VCol>

        <!-- 👉 Generated Leads -->
        <VCol
          cols="12"
          md="6"
          lg="12"
        >
          <EcommerceGeneratedLeads />
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Revenue Report -->
    <VCol
      cols="12"
      lg="8"
    >
      <EcommerceRevenueReport />
    </VCol>

    <!-- 👉 Earning Reports -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommerceEarningReports />
    </VCol>

    <!-- 👉 Popular Products -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommercePopularProducts />
    </VCol>

    <!-- 👉 Order -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommerceOrder />
    </VCol>

    <!-- 👉 Transaction -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommerceTransactions />
    </VCol>

    <!-- 👉 Invoice Table -->
    <VCol
      cols="12"
      lg="8"
    >
      <EcommerceInvoiceTable />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
