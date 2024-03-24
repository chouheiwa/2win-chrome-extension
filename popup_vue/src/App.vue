<template>
  <el-card v-loading="loading" v-if="!isLogin">
    当前暂未登录，请点击<a @click="open">链接</a>进行登录
  </el-card>
  <el-card v-else>
    <el-upload
        v-if="!processing"
        class="upload-demo"
        drag
        :auto-upload="false"
        :show-file-list="false"
        :limit="1"
        :on-change="onFileInputChange"
        action="#"
        accept=".xlsx,.csv"
    >
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        拖动xlsx文件到这里 <em>点击此处选择xlsx文件</em>
      </div>
    </el-upload>
    <el-progress v-else type="dashboard" :percentage="progress">
      <template #default="{ percentage }">
        <span class="percentage-value">{{ percentage }}%</span>
        <span class="percentage-label">处理中，请不要点击其他地方</span>
      </template>
    </el-progress>
  </el-card>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import BaseRequest from "./network/BaseRequest.ts";
//@ts-ignore
import ChromeConnect from "./network/ChromeConnect.js";
import {UploadFilled} from "@element-plus/icons-vue";
import {UploadFile} from "element-plus";
import XlsxProcess from "./workbook/XlsxProcess.ts";


const loading = ref(false);
const isLogin = ref(false);
const processing = ref(false);
const progress = ref(0);

onMounted(async () => {
  loading.value = true;
  isLogin.value = await BaseRequest.checkLoginStatus();
  loading.value = false;
});

const open = () => {
  ChromeConnect.openTab();
}

const onFileInputChange = (file: UploadFile) => {
  console.log(file);
  if (!file.raw) {
    return;
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    if (!e.target) {
      return;
    }
    //@ts-ignore
    const data = new Uint8Array(e.target.result);
    const rows = XlsxProcess.parseXlsx(data);
    getDetail(rows);
    // BaseRequest.getKeyWordList(rows);
  }
  reader.readAsArrayBuffer(file.raw);
}

const getDetail = async (key: string[]) => {
  processing.value = true;
  const totalCount = key.length;
  let currentCount = 0;
  let results = [];
  for (let i = 0; i < key.length; i++) {
    const result = await BaseRequest.getKeyWordList(key[i]);
    console.log(result);
    currentCount++;
    progress.value = Math.floor((currentCount / totalCount) * 100);
    results.push(result);
  }
  saveUint8ArrayToFile(XlsxProcess.generateXlsx(results), '单号查询结果.xlsx');
  processing.value = false;
}

function saveUint8ArrayToFile(uint8Array: Uint8Array, fileName: string) {
  const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
  const file = new File([blob], fileName, { type: 'application/octet-stream' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

</script>

<style scoped>
a {
  text-decoration: underline;
  color: #409EFF;
}
</style>
