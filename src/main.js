import Vue from 'vue'
import App from './App.vue'
import router from './router/index' //引入路由
import i18n from './locale';
import store from './store'
import api from './api/api'
import eventbus from './eventBus.js'
import './assets/css/stylesheet.css'
import Decimal from 'decimal.js';
import { SUPPORTED_CHAIN_LIST} from 'butterjs-sdk/dist/constants/index.js';

const CLIENT_CACHE={}
const Web3 = require('web3');
// watcher.getProvider().then(async provider=>{
//   Vue.prototype.$web3 = await watcher.bindClient();
//   Vue.prototype.$provider = provider;
// }).catch(e=>{})
// Vue.prototype.$client = (chainId)=>{
//   return asyncChainClient(chainId);
// };
Vue.prototype.$http = api;
Vue.prototype.$event = eventbus;
// Vue.prototype.$watcher = watcher;
Vue.prototype.$copy=(data)=>{
  let oInput = document.createElement('input');
  oInput.value = data;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  document.execCommand('Copy'); // 执行浏览器复制命令
  oInput.remove();
}
Vue.prototype.$copyObject=(data)=>{
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (e) {
    return [];
  }
}
Vue.prototype.$formatAddress =(address,length=4)=>{
  if (address && address.length > length*2) {
    return `${address.substring(0, length)}...${address.substring(address.length - length, address.length)}`
  }
  return address;
}

async function asyncChainClient(chainId){
  let chainClientCheckTimer=null;
  let limitCount = 5;
  return new Promise(async resolve=>{
    chainId = new Decimal(chainId).toHex();
    if (CLIENT_CACHE[chainId]){
      resolve(CLIENT_CACHE[chainId]);
    }
    if (!chainClientCheckTimer){
      chainClientCheckTimer = setInterval(async ()=>{
        if (CLIENT_CACHE[chainId] || limitCount===0){
          clearInterval(chainClientCheckTimer);
          chainClientCheckTimer=null;
          if (CLIENT_CACHE[chainId]){
            resolve(CLIENT_CACHE[chainId]);
          }else{
            let client = await watcher.bindClient();
            resolve(client);
          }
        }
        limitCount--;
      },1000);
    }
  });
}

async function asyncChainList(){
  let chainList = SUPPORTED_CHAIN_LIST

  console.log('chainList',chainList)
  if (chainList &&chainList.length>0){
    for (const item of chainList) {
      let chainId = new Decimal(item.chainId).toHex();
        CLIENT_CACHE[chainId] = new Web3(new Web3.providers.HttpProvider(item.rpc));
    }
  }
}

// Vue.prototype.myMapWeb3 = new Web3('http://18.142.54.137:7445');

asyncChainList();

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
