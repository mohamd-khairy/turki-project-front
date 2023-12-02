<script setup>
const props = defineProps(["location"])

const getSelectedLocation = loc => {
  console.log("LOCATION => ", loc)
}

</script>

<template>
  <div class="position-relative">
    <MapAutoComplete @select-location="getSelectedLocation"></MapAutoComplete>
    <AddCountryMap :location="props.location"></AddCountryMap>
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
