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
                         <img src="../assets/eth-icon.png"/>
                          Ethereum Mainnet
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
                  }
              },
              computed: {
                  account_default_address() {
                      return this.$store.state.account.default_address
                  },
              },
              watch: {
                  //检测到获取了地址
                  account_default_address() {
                      this.actionAddress()
                  }
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
                            chainId: '0x3'
                          },
                        ],
                      })
                      .then(() => {
                        console.log('网络切换成功')
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
                  goStake() {
                    this.tabIndex=0
                    console.log(this.tabIndex)
                    this.$router.push('/home')
                    if (window.ethereum.chainId == '0x3' || window.ethereum.chainId == '256'){
                      this.error=false
                    } else  {
                      this.error=true
                      // this.actionAddress()
                    }
                  },
                  goManage() {
                    this.tabIndex=1
                    console.log(this.tabIndex)
                    this.$router.push('/manage')
                    if (window.ethereum.chainId == '0x3' || window.ethereum.chainId == '256'){
                      this.error=false
                    } else  {
                      this.error=true
                      // this.actionAddress()
                    }
                },
                  async actionAddress() {
                    this.address = await this.action.getSortAddress()
                    if (window.web3 && (window.ethereum.chainId == '0x3' || window.ethereum.chainId == '256')){
                      this.error=false
                    } else  {
                      this.error=true
                    }
                  },
              },
            mounted() {
                if (window.web3 && (window.ethereum.chainId == '0x3' || window.ethereum.chainId == '256')){
                  this.error=false
                } else  {
                  this.error=true
                }
                  this.actionAddress()
              }
          }
      </script>

      <style scoped lang="less">

      .header {
        position: relative;
        border-bottom:1px solid rgba(255,255,255,0.1);
      }

      .header-container {
        width: 1200px;
        margin: 0 auto;
        padding-top: 27px;
        padding-bottom: 28px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .header-logo {
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
        margin-left: 40px;
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
          margin-left: 7px;
          font-size: 12px;
          right: 5%;
        }

        .header-intall {
          width: 100px;
          height: 35px;
          font-size: 12px;
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
