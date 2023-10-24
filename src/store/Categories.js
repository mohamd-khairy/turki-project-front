import { defineStore } from 'pinia'
import axios from '@axios'

export const useCategoriesStore = defineStore('CategoriesStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchCategories(params) {
      return axios.get('categories', { params })
    },
    fetchSubCategories(params) {
      return axios.get('sub-categories', { params })
    },

    // 👉 Fetch single banner
    fetchCategory(id) {
      return axios.get(`/categories/${id}`)
    },
    fetchSubCategory(id) {
      return axios.get(`/sub-categories/${id}`)
    },
  },
})
