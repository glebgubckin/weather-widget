<template>
  <p class="title">{{ city.name }}, {{ city.sys.country }}</p>
  <div class="weather">
    <img
      class="weather__icon"
      :src="getImgUrl(city.weather[0].icon)"
      v-bind:alt="city.weather[0].main"
    />
    <p class="weather__temp">{{ Math.round(city.main.temp) }}°C</p>
  </div>
  <p>
    Feels like
    {{ Math.round(city.main.feels_like) }}.
    {{ toUpperFirstLetter(city.weather[0].description) }}
  </p>
  <div class="row">
    <p class="row__info">
      <img
        :style="{ transform: `rotate(${city.wind.deg}deg)` }"
        class="icon"
        src="https://www.svgrepo.com/show/508015/cursor.svg"
        alt="wind_direction"
      />
      {{ city.wind.speed.toFixed(1) }}m/s SSE
    </p>
    <p class="row__info">
      <img
        class="icon"
        src="https://www.svgrepo.com/show/521793/pressure.svg"
        alt="pressure"
      />
      {{ city.main.pressure }}hPa
    </p>
  </div>
  <div class="row">
    <p>Humiditi: {{ city.main.humidity }}%</p>
    <p>
      Dew point:
      {{ dewPointCalculate(city.main.temp, city.main.humidity) }}°C
    </p>
  </div>
  <p>Visibility: {{ Math.round(city.visibility / 1000).toFixed(1) }}km</p>
</template>

<script lang="ts">
import { IWeatherData } from "../../types";
import { dewPointCalculate, getImgUrl, toUpperFirstLetter } from "../../utils";

export default {
  props: ["city"],
  setup(props: { city: IWeatherData }) {
    return {
      city: props.city,
      dewPointCalculate,
      getImgUrl,
      toUpperFirstLetter,
    };
  },
};
</script>
