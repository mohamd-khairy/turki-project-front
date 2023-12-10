import { defineStore } from 'pinia'
import axios from '@axios'

export const usePermissionsStore = defineStore('PermissionsStore', {
  actions: {
    // 👉 Fetch all Countries
    fetchPermissions(params) {
      return axios.get('permission', { params })
    },

    // 👉 Fetch Single Country
    fetchPermission(id) {
      return axios.get(`/permission/${id}`)
    },

    // 👉 Store Single Country countries/add-countries
    storePermission(data) {
      return axios.post(`permission` , data)
    },
    editPermission(data) {
      return axios.put(`permission/${data.id}` , data)
    },
    deletePermission(data) {
      return axios.delete(`permission/${data.id}`)
    },
  },
})
