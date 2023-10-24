import { defineStore } from 'pinia'
import axios from '@axios'

export const useOrdersStore = defineStore('OrdersStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchOrders(params) {
      return axios.get('orders', { params })
    },

    // 👉 Fetch single banner
    fetchOrder(id) {
      return axios.get(`/orders/${id}`)
    },
  },
})
