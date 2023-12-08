<script setup>
import { GoogleMap, Marker } from "vue3-google-map"

// const props = defineProps(["location"])
const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
})

const center = reactive({ lat: 30.0564503, lng: -74.1840919 })
const markerOpt = ref({})
const isMapLoad = ref(false)

const geoLocate = () => {

  center.lat = Number(props.location.lat)
  center.lng = Number(props.location.lng)
  isMapLoad.value = true
  let marker = {
    lat: Number(props.location.lat),
    lng: Number(props.location.lng),
  }
  markerOpt.value = { position: marker }
}

onMounted(() => {
  geoLocate()
})
</script>

<template>
  <div>
    CNTR => {{center}}
    <GoogleMap
      api-key="AIzaSyCM2TngqydZtVlZ5hkKjY7x56ut59TTI88"
      style="width: 100%; height: 500px"
      :center="center"
      :zoom="5"
    >
      <Marker
        :options="{position: {lat: props.location.lat, lng: props.location.lng }}"
      />
      <!--      <Polyline :options="flightPath"/>-->
    </GoogleMap>
  </div>
</template>

<style scoped lang="scss">

</style>
