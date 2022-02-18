import bus from '../bus.js'
import Vue from "vue";
import config from '../config/configTest'

export default {
    async getAddress() {
        if (window.ethereum) {
            let address = await window.ethereum.selectedAddress
            if (address) {
                return address
            }
        }
    },
    async getSortAddress() {
        if (window.ethereum) {
            let address = await window.ethereum.selectedAddress
            if (address) {
                return address.substr(0, 9) + '...' + address.substr(38)
            }
        }
    },
    // 读取metamask，更新账号等
    async scanMetaMaskAccount() {
        //以太坊web3
        const Web3 = require('web3');
        if (window.web3 && window.ethereum && (window.ethereum.chainId == config.ethId || window.ethereum.chainId == config.ethDefaultId || window.ethereum.chainId == '0x58f8' || window.ethereum.chainId == '58f8' || window.ethereum.chainId == '22776' || window.ethereum.chainId == config.bscId || window.ethereum.chainId == config.bscDefaultId || window.ethereum.chainId == config.polygonId || window.ethereum.chainId == config.polygonDefaultId  )){
        // if (window.web3 && window.ethereum && (window.ethereum.chainId == '0x3' || window.ethereum.chainId == '3')){
            Vue.prototype.myWeb3 =  new Web3(window.web3.currentProvider);
        }
        Vue.prototype.myMaticWeb3 = new Web3('https://rpc-mainnet.maticvigil.com/');
        if (window.ethereum) {
            let address = await window.ethereum.selectedAddress
            // console.log(chainId,'chainid')
            // 收集账号状态
            let account_json = {
                default_address: address
            };
            // 提交账号状态给全局
            bus.appvue.$store.commit("setAccountKey", account_json);
        }
    },
    //切换链
    async scanMetaMaskChain() {
        if (window.ethereum) {
            let chainId = await window.ethereum.chainId
            console.log(chainId,'chainid')
            // 收集账号状态

            let change_json = {
                change_chain: chainId
            }
            // 提交账号状态给全局
            // console.log('change_json',change_json)
            bus.appvue.$store.commit("setChangeChain", change_json);
        }
    },
    listenMetaMask() {
        let me = this
        window.ethereum.on('accountsChanged', (data) =>{

            if (data.length>0){
                bus.appvue.$store.commit("setAccountKey", {default_address: data[0]});
            }
        });
        window.addEventListener("message", function (e) {
            // console.log('message',e)
            let d = e.data
            //检测到是有修改以后
            if (d.target == 'metamask-inpage') {
                // 重新读取账号
                me.scanMetaMaskAccount()
            }

            // console.log(d.data.data.method ,'11111111111111')

            if (d && d.data && d.data.data && d.data.data.method && d.data.data.method == 'metamask_chainChanged') {
                // console.log(22222222)
                me.scanMetaMaskChain()
            }
            });
    },

    async getChainId(){
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        if (chainId) {
            return chainId
        }
        //！链id不是马上拿到的，如果通过链id来判断是不是主网的方式，请注意异步
    }
}
