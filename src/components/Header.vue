      <template>
          <div class="header">
              <div class="header-container">
                <div class="header-left">
                  <div @click="goMap()" class="header-logo">
                    <img src="../assets/logo.png"/>
                  </div>
                  <div class="header-line"></div>
                </div>
                <div  @click="goMap()" class="header-logo-h5">
      <!--            <img src="../assets/header-logo.png"/>-->
                </div>
                <div class="header-right">
                  <div class="header-connect">
                    <span class="header-error" v-if="error" @click="actionNetwork()">Network Error</span>
                    <div v-else>
                      <span class="header-intall">
                         <img :src="chainIcon"/>
                          {{chainName}}
                      </span>
                    </div>
                  </div>

                  <div class="header-connect">
                    <div>
                         <span v-if="address" class="header-intall header-intalls">
                           <img src="../assets/ant-icon.png"/>
                           {{address}}
                           <span class="header-address-round"></span>
                        </span>
                      <span v-else  class="header-intall">Install Metamask</span>
                    </div>
                  </div>
                </div>
              </div>
          </div>
      </template>

      <script>
      import Vue from 'vue'
      const Web3 = require('web3');
          export default {
              name: "Header",
              props:['num'],
              data() {
                  return {
                    tabIndex:0,
                    address: '' ,//地址
                    error:false,
                    chainIcon:require('../assets/eth-icon.png'),
                    chainName:'Ethereum Mainnet',
                    chainId:'0x1',//要修改
                  }
              },
              computed: {
                  account_default_address() {
                      return this.$store.state.account.default_address
                  },
                  account_change_chain() {
                  return this.$store.state.account.change_chain
                },
              },
              watch: {
                $route: {
                  handler() {
                    console.log( this.$route.query.sourceNetwork);
                    console.log( this.$route.query.destNetwork);

                    //深度监听，同时也可监听到param参数变化
                  },
                  deep: true,
                },
                //
                account_change_chain() {
                  // console.log(333333333)
                  this.getChainId()
                },
                  //检测到获取了地址
                account_default_address() {
                    // console.log(44444444)
                    this.actionAddress()
                    this.getChainId()
                  },

              },
              methods: {
                  actionNetwork() {
                  var v=this
                  window.ethereum &&
                  window.ethereum
                      .request({
                        method: 'wallet_switchEthereumChain',
                        params: [
                          {
                            chainId: v.chainId
                          },
                        ],
                      })
                      .then(() => {
                        // console.log('网络切换成功')
                        v.error=false
                        this.$router.go(0);
                        this.$eventBus.$emit('ref','页面')
                      })
                      .catch((e) => {
                        console.log(e)
                      })
                },
                  goMap() {
                    window.open('https://www.maplabs.io/','_blank')
                  },
                  async actionAddress() {
                    this.address = await this.action.getSortAddress()
                    //修改
                    // if (window.web3 && (window.ethereum.chainId == '0x1' || window.ethereum.chainId == '1')){
                    //   this.error=false
                    // } else  {
                    //   this.error=true
                    // }
                  },
                  async getChainId(){
                  // const chainId = await ethereum.request({ method: 'eth_chainId' });
                  //   if (window.web3 && (window.ethereum.chainId == '0x3' || window.ethereum.chainId == '3')){
                  //     this.error=false
                  //   } else  {
                  //     this.error=true
                  //   }

                  //！链id不是马上拿到的，如果通过链id来判断是不是主网的方式，请注意异步
                    let v = this
                    let chainId = await v.action.getChainId()
                    const params = v.$route.query;

                    console.log('chainIDDDDD',chainId,params.sourceNetwork)
                    if ((chainId=='0x1' || chainId=='1') && params.sourceNetwork=='ETH') {
                    // if (chainId=='0x1' || chainId=='0x3' && params.sourceNetwork=='ETH') {
                      v.error = false
                      v.chainIcon = require('../assets/eth-icon.png')
                      v.chainName = 'Ethereum Mainnet'
                    }
                    else if ((chainId=='0x58f8'|| chainId=='58f8' )&& params.sourceNetwork=='MAP') {
                      v.error = false
                      v.chainIcon = require('../assets/token/map.png')
                      v.chainName = 'MAP Makalu'
                    }
                    else if ((chainId=='0x38' || chainId=='38') && params.sourceNetwork=='BSC') {
                    // else if (chainId=='0x61' || chainId=='0x38' && params.sourceNetwork=='BSC') {
                      v.error = false
                      v.chainIcon = require('../assets/token/bsc.png')
                      v.chainName = 'BSC'
                    }
                    else  {
                      //要修改 chainID
                      v.error = true
                      if (params.sourceNetwork=='ETH') {
                        // v.chainId = '0x3'//测试ETH
                        v.chainId = '0x1'//正式
                      }
                      else if (params.sourceNetwork=='MAP') {
                        v.chainId = '0x58f8'
                      }
                      else if (params.sourceNetwork=='BSC') {
                        // v.chainId = '0x61' //测试
                        v.chainId = '0x38' // 正式
                      }
                    }
                }
              },
            mounted() {
                // if (window.web3 && (window.ethereum.chainId == '0x3' || window.ethereum.chainId == '3')){
                //   // this.error=false
                // } else  {
                //   // this.error=true
                // }
                  this.getChainId()
                  this.actionAddress()
              }
          }
      </script>

      <style scoped lang="less">

      .header {
        position: relative;
        border-bottom:1px solid rgba(0,0,0,0.1);
      }

      .header-container {
        width: 1200px;
        margin: 0 auto;
        padding-top: 20px;
        padding-bottom: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .header-logo {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        img {
          width: 170px;
        }
      }

      .header-logo-h5 {
        display: none;
      }

      .header-left {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .header-line {
        margin-left: 49px;
        width: 1px;
        height: 40px;
        opacity: 0.1;
        background-color: #fff;
      }

      .header-right {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .header-connect {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        margin-left: 10px;
      }

      .header-error {
        width: 186px;
        height: 40px;
        border-radius: 8px;
        text-align: center;
        line-height: 40px;
        border: solid 1px #E44E3A;
      }

      .header-intall {
        width: 186px;
        height: 40px;
        border-radius: 8px;
        border: solid 1px #E44E3A;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        //font-family: Poppins;
        font-size: 14px;
        img {
          margin-right: 9px;
          margin-left: 4px;
          width: 32px;
        }
      }

      .header-address-round {
        width: 6px;
        height: 6px;
        background: #23e9c3;
        border-radius: 100%;
        margin-left: 10px;
      }

      @media (max-width: 1200px) {
        .header-container {
          width: 100%;
        }
      }

      @media (max-width: 960px) {
        .header {
          width: 100%;
        }

        .header-container {
          width: 95%;
          align-items: center;
          justify-content: flex-start;
          padding: 10px 0;
        }

        .header-logo {
          img {
            width: 70px;
          }
        }

        .header-line {
          margin-left: 10px;
          height: 30px;
        }


        .header-connect {
          margin-left: 10px;
          font-size: 12px;
          right: 5%;
        }

        .header-intall {
          width: 100px;
          height: 35px;
          font-size: 12px;
          line-height: 12px;
          text-align: center;
          img {
            width: 20px;
          }
        }

        .header-intalls {
          width: 150px;
        }

        .tab-two {
          padding-left: 15px;
        }
      }

      </style>
