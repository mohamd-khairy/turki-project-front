import { defineStore } from 'pinia'
import axios from '@axios'

export const useCouponsStore = defineStore('CouponsStore', {
  actions: {
    // 👉 Fetch all Countries
    fetchCoupons(params) {
      return axios.get('discounts', { params })
    },

    // 👉 Fetch Single Country
    fetchCoupon(id) {
      return axios.get(`/discounts/${id}`)
    },

    // 👉 Store Single Country countries/add-countries
    storeCoupon(data) {
      return axios.post(`discounts/add-discount` , data)
    },
    editCoupon(data) {
      return axios.post(`discounts/update-discount/${data.id}` , data)
    },
    deleteCoupon(data) {
      return axios.delete(`discounts/delete-discount/${data.id}`)
    },
  },
})
