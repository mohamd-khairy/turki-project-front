import { defineStore } from 'pinia'
import axios from '@axios'

export const useRolesStore = defineStore('RolesStore', {
  actions: {
    // 👉 Fetch all Countries
    fetchRoles(params) {
      return axios.get('roles', { params })
    },

    // 👉 Fetch Single Country
    fetchRole(id) {
      return axios.get(`/roles/${id}`)
    },

    // 👉 Store Single Country countries/add-countries
    storeRole(data) {
      return axios.post(`roles` , data)
    },
    editRole(data) {
      return axios.put(`roles/${data.id}` , data)
    },
    deleteRole(data) {
      return axios.delete(`roles/${data.id}`)
    },
  },
})
