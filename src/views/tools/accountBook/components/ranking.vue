<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px',
      }"
      title="支出排行榜"
    >
      <template #extra>
        <a-link>更多</a-link>
      </template>
      <div class="datepicker-box">
        <span>日期选择</span>
        <a-date-picker
          v-model="datetime"
          style="width: 200px"
          @change="handleChange"
      /></div>
      <div class="ranking-list">
        <div v-for="(item, index) in data" :key="index" class="ranking-item">
          <a-avatar>A</a-avatar>
          <span>{{ tallyClassList[item.tally_type] }}</span>
          <a-progress
            :percent="Math.floor((item.money / sum) * 10000) / 10000"
            :style="{ width: '50%' }"
          />
        </div>
        <a-empty v-if="data.length === 0" />
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import { getDayMoneyRank } from '@/api/tally';
  import dayjs from 'dayjs';
  import { tallyClassList } from '../constant';

  export default defineComponent({
    setup() {
      const state = reactive({
        loading: false,
        data: [] as any[],
        sum: 0,
        datetime: dayjs().format('YYYY-MM-DD'),
      });

      // 获取单日排行榜
      const getRnkingList = async () => {
        const res = await getDayMoneyRank(state.datetime);
        console.log('排行榜：', res.data);
        // 计算当日总金额
        let sum = 0;
        res.data.forEach((item: any) => {
          sum += item.money;
        });
        state.sum = sum;
        state.data = res.data;
      };

      const handleChange = () => {
        getRnkingList();
      };

      onMounted(() => {
        getRnkingList();
      });

      return {
        ...toRefs(state),
        handleChange,
        tallyClassList,
      };
    },
  });
</script>

<style lang="less" scoped>
  .general-card {
    width: 100%;
    min-height: 400px;

    .ranking-list {
      height: 260px;
      overflow-y: scroll;

      .arco-empty {
        height: 260px;
      }
      .ranking-item {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 5px 0;
      }
    }
  }

  .datepicker-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
  }
</style>
