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

const geoLocate = () => {
  center.lat = props.location.lat == 0 || props.location.lat == null ? 30.0564503 : Number(props.location.lat)
  center.lng = props.location.lng == 0 || props.location.lng == null ? -74.1840919 : Number(props.location.lng)
  let marker = {
    lat: Number(props.location.lat),
    lng: Number(props.location.lng),
  }
  markerOpt.value = { position: marker }
}

onBeforeMount(() => {
  geoLocate()
})
</script>

<template>
  <div>
    <GoogleMap
      api-key="AIzaSyCM2TngqydZtVlZ5hkKjY7x56ut59TTI88"
      style="width: 100%; height: 500px"
      :center="{lat: props.location.lat == 0 || props.location.lat == null ? 30.0564503 : props.location.lat, lng: props.location.lng == 0 || props.location.lng == null ? -74.1840919 : props.location.lng }"
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
