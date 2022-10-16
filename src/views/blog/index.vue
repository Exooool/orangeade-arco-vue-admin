<template>
  <div class="container">
    <div class="panel blog-box">
      <div class="header">
        <!-- 筛选 -->
        <a-form
          ref="formRef"
          class="filter-group"
          :model="formFilterData"
          layout="inline"
        >
          <a-form-item field="title" label="文章名">
            <a-input
              v-model="formFilterData.title"
              placeholder="请输入文章名"
            />
          </a-form-item>
          <a-form-item field="createTime" label="创建时间">
            <a-range-picker
              v-model="formFilterData.createTime"
              style="width: 360px"
            />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="getArticleList">搜索</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="reset(formRef)">重置</a-button>
          </a-form-item>
        </a-form>
        <!-- 操作 -->
        <div class="button-group">
          <a-button
            type="primary"
            shape="circle"
            style="margin-right: 10px"
            @click="editVisible = true"
          >
            <icon-plus />
          </a-button>
          <a-popconfirm content="你确定要删除吗？" @ok="deleteArticle">
            <a-button type="primary" shape="circle">
              <icon-delete />
            </a-button>
          </a-popconfirm>
        </div>
      </div>
      <a-table
        v-model:selectedKeys="selectedKeys"
        row-key="article_id"
        :loading="loading"
        :columns="columns"
        :data="tableData"
        :row-selection="rowSelection"
        :pagination="pagination"
        @page-change="pageSizeChange"
      >
        <template #tag="{ record }">
          {{
            options.tags.filter((item) => item.value === record.tag)[0]?.label
          }}
        </template>
        <template #catalog="{ record }">
          {{
            options.catalogs.filter((item) => item.value === record.catalog)[0]
              ?.label
          }}
        </template>
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
    <Edit
      :id="currentId"
      v-model:visible="editVisible"
      :options="options"
      @update-list="getArticleList"
    />
  </div>
</template>

<script lang="ts">
  import { TableRowSelection } from '@arco-design/web-vue/es/table';
  import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
  import { delArticle, getArticles, getCatalogs, getTags } from '@/api/blog';
  import Edit from './edit.vue';

  export default defineComponent({
    components: {
      Edit,
    },
    setup() {
      const formRef = ref();

      const state = reactive({
        loading: false,
        editVisible: false,
        selectedKeys: [],
        pagination: {
          current: 1,
          total: 20,
          pageSize: 10,
        },
        formFilterData: {
          title: '',
          createTime: [],
        },
        tableData: [],
        // 当前选择的文章id
        currentId: 0,
        options: {
          tags: [] as { label: string; value: number }[],
          catalogs: [] as { label: string; value: number }[],
        },
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
          width: 200,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: '作者',
          dataIndex: 'user_name',
        },
        {
          title: '标签',
          slotName: 'tag',
        },
        {
          title: '分类',
          slotName: 'catalog',
        },
        {
          title: '状态',
          slotName: 'status',
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          width: 200,
        },
        {
          title: '操作',
          slotName: 'optional',
          width: 200,
        },
      ];

      const statusMean = ['未发布', '已发布', '已删除'];

      const show = (v: any) => {
        console.log(v);
        state.currentId = v;
        state.editVisible = true;
      };

      // 获取文章数据
      const getArticleList = () => {
        state.loading = true;
        const pagination = {
          title: state.formFilterData.title,
          startTime: state.formFilterData.createTime[0] ?? undefined,
          endTime: state.formFilterData.createTime[1] ?? undefined,
          pageIndex: state.pagination.current,
          pageSize: state.pagination.pageSize,
        };
        getArticles(pagination).then((res: Record<string, any>) => {
          state.loading = false;
          console.log(res);
          state.pagination.total = res.totalCount;
          state.tableData = res.data;
        });
      };

      // 页码改变重新获取数据
      const pageSizeChange = (e: any) => {
        console.log(e);
        state.pagination.current = e;
        getArticleList();
      };

      // 获取文章、分类以及标签
      const getInit = () => {
        getArticleList();
        getTags().then((res: Record<string, any>) => {
          console.log(res);
          const tags: { label: string; value: number }[] = [];
          res.data.forEach((item: Record<string, any>) => {
            tags.push({
              label: item.tag_name,
              value: item.tag_id,
            });
          });
          state.options.tags = tags;
        });
        getCatalogs().then((res: Record<string, any>) => {
          console.log(res);
          const catalogs: { label: string; value: number }[] = [];
          res.data.forEach((item: Record<string, any>) => {
            catalogs.push({
              label: item.catalog_name,
              value: item.catalog_id,
            });
          });
          state.options.catalogs = catalogs;
        });
      };

      // 删除文章
      const deleteArticle = () => {
        console.log(state.selectedKeys);
        delArticle(state.selectedKeys).then((res: Record<string, any>) => {
          console.log(res);
          if (res.code === 2000)
            // 重新获取数据
            getArticleList();
        });
      };

      const reset = (formEl: any) => {
        if (!formEl) return false;
        formEl.resetFields();
        return true;
      };

      onMounted(() => {
        getInit();
      });

      return {
        ...toRefs(state),
        formRef,
        columns,
        rowSelection,
        statusMean,
        getArticleList,
        show,
        pageSizeChange,
        deleteArticle,
        reset,
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
      padding: 10px 0;
      // .filter-group {
      // }
      .button-group {
        display: flex;
      }
    }
  }
</style>
