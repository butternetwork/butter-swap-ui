import Vue from 'vue'
import App from './App.vue'
import router from './router/index' //引入路由
import i18n from './locale';
import store,{watcher} from './store'
import api from './api/api'
import eventbus from './eventBus.js'
import './assets/css/stylesheet.css'
import * as vClickOutside from 'v-click-outside-x';
import Decimal from 'decimal.js';
Vue.use(vClickOutside);

const CLIENT_CACHE={}
const Web3 = require('web3');
watcher.getProvider().then(async provider=>{
  Vue.prototype.$web3 = await watcher.bindClient();
  Vue.prototype.$provider = provider;
}).catch(e=>{})
// Vue.prototype.$client = (chainId)=>{
//   return asyncChainClient(chainId);
// };
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
Vue.prototype.$copyObject=(data)=>{
  return JSON.parse(JSON.stringify(data));
}
Vue.prototype.$formatAddress =(address,length=4)=>{
  if (address && address.length > length*2) {
    return `${address.substring(0, length)}...${address.substring(address.length - length, address.length)}`
  }
  return address;
}

// async function asyncChainClient(chainId){
//   let chainClientCheckTimer=null;
//   let limitCount = 5;
//   return new Promise(async resolve=>{
//     chainId = new Decimal(chainId).toHex();
//     if (CLIENT_CACHE[chainId]){
//       resolve(CLIENT_CACHE[chainId]);
//     }
//     if (!chainClientCheckTimer){
//       chainClientCheckTimer = setInterval(()=>{
//         if (CLIENT_CACHE[chainId] || limitCount===0){
//           clearInterval(chainClientCheckTimer);
//           chainClientCheckTimer=null;
//           resolve(CLIENT_CACHE[chainId]);
//         }
//         limitCount--;
//       },1000);
//     }
//
//   });
//
// }
// async function asyncChainList(){
//   api.chainList().then(result => {
//     if (result.code === 200) {
//       let chainList = result.data.list;
//       console.log(result.data.list);
//       /*
//       chain: "MAP"
//       chainId: 22776
//       chainImg: "https://files.maplabs.io/bridge/map.png"
//       chainName: "MAP Makalu"
//       contract: "0xb586DC60e9e39F87c9CB8B7D7E30b2f04D40D14c"
//       gasLimit: "600000"
//       id: 1
//       rpc: "https://poc2-rpc.maplabs.io/"
//       scanUrl: "https://makalu.mapscan.io/"
//        */
//       if (chainList &&chainList.length>0){
//         for (const item of chainList) {
//           let chainId = new Decimal(item.chainId).toHex();
//           CLIENT_CACHE[chainId] = new Web3(new Web3.providers.HttpProvider(item.rpc));
//         }
//       }
//     }
//   }).catch(err => {});
// }
// asyncChainList();

Vue.config.productionTip = false
import toastRegistry from './vendor/toast/index'
import {Providers} from "web3-core";
Vue.use(toastRegistry)

new Vue({
  i18n,
  api,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
