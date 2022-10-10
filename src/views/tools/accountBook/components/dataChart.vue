<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px',
      }"
      :title="$t('workplace.contentData')"
    >
      <template #extra>
        <a-link>{{ $t('workplace.viewMore') }}</a-link>
      </template>
      <Chart height="289px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, onMounted } from 'vue';
  import { graphic } from 'echarts';
  import { getEveryDayMoney } from '@/api/tally';
  import useChartOption from '@/hooks/chart-option';

  export default defineComponent({
    setup() {
      const state = reactive({
        loading: false,
        xAxis: [] as string[],
        yAxis: [] as number[],
      });

      const { chartOption } = useChartOption(() => {
        return {
          grid: {
            left: '50',
            right: '50',
            top: '10',
            bottom: '30',
          },
          xAxis: {
            type: 'category',
            offset: 2,
            data: state.xAxis,
            boundaryGap: false,
            // axisLabel: {
            //   color: '#4E5969',
            //   formatter(value: number, idx: number) {
            //     if (idx === 0) return '';
            //     if (idx === state.xAxis.length - 1) return '';
            //     return `${value}`;
            //   },
            // },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              interval: (idx: number) => {
                if (idx === 0) return false;
                if (idx === state.xAxis.length - 1) return false;
                return true;
              },
              lineStyle: {
                color: '#E5E8EF',
              },
            },
            axisPointer: {
              show: true,
              lineStyle: {
                color: '#23ADFF',
                width: 2,
              },
            },
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false,
            },
            // axisLabel: {
            //   formatter(value: any, idx: number) {
            //     if (idx === 0) return value;
            //     return `${value}`;
            //   },
            // },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#E5E8EF',
              },
            },
          },
          tooltip: {
            trigger: 'axis',
            className: 'echarts-tooltip-diy',
          },
          series: [
            {
              data: state.yAxis,
              type: 'line',
              smooth: true,
              // symbol: 'circle',
              symbolSize: 12,
              emphasis: {
                focus: 'series',
                itemStyle: {
                  borderWidth: 2,
                },
              },
              lineStyle: {
                width: 3,
                color: new graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: 'rgba(30, 231, 255, 1)',
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(36, 154, 255, 1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(111, 66, 251, 1)',
                  },
                ]),
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(17, 126, 255, 0.16)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(17, 128, 255, 0)',
                  },
                ]),
              },
            },
          ],
        };
      });

      const getChartData = async () => {
        const res = await getEveryDayMoney();
        console.log(res);
        const money: number[] = [];
        const time: string[] = [];
        // 处理数据
        res.data.forEach((item: Record<string, any>) => {
          money.push(item.money);
          time.push((item.tally_time as string).substring(0, 10));
        });

        state.xAxis = time;
        state.yAxis = money;
        console.log(state);
        console.log(money, time);
      };

      onMounted(() => {
        getChartData();
      });

      return {
        ...toRefs(state),
        chartOption,
      };
    },
  });
</script>

<style lang="less" scoped></style>
