import Vue from 'vue'
import Vuex from 'vuex'
import Decimal from 'decimal.js';
import Watcher from './watcher';
import eventbus from '../eventBus.js'
import api from '../api/api'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        chains: {
            '0x1': {
                chainId:'0x1',
                symbol: 'ETH',
                name: 'Ethereum',
                network: 'Ethereum Mainnet',
                icon: require('../assets/eth-icon.png')
            },
            // '0x3': {
            //     chainId:'0x3',
            //     symbol: 'ETH',
            //     name: 'Ethereum',
            //     network: 'Ethereum Testnet',
            //     icon: require('../assets/eth-icon.png')
            // },
            '0x38': {
                chainId:'0x38',
                symbol: 'BSC',
                name: 'BinanceSmartChain',
                network: 'BSC Mainnet',
                icon: require('../assets/binance.png')
            },
            // '0x61': {
            //     chainId:'0x61',
            //     symbol: 'BSC',
            //     name: 'BinanceSmartChain',
            //     network: 'BinanceSmartChain Mainnet',
            //     icon: require('../assets/binance.png')
            // },
            '0x58f8': {
                chainId:'0x58f8',
                symbol: 'MAP',
                name: 'MAP Protocol',
                network: 'MAP Mainnet',
                icon: require('../assets/eth-icon.png')
            },
            // '0x13881': {
            //     chainId:'0x13881',
            //     symbol: 'Polygon',
            //     name: 'Polygon',
            //     network: 'Polygon Mainnet',
            //     icon: require('../assets/polygon.png')
            // },
            '0x89': {
                chainId:'0x89',
                symbol: 'Polygon',
                name: 'Polygon',
                network: 'Polygon Mainnet',
                icon: require('../assets/polygon.png')
            }
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
        }
    },
    actions: {
        connect(store) {
            watcherDog.getProvider()
                .then((provider) => {
                    provider.request({
                        method: 'eth_requestAccounts',
                        params: []
                    })
                        .then(result => {
                            // console.log("eth_requestAccounts",result)
                            matchAddress(result);

                        })
                        .catch(err => {

                        });
                });
        },
        switchChain(store, payload) {
            watcherDog.getProvider()
                .then((provider) => {
                    provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{chainId: payload}],
                    })
                        .then(result => {

                        })
                        .catch(err => {

                        });
                });
        }
    },
    modules: {
    }
});
const matchChainId = (data) => {
    if (!data) {
        return;
    }
    data = new Decimal(data).toHex();
    store.commit('setChainId', data);
};
const matchAddress = (data) => {
    if (!data) {
        return;
    }
    if (typeof data === 'string') {
        store.commit('setAddress', data);
    } else {
        store.commit('setAddress', data[0]);
    }
};
const watcherDog = new Watcher();
watcherDog.listen('providerReady', async () => {
    let client = await watcherDog.bindClient();
    Vue.prototype.$web3 = client;
    Vue.prototype.$provider = watcherDog.provider;
    if (window.web3) {
        Vue.prototype.myWeb3 = client
    }
    matchChainId(watcherDog.provider.chainId);
    matchAddress(watcherDog.provider.selectedAddress);
});
watcherDog.listen('chainChanged', (chainId) => {
    matchChainId(chainId)
});
watcherDog.listen('accountChanged', (accounts) => {
    matchAddress(accounts);
});

export const watcher = watcherDog;
export default store;
