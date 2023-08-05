<template>
  <div class="weather-widget">
    <button class="settings" @click="settingsToggleAction">
      <img class="settings__img" :src="settingsToggle ? 'https://www.svgrepo.com/show/521564/close.svg' : 'https://www.svgrepo.com/show/532244/gear.svg'" alt="settings">
    </button>
    <div v-if="settingsToggle" class="modal">
      <p class="title">Settings</p>
      <div class="cities">
        <div v-for="(city, index) in cities" :key="index" class="city" @drop.prevent="drop(index)">
          <div class="city__info">
            <div class="burger"  :draggable="true" @dragstart="dragStart(index)" @dragover.prevent="">
              <img src="https://www.svgrepo.com/show/506800/burger-menu.svg" alt="burger" class="icon">
            </div>
            <p>{{ city }}</p>
          </div>
          <button class="cities__delete" @click="deleteCity(city)">
            <img class="icon" src="https://www.svgrepo.com/show/502614/delete.svg" alt="delete_city">
          </button>
        </div>
      </div>
      <div class="add-location">
        <p class="title">Add location</p>
        <div class="modal__add">
          <input class="input" type="text" v-model="newCity" @keyup.enter="saveCity()">
          <img class="icon" src="https://www.svgrepo.com/show/533597/arrow-narrow-circle-broken-left.svg" alt="add_location">
        </div>
        <p class="error">{{ errorDataFetching }}</p>
      </div>
    </div>
    <!-- <Settings v-if="settingsToggle" :settingsToggle="settingsToggle" :weatherData="weatherData" /> -->
    <div v-else class="widgets">
      <div class="widget" v-for="(city, index) in weatherData" :key="index">
        <p class="title">{{ city.name }}, {{ city.sys.country }}</p>
        <div class="weather">
          <img class="weather__icon" :src="getImgUrl(city.weather[0].icon)" v-bind:alt="city.weather[0].main">
          <p class="weather__temp">{{ Math.round(city.main.temp) }}°C</p>
        </div>
        <p>
          Feels like
          {{ Math.round(city.main.feels_like) }}.
          {{ toUpperFirstLetter(city.weather[0].description) }}
        </p>
        <div class="row">
          <p class="row__info">
            <img :style="{transform: `rotate(${city.wind.deg}deg)`}" class="icon" src="https://www.svgrepo.com/show/508015/cursor.svg" alt="wind_direction">
            {{ city.wind.speed.toFixed(1) }}m/s SSE
          </p>
          <p class="row__info">
            <img class="icon" src="https://www.svgrepo.com/show/521793/pressure.svg" alt="pressure">
            {{ city.main.pressure }}hPa
          </p>
        </div>
        <div class="row">
          <p>Humiditi: {{ city.main.humidity }}%</p>
          <p>Dew point: {{ dewPointCalculate(city.main.temp, city.main.humidity) }}°C</p>
        </div>
        <p>Visibility: {{ Math.round(city.visibility / 1000).toFixed(1) }}km</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, ref } from 'vue';
import { toUpperFirstLetter, getImgUrl, dewPointCalculate, getWeatherData, getWeatherDataByCity } from './utils'
import { IWeatherData } from './types';
import Settings from './components/Settings/Settings.vue'

const settingsToggle = ref(false)
const errorDataFetching = ref("")
function settingsToggleAction() {settingsToggle.value = !settingsToggle.value}

const newCity = ref("")
const cities: Ref<string[]> = ref(JSON.parse(localStorage.getItem('cities') || '[]'))
const weatherData: Ref<IWeatherData[]> = ref([]);

(async () => {
  weatherData.value = await getWeatherData(cities.value)
})();

let dragIndex: number;

const dragStart = (index: number) => {
  dragIndex = index;
};

const drop = (index: number) => {
  const draggedItem = cities.value[dragIndex];
  cities.value.splice(dragIndex, 1);
  cities.value.splice(index, 0, draggedItem);
  localStorage.setItem('cities', JSON.stringify(cities.value))
  weatherData.value = cities.value.map(city => {
    return weatherData.value.find(data => data.name === city)
  }) as IWeatherData[]
  dragIndex = -1;
};

async function saveCity() {
  getWeatherDataByCity(newCity.value)
  .then(data => {
    weatherData.value.push(data)
    localStorage.setItem('cities', JSON.stringify([...JSON.parse(localStorage.getItem('cities') || '[]'), newCity.value]))
    cities.value.push(newCity.value)
    newCity.value = ""
    errorDataFetching.value = ""
  })
  .catch(() => {
    errorDataFetching.value = "Error! Try again"
  })
}

function deleteCity(city: string) {
  const newCitiesList = cities.value.filter(c => c !== city)
  localStorage.setItem('cities', JSON.stringify(newCitiesList))
  cities.value = newCitiesList
  weatherData.value = weatherData.value.filter(c => c.name !== city)
}


export default {
  name: 'Weather widget',
  components: {
    Settings
  },
  data() {
    return {
      weatherData,
      getImgUrl,
      toUpperFirstLetter,
      dewPointCalculate,
      settingsToggle,
      settingsToggleAction,
      cities,
      newCity,
      saveCity,
      deleteCity,
      errorDataFetching,
      dragStart,
      drop
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
@import './styles/index.scss';
</style>