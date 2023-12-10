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

      let cty_ids = ""
      Object.values(banner.city_ids).map(ctid => {
        if (typeof ctid == "object") {
          cty_ids = cty_ids.length == 0 ? `${ctid.id}` : cty_ids + ',' + ctid.id
        } else {
          cty_ids = cty_ids.length == 0 ? `${ctid}` : cty_ids + ',' + ctid
        }
      })

      formData.append("title", banner.title)
      formData.append("title_color", banner.title_color)
      formData.append("sub_title", banner.sub_title)
      formData.append("sub_title_color", banner.sub_title_color)
      formData.append("button_text", banner.button_text)
      formData.append("button_text_color", banner.button_text_color)
      formData.append("redirect_url", banner.redirect_url)
      formData.append("is_active", banner.is_active)
      formData.append("type", banner.type)
      if (banner.redirect_mobile_url !== null) {
        formData.append("redirect_mobile_url", banner.redirect_mobile_url)
      }
      if (banner.product_id !== null) {
        formData.append("product_id", banner.product_id)
      }

      formData.append("category_ids", banner.category_ids)

      formData.append("city_ids", cty_ids)
      if (banner.image !== {}) {
        formData.append("image", banner.image[0])
      }

      return axios.post(`/banners/add-banner`, formData)
    },

    // 👉 Edit banner
    editBanner(banner) {

      const formData = new FormData()

      let cty_ids = ""
      Object.values(banner.city_ids).map(ctid => {
        if (typeof ctid == "object") {
          cty_ids = cty_ids.length == 0 ? `${ctid.id}` : cty_ids + ',' + ctid.id
        } else {
          cty_ids = cty_ids.length == 0 ? `${ctid}` : cty_ids + ',' + ctid
        }
      })

      formData.append("title", banner.title)
      formData.append("title_color", banner.title_color)
      formData.append("sub_title", banner.sub_title)
      formData.append("sub_title_color", banner.sub_title_color)
      formData.append("button_text", banner.button_text)
      formData.append("button_text_color", banner.button_text_color)
      formData.append("redirect_url", banner.redirect_url)
      formData.append("is_active", banner.is_active)
      formData.append("type", banner.type)
      if (banner.redirect_mobile_url !== null) {
        formData.append("redirect_mobile_url", banner.redirect_mobile_url)
      }
      if (banner.product_id !== null) {
        formData.append("product_id", banner.product_id)
      }

      let cats_ids = []

      banner.category_ids.map(cat => {
        cats_ids.push(cat.id)
      })

      formData.append("category_ids", cats_ids)
      formData.append("city_ids", cty_ids)
      if (banner.image[0]) {
        formData.append("image", banner.image)
      }

      return axios.post(`/banners/update-banner/${banner.id}`, formData)
    },

    // 👉 Delete banner
    deleteBanner(banner) {
      return axios.delete(`/banners/delete-banner/${banner.id}`)
    },
  },
})
