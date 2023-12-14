<script setup>
import moment from "moment"
import { useOrdersStore } from "@/store/Orders"

const ordersListStore = useOrdersStore()
const route = useRoute()

const order = ref({})
const isLoading = ref(true)
const isEditOpen = ref(false)

const { t } = useI18n()

const i18n = useI18n()

const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

const formatDateTime = data => {
  let date = moment(data).format("DD-MM-YYYY")
  let time = moment(data).format("hh:mm:ss A")

  return { date, time }
}

const getOrderDetails = id => {
  ordersListStore.fetchOrder(id).then(response => {
    order.value = response?.data.data
    isLoading.value = false
  }).catch(error => {
    isLoading.value = false
  })
}

const printDiv = () => {
 window.print()
}

onMounted(() => {
  const id = route.params.id

  getOrderDetails(id)
})
</script>

<template>
  <div>
        <div class="loader_wrap" v-if="isLoading">
          <img src="@/assets/images/logo.png" alt="najdiya"/>
          <p class="text-2xl">جاري جلب بيانات الفاتورة ...</p>
        </div>
    <div id="invoice" class="card-wrapper" v-else>
      <VRow justify="space-between" class="mb-2">
        <VCol cols="12">
          <div class="d-flex justify-space-between">
            <img src="/src/assets/images/logo_c.png" alt="نجدية" width="200" class="najdiya_logo">
            <VBtn @click="printDiv" class="print_sec">طباعة الفاتورة</VBtn>
          </div>
        </VCol>
        <VCol cols="12" class="d-flex justify-space-around flex-wrap">
          <h3 class="mb-2">
            <VIcon icon="iconoir:n-square" size="x-small" color="primary" class="ml-2"></VIcon>
            <span>
              شركة لحوم نجدية للتجارة
            </span>
          </h3>
          <h3 class="mb-2">
            <VIcon icon="arcticons:destiny-item-manager" size="x-small" color="primary" class="ml-2"></VIcon>
            <span>سجل تجاري: </span>
            <span class="text-primary">
              {{ ConvertToArabicNumbers(1010938507) }}
            </span>
          </h3>
          <h3 class="mb-2">
            <VIcon icon="arcticons:destiny-item-manager" size="x-small" color="primary" class="ml-2"></VIcon>
            <span>رقم السجل الضريبي: </span>
            <span class="text-primary">
              {{ ConvertToArabicNumbers(311859965700003) }}
            </span>
          </h3>
        </VCol>
      </VRow>
      <hr/>
      <VRow justify="space-between" class="mt-3 mb-3">
        <VCol cols="12" class="d-flex justify-space-around flex-wrap">
          <h3 class="mb-2">
            <VIcon icon="arcticons:destiny-item-manager" size="x-small" color="primary" class="ml-2"></VIcon>
            <span>اسم العميل: </span>
            <span class="text-primary">{{ order.order.customer.name }}</span>
          </h3>
          <h3 class="mb-2">
            <VIcon icon="arcticons:destiny-item-manager" size="x-small" color="primary" class="ml-2"></VIcon>
            <span>الجوال: </span>
            <span class="text-primary">{{ order.order.customer.mobile }}</span>
          </h3>
          <h3 class="mb-2">
            <VIcon icon="arcticons:destiny-item-manager" size="x-small" color="primary" class="ml-2"></VIcon>
            <span>تاريخ التسليم: </span>
            <span class="text-primary">{{ order.order.delivery_date }}</span>
          </h3>
          <h3 class="mb-2">
            <VIcon icon="arcticons:destiny-item-manager" size="x-small" color="primary" class="ml-2"></VIcon>
            <span>وقت التسليم: </span>
            <span class="text-primary">{{ order.order.delivery_period ? order.order.delivery_period.name_ar : "لا يوجد" }}</span>
          </h3>
          <h3 class="mb-2">
            <VIcon icon="arcticons:destiny-item-manager" size="x-small" color="primary" class="ml-2"></VIcon>
            <span>طريقة الدفع : </span>
            <span class="text-primary">{{ order.order.payment_type ? order.order.payment_type.name_ar : "لا يوجد" }}</span>
          </h3>
        </VCol>
        <VCol cols="12" class="d-flex justify-space-around flex-wrap">
          <h3 class="mb-2">
            <VIcon icon="iconamoon:invoice-thin" size="x-small" color="primary" class="ml-2"></VIcon>
            <span>رقم الفاتورة: </span>
            <span class="text-primary">{{ order.order.payment ? order.order.payment.order_ref_no : "لا يوجد" }}</span>
          </h3>
          <h3>
            <VIcon icon="fluent:location-48-regular" size="x-small" color="primary" class="ml-2"></VIcon>
            <span>
              {{ order.order.selected_address.address }}
            </span>
          </h3>
        </VCol>
      </VRow>
      <hr/>
      <VRow class="mt-3">
        <VCol>
          <VTable>
            <thead>
            <tr>
              <th>الذبيحة</th>
              <th>الحجم</th>
              <th>الكمية</th>
              <th>التقطيع</th>
              <th>التجهيز</th>
              <th>السعر</th>
              <th>الشلوطة</th>
              <th>الاجمالي</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="product in order.products" :key="product.id">
              <td>{{ product.product ? product.product.name_ar : "لا يوجد" }}</td>
              <td>{{ product.size ? product.size.name_ar : "لا يوجد" }}</td>
              <td>{{ product.quantity ? product.quantity : "لا يوجد" }}</td>
              <td>{{ product.cut ? product.cut.name_ar : "لا يوجد" }}</td>
              <td>{{ product.preparation ? product.preparation.name_ar : "لا يوجد" }}</td>
              <td>{{ product.price ?? (product.total_price / product.quantity) }}</td>
              <td>{{ product.shalwata ?? "لا يوجد" }}</td>
              <td>{{ product.total_price ?? "لا يوجد" }}</td>
            </tr>
            <tr>
              <td colspan="2">
                الإجمالي شامل الضريبة
              </td>
              <td colspan="6">
                {{ order.order.total_amount }} ريال سعودي
              </td>
            </tr>
            <tr>
              <td colspan="2">
                الخصم
              </td>
              <td colspan="6">
                {{ order.order.discount_applied }} ريال سعودي
              </td>
            </tr>
            <tr>
              <td colspan="2">
                الإجمالي غير شامل الضريبة بعد الخصم
              </td>
              <td colspan="6">
                1500 ريال سعودي
              </td>
            </tr>
            <tr>
              <td colspan="2">
                ضريبة القيمة المضافة
              </td>
              <td colspan="6">
                {{ order.order.delivery_fee }} ريال سعودي
              </td>
            </tr>
            <tr>
              <td colspan="2">
                الإجمالي شامل الضريبة بعد الخصم
              </td>
              <td colspan="6">
                {{ order.order.total_amount_after_discount }} ريال سعودي
              </td>
            </tr>
            <tr>
              <td colspan="2">
                المسدد
              </td>
              <td colspan="6">
                0 ريال سعودي
              </td>
            </tr>
            <tr>
              <td colspan="2">
                إجمالي المتبقي
              </td>
              <td colspan="6">
                0 ريال سعودي
              </td>
            </tr>
            <tr>
              <td colspan="2">
                الملاحظة
              </td>
              <td colspan="6">

              </td>
            </tr>
            <tr>
              <td colspan="8" class="text-center">
                جميع الأسعار تشمل الضريبة
              </td>
            </tr>
            </tbody>
          </VTable>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loader_wrap {
  text-align: center;

  img {
    width: 300px;
    margin: 0 auto;
  }

  p {
    margin-top: 0;
  }
}

table thead th {
  border-top: 1px solid;
}

table tbody td {
  border-top: 1px solid;
  border-bottom: 1px solid;
}

table th{
  border-left: 1px solid;
  border-right: 1px solid;
}
table td {
  border-left: 1px solid;
  border-right: 1px solid;
}
</style>
