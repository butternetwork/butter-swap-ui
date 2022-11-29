import Vue from 'vue'
import Vuex from 'vuex'
import Decimal from 'decimal.js';
// import Watcher from './watcher';
import eventbus from '../eventBus.js'
import connector from "@/store/connector";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        chains: {
            // '0x8682': {
            //     chainId:'0x8682',
            //     symbol: 'ETH',
            //     name: 'Ethereum',
            //     network: 'Ethereum Private',
            //     icon: require('../assets/token/eth-icon.png')
            // },
            '0xd4': {
                chainId:'0xd4',
                symbol: 'MAP',
                name: 'MAP',
                network: 'MAP Testnet',
                icon: require('../assets/token/map.png')
            },
            '0x4d41500100000001': {
                chainId:'0x4d41500100000001',
                symbol: 'NEAR',
                name: 'NEAR',
                network: 'Near Testnet',
                icon: require("../assets/token/near.png")
            },
            // '0x3': {
            //     chainId:'0x3',
            //     symbol: 'ETH',
            //     name: 'Ethereum',
            //     network: 'Ethereum Testnet',
            //     icon: require('../assets/token/eth-icon.png')
            // },
            // '0x38': {
            //     chainId:'0x38',
            //     symbol: 'BSC',
            //     name: 'BinanceSmartChain',
            //     network: 'BSC Mainnet',
            //     icon: require('../assets/token/bsc.png')
            // },
            '0x61': {
                chainId:'0x61',
                symbol: 'BSC',
                name: 'BinanceSmartChain',
                network: 'BSC Testnet',
                icon: require('../assets/binance.png')
            },
            // '0x58f8': {
            //     chainId:'0x58f8',
            //     symbol: 'MAP',
            //     name: 'MAP Protocol',
            //     network: 'MAP Mainnet',
            //     icon: require('../assets/token/map-black.png')
            // },
            // '0x13881': {
            //     chainId:'0x13881',
            //     symbol: 'Matic',
            //     name: 'Matic',
            //     network: 'Polygon Mainnet',
            //     icon: require('../assets/polygon.png')
            // },
            // '0x89': {
            //     chainId:'0x89',
            //     symbol: 'POLYGON',
            //     name: 'Polygon',
            //     network: 'Polygon Mainnet',
            //     icon: require('../assets/token/polygon.png')
            // }
        },
        changed: 0,
        address: '',
        chainId: '',
    },
    mutations: {
        setAddress(state, payload) {
            eventbus.$emit('dataChanged', true)
            state.address = payload;
        },
        setChainId(state, payload) {
            eventbus.$emit('dataChanged', true)
            payload = new Decimal(payload).toHex();
            console.log('payload',payload)
            state.chainId = payload;
        },
    },
    getters: {
        getChains:(state)=>{
            return state.chains;
        },
        getAddress: (state) => {
            return state.address;
        },
        getChainId: (state) => {
            return state.chainId;
        },
        provider: (state) => {
            return connector.provider;
        },
        web3: (state) => {
            return connector.web3;
        }
    },
    actions: {
        async connect(store) {
            const {
                account,
                chainId
            } = await connector.connect();
            // store.commit("setAddress",account);
            console.log('account',account, chainId);
        },
        logout(store, payload) {
            store.commit('setAddress', '');
            connector.web3modal.clearCachedProvider();
        },
        switchChain(store, payload) {
            connector.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: payload}],
            });
        },
    },
    modules: {
    }
});
// const matchChainId = (data) => {
//     if (!data) {
//         return;
//     }
//     data = new Decimal(data).toHex();
//     store.commit('setChainId', data);
// };
// const matchAddress = (data) => {
//     if (!data) {
//         return;
//     }
//     if (typeof data === 'string') {
//         store.commit('setAddress', data);
//     } else {
//         store.commit('setAddress', data[0]);
//     }
// };
// const watcherDog = new Watcher();
// watcherDog.listen('providerReady', async () => {
//     let client = await watcherDog.bindClient();
//     Vue.prototype.$web3 = client;
//     Vue.prototype.$provider = watcherDog.provider;
//     if (window.web3) {
//         Vue.prototype.myWeb3 = client
//     }
//     matchChainId(watcherDog.provider.chainId);
//     matchAddress(watcherDog.provider.selectedAddress);
// });
// watcherDog.listen('chainChanged', (chainId) => {
//     matchChainId(chainId)
// });
// watcherDog.listen('accountChanged', (accounts) => {
//     matchAddress(accounts);
// });

// export const watcher = watcherDog;
export default store;
