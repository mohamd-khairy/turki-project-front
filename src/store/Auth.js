import { defineStore } from 'pinia'
import axios from '@axios'

export const useAuthStore = defineStore('AuthStore', {
  state: () => {
    return {
      token: "",
      user: "",
    }
  },
  actions: {
    login(data) {
      return axios.post('login', data)
    },
  },
})
