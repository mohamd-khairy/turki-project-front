import { defineStore } from 'pinia'
import axios from '@axios'

export const useOrdersStore = defineStore('OrdersStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchOrders(params) {
      return axios.get('orders/get-order', { params })
    },
    fetchOrderStatus() {
      return axios.get('order-status')
    },

    // 👉 Fetch single banner
    storeOrder(data) {
      return axios.post(`orders/create-order`, data)
    },
    fetchOrder(refrence_id) {
      return axios.get(`/orders/get-one-order/${refrence_id}`)
    },
    editOrder(data) {
      return axios.post(`/orders/edit-order`, data)
    },
    editOrderProduct(data) {
      return axios.post(`/orders/edit-order-product`, data)
    },
    deleteOrderProduct(data) {
      return axios.post(`orders/delete-order-product`, data)
    },
  },
})
