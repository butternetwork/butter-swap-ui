import * as nearAPI from "near-api-js";

const { keyStores } = nearAPI;


export default
    {
        // baseUrl: 'https://omniscan-api-testnet.mapscan.io/',// 生产接口请求地址
        baseUrl: 'https://api.mapomniscan.com/',

        tokenCoin: "0x9E976F211daea0D652912AB99b0Dc21a7fD728e4",//默认链的默认代币地址
        mapAddress: "0xb586DC60e9e39F87c9CB8B7D7E30b2f04D40D14c",//eth正式地址
        toAddress: "0x346544CdCDB4452993d90e86ABCeAB8bD1405b7a",//map测试地址

        defaultChain: {
            from: '34434',
            to: '22776'
        },

        eth: {
            chainId: '34434',
            chainHex: '0x8682',
        },
        bsc: {
            chainId: '97',
            chainHex: '0x61',
        },
        bsc_mainnet: {
            chainId: '56',
            chainHex: '0x38',
            rpc: "https://bsc-dataseed1.defibit.io/",
            chainName: "BSC Mainnet"
        },
        map: {
            chainId: '212',
            chainHex: '0xd4',
            rpc:"https://testnet-rpc.maplabs.io",
            chainName:"MAP Testnet"
        },
        map_mainnet: {
            chainId: '22776',
            chainHex: '0x58f8',
            rpc: "https://poc3-rpc.maplabs.io/",
            chainName:"MAP Mainnet"
        },
        polygon:{
            chainId: '137',
            chainHex: '0x89',
            rpc: "https://polygon-rpc.com/",
            chainName: "Polygon Mainnet"
        },

        near:{
            chainId: '5566818579631833089',
            chainHex: '0x4d41500100000001',
        },

        defaultChainFrom:'34434',
        defaultChainTo:'22776',
        ethId:'0x8682',
        ethDefaultId:'34434',
        bscId:'0x38',
        bscDefaultId:'56',
        polygonId:'0x89',
        polygonDefaultId:'137',

         connectionConfig : {
            networkId: "testnet",
            keyStore: new keyStores.BrowserLocalStorageKeyStore(), // first create a key store
             nodeUrl: "https://rpc.testnet.near.org",
             walletUrl: "https://testnet.mynearwallet.com/",
             helperUrl: "https://helper.testnet.near.org",
             explorerUrl: "https://explorer.testnet.near.org",
        }





    }
