<template>
  <a-card
    class="general-card"
    title="近日账单"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 15px 0 15px' }"
  >
    <template #extra>
      <a-link @click="showTallyCounter">更多</a-link>
    </template>
    <div class="tally-list">
      <div v-for="(item, index) in tallyTimeList" :key="index">
        <div class="tally-list-header">
          <span class="date"
            >{{ item.slice(0, 10) }} {{ weekCN(dayjs(item).day()) }}</span
          >
          <a-tag color="blue">支出：{{ tallyList[item].money }}</a-tag>
        </div>
        <a-divider />
        <div v-for="(o, i) in tallyList[item].list" :key="i" class="tally-item">
          <div class="top">
            <a-avatar>A</a-avatar>
            <span class="tally-name">{{ o.remark }}</span>
          </div>
          <div class="bottom">-{{ o.money }}</div>
        </div>
      </div>
    </div>
  </a-card>

  <a-modal
    v-model:visible="tallyCounterVisible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title> 记账 </template>
    <TallyCounter />
  </a-modal>
</template>

<script lang="ts">
  import { getTallyList } from '@/api/tally';
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import dayjs from 'dayjs';
  import TallyCounter from '@/components/tally-counter/index.vue';

  export default defineComponent({
    components: {
      TallyCounter,
    },
    setup() {
      const state = reactive({
        tallyCounterVisible: false,
        tallyList: {} as Record<string, any>,
        tallyTimeList: [] as string[],
      });

      const getAllTally = async () => {
        const res = await getTallyList();
        // 按时间节点解析
        const tallyList: Record<string, any> = {};
        res.data.forEach((item: Record<string, any>) => {
          if (!tallyList[item.tally_time]) {
            tallyList[item.tally_time] = {};
            tallyList[item.tally_time].list = [item];
            tallyList[item.tally_time].money = parseFloat(item.money);
          } else {
            tallyList[item.tally_time].list.push(item);
            tallyList[item.tally_time].money += parseFloat(item.money);
          }
        });
        console.log('获取的所有日期记账信息：', tallyList);
        state.tallyTimeList = Object.keys(tallyList).sort().reverse();
        // console.log('时间数组', state.tallyTimeList);
        state.tallyList = tallyList;
      };

      const showTallyCounter = () => {
        state.tallyCounterVisible = true;
      };

      const handleOk = () => {
        state.tallyCounterVisible = false;
      };

      const handleCancel = () => {
        state.tallyCounterVisible = false;
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
      });

      return {
        ...toRefs(state),
        showTallyCounter,
        handleOk,
        handleCancel,
        dayjs,
        weekCN,
      };
    },
  });
</script>

<style lang="less" scoped>
  .tally-list {
    height: 350px;
    overflow: auto;

    .arco-divider-horizontal {
      margin: 0;
    }
    .tally-list-header {
      padding: 5px 5px;
      display: flex;
      justify-content: space-between;
      .date {
        font-size: 12px;
        line-height: 24px;
      }
    }

    .tally-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: 0.1s all ease-in-out;
      margin: 5px 0px;
      padding: 5px;
      &:hover {
        background-color: rgb(247, 248, 250);
      }
    }

    .top {
      display: flex;
      align-items: center;

      .tally-name {
        margin-left: 10px;
      }
    }
  }
</style>
