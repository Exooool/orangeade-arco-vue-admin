<template>
  <div class="container">
    <div class="panel blog-box">
      <div class="header">
        <!-- 筛选 -->
        <a-form class="left" :model="formFilterData" layout="inline">
          <a-form-item field="articleName" label="文章名">
            <a-input
              v-model="formFilterData.articleName"
              placeholder="请输入文章名"
            />
          </a-form-item>
          <a-form-item field="createTime" label="创建时间">
            <a-range-picker
              v-model="formFilterData.createTime"
              style="width: 360px"
              show-time
              :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }"
              format="YYYY-MM-DD HH:mm"
            />
          </a-form-item>

          <a-form-item>
            <a-button type="primary">搜索</a-button>
          </a-form-item>
        </a-form>
        <!-- 操作 -->
        <div class="right">
          <a-button
            type="primary"
            shape="circle"
            style="margin-right: 10px"
            @click="editVisible = true"
          >
            <icon-plus />
          </a-button>
          <a-button type="primary" shape="circle">
            <icon-delete />
          </a-button>
        </div>
      </div>
      <a-table
        v-model:selectedKeys="selectedKeys"
        row-key="name"
        :columns="columns"
        :data="tableData"
        :row-selection="rowSelection"
        :pagination="pagination"
        @page-change="pageSizeChange"
      >
        <template #status="{ record }">
          <a-tag color="blue">{{ statusMean[record.status] }}</a-tag>
        </template>
        <template #optional="{ record }">
          <a-button style="margin-right: 10px" @click="show(record.article_id)">
            查看
          </a-button>
          <a-button @click="show(record.article_id)"> 编辑 </a-button>
        </template>
      </a-table>
    </div>

    <!-- 新增网站表单 -->
    <Edit :id="currentId" v-model:visible="editVisible" />
  </div>
</template>

<script lang="ts">
  import { TableRowSelection } from '@arco-design/web-vue/es/table';
  import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
  import { getArticles, getCatalogs, getTags } from '@/api/blog';
  import Edit from './edit.vue';

  export default defineComponent({
    components: {
      Edit,
    },
    setup() {
      const formRef = ref();

      const state = reactive({
        editVisible: false,
        selectedKeys: ['1', '2'],
        pagination: {
          current: 2,
          total: 20,
          pageSize: 5,
        },
        formFilterData: {
          articleName: '',
          type: '',
          createTime: [],
        },
        tableData: [],
        // 当前选择的文章id
        currentId: 0,
        catalogList: [],
        tagList: [],
      });

      const rowSelection: TableRowSelection = reactive({
        type: 'checkbox',
        showCheckedAll: true,
        onlyCurrent: false,
      });

      const columns = [
        {
          title: '文章名',
          dataIndex: 'title',
        },
        {
          title: '作者',
          dataIndex: 'author',
        },
        {
          title: '标签',
          dataIndex: 'tag',
        },
        {
          title: '分类',
          dataIndex: 'catalog',
        },
        {
          title: '状态',
          slotName: 'status',
        },
        {
          title: '创建时间',
          dataIndex: 'datetime',
        },
        {
          title: '操作',
          slotName: 'optional',
        },
      ];

      const statusMean = ['未发布', '已发布', '已删除'];

      const rules = {
        name: [
          {
            required: true,
            message: '请输入网站名',
          },
        ],
        address: [
          {
            required: true,
            message: '请输入网站地址',
          },
        ],
        createtime: [
          {
            required: true,
            message: '请选择创建时间',
          },
        ],
      };

      const show = (v: any) => {
        console.log(v);
        state.currentId = v;
        state.editVisible = true;
      };

      const getArticleList = async () => {
        const pagination = {
          pageIndex: state.pagination.current,
          pageSize: state.pagination.pageSize,
        };
        await getArticles(pagination).then((res: Record<string, any>) => {
          console.log(res);
          state.pagination.total = res.totalSize;
          state.tableData = res.data;
        });
      };

      const pageSizeChange = (e: any) => {
        console.log(e);
        state.pagination.current = e;
        getArticleList();
      };

      const getInit = async () => {
        getArticleList();
        await getTags().then((res: Record<string, any>) => {
          console.log(res);
        });
        await getCatalogs().then((res: Record<string, any>) => {
          console.log(res);
        });
      };

      onMounted(() => {
        getInit();
      });

      return {
        ...toRefs(state),
        formRef,
        columns,
        rowSelection,
        rules,
        statusMean,
        show,
        pageSizeChange,
      };
    },
  });
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);
  }

  // panel
  .panel {
    overflow: auto;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  .blog-box {
    width: 100%;
    height: calc(100vh - 116px);
    padding: 20px;

    .header {
      display: flex;
      padding: 10px 0;
      // .left {
      // }
      .right {
        display: flex;
        padding-right: 20px;
      }
    }
  }
</style>
