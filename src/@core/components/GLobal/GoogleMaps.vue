<script setup>
import { GoogleMap, Marker } from "vue3-google-map"

const props = defineProps(["location"])

// const center = reactive({ lat: 30.0516943, lng: 31.2053852 })
const center = reactive({ lat: 30.0516943, lng: -74.0215151 })
const currentPlace = ref(null)
const markers = ref(null)
const places = ref(null)

const geoLocate = () => {
  if (props.location) {
    let loc = JSON.stringify(props.location).replaceAll("{", "").replaceAll("}", "").replaceAll("\"", "").replaceAll("\"\\", "").replaceAll("\\", "").split(",")
    center.lat = Number(loc[0].split(":")[1])
    center.lng = Number(loc[1].split(":")[1])
    let marker = {
      lat: center.lat,
      lng: center.lng,
    }
    emit("updateLocation", marker)
    markers.value = { position: marker }
  } else {
    navigator.geolocation.getCurrentPosition(position => {
      center.lat = position.coords.latitude
      center.lng = position.coords.longitude
    })
  }
}

onMounted(() => {
  geoLocate()
})
</script>

<template>
  <GoogleMap api-key="AIzaSyCNeP4vlmQ8y_Sq7EtKk8_mEN47PapWIuI" style="width: 100%; height: 500px" :center="center"
             :zoom="15"
  >
    <Marker :options="{ position: center }"/>
  </GoogleMap>
</template>

