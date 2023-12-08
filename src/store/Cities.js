import { defineStore } from 'pinia'
import axios from '@axios'

export const useCitiesStore = defineStore('CitiesStore', {
  actions: {
    // 👉 Fetch all Countries
    fetchCities(params) {
      return axios.get('cities', { params })
    },
    fetchCitiesByCountry(id) {
      return axios.get(`cities/get-city-ByCountry/${id}`)
    },

    // 👉 Fetch Single Country
    fetchCity(id) {
      return axios.get(`/cities/${id}`)
    },

    // 👉 Store Single Country countries/add-countries
    storeCity(data) {
      return axios.post(`cities/add-cities` , data)
    },
    editCity(data) {
      return axios.post(`cities/update-cities/${data.id}` , data)
    },
    deleteCity(data) {
      return axios.post(`cities/delete-city/${data.id}`)
    },
  },
})
