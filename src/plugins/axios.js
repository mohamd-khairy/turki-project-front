import axios from 'axios'
import { useRouter } from "vue-router"

const router = useRouter()

const axiosIns = axios.create({
// You can add your headers here
// ================================
  baseURL: 'https://c296-41-42-87-23.ngrok-free.app/api/v1/',

  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
})

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Use router.push() to navigate to the login screen
      router.push('/login') // Adjust the route as needed
      // Throw an exception to stop further execution

      return Promise.reject('Unauthorized')
    }

    // Handle other errors here
    return Promise.reject(error)
  },
)

export default axiosIns
