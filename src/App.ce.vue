<template>
  <div class="weather-widget">
    <button class="settings" @click="settingsToggleAction">
      <img
        class="settings__img"
        :src="
          settingsToggle
            ? 'https://www.svgrepo.com/show/521564/close.svg'
            : 'https://www.svgrepo.com/show/532244/gear.svg'
        "
        alt="settings"
      />
    </button>
    <Settings
      v-if="settingsToggle"
      :weatherData="weatherData"
      :cities="cities"
      @newWeatherData="newWeatherData"
      @newCitiesData="newCitiesData"
    />
    <div v-else class="widgets">
      <div class="widget" v-for="(city, index) in weatherData" :key="index">
        <CityWeather :city="city" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, ref } from "vue";
import {
  toUpperFirstLetter,
  getImgUrl,
  dewPointCalculate,
  getWeatherData,
} from "./utils";
import { IWeatherData } from "./types";
import Settings from "./components/Settings/Settings.vue";
import CityWeather from "./components/CityWeather/CityWeather.vue";

const settingsToggle = ref(false);
function settingsToggleAction() {
  settingsToggle.value = !settingsToggle.value;
}

const cities: Ref<string[]> = ref(
  JSON.parse(localStorage.getItem("cities") || "[]"),
);
const newCitiesData = (newData: string[]): void => {
  cities.value = newData;
};

const weatherData: Ref<IWeatherData[]> = ref([]);
const newWeatherData = (newData: IWeatherData[]): void => {
  weatherData.value = newData;
};

(async () => {
  weatherData.value = await getWeatherData(cities.value);
})();

export default {
  name: "Weather widget",
  components: {
    Settings,
    CityWeather,
  },
  data() {
    return {
      weatherData,
      newWeatherData,
      getImgUrl,
      toUpperFirstLetter,
      dewPointCalculate,
      settingsToggle,
      settingsToggleAction,
      cities,
      newCitiesData,
    };
  },
};
</script>

<style lang="scss">
@import "./styles/index.scss";
</style>
