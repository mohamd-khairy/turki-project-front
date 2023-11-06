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

    storeCategory(data) {
      const formData = new FormData()
      let cty_ids = " "
      Object.values(data.city_ids).map(ctid => {
        cty_ids = cty_ids + ',' + ctid
      })

      formData.append("type_ar", data.type_ar)
      formData.append("type_en", data.type_en)
      formData.append("description", data.description)
      formData.append("backgroundColor", data.backgroundColor)
      formData.append("color", data.color)
      formData.append("city_ids", cty_ids.split(" ,")[1])
      formData.append("image", data.image[0])

      return axios.post(`/categories/add-category`, formData)
    },
    storeSubCategory(data) {
      return axios.get(`/sub-categories`, data)
    },

    editCategory(data) {
      const formData = new FormData()
      let cty_ids = " "
      Object.values(data.city_ids).map(ctid => {
        cty_ids = cty_ids + ',' + ctid
      })

      formData.append("type_ar", data.type_ar)
      formData.append("type_en", data.type_en)
      formData.append("description", data.description)
      formData.append("backgroundColor", data.backgroundColor)
      formData.append("color", data.color)
      formData.append("city_ids", cty_ids.split(" ,")[1])
      formData.append("image", data.image[0])

      return axios.post(`/categories/update-category/${data.id}`, formData)
    },

    deleteCategory(data) {
      return axios.delete(`/categories/delete-category/${data.id}`)
    },
  },
})
