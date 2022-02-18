import Vue from 'vue'
import App from './App.vue'
import router from './router/index' //引入路由
// import i18n from '@/locale/index'


import store from './store'
import api from './api/api'
import './assets/css/stylesheet.css'
import config from './config/configTest'


//以太坊web3
const Web3 = require('web3');

if (window.web3 && (window.ethereum.chainId == config.ethId || window.ethereum.chainId == config.ethDefaultId || window.ethereum.chainId == '0x58f8' || window.ethereum.chainId == '58f8' || window.ethereum.chainId == '22776' || window.ethereum.chainId == config.bscId || window.ethereum.chainId == config.bscDefaultId   || window.ethereum.chainId == config.polygonId || window.ethereum.chainId == config.polygonDefaultId)) {
// if (window.web3 && (window.ethereum.chainId == '0x3' || window.ethereum.chainId == '3' )) {
  Vue.prototype.myWeb3 = new Web3(window.web3.currentProvider);
}

Vue.prototype.myMaticWeb3 = new Web3('https://rpc-mainnet.maticvigil.com/');

// 挂载action
import action from "./action/index"
Vue.prototype.action = action


Vue.prototype.$eventBus = new Vue()


Vue.config.productionTip = false

import toastRegistry from './vendor/toast/index'
Vue.use(toastRegistry)

new Vue({
  // i18n,
  api,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
