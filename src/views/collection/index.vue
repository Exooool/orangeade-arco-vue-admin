<template>
  <div class="container">
    <div class="panel collection-box">
      <div class="header">
        <!-- 筛选 -->
        <a-form class="left" :model="formFilterData" layout="inline">
          <a-form-item field="name" label="网站名（标签名）">
            <a-input
              v-model="formFilterData.name"
              placeholder="请输入网站名（标签名）"
            />
          </a-form-item>
          <a-form-item field="post" label="创建时间">
            <a-time-picker
              v-model="formFilterData.createtime"
              type="time-range"
              style="width: 252px"
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
            @click="addVisible = true"
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
      >
        <template #optional="{ record }">
          <a-button
            style="margin-right: 10px"
            @click="show({ title: 'Name', content: record.name })"
          >
            查看
          </a-button>
          <a-button @click="show({ title: 'Name', content: record.name })">
            编辑
          </a-button>
        </template>
      </a-table>
    </div>

    <!-- 新增网站表单 -->
    <a-modal
      v-model:visible="addVisible"
      title="新增网站"
      @before-ok="addSubmit(formRef)"
    >
      <a-form
        ref="formRef"
        :model="addFormData"
        :rules="rules"
        auto-label-width
      >
        <a-form-item field="name" label="网站名or标签名">
          <a-input v-model="addFormData.name" />
        </a-form-item>
        <a-form-item field="address" label="网站地址">
          <a-input v-model="addFormData.address" />
        </a-form-item>
        <a-form-item field="createtime" label="创建时间">
          <a-time-picker v-model="addFormData.createtime" />
        </a-form-item>
        <a-form-item field="conifg" label="配置">
          <a-time-picker v-model="addFormData.config" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { TableRowSelection } from '@arco-design/web-vue/es/table';
  import { defineComponent, reactive, ref, toRefs } from 'vue';

  export default defineComponent({
    setup() {
      const formRef = ref();

      const state = reactive({
        addVisible: false,
        selectedKeys: ['1', '2'],
        pagination: {
          current: 2,
          total: 20,
          pageSize: 5,
        },
        addFormData: {
          name: '哔哩哔哩',
          address: 'www.bilibili.com',
          createtime: '2022/9/5 20:00',
          config: '{}',
        },
        formFilterData: {
          name: '',
          createtime: '',
        },
        tableData: [
          {
            key: '1',
            name: '哔哩哔哩',
            address: 'www.bilibili.com',
            createtime: '2022/9/5 20:00',
            config: '{}',
          },
          {
            key: '2',
            name: '哔哩哔哩1',
            address: 'www.bilibili.com',
            createtime: '2022/9/5 20:00',
            config: '{}',
          },
          {
            key: '3',
            name: '哔哩哔哩2',
            address: 'www.bilibili.com',
            createtime: '2022/9/5 20:00',
            config: '{}',
          },
          {
            key: '4',
            name: '哔哩哔哩3',
            address: 'www.bilibili.com',
            createtime: '2022/9/5 20:00',
            config: '{}',
          },
        ],
      });

      const rowSelection: TableRowSelection = reactive({
        type: 'checkbox',
        showCheckedAll: true,
        onlyCurrent: false,
      });

      const columns = [
        {
          title: '网站名or标签名',
          dataIndex: 'name',
        },
        {
          title: '网站地址',
          dataIndex: 'address',
        },
        {
          title: '创建时间',
          dataIndex: 'createtime',
        },
        {
          title: '配置',
          dataIndex: 'config',
        },
        {
          title: '操作',
          slotName: 'optional',
        },
      ];

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
      };

      // 新增提交
      function addSubmit(formEl: any) {
        if (!formEl) return false;
        return new Promise((resolve) => {
          formEl.validate((errors: any) => {
            if (!errors) {
              console.log(state.addFormData);
              resolve(true);
            } else {
              console.log(errors);
              resolve(false);
            }
          });
        }).then((value) => {
          return value;
        });
      }

      return {
        ...toRefs(state),
        formRef,
        columns,
        rowSelection,
        rules,
        show,
        addSubmit,
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

  .collection-box {
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
        align-items: center;
        padding-right: 20px;
      }
    }
  }
</style>
