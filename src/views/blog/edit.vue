<template>
  <a-modal
    title="编辑文章"
    width="80%"
    :mask-closable="false"
    @before-ok="submit(formRef)"
  >
    <a-form ref="formRef" :model="articleData" layout="inline" :rules="rules">
      <a-form-item field="title" label="标题">
        <a-input v-model="articleData.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="type" label="类型">
        <a-select v-model="articleData.type" placeholder="选择类型">
          <a-option>生活</a-option>
          <a-option>开发</a-option>
          <a-option>学习</a-option>
          <a-option>笔记</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-select
          v-model="articleData.tags"
          :default-value="['Beijing', 'Shanghai']"
          :style="{ width: '320px' }"
          placeholder="选择标签"
          multiple
          :limit="2"
        >
          <a-option>Beijing</a-option>
          <a-option :tag-props="{ color: 'red' }">Shanghai</a-option>
          <a-option>Guangzhou</a-option>
          <a-option disabled>Disabled</a-option>
          <a-option>Shenzhen</a-option>
          <a-option>Wuhan</a-option>
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
        :editor="editorRef"
        :default-config="toolbarConfig"
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
  import { getArticleById } from '@/api/blog';
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
    },
    setup(props) {
      // 编辑器实例，必须用 shallowRef
      const editorRef = shallowRef();

      // 内容 HTML
      const valueHtml = ref('');
      const contentRef = ref();

      const toolbarConfig = {};
      const editorConfig = { placeholder: '请输入内容...' };

      const formRef = ref();
      const state = reactive({
        visible: false,
        articleData: {
          title: '',
          type: '',
          tags: [],
        },
      });

      watch(
        () => props.id,
        async (val) => {
          if (val) {
            await getArticleById(val).then((res: Record<string, any>) => {
              console.log(res);
            });
          }
        }
      );

      const rules = {
        title: [{ required: true, message: '请填入标题' }],
        type: [{ required: true, message: '请选择类型' }],
        tags: [{ required: true, message: '请选择标签' }],
      };

      function submit(formEl: any) {
        if (!formEl) return false;

        return new Promise((resolve) => {
          formEl.validate((errors: any) => {
            if (!errors) {
              const data = {
                ...state.articleData,
                content: editorRef.value.getHtml(),
              };

              console.log(data);
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
      };
    },
  });
</script>

<style>
  @import '@wangeditor/editor/dist/css/style.css';
</style>

<style lang="less" scoped></style>
