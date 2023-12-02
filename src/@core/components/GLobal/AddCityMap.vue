<script setup>
import { GoogleMap, Polyline, Marker, MarkerCluster } from "vue3-google-map"

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
})

// const center = reactive({ lat: 30.0516943, lng: 31.2053852 })
const center = reactive({ lat: 30.0564503, lng: -74.1840919 })
const currentPlace = ref(null)
const markers = reactive([])

const places = reactive([
  { "lat": 30.060624918961977, "lng": 31.184370849737533 },
  { "lat": 30.0583220228878, "lng": 31.177032325872787 },
  { "lat": 30.056501954222682, "lng": 31.18497166455687 },
  { "lat": 30.054979013915826, "lng": 31.180079315313705 },
])

const flightPath = {
  path: places,
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
}

const searchInput = ref('')
const showAutocomplete = ref(false)
const autocompletePredictions = ref([])

const geoLocate = () => {
  if (props.location) {
    center.lat = props.location.lat
    center.lng = props.location.lng
    let marker = {
      lat: center.lat,
      lng: center.lng,
    }
    // emit("updateLocation", marker)
    markers.value = { position: marker }
  } else {
    navigator.geolocation.getCurrentPosition(position => {
      center.lat = position.coords.latitude
      center.lng = position.coords.longitude
    })
  }
}

const onSearchInput = () => {
  if (!searchInput.value) {
    showAutocomplete.value = false
    autocompletePredictions.value = []

    return
  }

  const autocompleteService = new google.maps.places.AutocompleteService()

  const request = {
    input: searchInput.value,
  }

  autocompleteService.getPlacePredictions(request, predictions => {
    if (predictions) {
      showAutocomplete.value = true
      autocompletePredictions.value = predictions
    }
  })
}

const selectPrediction = prediction => {
  searchInput.value = prediction.description
  showAutocomplete.value = false
  autocompletePredictions.value = []

  // You can do something with the selected place, e.g., set map center
  // this.mapCenter = { lat: prediction.geometry.location.lat(), lng: prediction.geometry.location.lng() };
  const placeService = new google.maps.places.PlacesService(document.createElement('div'))

  placeService.getDetails({ placeId: prediction.place_id }, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && place.geometry) {
      const latitude = place.geometry.location.lat()
      const langitude = place.geometry.location.lng()

      places.push({ lat: latitude, lng: langitude })
      markers.push({ lat: latitude, lng: langitude })
    }
  })
}

const addMarker = event => {
  if (event.latLng) {
    console.log(event.latLng.lng())

    const position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }

    const options = {
      draggable: true,
      label: 'Marker',
    }


    markers.push({ position, ...options })
    places.push(position)
  }
}

const onMarkerDragged = index => {
  const marker = markers[index]
  const position = marker.position
}

onMounted(() => {
  geoLocate()
})
</script>

<template>
  <div class="position-relative">
    <VTextField
      v-model="searchInput"
      placeholder="إبحث في الخريطة"
      class="mb-1"
      @input="onSearchInput"
    />

    <div v-if="showAutocomplete" class="autocomplete-results">
      <div v-for="(prediction, index) in autocompletePredictions" :key="index" @click="selectPrediction(prediction)">
        <VIcon icon="material-symbols:globe" size="24" color="primary"></VIcon>
        <span class="mx-1 font-weight-bold">
          {{ prediction.description }}
        </span>
      </div>
    </div>
    <GoogleMap
      api-key="AIzaSyCM2TngqydZtVlZ5hkKjY7x56ut59TTI88"
      style="width: 100%; height: 500px"
      :center="center"
      :zoom="15"
      @click="addMarker"
    >
      <Marker
        v-for="(marker, index) in markers"
        :key="index"
        :options="marker"
        :draggable="false"
      />
      <Polyline :options="flightPath"/>
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
