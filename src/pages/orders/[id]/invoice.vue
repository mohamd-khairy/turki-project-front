<script setup>
import { useOrdersStore } from "@/store/Orders"
import moment from "moment"

const value = ref('qrcode')

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
    <div
      v-if="isLoading"
      class="loader_wrap"
    >
      <img
        src="@/assets/images/logo.png"
        alt="najdiya"
      >
      <p class="text-2xl">
        جاري جلب بيانات الفاتورة ...
      </p>
    </div>
    <div
      v-else
      id="invoice"
      class="card-wrapper"
    >
      <VRow
        justify="space-between"
        class="mb-2"
      >
        <VCol cols="12">
          <div class="d-flex justify-space-between">
            <img
              src="/src/assets/images/logo_c.png"
              alt="نجدية"
              width="200"
              class="najdiya_logo"
            >
            <VBtn
              class="print_sec"
              @click="printDiv"
            >
              طباعة الفاتورة
            </VBtn>
          </div>
        </VCol>
        <VCol
          cols="12"
          class="d-flex justify-space-around flex-wrap"
        >
          <h3 class="mb-2">
            <VIcon
              icon="iconoir:n-square"
              size="x-small"
              color="primary"
              class="ml-2"
            />
            <span>
              شركة لحوم نجدية للتجارة
            </span>
          </h3>
          <h3 class="mb-2">
            <VIcon
              icon="arcticons:destiny-item-manager"
              size="x-small"
              color="primary"
              class="ml-2"
            />
            <span>سجل تجاري: </span>
            <span class="text-primary">
              {{ ConvertToArabicNumbers(1010938507) }}
            </span>
          </h3>
          <h3 class="mb-2">
            <VIcon
              icon="arcticons:destiny-item-manager"
              size="x-small"
              color="primary"
              class="ml-2"
            />
            <span>رقم السجل الضريبي: </span>
            <span class="text-primary">
              {{ ConvertToArabicNumbers(311859965700003) }}
            </span>
          </h3>
        </VCol>
      </VRow>
      <hr>
      <VRow
        justify="space-between"
        class="mt-3 mb-3"
      >
        <VCol
          cols="12"
          class="d-flex justify-space-around flex-wrap"
        >
          <h3 class="mb-2">
            <VIcon
              icon="arcticons:destiny-item-manager"
              size="x-small"
              color="primary"
              class="ml-2"
            />
            <span>اسم العميل: </span>
            <span class="text-primary">{{ order.order.customer.name }}</span>
          </h3>
          <h3 class="mb-2">
            <VIcon
              icon="arcticons:destiny-item-manager"
              size="x-small"
              color="primary"
              class="ml-2"
            />
            <span>الجوال: </span>
            <span class="text-primary">{{ ConvertToArabicNumbers(order.order.customer.mobile) }}</span>
          </h3>
          <h3 class="mb-2">
            <VIcon
              icon="arcticons:destiny-item-manager"
              size="x-small"
              color="primary"
              class="ml-2"
            />
            <span>تاريخ التسليم: </span>
            <span class="text-primary">{{ ConvertToArabicNumbers(order.order.delivery_date.toString().split("-").reverse().join("-")) }}</span>
          </h3>
          <h3 class="mb-2">
            <VIcon
              icon="arcticons:destiny-item-manager"
              size="x-small"
              color="primary"
              class="ml-2"
            />
            <span>وقت التسليم: </span>
            <span class="text-primary">{{ order.order.delivery_period ? order.order.delivery_period.name_ar : "لا يوجد" }}</span>
          </h3>
          <h3 class="mb-2">
            <VIcon
              icon="arcticons:destiny-item-manager"
              size="x-small"
              color="primary"
              class="ml-2"
            />
            <span>طريقة الدفع : </span>
            <span class="text-primary">{{ order.order.payment_type ? order.order.payment_type.name_ar : "لا يوجد" }}</span>
          </h3>
        </VCol>
        <VCol
          cols="12"
          class="d-flex justify-space-around flex-wrap"
        >
          <h3 class="mb-2">
            <VIcon
              icon="iconamoon:invoice-thin"
              size="x-small"
              color="primary"
              class="ml-2"
            />
            <span>رقم الفاتورة: </span>
            <span class="text-primary">{{ order.order.payment ? order.order.payment.order_ref_no : "لا يوجد" }}</span>
          </h3>
          <h3>
            <VIcon
              icon="fluent:location-48-regular"
              size="x-small"
              color="primary"
              class="ml-2"
            />
            <span>
              {{ ConvertToArabicNumbers(order.order.selected_address.address) }}
            </span>
          </h3>
        </VCol>
      </VRow>
      <hr>
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
                <th>الكرشة</th>
                <th>الكوارع</th>
                <th>اللية</th>
                <th>الرأس</th>
                <th>الشلوطة</th>
                <th>السعر</th>
                <th>الاجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in order.products"
                :key="product.id"
              >
                <td>{{ product.product ? product.product.name_ar : "لا يوجد" }}</td>
                <td>{{ product.size ? product.size.name_ar : "لا يوجد" }}</td>
                <td>{{ product.quantity ? product.quantity : "لا يوجد" }}</td>
                <td>{{ product.cut ? product.cut.name_ar : "لا يوجد" }}</td>
                <td>{{ product.preparation ? product.preparation.name_ar : "لا يوجد" }}</td>
                <td>{{ product.is_karashah ? "بدون" : "" }}</td>
                <td>{{ product.is_kwar3 ? "بدون" : "" }}</td>
                <td>{{ product.is_lyh ? "بدون" : "" }}</td>
                <td>{{ product.is_Ras ? "بدون" : "" }}</td>
                <td>{{ product.shalwata ? "مع شلوطة" : "بدون" }}</td>
                <td>{{ product.price ?? (product.total_price / product.quantity) }}</td>
                <td>{{ product.total_price ?? "لا يوجد" }}</td>
              </tr>
              <tr>
                <td colspan="4">
                  الإجمالي شامل الضريبة
                </td>
                <td colspan="8">
                  {{ ConvertToArabicNumbers(Number(order.order.order_subtotal)) }} ريال سعودي
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  الخصم
                </td>
                <td colspan="8">
                  {{ ConvertToArabicNumbers(order.order.discount_applied) ?? 0 }} ريال سعودي
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  الإجمالي غير شامل الضريبة بعد الخصم
                </td>
                <td colspan="8">
                  {{ ConvertToArabicNumbers(order.order.total_amount_after_tax) ?? 0 }} ريال سعودي
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  ضريبة القيمة المضافة
                </td>
                <td colspan="8">
                  {{ ConvertToArabicNumbers(order.order.tax_fees) }} ريال سعودي
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  الإجمالي شامل الضريبة بعد الخصم
                </td>
                <td colspan="8">
                  {{ ConvertToArabicNumbers(parseFloat(order.order.total_amount_after_discount) + parseFloat(order.order.wallet_amount_used)) ?? 0 }} ريال سعودي
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  المسدد
                </td>
                <td colspan="8">
                  {{ order.order.paidpayment ? ConvertToArabicNumbers(parseFloat(order.order.paidpayment.price) + parseFloat(order.order.wallet_amount_used)) : ConvertToArabicNumbers(parseFloat(0) + parseFloat(order.order.wallet_amount_used)) }} ريال سعودي
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  إجمالي المتبقي
                </td>
                <td colspan="8">
                  {{ ConvertToArabicNumbers(order.order.remain_amount ?? 0) }} ريال سعودي
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  الملاحظة
                </td>
                <td colspan="8">
                  {{ order.order.comment ?? "لا يوجد" }}
                </td>
              </tr>
              <tr>
                <td
                  colspan="12"
                  class="text-center"
                >
                  جميع الأسعار تشمل الضريبة
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCol>
      </VRow>
      <VRow
        class="mt-3 flex-column"
        justify="center"
        align="center"
      >
        <h3>رمز الإستجابة السريعة</h3>
        <div>
          <img
            v-if="order.order.qr"
            :src="order.order.qr"
            alt="رمز الاستجابة السريعة"
            width="300"
            class="mx-auto"
          >
          <img
            v-else
            src="@/assets/images/logo.png"
            alt="najdiya"
            width="300"
            class="mx-auto"
          >
        </div>
      </VRow>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loader_wrap {
  text-align: center;

  img {
    inline-size: 300px;
    margin-block: 0;
    margin-inline: auto;
  }

  p {
    margin-block-start: 0;
  }
}

table thead th {
  border-block-start: 1px solid;
}

table tbody td {
  border-block-end: 1px solid;
  border-block-start: 1px solid;
}

table th {
  border-inline-end: 1px solid;
  border-inline-start: 1px solid;
}

table td {
  border-inline-end: 1px solid;
  border-inline-start: 1px solid;
}
</style>
