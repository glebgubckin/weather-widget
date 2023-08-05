import { IWeatherData } from "@/types"
import axios from "axios"

function toUpperFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1, str.length)
}

function getImgUrl(icon: string): string {
  return `http://openweathermap.org/img/wn/${icon}@2x.png`
}

function dewPointCalculate(temp: number, humidity: number): number {
  return Math.round(temp - ((100 - humidity)/5))
}

async function getWeatherData(cities: string[]): Promise<IWeatherData[]> {
  const result: IWeatherData[] = [] 
  for (let city of cities) {
    const data = await (await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e2d2d3376acfaea567214fb1be5cd3ed&units=metric`)).data
    result.push(data)
  }
  return result
}

async function getWeatherDataByCity(city: string): Promise<IWeatherData> {
  return await (await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e2d2d3376acfaea567214fb1be5cd3ed&units=metric`)).data
}

export {
  toUpperFirstLetter,
  getImgUrl,
  dewPointCalculate,
  getWeatherData,
  getWeatherDataByCity
}