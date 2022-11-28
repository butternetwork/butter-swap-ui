export default {
    baseUrl: 'https://omniscan-api-testnet.mapscan.io/',// 生产接口请求地址
    // baseUrl: 'http://18.139.224.21:8201',// 测试接口请求地址

    //切换测试网    需要修改  action/index.js   main.js   header home
    tokenCoin: "0x5aa33a182f3c2e3f41176b9ea100f5dbcd1be553",//测试链的默认代币地址
    mapAddress: "0x1cc73FbDA4fDBB80015Fb824807c5f19276243Ee",//eth测试地址
    toAddress: "0x346544CdCDB4452993d90e86ABCeAB8bD1405b7a",//eth测试地址


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
    map: {
        chainId: '212',
        chainHex: '0xd4',
        rpc:"https://testnet-rpc.maplabs.io",
        chainName:"MAP Testnet"
    },
    polygon:{
        chainId: '137',
        chainHex: '0x89',
    },

    near:{
        chainId: '5566818579631833089',
        chainHex: '0x4d41500100000001',
    },


    connectionConfig : {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(), // first create a key store
        nodeUrl: "https://rpc.testnet.near.org",
        // walletUrl: "https://app.mynearwallet.com/",//正式
        walletUrl: "https://testnet.mynearwallet.com/",//测试
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    }

}
