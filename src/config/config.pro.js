export default {
    baseUrl: 'https://bridge-api.maplabs.io/',

    tokenCoin: "0x9E976F211daea0D652912AB99b0Dc21a7fD728e4",//默认链的默认代币地址
    mapAddress: "0xb586DC60e9e39F87c9CB8B7D7E30b2f04D40D14c",//eth正式地址
    toAddress: "0x346544CdCDB4452993d90e86ABCeAB8bD1405b7a",//map测试地址


    defaultChain: {
        from: '1',
        to: '22776'
    },

    eth: {
        chainId: '1',
        chainHex: '0x1',
    },
    bsc: {
        chainId: '38',
        chainHex: '0x26',
    },
    map: {
        chainId: '22776',
        chainHex: '0x58f8',
    }
}
