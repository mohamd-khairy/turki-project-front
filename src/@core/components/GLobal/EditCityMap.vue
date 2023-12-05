<script setup>
import { GoogleMap, Polygon, Marker, MarkerCluster } from "vue3-google-map"

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
  places: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['getPaths'])

// const center = reactive({ lat: 30.0516943, lng: 31.2053852 })
const center = reactive({ lat: 30.0564503, lng: -74.1840919 })
const markers = reactive([])

const places = reactive([])

const flightPath = ref({
  path: props.places,
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
})

const geoLocate = () => {
  if (props.location) {
    center.lat = props.location.lat
    center.lng = props.location.lng
    let marker = {
      lat: center.lat,
      lng: center.lng,
    }
    markers.value = { position: marker }
  } else {
    navigator.geolocation.getCurrentPosition(position => {
      center.lat = position.coords.latitude
      center.lng = position.coords.longitude
    })
  }
}


const addMarker = event => {
  if (event.latLng) {
    const position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }

    const options = {
      // draggable: true,
      label: 'Marker',
    }

    emit('getPaths', position)
    markers.push({ position, ...options })
    places.push(position)

  }
}

const onMarkerDragged = index => {
  console.log(index)
}

onMounted(() => {
  geoLocate()
})
</script>

<template>
  <div class="position-relative">
    <GoogleMap
      api-key="AIzaSyCM2TngqydZtVlZ5hkKjY7x56ut59TTI88"
      style="width: 100%; height: 500px"
      :center="{lat: props.location.lat == 0 || props.location.lat == null ? 30.0564503 : props.location.lat, lng: props.location.lng == 0 || props.location.lng == null ? -74.1840919 : props.location.lng }"
      :zoom="12"
      @click="addMarker"
    >
      <Marker
        v-for="(marker, index) in markers"
        :key="index"
        :options="marker"
      />
      <Polygon :options="flightPath"/>
    </GoogleMap>
  </div>
</template>

<style lang="scss" scoped>
.autocomplete-results {
  position: absolute;
  top: 45px;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 99;
  color: #000;
  padding: 5px;
  box-shadow: 0 1px 5px 3px rgba(0, 0, 0, 0.12);

  div {
    margin: 2px 0;
    padding: 8px;
    //background: #ddd;
    //cursor: pointer;
    transition: 0.5s ease-in-out background;

    &:hover {
      background: #efefef;
    }
  }
}
</style>
