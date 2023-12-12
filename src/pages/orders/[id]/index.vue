<script setup>
import moment from "moment"
import { useOrdersStore } from "@/store/Orders"
import { useSettingsStore } from "@/store/Settings"
import AddProductCoupon from "@/pages/orders/[id]/AddProductCoupon.vue"
import AddNewProduct from "@/pages/orders/[id]/AddNewProduct.vue"

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
    <VCard class="mb-5 pa-5" v-if="!isLoading">
      <VRow>
        <VCol cols="12" lg="2" md="3" sm="4">
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
    <div class="loader_wrap" v-if="isLoading">
      <img src="@/assets/images/logo.png" alt="najdiya"/>
      <p class="text-2xl">جاري جلب البيانات ...</p>
    </div>
    <div class="card-wrapper" v-else>
      <div class="card">
        <div class="order-content">
          <h1 class="order-title pb-2">
            <span>طلب - </span>
            <span>
              #{{ order ? order.order.ref_no : "الرقم المرجعي" }}
            </span>
          </h1>
          <p class="mb-5">{{ order ? order.order.comment : "لا يوجد" }}</p>

          <div class="order-detail mt-5">
            <h2 class="bg-light-primary px-5 py-2">
              <VIcon icon="clarity:details-line"></VIcon>
              <span class="mx-2">
              تفاصيل الطلب
            </span>
            </h2>
            <div>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
                تاريخ الطلب :
              </span>
                <VChip size="large" class="font-weight-bold">
                  {{ ConvertToArabicNumbers(formatDateTime(order.order.created_at).date) }}
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
                توقيت الطلب :
              </span>
                <VChip size="large" class="font-weight-bold">
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
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
                حالة الطلب :
              </span>
                <VChip size="large" class="font-weight-bold">
                  {{ order.order.order_state.state_ar }}
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              المجموع الفرعي للطلب :
              </span>
                <VChip size="large" class="mx-1 font-weight-bold">
                  {{ order ? ConvertToArabicNumbers(order.order.order_subtotal) : ConvertToArabicNumbers(0) }}
                  ريال
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
               المجموع الكلي :
              </span>
                <VChip size="large" class="font-weight-bold"
                       :class="{'text-error': order['sale price'] === 'undefined', 'text-success': order['sale price'] !== 'undefined' }"
                >
                  {{
                    order.order.total_amount !== "undefined" ? ConvertToArabicNumbers(order.order.total_amount) : ConvertToArabicNumbers(0)
                  }} ريال
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
               الخصم المطبق  :
              </span>
                <VChip size="large" class="font-weight-bold">
                  {{
                    order.order.discount_applied !== "undefined" ? ConvertToArabicNumbers(order.order.discount_applied) : ConvertToArabicNumbers(0)
                  }} ريال
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
               المجموع الكلي بعد الخصم :
              </span>
                <VChip size="large" class="font-weight-bold"
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
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              مصاريف التوصيل :
              </span>
                <VChip size="large" class="font-weight-bold">
                  {{
                    order.order.delivery_fee !== "undefined" ? ConvertToArabicNumbers(order.order.delivery_fee) + " ريال " : "لا يوجد"
                  }}
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              عنوان التوصيل :
              </span>
                <VChip size="large" class="font-weight-bold"
                       :class="{'text-error': order.order.selected_address.address === 'undefined', 'text-success': order.order.selected_address.address !== 'undefined' }"
                >
                  {{
                    order.order.selected_address.address !== "undefined" ? ConvertToArabicNumbers(order.order.selected_address.address) + "كيلو جرام" : "لا يوجد "
                  }}
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              الرصيد المستخدم من المحفظة :
              </span>
                <VChip size="large" class="font-weight-bold">
                  {{
                    order.order.wallet_amount_used !== "undefined" ? ConvertToArabicNumbers(order.order.wallet_amount_used) + " " + "ريال " : "لا يوجد  "
                  }}
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              طريقة الدفع :
              </span>
                <VChip size="large" class="font-weight-bold">
                  {{
                    order.order.payment_type ? ConvertToArabicNumbers(order.order.payment_type.name_ar) : "لا يوجد  "
                  }}
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
                  الفئة :
                </span>
                <VChip size="large" class="font-weight-bold"
                       :class="{'text-error': order.category === 'undefined', 'text-success': order.category !== 'undefined' }"
                >
                  {{
                    order.category ? order.category.type_ar : "لايوجد"
                  }}
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
                  الفئة الفرعية :
                </span>
                <VChip size="large" class="font-weight-bold"
                       :class="{'text-error': order.sub_category === 'undefined', 'text-success': order.sub_category !== 'undefined' }"
                >
                  {{
                    order.sub_category ? order.sub_category.type_ar : "لايوجد"
                  }}
                </VChip>
              </h3>
            </div>
            <div class="order-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span> المنتجات :</span>
                <VChip size="large" class="font-weight-bold mx-1" v-for="product in order.products" :key="product.id">
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
                <tr v-for="product in order.products" :key="product.id" style=" border-bottom: 1px solid">
                  <td class="px-2">
                    <span>{{ product.product ? product.product.name_ar : "لا يوجد اسم" }}</span>
                  </td>
                  <td>{{product.size ? product.size.name_ar : "لا يوجد"}}</td>
                  <td>{{product.cut ? product.cut.name_ar : "لا يوجد"}}</td>
                  <td>{{product.preparation ? product.preparation.name_ar : "لا يوجد"}}</td>
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
                    <VBtn icon
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
                      <VIcon v-else icon="mingcute:loading-line" class="loading" size="32"></VIcon>

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
    <AddNewProduct v-model:isAddOpen="isAddProductOpen" :order="selectedProductItem" @refreshTable="getOrderDetails" :sizes="productSizes" :cuts="productCuts" :preparations="productPreparations"></AddNewProduct>
    <AddProductCoupon v-model:isAddOpen="isAddProductCouponOpen" @addProductCoupon="addProductCoupon"
    ></AddProductCoupon>
    <EditOrderDeatilsDialog v-model:isEditOpen="isEditOpen" :item="order" @refrshTable="getOrderDetails"
    ></EditOrderDeatilsDialog>
    <EditOrderItemDialog v-model:isEditProductOpen="isEditProductOpen" :item="selectedProductItem" :sizes="productSizes" :cuts="productCuts" :preparations="productPreparations"
                         @refrshTable="getOrderDetails"
    ></EditOrderItemDialog>
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

img {
  width: 100%;
  display: block;
}

.img-display {
  overflow: hidden;
  max-width: 500px;
}

.img-showcase {
  display: flex;
  width: 100%;
  transition: all 0.5s ease;
}

.img-showcase img {
  min-width: 100%;
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
  margin-right: 0;
}

.img-item:hover {
  opacity: 0.8;
}

.order-content {
  padding: 2rem 1rem;
}

.order-title {
  width: fit-content;
  text-transform: capitalize;
  font-weight: 700;
  position: relative;
  //color: #12263a;
  margin: 1rem 0;
}

.order-title::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  height: 4px;
  width: 50%;
  background: rgb(var(--v-global-theme-primary));
}

.order-detail h2 {
  position: relative;
  width: fit-content;
  margin-bottom: 20px;
}

.order-detail h2::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  height: 4px;
  width: 100%;
  background: rgb(var(--v-global-theme-primary));
}

.order-link {
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 400;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 0.5rem;
  background: #256eff;
  color: #fff;
  padding: 0 0.3rem;
  transition: all 0.5s ease;
}


@media screen and (min-width: 992px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 1.5fr;
    grid-gap: 1rem;
  }
  .card-wrapper {
    //height: 100vh;
    //display: flex;
    justify-content: center;
    align-items: center;
  }
  .order-imgs {
    max-width: 500px;
  }
  .order-content {
    padding-top: 0;
  }
}
</style>
