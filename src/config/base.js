export default
    {
        tokenCoin: "0x2020f4b99433067F4a5ED99Ce8392d94a8AC70d1",//默认链的默认代币地址
        mapAddress: "0x659BC6aD25AEea579f3eA91086fDbc7ac0432Dc4",//eth测试地址
        CHAIN:{
          22776: {
              CHAINNAME:"MAP",
              mapAddress:"0x1d7Ef443d23998e78341e4b437Aaa63303E0635C"
          },
          3: {
              CHAINNAME:"ETH",
              mapAddress:"0x1d7Ef443d23998e78341e4b437Aaa63303E0635C"
          }
        },

        TOKENS:{
            MAP:{
                MAP:"0x6a33e88b8fa3031ad55d16b5c7def4fd93fa29b1",
                USDT:"0x6a33e88b8fa3031ad55d16b5c7def4fd93fa29b1",
            },
            ETH:{
                MAP:"0x2020f4b99433067F4a5ED99Ce8392d94a8AC70d1",
                // USDT:"0x33daba9618a75a7aff103e53afe530fbacf4a3dd",
                // USDC:"0x9f722b2cb30093f766221fd0d37964949ed66918",
                IDV:"0x5aa33a182f3c2e3f41176b9ea100f5dbcd1be553",
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
