import { defineStore } from 'pinia'
import axios from '@axios'

export const useCountriesStore = defineStore('CountriesStore', {
  actions: {
    // 👉 Fetch all Countries
    fetchCountries(params) {
      return axios.get('countries', { params })
    },

    // 👉 Fetch Single Country
    fetchCountry(id) {
      return axios.get(`countries/${id}`)
    },

    // 👉 Store Single Country countries/add-countries
    storeCountry(data) {
      return axios.post(`countries/add-countries` , data)
    },

    // 👉 Store Single Country countries/add-countries
    editCountry(data) {
      return axios.post(`countries/update-country/${data.id}` , data)
    },
    deleteCountry(data) {
      return axios.post(`countries/delete-country/${data.id}`)
    },

    changeCountryStatus(data) {
      return axios.post(`countries/update-status/${data.id}`)
    },
  },
})
