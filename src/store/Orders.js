import { defineStore } from 'pinia'
import axios from '@axios'

export const useOrdersStore = defineStore('OrdersStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchOrders(params) {
      return axios.get('orders/get-order', { params })
    },

    // 👉 Fetch single banner
    fetchOrder(id) {
      return axios.get(`/orders/${id}`)
    },
    editOrder(data) {
      return axios.post(`/orders/edit-order`, data)
    },
  },
})
