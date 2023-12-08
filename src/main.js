/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import i18n from '@/plugins/i18n'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

loadFonts()

// Create vue app
const pinia = createPinia()
const app = createApp(App)

// directives
app.directive('can', {
  mounted(el, binding) {
    // Assume 'userPermissions' is an array of permissions the user has
    const userPermissions = JSON.parse(localStorage.getItem('najdPermissions')) || []
    const requiredPermission = binding.value

    if (!userPermissions.includes(requiredPermission) && requiredPermission !== "show") {
      el.style.display = 'none'
      if(el.parentNode.getAttribute('class') !== "ps nav-items ps__rtl") {
        // Insert a placeholder element
        const placeholder = document.createElement('div')
        const textContent = document.createElement('span')
        const br = document.createElement('br')
        const iconContent = document.createElement('img')

        iconContent.src = "https://img.icons8.com/?size=256&id=HeUqp8xPBlG1&format=png"
        iconContent.width = "100"
        textContent.textContent = "ليس لديك صلاحية لعرض هذا المحتوي."
        placeholder.style.textAlign = "center"
        placeholder.appendChild(iconContent)
        placeholder.appendChild(br)
        placeholder.appendChild(textContent)

        // placeholder.textContent = 'ليس لديك صلاحية لعرض هذا المحتوي.'
        el.parentNode.insertBefore(placeholder, el)
      }
    }
  },
})

// Use plugins
app.use(vuetify)
app.use(i18n)
app.use(pinia)
app.use(router)
app.use(layoutsPlugin)

// Mount vue app
app.mount('#app')
