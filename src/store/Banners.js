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

    // 👉 store banner
    storeBanner(banner) {
      const formData = new FormData()

      formData.append("title", banner.title)
      formData.append("title_color", banner.title_color)
      formData.append("sub_title", banner.sub_title)
      formData.append("sub_title_color", banner.sub_title_color)
      formData.append("button_text", banner.button_text)
      formData.append("button_text_color", banner.button_text_color)
      formData.append("redirect_url", banner.redirect_url)
      formData.append("is_active", banner.is_active)
      formData.append("type", banner.type)
      formData.append("redirect_mobile_url", banner.redirect_mobile_url)
      formData.append("product_id", banner.product_id)
      formData.append("category_id", banner.category_id)
      formData.append("city_ids", [banner.city_ids])
      formData.append("image", banner.image[0])

      return axios.post(`/banners/add-banner`, formData)
    },

    // 👉 Edit banner
    editBanner(banner) {

      const formData = new FormData()

      formData.append("title", banner.title)
      formData.append("title_color", banner.title_color)
      formData.append("sub_title", banner.sub_title)
      formData.append("sub_title_color", banner.sub_title_color)
      formData.append("button_text", banner.button_text)
      formData.append("button_text_color", banner.button_text_color)
      formData.append("redirect_url", banner.redirect_url)
      formData.append("is_active", banner.is_active)
      formData.append("type", banner.type)
      formData.append("redirect_mobile_url", banner.redirect_mobile_url)
      formData.append("product_id", banner.product_id)
      formData.append("category_id", banner.category_id)
      formData.append("city_ids", [banner.city_ids])
      if(typeof banner.image !== "object" && banner.image !== {}){
        formData.append("image", banner.image[0])
      }

      return axios.post(`/banners/update-banner/${banner.id}`, formData)
    },

    // 👉 Delete banner
    deleteBanner(banner) {
      return axios.delete(`/banners/delete-banner/${banner.id}`)
    },
  },
})
