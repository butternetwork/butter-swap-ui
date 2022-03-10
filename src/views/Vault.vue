      <template>
          <div class="vault">
            <Header/>
<!--            广告-->
            <div v-show="showEarn" class="vault-earn">
              <div class="vault-earn-content">
                <div class="vault-earn-left">
                  <span>Participate in DeFi and earn </span>
                  <span>580%</span>
                </div>
                <div class="vault-earn-right">
                  <button>Go to Defi</button>
                  <img @click="showEarn=false" src="../assets/vault/close.png"/>
                </div>
              </div>
            </div>

<!--            overview-->
            <div class="overview">
              <div class="vault-container">
                <div class="overview-title">Your Liquidity Overview</div>
                <div class="overview-content">
                  <div class="overview-content-item">
                    <div class="overview-content-item-top">
                      <span>Total Vault Liquidity</span>
                      <img src="../assets/vault/warn.png"/>
                    </div>
                    <span class="overview-content-item-bottom">$ 20,345,567.00</span>
                  </div>
                  <div class="overview-content-item">
                    <div class="overview-content-item-top">
                      <span>TYour Liquidity Fee Earnings</span>
                      <img src="../assets/vault/warn.png"/>
                    </div>
                    <span class="overview-content-item-bottom">$2808.00</span>
                  </div>
                  <div class="overview-content-item overview-content-item-three">
                    <div class="overview-content-item-left">
                      <div class="overview-content-item-top">
                        <span>Your Total Farming Rewards</span>
                        <img src="../assets/vault/warn.png"/>
                      </div>
                      <span class="overview-content-item-bottom">$ 20,345,567.00</span>
                    </div>
                    <div class="overview-view">
                      <button>View</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

<!--            stake-->
            <div class="vault-stake">
              <div class="vault-container">
                <div class="vault-content">
                  <!--                按钮-->
                  <div class="vault-stake-btn">
                    <span>Staked only</span>
                    <SwitchComponent />
                  </div>
                  <!--                搜索-->
                  <div class="vault-stake-search">
                    <input placeholder="Search token by name ">
                    <img src="../assets/vault/search.png"/>
                  </div>
                </div>

              </div>

            </div>


            <div class="vault-table">
              <div class="vault-container">
                <div class="vault-table-content">
                  <table>
                    <tr class="text-break">
                      <td class="pl-4" style="width: 12%">
                        <div class="vault-table-header">
                          <span>Token</span>
                          <div class="vault-header-arrow">
                            <img src="../assets/vault/arrow-top.png"/>
                            <img src="../assets/vault/arrow-bottom.png"/>
                          </div>
                        </div>
                      </td>
                      <td style="width: 20%">
                        <div class="vault-table-header">
                          <span>Chain</span>
                          <div class="vault-header-arrow">
                            <img src="../assets/vault/arrow-top.png"/>
                            <img src="../assets/vault/arrow-bottom.png"/>
                          </div>
                        </div>
                      </td>
                      <td style="width: 15%">
                        <div style="" class="vault-table-header vault-table-header-two">
                          <span> Total Liquidity</span>
                          <div class="vault-header-arrow">
                            <img src="../assets/vault/arrow-top.png"/>
                            <img src="../assets/vault/arrow-bottom.png"/>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="vault-table-header vault-table-header-two">
                          <span> Volume 24H</span>
                          <div class="vault-header-arrow">
                            <img src="../assets/vault/arrow-top.png"/>
                            <img src="../assets/vault/arrow-bottom.png"/>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="vault-table-header vault-table-header-two">
                          <span>Your Liquidity</span>
                          <div class="vault-header-arrow">
                            <img src="../assets/vault/arrow-top.png"/>
                            <img src="../assets/vault/arrow-bottom.png"/>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="vault-table-header vault-table-header-two">
                          <span>APY</span>
                          <div class="vault-header-arrow">
                            <img src="../assets/vault/arrow-top.png"/>
                            <img src="../assets/vault/arrow-bottom.png"/>
                          </div>

                        </div>
                      </td>
                      <td></td>
                    </tr>

                    <tbody class="vault-table-conntent">
                      <tr >
                        <td>
                          <div class="vault-token">
                            <img src="../assets/token/eth-icon.png"/>
                             ETH
                          </div>
                        </td>
                        <td>
                          <div class="vault-chain">
                            <img src="../assets/token/eth-icon.png"/>
                            <img src="../assets/token/map.png"/>
                            <img src="../assets/token/polygon.png"/>
                          </div>
                        </td>
                        <td>
                          <div class="vault-liquidity">
                            14,939 ETH
                          </div>
                        </td>
                        <td>
                          <div class="vault-liquidity">$3,204,925</div>
                        </td>
                        <td>
                          <div class="vault-liquidity">
                            --
                          </div>
                        </td>
                        <td>
                          <div>
                            <div>
                              <span>10.48%</span>
                              <img/>
                            </div>
                            <div>
                              <img/>
                              <span>5.39%</span>
                              <img/>
                            </div>
                          </div>
                        </td>
                        <td>
                          <img style="width: 12px" src="../assets/vault/arrow-bottom-two.png"/>
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>

              </div>

            </div>


          </div>
      </template>

      <script>
      import Header from "@/components/Header";
      import SwitchComponent from "@/components/Switch";
      export default {
        name: "Vault",
        components: {SwitchComponent, Header},
        data(){
          return{
            showEarn:true //广告显示
          }
        },
        methods:{
          actionEmitHeader(data) {
            this.showTab = data
            if (this.showTab === 0) {
              this.actionOpenTransfer()
            } else if (this.showTab === 1) {
              this.actionHistory()
            }
          },
        }
      }
      </script>

      <style scoped lang="less">
      @import './Vault.less';

      </style>
