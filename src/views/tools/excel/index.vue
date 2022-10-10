<template>
  <div class="excelPage">
    <label for="file" style="position: absolute">
      <div class="fileButton">选择文件</div>
      <span>{{ fileName }}</span>
    </label>
    <input
      id="file"
      ref="input"
      type="file"
      style="margin-left: 3px; color: red"
      @change="fileChange()"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, toRefs } from 'vue';
  import * as XLSX from 'xlsx';

  export default defineComponent({
    name: 'App',
    setup() {
      const input = ref(null);
      const state = reactive({
        fileList: [],
        fileName: '',
      });

      const custom = (option: any) => {
        console.log(option);
      };

      const cons = () => {
        console.log(state.fileList);
      };

      // 处理医院信息以及姓名时间
      const sepratorInfo = (obj: any) => {
        const arry = obj.w.split(' ');
        const dateFormt =
          /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])+$/;
        const info = {
          hos: '',
          time: '',
        };
        arry.forEach((v: any) => {
          if (v.includes('医院')) info.hos = v;
          else if (dateFormt.test(v)) info.time = v;
        });
        return info;
      };

      const exportExcel = (jsonData: any[]) => {
        const sheet = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1');
        XLSX.writeFile(wb, 'textport.xlsx', {
          bookType: 'xlsx',
          bookSST: false,
          type: 'binary',
        });
      };

      // 读取本地excel文件
      const readWorkbookFromLocalFile = (file: any, callback: any) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e: any) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          if (callback) callback(workbook);
        };
      };

      const fileChange = () => {
        if (!input.value) return;
        // console.dir(input.value);
        const { files } = input.value as any;
        state.fileName = files[0].name;
        if (files.length === 0) return;
        const targetList = ['B', 'AD'];
        readWorkbookFromLocalFile(files[0], (workbook: any) => {
          console.log(workbook);
          const list = workbook.Sheets[workbook.SheetNames[0]];
          let rowLength = 1;
          let end = false;
          // 循环获取excel表行数
          while (!end) {
            if (list[targetList[0] + rowLength.toString()]) {
              rowLength += 1;
            } else {
              end = true;
            }
          }
          console.log(rowLength - 1);
          const hospital = {} as Record<string, string>;

          for (let i = 3; i < rowLength; i += 1) {
            // console.log(sepratorInfo(list[targetList[0] + i.toString()]));
            const info = sepratorInfo(list[targetList[0] + i.toString()]);
            if (hospital[info.hos] === undefined) {
              hospital[info.hos] = `${info.time}\n${
                list[targetList[1] + i.toString()].w
              }`;
            } else {
              hospital[info.hos] = `${hospital[info.hos]}\n${info.time}\n${
                list[targetList[1] + i.toString()].w
              }`;
            }
          }
          const infoList: { 医院: string; 拜访结果: any }[] = [];
          Object.keys(hospital).forEach((key) => {
            infoList.push({
              医院: key,
              拜访结果: hospital[key],
            });
          });
          exportExcel(infoList);
          console.log(infoList);
        });
      };

      return {
        ...toRefs(state),
        cons,
        custom,
        readWorkbookFromLocalFile,
        fileChange,
        input,
        sepratorInfo,
        exportExcel,
      };
    },
  });
</script>

<style>
  html,
  body {
    margin: 0;
    padding: 0;
  }

  .excelPage {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  input {
    display: none;
  }

  .fileButton {
    display: inline-block;
    height: 30px;
    padding: 0 10px;
    color: #fff;
    font-weight: 400;
    line-height: 30px;
    background-color: #409eff;
    border-radius: 3px;
    cursor: pointer;
  }
</style>
