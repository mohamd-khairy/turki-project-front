<script setup>
import { useProductsStore } from "@/store/Products"
import moment from "moment"

const productsListStore = useProductsStore()
const route = useRoute()

const product = ref({})
const isLoading = ref(false)

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

onMounted(() => {
  const id = route.params.id

  isLoading.value = true

  productsListStore.fetchProduct(id).then(response => {
    isLoading.value = false
    product.value = response.data.data
  }).catch(error => {
    isLoading.value = false
  })
})
</script>

<template>
  <div>
    <div class="card-wrapper" v-if="!isLoading">
      <div class="card">
        <!-- card left -->
        <div class="product-imgs">
          <VCarousel hide-delimiter-background cycle :show-arrows="product.images > 1"
          >
            <VCarouselItem
              v-for="image in product.images"
              :key="image.id"
              cover
            >
              <img :src="image.image_url" alt="">
            </VCarouselItem>
          </VCarousel>

        </div>
        <!-- card right -->
        <div class="product-content">
          <h2 class="product-title text-white pb-2">{{ product ? product.name_ar : "اسم المنتج" }}</h2>
          <p class="mb-5">{{ product.description_ar }}</p>

          <div class="product-detail mt-5">
            <h2 class="bg-light-primary px-5 py-2">
              <VIcon icon="clarity:details-line"></VIcon>
              <span class="mx-2">
              تفاصيل المنتج
            </span>
            </h2>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              سعر المنتج :
              </span>
                <VChip class="mx-1">{{ product ? ConvertToArabicNumbers(product.price) : ConvertToArabicNumbers(0) }}
                  ريال
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              سعر البيع :
              </span>
                <VChip class="font-weight-bold"
                       :class="{'text-error': product['sale price'] === 'undefined', 'text-success': product['sale price'] !== 'undefined' }"
                >
                  {{
                    product['sale price'] !== "undefined" ? ConvertToArabicNumbers(product['sale price']) : ConvertToArabicNumbers(0)
                  }} ريال
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              الوزن :
              </span>
                <VChip class="font-weight-bold"
                       :class="{'text-error': product.weight === 'undefined', 'text-success': product.weight !== 'undefined' }"
                >
                  {{
                    product.weight !== "undefined" ? ConvertToArabicNumbers(product.weight) + "كيلو جرام" : "لا يوجد حجم"
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              السعرات الحرارية :
              </span>
                <VChip class="font-weight-bold"
                       :class="{'text-error': product.calories === 'undefined', 'text-success': product.calories !== 'undefined' }"
                >
                  {{
                    product.calories !== "undefined" ? ConvertToArabicNumbers(product.calories) + "كيلو جرام" : "لا يوجد "
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              عدد مرات التقييم :
              </span>
                <VChip class="font-weight-bold"
                       :class="{'text-error': product.no_rating === 'undefined', 'text-success': product.no_rating !== 'undefined' }"
                >
                  {{
                    product.no_rating !== "undefined" ? ConvertToArabicNumbers(product.no_rating) + " " + "مرات " : "لا يوجد  "
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              عدد مرات البيع :
              </span>
                <VChip class="font-weight-bold"
                       :class="{'text-error': product.no_sale === 'undefined', 'text-success': product.no_sale !== 'undefined' }"
                >
                  {{
                    product.no_sale !== "undefined" ? ConvertToArabicNumbers(product.no_sale) + " " + "مرات " : "لا يوجد  "
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              الفئة :
              </span>
                <VChip class="font-weight-bold"
                       :class="{'text-error': product.category === 'undefined', 'text-success': product.category !== 'undefined' }"
                >
                  {{
                    product.category ? product.category.type_ar : "لايوجد"
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
              الفئة الفرعية :
              </span>
                <VChip class="font-weight-bold"
                       :class="{'text-error': product.sub_category === 'undefined', 'text-success': product.sub_category !== 'undefined' }"
                >
                  {{
                    product.sub_category ? product.sub_category.type_ar : "لايوجد"
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
                 المدن :
                </span>
                <VChip class="font-weight-bold mx-1" v-for="city in product.cities" :key="city.id">
                  {{ city.name_ar }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
               وسائل الدفع :
              </span>
                <VChip class="font-weight-bold mx-1" v-for="payment in product.payment_types" :key="payment.id">
                  {{ payment.name_ar }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
                الأحجام :
              </span>
                <VChip class="font-weight-bold mx-1" v-if="product.sizes === []">
                  لا يوجد
                </VChip>
                <VChip class="font-weight-bold mx-1" v-for="size in product.sizes" :key="size.id" v-else>
                  {{ size.name_ar }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
                القطع :
              </span>
                <VChip class="font-weight-bold mx-1" v-if="product.cuts === []">
                  لا يوجد
                </VChip>
                <VChip class="font-weight-bold mx-1" v-for="cut in product.cuts" :key="cut.id" v-else>
                  {{ cut.name_ar }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon icon="arcticons:destiny-item-manager" color="primary" class="ml-2"></VIcon>
                <span>
                التجهيز :
              </span>
                <VChip class="font-weight-bold mx-1" v-if="product.preparations == []">
                  لا يوجد
                </VChip>
                <VChip class="font-weight-bold mx-1" v-for="preparation in product.preparations" :key="preparation.id"
                       v-else
                >
                  {{ preparation.name_ar }}
                </VChip>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loader_wrap" v-else>
      <img src="@/assets/images/logo.png" alt="najdiya" width="100" />
      <p class="text-2xl">جاري جلب البيانات ...</p>
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

.product-content {
  padding: 2rem 1rem;
}

.product-title {
  width: fit-content;
  font-size: 3rem;
  text-transform: capitalize;
  font-weight: 700;
  position: relative;
  //color: #12263a;
  margin: 1rem 0;
}

.product-title::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  height: 4px;
  width: 50%;
  background: rgb(var(--v-global-theme-primary));
}

.product-detail h2 {
  position: relative;
  width: fit-content;
  margin-bottom: 20px;
}

.product-detail h2::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  height: 4px;
  width: 100%;
  background: rgb(var(--v-global-theme-primary));
}

.product-link {
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
    grid-template-columns: 1fr 2fr;
    grid-gap: 1.5rem;
  }
  .card-wrapper {
    //height: 100vh;
    //display: flex;
    justify-content: center;
    align-items: center;
  }
  .product-imgs {
    max-width: 500px;
  }
  .product-content {
    padding-top: 0;
  }
}
</style>
