import Vue from 'vue'
import App from './App.vue'
import router from './router/index' //引入路由
import i18n from './locale';
import store,{watcher} from './store'
import api from './api/api'
import eventbus from './eventBus.js'
import './assets/css/stylesheet.css'
import * as vClickOutside from 'v-click-outside-x';

Vue.use(vClickOutside);

// const Web3 = require('web3');
watcher.getProvider().then(async provider=>{
  Vue.prototype.$web3 = await watcher.bindClient();
  Vue.prototype.$provider = provider;
}).catch(e=>{})
Vue.prototype.$http = api;
Vue.prototype.$event = eventbus;
Vue.prototype.$watcher = watcher;
Vue.prototype.$copy=(data)=>{
  let oInput = document.createElement('input');
  oInput.value = data;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  document.execCommand('Copy'); // 执行浏览器复制命令
  oInput.remove();
}
Vue.prototype.$formatAddress =(address,length=4)=>{
  if (address && address.length > length*2) {
    return `${address.substring(0, length)}...${address.substring(address.length - length, address.length)}`
  }
  return address;
}
// 挂载action
// import action from "./action/index"
// Vue.prototype.action = action


Vue.config.productionTip = false

import toastRegistry from './vendor/toast/index'
Vue.use(toastRegistry)

new Vue({
  i18n,
  api,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
