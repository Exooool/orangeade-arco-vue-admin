import axios from 'axios';

const gaodeKey = '632779b094998163b9b9a47557052095';

const getLocationByIP = () => {
  return axios.get(`/amap/v3/ip?key=${gaodeKey}`);
};
export { getLocationByIP as default };
