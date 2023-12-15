<script setup>
import AddNewProduct from "@/pages/orders/[id]/AddNewProduct.vue"
import AddProductCoupon from "@/pages/orders/[id]/AddProductCoupon.vue"
import { useOrdersStore } from "@/store/Orders"
import { useSettingsStore } from "@/store/Settings"
import moment from "moment"

const ordersListStore = useOrdersStore()
const settingsListStore = useSettingsStore()
const route = useRoute()

const order = ref({})
const isLoading = ref(true)
const isDeleteing = ref(false)
const isEditOpen = ref(false)
const isEditProductOpen = ref(false)
const isAddProductOpen = ref(false)
const isAddProductCouponOpen = ref(false)
const selectedProductItem = ref({})
const productCuts = ref([])
const productSizes = ref([])
const productPreparations = ref([])

const { t } = useI18n()

const i18n = useI18n()

const addProductCoupon = () => {
  console.log("ADDED")
}

const openProductEdit = item => {
  selectedProductItem.value = item
  isEditProductOpen.value = true
}

const AddNewProductOpen = item => {
  selectedProductItem.value = item
  isAddProductOpen.value = true
}

const deleteProduct = item => {
  isDeleteing.value = true
  ordersListStore.deleteOrderProduct({ order_product_id: item.id }).then(() => {
    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم إضافة العنصر بنجاح"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
    isDeleteing.value = false
    getOrderDetails()
  }).catch(error => {
    isDeleteing.value = false
    settingsListStore.alertColor = "error"
    settingsListStore.alertMessage = "حدث خطأ ما !"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
  })
}

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

const getOrderDetails = () => {
  const id = route.params.id

  isLoading.value = true
  ordersListStore.fetchOrder(id).then(response => {
    order.value = response?.data.data
    isLoading.value = false
  }).catch(error => {
    isLoading.value = false
  })
}

onMounted(() => {
  getOrderDetails()
  settingsListStore.fetchProductCut().then(response => {
    productCuts.value = response.data.data
  })

  settingsListStore.fetchProductSize().then(response => {
    productSizes.value = response.data.data
  })

  settingsListStore.fetchProductPerparation().then(response => {
    productPreparations.value = response.data.data
  })
})
</script>

<template>
  <div>
    <VCard
      v-if="!isLoading"
      class="mb-5 pa-5"
    >
      <VRow>
        <VCol
          cols="12"
          lg="2"
          md="3"
          sm="4"
        >
          <VBtn
            class="w-100"
            prepend-icon="clarity:details-line"
            :disabled="isLoading"
            @click.stop="isEditOpen = true"
          >
            {{ t('Edit_Order_Details') }}
          </VBtn>
        </VCol>
      </VRow>
    </VCard>
    <div
      v-if="isLoading"
      class="loader_wrap"
    >
      <img
        src="@/assets/images/logo.png"
        alt="najdiya"
      >
      <p class="text-2xl">
        جاري جلب البيانات ...
      </p>
    </div>
    <div
      v-else
      class="card-wrapper"
    >
      <div class="card">
        <div class="order-content">
          <h1 class="order-title pb-2">
            <span>طلب - </span>
            <span>
              #{{ order ? order.order.ref_no : "الرقم المرجعي" }}
            </span>
          </h1>
          <p class="mb-5">
            {{ order ? order.order.comment : "لا يوجد" }}
          </p>

          <div class="order-detail mt-5">
            <h2 class="bg-light-primary px-5 py-2">
              <VIcon icon="clarity:details-line" />
              <span class="mx-2">
                تفاصيل الطلب
              </span>
            </h2>
            <div>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  تاريخ الطلب :
                </span>
                <VChip
                  size="large"
                  class="font-weight-bold"
                >
                  {{ ConvertToArabicNumbers(formatDateTime(order.order.created_at).date) }}
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  تاريخ التوصيل :
                </span>
                <VChip
                  size="large"
                  class="font-weight-bold"
                >
                  {{ ConvertToArabicNumbers(order.order.delivery_date.toString().split('-')[1] + "-" + order.order.delivery_date.toString().split('-')[0]) }}
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  توقيت الطلب :
                </span>
                <VChip
                  size="large"
                  class="font-weight-bold"
                >
                  {{
                    ConvertToArabicNumbers(
                      String(formatDateTime(order.order.created_at).time)
                        .slice(-2)
                        .toLowerCase() == "pm"
                        ? String(formatDateTime(order.order.created_at).time)
                          .slice(0, -2)
                          .toLowerCase() + "مساءاً"
                        : String(formatDateTime(order.order.created_at).time)
                          .slice(0, -2)
                          .toLowerCase() + "صباحاً",
                    )
                  }}
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  حالة الطلب :
                </span>
                <VChip
                  size="large"
                  class="font-weight-bold"
                >
                  {{ order.order.order_state.state_ar }}
                </VChip>
                <VChip
                  size="large"
                  class="font-weight-bold mx-2"
                  :class="{'text-error': order.order.paid == 0, 'text-success': order.order.paid == 1}"
                >
                  {{ order.order.paid == 1 ? "مدفوع" : "غير مدفوع" }}
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  المجموع الفرعي للطلب :
                </span>
                <VChip
                  size="large"
                  class="mx-1 font-weight-bold"
                >
                  {{ order ? ConvertToArabicNumbers(order.order.order_subtotal) : ConvertToArabicNumbers(0) }}
                  ريال
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  المجموع الكلي :
                </span>
                <VChip
                  size="large"
                  class="font-weight-bold"
                  :class="{'text-error': order['sale price'] === 'undefined', 'text-success': order['sale price'] !== 'undefined' }"
                >
                  {{
                    order.order.total_amount !== "undefined" ? ConvertToArabicNumbers(order.order.total_amount) : ConvertToArabicNumbers(0)
                  }} ريال
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  كود الخصم   :
                </span>
                <VChip
                  size="large"
                  color="primary"
                  class="font-weight-bold"
                >
                  {{
                    order.order.applied_discount_code ? order.order.applied_discount_code : "لا يوجد"
                  }} 
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  الخصم المطبق  :
                </span>
                <VChip
                  size="large"
                  color="primary"
                  class="font-weight-bold"
                >
                  {{
                    order.order.discount_applied !== "undefined" ? ConvertToArabicNumbers(order.order.discount_applied) : ConvertToArabicNumbers(0)
                  }} ريال
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  المجموع الكلي بعد الخصم :
                </span>
                <VChip
                  size="large"
                  class="font-weight-bold"
                  :class="{'text-error': order['sale price'] === 'undefined', 'text-success': order['sale price'] !== 'undefined' }"
                >
                  {{
                    order.order.total_amount_after_discount !== "undefined" ? ConvertToArabicNumbers(order.order.total_amount_after_discount) : ConvertToArabicNumbers(0)
                  }} ريال
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  مصاريف التوصيل :
                </span>
                <VChip
                  size="large"
                  class="font-weight-bold"
                >
                  {{
                    order.order.delivery_fee !== "undefined" ? ConvertToArabicNumbers(order.order.delivery_fee) + " ريال " : "لا يوجد"
                  }}
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  عنوان التوصيل :
                </span>
                <VChip
                  size="large"
                  class="font-weight-bold"
                  :class="{'text-error': order.order.selected_address.address === 'undefined', 'text-success': order.order.selected_address.address !== 'undefined' }"
                >
                  {{
                    order.order.selected_address.address !== "undefined" ? order.order.selected_address.address : "لا يوجد"
                  }}
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  الرصيد المستخدم من المحفظة :
                </span>
                <VChip
                  size="large"
                  class="font-weight-bold"
                >
                  {{
                    order.order.wallet_amount_used !== "undefined" ? ConvertToArabicNumbers(order.order.wallet_amount_used) + " " + "ريال " : "لا يوجد  "
                  }}
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  طريقة الدفع :
                </span>
                <VChip
                  size="large"
                  class="font-weight-bold"
                >
                  {{
                    order.order.payment_type ? ConvertToArabicNumbers(order.order.payment_type.name_ar) : "لا يوجد  "
                  }}
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span> المنتجات :</span>
                <VChip
                  v-for="product in order.products"
                  :key="product.id"
                  size="large"
                  class="font-weight-bold mx-1"
                >
                  {{ product.product ? product.product.name_ar : "لا يوجد اسم" }}
                </VChip>
              </h3>
            </div>
          </div>
        </div>
        <div class="order-products">
          <div class="d-flex justify-space-between align-center flex-wrap">
            <h2 class="order-title pb-2">
              <span>المنتجات </span>
            </h2>
            <VBtn
              color="primary"
              @click="AddNewProductOpen(order.order)"
            >
              <VIcon
                :size="22"
                icon="lets-icons:add-light"
              />
              <span>إضافة منتج جديد</span>
            </VBtn>
          </div>
          <div class="products-list">
            <div class="product table-responsive">
              <VTable class="table">
                <thead>
                  <tr class="border-b-sm">
                    <th>
                      الاسم
                    </th>
                    <th>
                      الأحجام
                    </th>
                    <th>
                      التقطيع
                    </th>
                    <th>
                      التجهيز
                    </th>
                    <th>
                      الكمية
                    </th>
                    <th>
                      السعر
                    </th>
                    <th>
                      الاجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="product in order.products"
                    :key="product.id"
                    style=" border-bottom: 1px solid;"
                  >
                    <td class="px-2">
                      <span>{{ product.product ? product.product.name_ar : "لا يوجد اسم" }}</span>
                    </td>
                    <td>{{ product.size ? product.size.name_ar : "لا يوجد" }}</td>
                    <td>{{ product.cut ? product.cut.name_ar : "لا يوجد" }}</td>
                    <td>{{ product.preparation ? product.preparation.name_ar : "لا يوجد" }}</td>
                    <td class="px-2">
                      <span class="d-block  text-base">
                        {{ ConvertToArabicNumbers(product.quantity) }}
                      </span>
                    </td>
                    <td class="px-2">
                      <span class="text-success font-weight-bold">
                        {{ ConvertToArabicNumbers(Intl.NumberFormat().format(product.total_price)) }} ريال
                      </span>
                    </td>
                    <td>
                      <VBtn
                        icon
                        variant="plain"
                        color="default"
                        size="x-small"
                        @click="openProductEdit(product)"
                      >
                        <VIcon
                          :size="22"
                          icon="ph:pencil-line"
                        />
                      </VBtn>
                      <VBtn
                        icon
                        variant="plain"
                        color="default"
                        size="x-small"
                        @click="deleteProduct(product)"
                      >
                        <VIcon
                          v-if="!isDeleteing"
                          :size="22"
                          icon="mingcute:delete-line"
                        />
                        <VIcon
                          v-else
                          icon="mingcute:loading-line"
                          class="loading"
                          size="32"
                        />
                      </VBtn>
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddNewProduct
      v-model:isAddOpen="isAddProductOpen"
      :order="selectedProductItem"
      :sizes="productSizes"
      :cuts="productCuts"
      :preparations="productPreparations"
      @refreshTable="getOrderDetails"
    />
    <AddProductCoupon
      v-model:isAddOpen="isAddProductCouponOpen"
      @addProductCoupon="addProductCoupon"
    />
    <EditOrderDeatilsDialog
      v-model:isEditOpen="isEditOpen"
      :item="order"
      @refreshTable="getOrderDetails"
    />
    <EditOrderItemDialog
      v-model:isEditProductOpen="isEditProductOpen"
      :item="selectedProductItem"
      :sizes="productSizes"
      :cuts="productCuts"
      :preparations="productPreparations"
      @refreshTable="getOrderDetails"
    />
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

img {
  display: block;
  inline-size: 100%;
}

.img-display {
  overflow: hidden;
  max-inline-size: 500px;
}

.img-showcase {
  display: flex;
  inline-size: 100%;
  transition: all 0.5s ease;
}

.img-showcase img {
  min-inline-size: 100%;
}

.img-select {
  display: flex;
}

.img-item {
  margin: 0.3rem;
}

.img-item:nth-child(1),
.img-item:nth-child(2),
.img-item:nth-child(3) {
  margin-inline-end: 0;
}

.img-item:hover {
  opacity: 0.8;
}

.order-content {
  padding-block: 2rem;
  padding-inline: 1rem;
}

.order-title {
  position: relative;
  font-size: 3rem;
  font-weight: 700;
  inline-size: fit-content;

  //color: #12263a;
  margin-block: 1rem;
  margin-inline: 0;
  text-transform: capitalize;
}

.order-title::after {
  position: absolute;
  background: rgb(var(--v-global-theme-primary));
  block-size: 4px;
  content: "";
  inline-size: 50%;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.order-detail h2 {
  position: relative;
  inline-size: fit-content;
  margin-block-end: 20px;
}

.order-detail h2::after {
  position: absolute;
  background: rgb(var(--v-global-theme-primary));
  block-size: 4px;
  content: "";
  inline-size: 100%;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.order-link {
  display: inline-block;
  background: #256eff;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 400;
  margin-block-end: 0.5rem;
  padding-block: 0;
  padding-inline: 0.3rem;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.5s ease;
}

@media screen and (min-width: 992px) {
  .card {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 2fr 2fr;
  }

  .card-wrapper {
    align-items: center;

    //height: 100vh;
    //display: flex;
    justify-content: center;
  }

  .order-imgs {
    max-inline-size: 500px;
  }

  .order-content {
    padding-block-start: 0;
  }
}
</style>
