<template>
  <a-card class="totaltally" :bordered="false">
    <div class="totaltally-filter">
      <a-select v-model="totaltallyTime" style="width: 100px" :bordered="false">
        <a-option value="2022">2022年</a-option>
        <a-option value="2021">2021年</a-option>
        <a-option value="2020">2020年</a-option>
        <a-option value="2019">2010年</a-option>
      </a-select>
      <span>账单</span>
    </div>
    <a-grid :cols="24" :row-gap="16">
      <a-grid-item :span="24">
        <div class="panel billing-details">
          <div class="billing-sum">4353</div>
          <div class="billing-category">
            <div class="billing-income">收入：3421</div>
            <div class="billing-expend">支出：-12345</div>
          </div>
        </div>
      </a-grid-item>
      <a-grid-item :span="24">
        <a-table
          :columns="columns"
          :data="tableData"
          :pagination="false"
          style="font-size: 12px"
      /></a-grid-item>
    </a-grid>
  </a-card>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';

  export default defineComponent({
    setup() {
      const columns = [
        {
          title: '月份',
          dataIndex: 'month',
        },
        {
          title: '收入',
          dataIndex: 'income',
        },
        {
          title: '支出',
          dataIndex: 'output',
        },
        {
          title: '结余',
          dataIndex: 'result',
        },
      ];

      const state = reactive({
        totaltallyTime: '2022',
        tableData: [
          {
            month: '8',
            income: 49,
            output: 4435.33,
            result: -4385.53,
          },
          {
            month: '7',
            income: 0,
            output: 5561,
            result: -5561,
          },
          {
            month: '6',
            income: 0,
            output: 0,
            result: 0,
          },
          {
            month: '5',
            income: 0,
            output: 0,
            result: 0,
          },
          {
            month: '4',
            income: 0,
            output: 0,
            result: 0,
          },
          {
            month: '3',
            income: 0,
            output: 0,
            result: 0,
          },
          {
            month: '2',
            income: 0,
            output: 0,
            result: 0,
          },
          {
            month: '1',
            income: 0,
            output: 0,
            result: 0,
          },
        ],
      });
      return {
        ...toRefs(state),
        columns,
      };
    },
  });
</script>

<style lang="less" scoped>
  .totaltally {
    .billing-details {
      display: flex;
      flex-direction: column;
      align-items: center;
      .billing-sum {
        font-size: 22px;
      }
      .billing-category {
        display: flex;
        div {
          margin: 10px;
        }
      }
    }
    .totaltally-filter {
      span {
        position: absolute;
        width: 100px;
        font-size: 16px;
        left: 50%;
        transform: translateX(-50px);
        text-align: center;
      }
    }
  }
</style>
