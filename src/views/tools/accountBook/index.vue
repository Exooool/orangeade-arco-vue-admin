<template>
  <div class="container">
    <div class="left-side">
      <div class="panel">
        <!-- <TallyCounter v-model="tallyInfo" @compelete="compelete" />
        <a-divider /> -->
        <DataChart />
      </div>
      <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
        <a-grid-item :span="12">
          <Ranking />
        </a-grid-item>
        <a-grid-item :span="12"> <Category /></a-grid-item>
      </a-grid>
    </div>
    <div class="right-side">
      <TotalBill />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, onMounted } from 'vue';
  import { getTallyList, addTallyInfo } from '@/api/tally';
  import dayjs from 'dayjs';
  import DataChart from './components/dataChart.vue';
  import Ranking from './components/ranking.vue';
  import Category from './components/category.vue';
  import TotalBill from './components/totalBill.vue';
  import { tallyClassList } from './constant';

  export default defineComponent({
    components: {
      DataChart,
      Ranking,
      Category,
      TotalBill,
    },
    setup() {
      const state = reactive({
        tallyInfo: {
          money: '',
          tallyType: 1,
          tallyTime: dayjs().format('YYYY-MM-DD'),
          remark: '',
        },
        tallyList: {} as Record<string, any>,
        tallyTimeList: [] as string[],
      });

      const getAllTally = async () => {
        const res = await getTallyList();
        // 按时间节点解析
        const tallyList: Record<string, any> = {};
        res.data.forEach((item: Record<string, any>) => {
          if (!tallyList[item.tally_time]) {
            tallyList[item.tally_time] = [item];
          } else {
            tallyList[item.tally_time].push(item);
          }
        });
        console.log('解析后的对象：', tallyList);
        state.tallyTimeList = Object.keys(tallyList).sort().reverse();
        console.log('时间数组', state.tallyTimeList);
        state.tallyList = tallyList;
      };

      const refresh = async () => {
        await getAllTally();
      };

      // 提交数据
      const compelete = async () => {
        const commit = {
          ...state.tallyInfo,
        };
        if (commit.remark === '') {
          commit.remark = tallyClassList[commit.tallyType - 1];
        }
        console.log('记录的数据：', commit);
        const res = await addTallyInfo(commit);

        console.log(res);
        refresh();
      };

      const weekCN = (week: number) => {
        switch (week) {
          case 0:
            return '星期日';
          case 1:
            return '星期一';
          case 2:
            return '星期二';
          case 3:
            return '星期三';
          case 4:
            return '星期四';
          case 5:
            return '星期五';
          case 6:
            return '星期六';
          default:
            return '';
        }
      };

      onMounted(() => {
        getAllTally();
        // console.log();
      });
      return {
        ...toRefs(state),
        compelete,
        weekCN,
        dayjs,
      };
    },
  });
</script>

<style lang="less" scoped>
  // 修改分割线样式
  .arco-divider-horizontal {
    margin: 0;
  }

  .container {
    display: flex;
    align-items: flex-start;
    padding: 16px 20px;
    background-color: var(--color-fill-2);

    .left-side {
      flex: 1;
      overflow: auto;

      .panel {
        padding: 10px 20px;
        background-color: var(--color-bg-2);
        border-radius: 4px;
      }
    }

    .right-side {
      width: 380px;
      min-width: 32px;
      margin-left: 16px;
      background-color: var(--color-bg-2);
      border-radius: 4px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .container {
      display: block;
    }

    .right-side {
      // display: none;
      width: 100%;
      margin-top: 16px;
      margin-left: 0;
    }
  }
</style>
