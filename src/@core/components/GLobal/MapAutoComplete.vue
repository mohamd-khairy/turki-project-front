<script setup>
const emit = defineEmits(["selectLocation"])

const searchInput = ref('')
const showAutocomplete = ref(false)
const autocompletePredictions = ref([])

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

      let pos = {
        lat: latitude,
        lng: langitude,
      }
      emit('selectLocation', pos)
      // center.lat = latitude
      // center.lng = latitude
      // markerOpt.value = { position: center }
    }
  })
}
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
  </div>
</template>

<style scoped lang="scss">

</style>
