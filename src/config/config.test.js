export default {
    baseUrl: 'https://bridge-api.maplabs.io/',// 生产接口请求地址
    // baseUrl: 'http://39.99.244.11:8201/',// 生产接口请求地址

    //切换测试网    需要修改  action/index.js   main.js   header home
    tokenCoin: "0x5aa33a182f3c2e3f41176b9ea100f5dbcd1be553",//测试链的默认代币地址
    mapAddress: "0x1cc73FbDA4fDBB80015Fb824807c5f19276243Ee",//eth测试地址
    toAddress: "0x346544CdCDB4452993d90e86ABCeAB8bD1405b7a",//eth测试地址

    defaultChain: {
        from: '3',
        to: '22776'
    },

    eth: {
        chainId: '3',
        chainHex: '0x3',
    },
    bsc: {
        chainId: '97',
        chainHex: '0x61',
    },
    map: {
        chainId: '22776',
        chainHex: '0x58f8',
    }
}
