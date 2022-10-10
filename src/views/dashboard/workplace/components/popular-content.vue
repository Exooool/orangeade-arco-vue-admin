<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title> 备忘录(Todo-List) </template>
      <template #extra>
        <a-link>{{ $t('workplace.viewMore') }}</a-link>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-table
          :data="tableList"
          :pagination="false"
          :bordered="false"
          :columns="columns"
          :scroll="{ x: '100%', y: '264px' }"
        >
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import useLoading from '@/hooks/loading';

  export default defineComponent({
    setup() {
      const { loading } = useLoading();
      const state = reactive({
        tableList: [
          { title: '备忘录1', content: '这是备忘录内容', time: '2022-08-22' },
        ],
        columns: [
          {
            title: '标题',
            dataIndex: 'title',
          },
          {
            title: '内容',
            dataIndex: 'content',
          },
          {
            title: '时间',
            dataIndex: 'time',
          },
        ],
      });

      return {
        ...toRefs(state),
        loading,
      };
    },
  });
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }

  :deep(.arco-table-tr) {
    height: 44px;

    .arco-typography {
      margin-bottom: 0;
    }
  }

  .increases-cell {
    display: flex;
    align-items: center;

    span {
      margin-right: 4px;
    }
  }
</style>
