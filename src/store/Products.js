import { defineStore } from 'pinia'
import axios from '@axios'

export const useProductsStore = defineStore('ProductsStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchProducts(params) {
      return axios.get('products', { params })
    },

    // 👉 Fetch single banner
    fetchProduct(id) {
      return axios.get(`/products/${id}`)
    },
  },
})
