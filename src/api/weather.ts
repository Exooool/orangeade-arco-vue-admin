import axios from 'axios';

const hefengKey = '5afa8c60b2d44e72b020538cc9bec0fc';

const getWeatherByPosistion = (locationId: string) => {
  return axios.get(
    `https://devapi.qweather.com/v7/weather/now?location=${locationId}&key=${hefengKey}`
  );
};

const getWeatherLocationId = (location: string) => {
  return axios.get(
    `/geoapi/v2/city/lookup?location=${location}&key=${hefengKey}`
  );
};

export { getWeatherByPosistion, getWeatherLocationId };
