export default
{
    tokenCoin: "0x5aa33a182f3c2e3f41176b9ea100f5dbcd1be553",//测试链的默认代币地址
    // tokenCoin: "0x9E976F211daea0D652912AB99b0Dc21a7fD728e4",//默认链的默认代币地址
    mapAddress: "0x1cc73FbDA4fDBB80015Fb824807c5f19276243Ee",//eth测试地址
    toAddress: "0x346544CdCDB4452993d90e86ABCeAB8bD1405b7a",//eth测试地址
    defaultChainFrom:'3',
    defaultChainTo:'22776',
    // mapAddress: "0xb586DC60e9e39F87c9CB8B7D7E30b2f04D40D14c",//eth正式地址
    CHAIN:{
        22776: {
            CHAINNAME:"MAP",
            mapAddress:"0x1d7Ef443d23998e78341e4b437Aaa63303E0635C"
        },
        3: {
            CHAINNAME:"ETH",
            mapAddress:"0x1d7Ef443d23998e78341e4b437Aaa63303E0635C"
        },
        1: {
            CHAINNAME:"ETH",
            mapAddress:"0xb586DC60e9e39F87c9CB8B7D7E30b2f04D40D14c"
        }
    },

    TOKENS:{
        MAP:{
            MAP:"0x6a33e88b8fa3031ad55d16b5c7def4fd93fa29b1",
            USDT:"0x6a33e88b8fa3031ad55d16b5c7def4fd93fa29b1",
        },
        ETH:{
            // MAP:"0x9E976F211daea0D652912AB99b0Dc21a7fD728e4",//0x2020f4b99433067F4a5ED99Ce8392d94a8AC70d1
            MAP:"0x2020f4b99433067F4a5ED99Ce8392d94a8AC70d1",//0x2020f4b99433067F4a5ED99Ce8392d94a8AC70d1
            USDT:"0xdac17f958d2ee523a2206206994597c13d831ec7",
            USDC:"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            IDV:"0x5aa33a182f3c2e3f41176b9ea100f5dbcd1be553",//0x5aa33a182f3c2e3f41176b9ea100f5dbcd1be553
            // IDV:"0x92ec47df1aa167806dfa4916d9cfb99da6953b8f",//0x5aa33a182f3c2e3f41176b9ea100f5dbcd1be553
            ETH:"0x0000000000000000000000000000000000000000",

        },
        HECOTEST:{
            MAP:"0x6a33e88b8fa3031ad55d16b5c7def4fd93fa29b1",
            USDT:"0x6a33e88b8fa3031ad55d16b5c7def4fd93fa29b1",
        },
    },

    tokenList:{
        22776:{//map链
            list:[
                {
                    name:"MAP",
                    contract:"0x6a33e88b8fa3031ad55d16b5c7def4fd93fa29b1",
                    img:require('../assets/token/map.png'),
                    decimal:18
                },
                {
                    name:"USDT",
                    contract:"0x6a33e88b8fa3031ad55d16b5c7def4fd93fa29b1",
                    img:require('../assets/token/tether.png'),
                    decimal:18
                },
                {
                    name:"USDC",
                    contract:"0x6a33e88b8fa3031ad55d16b5c7def4fd93fa29b1",
                    img:require('../assets/token/usd.png'),
                    decimal:18
                }
            ]
        },
        1:{//以太坊
            list:[
                {
                    name:"MAP",
                    contract:"0x9E976F211daea0D652912AB99b0Dc21a7fD728e4",
                    img:require('../assets/token/map.png'),
                    decimal:18
                },
                {
                    name:"IDV",
                    contract:"0x92ec47df1aa167806dfa4916d9cfb99da6953b8f",
                    img:require('../assets/token/idv.png'),
                    decimal:18
                },
                {
                    name:"ETH",
                    contract:"0x0000000000000000000000000000000000000000",
                    img:require('../assets/eth-icon.png'),
                    decimal:18
                },
                {
                    name:"USDT",
                    contract:"0xdac17f958d2ee523a2206206994597c13d831ec7",
                    img:require('../assets/token/tether.png'),
                    decimal:6
                },
                {
                    name:"USDC",
                    contract:"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    img:require('../assets/token/usd.png'),
                    decimal:6
                }
            ]
        },
        3:{//以太坊
            list:[
                {
                    name:"MAP",
                    contract:"0x2020f4b99433067F4a5ED99Ce8392d94a8AC70d1",
                    img:require('../assets/token/map.png'),
                    decimal:18
                },
                {
                    name:"IDV",
                    contract:"0x5aa33a182f3c2e3f41176b9ea100f5dbcd1be553",
                    img:require('../assets/token/idv.png'),
                    decimal:18
                },
                {
                    name:"ETH",
                    contract:"0x0000000000000000000000000000000000000000",
                    img:require('../assets/eth-icon.png'),
                    decimal:18
                },
                {
                    name:"USDT",
                    contract:"0x33daba9618a75a7aff103e53afe530fbacf4a3dd",
                    img:require('../assets/token/tether.png'),
                    decimal:18
                },
                {
                    name:"USDC",
                    contract:"0x9f722b2cb30093f766221fd0d37964949ed66918",
                    img:require('../assets/token/usd.png'),
                    decimal:18
                }
            ]
        },
        256:{
            MAP:"0x6a33e88b8fa3031ad55d16b5c7def4fd93fa29b1",
            USDT:"0x6a33e88b8fa3031ad55d16b5c7def4fd93fa29b1",
        },
    }
}
