<template>
  <div class="modal">
    <p class="title">Settings</p>
    <div class="cities">
      <div
        v-for="(city, index) in cities"
        :key="index"
        class="city"
        @drop.prevent="drop(index)"
      >
        <div class="city__info">
          <div
            class="burger"
            :draggable="true"
            @dragstart="dragStart(index)"
            @dragover.prevent=""
          >
            <img
              src="https://www.svgrepo.com/show/506800/burger-menu.svg"
              alt="burger"
              class="icon"
            />
          </div>
          <p>{{ city }}</p>
        </div>
        <button class="cities__delete" @click="deleteCity(city)">
          <img
            class="icon"
            src="https://www.svgrepo.com/show/502614/delete.svg"
            alt="delete_city"
          />
        </button>
      </div>
    </div>
    <div class="add-location">
      <p class="title">Add location</p>
      <div class="modal__add">
        <input
          class="input"
          type="text"
          v-model="newCity"
          @keyup.enter="saveCity()"
        />
        <img
          class="icon"
          src="https://www.svgrepo.com/show/533597/arrow-narrow-circle-broken-left.svg"
          alt="add_location"
        />
      </div>
      <p class="error">{{ errorDataFetching }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { IWeatherData } from "@/types";
import { getWeatherDataByCity } from "@/utils";
import { Ref, ref } from "vue";

interface SettingsProps {
  weatherData: Ref<IWeatherData[]>;
  cities: Ref<string[]>;
}

export default {
  props: ["weatherData", "cities"],
  setup(
    props: SettingsProps,
    { emit }: { emit: (event: string, ...args: any[]) => void },
  ) {
    const weatherData = ref(props.weatherData);
    const cities = ref(props.cities);
    const errorDataFetching = ref("");
    const newCity = ref("");

    let dragIndex: number;

    const dragStart = (index: number) => {
      dragIndex = index;
    };

    const drop = (index: number) => {
      const draggedItem = cities.value[dragIndex];
      cities.value.splice(dragIndex, 1);
      cities.value.splice(index, 0, draggedItem);
      emit("newCitiesData", cities.value);
      localStorage.setItem("cities", JSON.stringify(cities.value));
      weatherData.value = cities.value.map((city) => {
        return weatherData.value.find(
          (data: IWeatherData) => data.name === city,
        );
      }) as IWeatherData[];
      emit("newWeatherData", weatherData.value);
      dragIndex = -1;
    };

    async function saveCity() {
      getWeatherDataByCity(newCity.value)
        .then((data) => {
          weatherData.value.push(data);
          emit("newWeatherData", weatherData.value);
          localStorage.setItem(
            "cities",
            JSON.stringify([
              ...JSON.parse(localStorage.getItem("cities") || "[]"),
              newCity.value,
            ]),
          );
          cities.value.push(newCity.value);
          emit("newCitiesData", cities.value);
          newCity.value = "";
          errorDataFetching.value = "";
        })
        .catch(() => {
          errorDataFetching.value = "Error! Try again";
        });
    }

    function deleteCity(city: string) {
      const newCitiesList = cities.value.filter((c) => c !== city);
      localStorage.setItem("cities", JSON.stringify(newCitiesList));
      cities.value = newCitiesList;
      emit("newCitiesData", cities.value);
      weatherData.value = weatherData.value.filter(
        (c: IWeatherData) => c.name !== city,
      );
      emit("newWeatherData", weatherData.value);
    }

    return {
      cities,
      newCity,
      saveCity,
      deleteCity,
      errorDataFetching,
      dragStart,
      drop,
    };
  },
};
</script>
