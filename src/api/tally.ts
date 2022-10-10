import axios from 'axios';

export interface tally {
  money: string;
  tallyType: number;
  tallyTime: string;
  remark: string;
}

export function getTallyList() {
  return axios.get('/api/tally/getAllInfo');
}

export function getEveryDayMoney() {
  return axios.get('/api/tally/getEveryDayMoney');
}

export function getMoneyByType() {
  return axios.get('/api/tally/getMoneyByType');
}

export function getDayMoneyRank(daytime: string) {
  return axios.post('/api/tally/getDayMoneyRank', { daytime });
}

export function addTallyInfo(data: tally) {
  return axios.post('/api/tally/addInfo', data);
}
