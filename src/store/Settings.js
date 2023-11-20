import { defineStore } from 'pinia'
import axios from '@axios'

export const useSettingsStore = defineStore('SettingsStore', {
  state: () => {
    return {
      isAlertShow: false,
      alertColor: "",
      alertMessage: "",
    }
  },
  actions: {
    fetchDelivery_Periods(params) {
      return axios.get('delivery-period', { params })
    },
    fetchProductCut(params) {
      return axios.get('product-cuts', { params })
    },
    fetchPaymentTypes(params) {
      return axios.get('payment-types', { params })
    },
    fetchProductShalwata(params) {
      return axios.get('product-shlwatas', { params })
    },
    fetchProductPerparation(params) {
      return axios.get('Product-preparations', { params })
    },
    fetchProductSize(params) {
      return axios.get('product-sizes', { params })
    },

    storeProductCut(data) {
      return axios.post(`product-cuts/add-cut`, data)
    },
    storePaymentType(data) {
      return axios.post(`payment-types/add-payment-type`, data)
    },
    storeProductShalwata(data) {
      return axios.post(`product-shlwatas/add-product-shlwatas`, data)
    },
    storeProductPerparation(data) {
      return axios.post(`Product-preparations/add-preparations`, data)
    },
    storeProductSize(data) {
      return axios.post(`product-sizes/add-size`, data)
    },

    editProductCut(data) {
      return axios.post(`product-cuts/update-cut/${data.id}`, data)
    },
    editPaymentType(data) {
      return axios.post(`payment-types/update-payment-type/${data.id}`, data)
    },
    editProductShalwata(data) {
      return axios.post(`product-shlwatas/update-product-shlwatas/${data.id}`, data)
    },
    editProductPerparation(data) {
      return axios.post(`Product-preparations/update-preparations/${data.id}`, data)
    },
    editProductSize(data) {
      return axios.post(`product-sizes/update-size/${data.id}`, data)
    },

    deleteProductCut(data) {
      return axios.post(`product-cuts/delete-productCut/${data.id}`, data)
    },
    deletePaymentType(data) {
      return axios.post(`payment-types/delete-payment-type/${data.id}`)
    },
    deleteProductShalwata(data) {
      return axios.post(`delete-product-shlwatas/${data.id}`, data)
    },
    deleteProductPerparation(data) {
      return axios.post(`Product-preparations/delete-preparations/${data.id}`, data)
    },
    deleteProductSize(data) {
      return axios.post(`product-sizes/delete-size/${data.id}`)
    },
  },
})
