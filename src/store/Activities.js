import { defineStore } from 'pinia'
import axios from '@axios'

export const useActivitiesStore = defineStore('ActivitiesStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchActivities(params) {
      return axios.get('logs', { params })
    },
  },
})
