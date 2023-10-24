import { defineStore } from 'pinia'
import axios from '@axios'

export const useBannersStore = defineStore('BannersStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchBanners(params) {
      return axios.get('banners', { params })
    },

    // 👉 Fetch single banner
    fetchBanner(id) {
      return axios.get(`/banners/${id}`)
    },
  },
})
