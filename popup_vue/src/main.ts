import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
//@ts-ignore
import ChromeConnect from './network/ChromeConnect.js'

ChromeConnect.wakeUp();

createApp(App).use(ElementPlus).mount('#app')
