<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px',
      }"
      title="支出占比"
    >
      <template #extra>
        <a-link>更多</a-link>
      </template>
      <Chart height="289px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, onMounted } from 'vue';
  import { getMoneyByType } from '@/api/tally';
  import useChartOption from '@/hooks/chart-option';
  import dayjs from 'dayjs';
  import { tallyClassList } from '../constant';

  export default defineComponent({
    setup() {
      const state = reactive({
        loading: false,
        legendData: [] as any[],
        data: [] as any[],
        sum: 0,
      });

      const { chartOption } = useChartOption(() => {
        return {
          legend: {
            left: 'center',
            data: state.legendData,
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            textStyle: {
              color: '#4E5969',
            },
            itemStyle: {
              borderWidth: 0,
            },
          },
          tooltip: {
            show: true,
            trigger: 'item',
          },
          graphic: {
            elements: [
              {
                type: 'text',
                left: 'center',
                top: '40%',
                style: {
                  text: '总金额',
                  textAlign: 'center',
                  fill: '#4E5969',
                  fontSize: 14,
                },
              },
              {
                type: 'text',
                left: 'center',
                top: '50%',
                style: {
                  text: `${state.sum}`,
                  textAlign: 'center',
                  fill: '#1D2129',
                  fontSize: 16,
                  fontWeight: 500,
                },
              },
            ],
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '50%'],
              label: {
                formatter: '{d}%',
                fontSize: 14,
                color: '#4E5969',
              },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1,
              },
              data: state.data,
            },
          ],
        };
      });

      const getChartData = async () => {
        const res = await getMoneyByType();
        console.log('按分类的结果：', res.data);
        const legendData = [] as any[];
        const data = [] as any[];
        let sum = 0;
        // 处理数据
        res.data.forEach((item: Record<string, any>) => {
          legendData.push(tallyClassList[item.tally_type]);
          data.push({
            name: tallyClassList[item.tally_type],
            value: item.money,
          });
          sum += item.money;
        });

        state.legendData = legendData;
        state.data = data;
        state.sum = sum;
        console.log(state);
      };

      onMounted(() => {
        getChartData();
        console.log(dayjs().format('YYYY-MM-DD'));
      });

      return {
        ...toRefs(state),
        chartOption,
      };
    },
  });
</script>

<style lang="less" scoped>
  .general-card {
    min-height: 400px;
  }
</style>
