import { defineStore } from 'pinia'
import axios from '@axios'

export const useCountriesStore = defineStore('CountriesStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchCountries(params) {
      return axios.get('countries', { params })
    },

    // 👉 Fetch single banner
    fetchCountry(id) {
      return axios.get(`/countries/${id}`)
    },
  },
})
