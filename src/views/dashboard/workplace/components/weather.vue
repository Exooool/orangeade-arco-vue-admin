<template>
  <div class="weather-box">
    <div class="weather-header">{{ city }}</div>

    <div class="weather-content">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-icon_zhongxue"></use>
      </svg>

      <div class="weather-title">
        <span class="temp">{{ nowWeather.temp }}°</span>
        <span class="text">{{ nowWeather.text }}</span>
      </div>
    </div>

    <div class="weather-info">
      <div class="weather-info-item">
        <span class="top">{{ nowWeather.windScale }}级</span>
        <span class="bottom">{{ nowWeather.windDir }}</span>
      </div>
      <div class="weather-info-item">
        <span class="top">{{ nowWeather.humidity }}%</span>
        <span class="bottom">相对湿度</span>
      </div>
      <div class="weather-info-item">
        <span class="top">{{ nowWeather.feelsLike }}°</span>
        <span class="bottom">体感温度</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import '@/assets/icon/iconfont';
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import { getWeatherByPosistion, getWeatherLocationId } from '@/api/weather';
  import getLocationByIP from '@/api/location';
  import { Notification } from '@arco-design/web-vue';
  import { WeatherNow } from '@/types/global';

  export default defineComponent({
    setup() {
      const state = reactive({
        nowWeather: {} as WeatherNow,
        city: '定位中',
      });

      const getWeatherInfo = async () => {
        const locationRes = await getLocationByIP();
        const { city } = locationRes as Record<string, any>;
        state.city = city;
        const idRes = await getWeatherLocationId(city);
        const { location } = idRes as Record<string, any>;
        if (location) {
          const res = await getWeatherByPosistion(location[0].id);
          Notification.info('天气信息获取成功');
          state.nowWeather = (res as Record<string, any>).now;
          console.log(
            `地理位置=>\n城市: ${city}\nLocationId: ${location[0].id}\n获取的天气信息:`,
            res
          );
        } else {
          Notification.error('地理位置信息获取失败');
        }
      };

      onMounted(() => {
        getWeatherInfo();
      });
      return {
        ...toRefs(state),
      };
    },
  });
</script>

<style type="text/css">
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>

<style lang="less" scoped>
  .weather-box {
    border-radius: 5px;
    padding: 10px;
    background-image: linear-gradient(225deg, #d0dae8, #ccd4df 55%, #a5b3c5);

    .weather-header {
      width: 100%;
      text-align: right;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
    }

    .weather-content {
      display: flex;
      justify-content: center;
      margin: 20px 0px;
      .icon {
        font-size: 56px;
      }

      .weather-title {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .temp {
          font-size: 26px;
          font-weight: 500;
        }
        .text {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    .weather-info {
      height: 60px;
      border-radius: 10px;
      display: flex;
      background-color: rgba(0, 0, 0, 0.03);
      justify-content: space-around;
      .weather-info-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .top {
          font-size: 18px;
          font-weight: 500;
        }
        .bottom {
          font-size: 15px;
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
</style>
