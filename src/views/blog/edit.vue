<template>
  <a-modal
    title="编辑文章"
    width="80%"
    :mask-closable="false"
    :ok-text="id ? '修改' : '确定'"
    :ok-loading="loading"
    @before-ok="id ? update(formRef) : submit(formRef)"
  >
    <a-spin :loading="loading" tip="执行中.....">
      <a-form ref="formRef" :model="articleData" layout="inline" :rules="rules">
        <a-form-item field="title" label="标题">
          <a-input v-model="articleData.title" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item field="catalog" label="类型">
          <a-select v-model="articleData.catalog" placeholder="选择类型">
            <a-option
              v-for="(item, index) in options.catalogs"
              :key="index"
              :value="item.value"
              >{{ item.label }}</a-option
            >
          </a-select>
        </a-form-item>
        <a-form-item field="tag" label="标签">
          <a-select
            v-model="articleData.tag"
            :style="{ width: '320px' }"
            placeholder="选择标签"
            multiple
            :limit="2"
          >
            <a-option
              v-for="(item, index) in options.tags"
              :key="index"
              :value="item.value"
              >{{ item.label }}</a-option
            >
          </a-select>
        </a-form-item>
        <a-button type="primary" @click="visible = true">预览</a-button>
        <a-modal v-model:visible="visible">
          <div ref="contentRef" class="w-e-text-container"></div>
          <View />
        </a-modal>
      </a-form>
      <div style="border: 1px solid #ccc">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :default-config="toolbarConfig"
          :editor="editorRef"
          mode="default"
        />
        <Editor
          v-model="valueHtml"
          style="height: 500px; overflow-y: hidden"
          :default-config="editorConfig"
          mode="default"
          @on-created="handleCreated"
        />
      </div>
    </a-spin>
  </a-modal>
</template>

<script lang="ts">
  import {
    defineComponent,
    onBeforeUnmount,
    reactive,
    ref,
    shallowRef,
    toRefs,
    watch,
  } from 'vue';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { getArticleById, pushArticle, updateArticle } from '@/api/blog';
  import { Message } from '@arco-design/web-vue';
  import View from './view.vue';

  export default defineComponent({
    components: {
      Editor,
      Toolbar,
      View,
    },
    props: {
      id: {
        type: Number,
        default: () => {
          return 0;
        },
      },
      options: {
        type: Object,
        default: () => {
          return {};
        },
      },
    },
    emits: ['updateList'],
    setup(props, ctx) {
      // 编辑器实例，必须用 shallowRef
      const editorRef = shallowRef();

      // 内容 HTML
      const valueHtml = ref('');
      const contentRef = ref();
      const toolbarConfig = {};
      const editorConfig = { height: 500, placeholder: '请输入内容...' };

      const formRef = ref();

      const state = reactive({
        id: 0,
        loading: false,
        visible: false,
        articleData: {
          title: '',
          catalog: '',
          tag: [] as number[],
        },
      });

      // 通过变化的id获取文章
      watch(
        () => props.id,
        (val) => {
          if (val) {
            state.id = props.id;
            getArticleById(val).then((res: Record<string, any>) => {
              console.log(res);
              state.articleData.title = res.data.title;
              state.articleData.catalog = res.data.catalog;
              state.articleData.tag = JSON.parse(res.data.tag);
              editorRef.value.setHtml(res.data.content);
            });
          }
        }
      );

      // 检验规则
      const rules = {
        title: [{ required: true, message: '请填入标题' }],
        catalog: [{ required: true, message: '请选择类型' }],
        tag: [{ required: true, message: '请选择标签' }],
      };

      // 提交新增
      const submit = (formEl: any) => {
        if (!formEl) return false;

        return new Promise((resolve) => {
          formEl.validate((errors: any) => {
            const content = editorRef.value.getHtml();
            if (!errors && content !== '') {
              state.loading = true;
              const data = {
                ...state.articleData,
                tag: JSON.stringify(state.articleData.tag),
                user_id: 2,
                content,
              };
              console.log('表单数据', data);
              pushArticle(data).then((res) => {
                console.log('submit结果', res);
                Message.success('文章新增成功');
                state.loading = false;
                ctx.emit('updateList');
                resolve(true);
              });
            } else {
              console.log('表单验证失败', errors);
              resolve(false);
            }
          });
        }).then((value) => {
          return value;
        });
      };

      // 提交修改
      const update = (formEl: any) => {
        if (!formEl) return false;

        return new Promise((resolve) => {
          formEl.validate((errors: any) => {
            const content = editorRef.value.getHtml();
            if (!errors && content !== '') {
              state.loading = true;
              const data = {
                ...state.articleData,
                tag: JSON.stringify(state.articleData.tag),
                user_id: 2,
                content,
                article_id: state.id,
              };
              console.log('表单数据', data);
              updateArticle(data).then((res) => {
                console.log('update结果', res);
                Message.success('文章修改成功');
                state.loading = false;
                ctx.emit('updateList');
                resolve(true);
              });
            } else {
              console.log('表单验证失败', errors);
              resolve(false);
            }
          });
        }).then((value) => {
          return value;
        });
      };

      // 组件销毁时，也及时销毁编辑器
      onBeforeUnmount(() => {
        const editor = editorRef.value;
        if (editor == null) return;
        editor.destroy();
      });

      const handleCreated = (editor: any) => {
        editorRef.value = editor; // 记录 editor 实例，重要！
      };

      return {
        ...toRefs(state),
        formRef,
        editorRef,
        contentRef,
        valueHtml,
        toolbarConfig,
        editorConfig,
        rules,
        handleCreated,
        submit,
        update,
      };
    },
  });
</script>

<style>
  @import '@wangeditor/editor/dist/css/style.css';
</style>

<style lang="less" scoped></style>
