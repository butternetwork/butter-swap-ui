    <template>
      <div class="home">

        <Header/>

        <div class="bridge">
          <div class="bridge-content">
            <div class="bridge-title">
              <div class="tran">
                <div @click="showTab=0" class="tran-title"><span>Transfer funds</span></div>
                <div :class="showTab==0?'tran-title-line':'tran-title-line-black'" class=""></div>
              </div>
              <div class="tran" >
                <div @click="actionHistory(showTab=1)" class="tran-title">
                  <span>History</span>
                  <img @click="actionHistory(showTab=1)"  v-show="showTab==1" src="../assets/change-round.png"/>
                </div>
                <div :class="showTab==1?'tran-title-line':'tran-title-line-black'" class=""></div>
              </div>
            </div>
            <!--              tranfer-->
            <div v-show="showTab==0">
              <!--                tran-from-->
              <div class="tran-from">
                <div class="tran-from-left">
                  <span>From</span>
                  <!--              <div @click="actionChain(0)" class="tran-from-btn">-->
                  <div class="tran-from-btn">
                    <img :src="chainForm.url"/>
                    <span>{{ chainForm.name }}</span>
                    <img src="../assets/arrow-bottom-red.png"/>
                  </div>
                </div>
                <div class="tran-from-right">Source Chain</div>
              </div>
              <!--                send-->
              <div class="tran-send">
                <div class="tran-send-top">
                  <span>Sending Amount:</span>
                  <span>Max: {{ balanceZ }}</span>
                </div>
                <div class="tran-send-bottom">
                  <input v-model="sendAmount" placeholder="0.0"/>
                  <div @click="actionShowToken()" class="tran-send-btn">
                    <img :src="selectToken.url"/>
                    <span>{{ selectToken.name }}</span>
                    <img class="tran-send-arrow-icon" src="../assets/arrow-bottom-red.png"/>
                  </div>
                </div>
              </div>
              <!--                change-->
              <div class="tran-change">
                <img src="../assets/change.png"/>
              </div>
              <!--                tran-to-->
              <div class="tran-from tran-to">
                <div class="tran-from-left">
                  <span>To  </span>
                  <!--              <div @click="actionChain(1)" class="tran-from-btn">-->
                  <div style="margin-left: 28px" class="tran-from-btn">
                    <img :src="chainTo.url"/>
                    <span>{{ chainTo.name }}</span>
                    <img src="../assets/arrow-bottom-red.png"/>
                  </div>
                </div>
                <div class="tran-from-right">Destination Chain</div>
              </div>
              <div class="tran-send">
                <div class="tran-send-top">
                  <span>Received Amount:</span>
                  <span>Received Address:</span>
                </div>
                <div class="tran-send-bottom">
                  <span>{{ sendAmount }}</span>
                  <!--                  <span>{{ receivedAmount }}</span>-->
                  <div @click="actionShowAddress()" class="tran-send-btn tran-send-btns">
                    <span class="tran-send-btn-address">{{ sortAddress }}</span>
                    <img class="tran-send-arrow-icon tran-send-arrow-icons" src="../assets/arrow-bottom-red.png"/>
                  </div>
                </div>
                <div v-show="showAddress" class="tran-send-address">
                  <span>Received Address:</span>
                  <div class="tran-send-address-input">
                    <input v-model="allAddress" placeholder="Please enter the address"/>
                    <img v-if="allAddress" @click="getInputAddress()" src="../assets/success.png"/>
                    <img v-else src="../assets/success-gray.png"/>
                  </div>
                </div>
                <div class="tran-send-fee">
                  <img src="../assets/error.png"/>
                  <span style="padding-top: 3px">Fee:0 {{selectToken.coin}}</span>
                </div>
              </div>
              <!--                connect-->
              <div class="tran-connect">
                <button v-if="!allowance && !approveHash" @click="actionApprove(selectToken.coin)">Approve</button>
                <button v-if="!allowance &&  approveHash" class="tran-connect-approve">
                  Approving... <img src="../assets/loading.gif"/>
                </button>
                <button v-if="allowance && !transferBtn" @click="actionTrans()">Transfer</button>
                <button v-if="allowance && transferBtn" class="tran-connect-approve">
                  Transfering... <img src="../assets/loading.gif"/>
                </button>
              </div>
            </div>
            <!--                history-->
            <div v-show="showTab==1" class="">
              <div class="history">
                <div v-show="historyList" v-for="(item,index) in historyList" @click="actionHistoryDetail(item)" :key="index"
                     class="history-list">
                  <div class="history-top">
                    <div class="history-coin">
                      <img :src="item.fromLogo"/> <span>{{item.fromChainName}}</span>
                      <img src="../assets/tranform.png"/>
                      <img :src="item.toLogo"/> <span>{{item.toChainName}}</span>
                    </div>
                    <div v-if="item.state==0" class="history-status history-status-cancel">
                      <span>Pending</span>
                      <img src="../assets/arrow-right-yellow.png"/>
                    </div>
                    <div v-else-if="item.state==1" class="history-status history-status-success">
                      <span>Complete</span>
                      <img src="../assets/arrow-right-green.png"/>
                    </div>
                    <div v-else-if="item.state==2" class="history-status">
                      <span>Failed</span>
                      <img src="../assets/arrow-right-red.png"/>
                    </div>
                    <div v-else class="history-status history-status-cancel">
                      <span>Processing</span>
                      <img src="../assets/arrow-right-yellow.png"/>
                    </div>
                  </div>
                  <div class="history-bottom">
                    <span>{{ item.amount }} {{ item.coin }}</span>
                    <span>{{ item.updatedAt }}</span>
                  </div>
                </div>
                <div>
                  <div v-if="historyList && historyList.length>0" class="home-page">
                    <div :class="currentPage==1?'btn-pre':'btn-next'" @click="prePage()" class="">
                      <button>Previous</button>
                    </div>
                    <div>
                      <span style="color:#E44E3A ">{{ currentPage }}</span>/{{ pageNum }}
                    </div>
                    <div :class="currentPage==pageNum?'btn-pre':'btn-next'" @click="nextPage()" class="">
                      <button>Next</button>
                    </div>
                  </div>
                  <div v-else class="home-page-not">
                    No data
                  </div>
                </div>

                <div class="history-ant">
                  <!--              <img src="../assets/ant.png"/>-->
                  <!--              <span>In the end</span>-->
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer/>

        <!--        选择链-->
        <div v-show="showSelectChain" class="dialog-selectChain">
          <div class="dialog-content">
            <div class="dialog-selectChain-title">
              <span>Select Source Chain</span>
              <img @click="showSelectChain=false" src="../assets/cancel.png"/>
            </div>
            <div class="dialog-selectChain-search">
              <img src="../assets/search.png"/>
              <input v-model="searchVal" placeholder="Search chain by name or chain ID">
            </div>
            <div class="dialog-selectChain-coin">
              <div v-for="(item,index) in listChain" :key="index" @click="handleLink(item,index)" class="dialog-Chain-coin">
                <div class="dialog-selectChain-coin-content">
                  <img :src="item.url"/>
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--        选择token-->
        <div v-show="showSelectToken" class="dialog-selectChain">
          <div class="dialog-content">
            <div class="dialog-selectChain-title">
              <span>Select a token</span>
              <img @click="showSelectToken=false" src="../assets/cancel.png"/>
            </div>
            <div class="dialog-selectChain-search">
              <img src="../assets/search.png"/>
              <input  v-model="searchToken" placeholder="Search token by name or address">
            </div>
            <div class="dialog-token">
              <div v-for="(item,index) in listToken" :key="index" @click="actionSelectToken(item,index)"
                   class="dialog-token-content">
                <div class="dialog-token-contentlist">
                  <div class="dialog-token-detail">
                    <div class="dialog-token-detail-left">
                      <img :src="item.url"/>
                      <div class="dialog-token-detail-left-text">
                        {{ item.name }}
                        <span> {{ item.coin }}</span>
                      </div>
                    </div>
                    <div class="dialog-token-detail-left-right">{{ item.amount }} {{ item.coin }}</div>
<!--                    <div v-else class="dialog-token-loading">-->
<!--                      <img style="width:30px" src="../assets/loading2.gif"/>-->
<!--                    </div>-->
                  </div>
                  <div class="dialog-token-content-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--        交易详情-->
        <div v-show="showTranDetail" class="dialog-selectChain">
          <div class="dialog-content dialog-content-trans">
            <div class="dialog-selectChain-title">
              <span>Transaction Detail</span>
              <img @click="closeHistoryList()" src="../assets/cancel.png"/>
            </div>
            <div class="dialog-trans-detail-line"></div>
            <div class="dialog-content-trans-detail">
              <!--            sending-->
              <div class="dialog-trans-detail">
                <div class="dialog-trans-detail-left">Sending</div>
                <div class="dialog-trans-detail-right">
                  <span>{{historyDetailList.sending}} {{historyCoin}}</span>
                  <span>{{historyDetailList.from}}</span>
                </div>
              </div>
              <!--            receiving-->
              <div class="dialog-trans-detail">
                <div class="dialog-trans-detail-left">Receiving</div>
                <div class="dialog-trans-detail-right">
                  <span v-if="historyDetailList.receiving">{{ historyDetailList.receiving }}  {{historyCoin}}</span>
                  <span v-else>Processing</span>
                  <span>{{historyDetailList.to}}</span>
                </div>
              </div>
              <!--            fee-->
              <div class="dialog-trans-detail">
                <div class="dialog-trans-detail-left">Fee</div>
                <div class="dialog-trans-detail-right">
                  <span v-if="historyDetailList.receiving" class="dialog-trans-detail-fee">{{historyDetailList.sending - historyDetailList.receiving}}  {{historyCoin}}</span>
                  <span v-else>Processing</span>
                </div>
              </div>
              <!--            status-->
              <div class="dialog-trans-detail">
                <div class="dialog-trans-detail-left">Status</div>
                <div class="dialog-trans-detail-rights">
                  <div class="dia-trans">
                    <div class="dia-trans-top">
                      <img v-if="historyDetailList.confirmHeight>0" src="../assets/dialog/success-red.png"/>
                      <img v-else src="../assets/dialog/success-write.png"/>
                      <div class="dia-trans-top-icon">
                        <img src="../assets/eth-icon.png"/>
                        <span>Ethereum</span>
                      </div>
                    </div>
                    <div class="dia-trans-bottom dia-trans-bottoms">
                      <div>
                        <img v-if="historyDetailList.confirmHeight==6" class="dia-trans-bottom-arrow" src="../assets/dialog/line-red.png"/>
                        <img v-else  class="dia-trans-bottom-arrow" src="../assets/dialog/line-write.png"/>
                      </div>
                      <div class="dia-trans-bottom-progress">
                        <span @click="goEth()">{{historyDetailList.confirmHeight}}/6 confirmed <img src="../assets/dialog/send.png"/> </span>
                        <div class="dia-transStatus-content-bottom">
                          <div class="dia-transStatus-content-bottom-bg" :style="{width:historyDetailList.confirmHeight/6*100+'%'}"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="dia-trans dia-trans-two">
                    <div class="dia-trans-top">
                      <div>
                        <img v-if="historyDetailList.transferInHeight>0" src="../assets/dialog/success-red.png"/>
                        <img v-else src="../assets/dialog/success-write.png"/>
                      </div>
                      <div class="dia-trans-top-icon">
                        <img src="../assets/token/map.png"/>
                        <span>MAP Protocol</span>
                      </div>
                    </div>
                    <div class="dia-trans-bottom dia-trans-bottoms">
                      <div>
                        <img v-if="historyDetailList.transferInHeight==6" class="dia-trans-bottom-arrow" src="../assets/dialog/line-red.png"/>
                        <img v-else class="dia-trans-bottom-arrow" src="../assets/dialog/line-write.png"/>
                      </div>
                      <div class="dia-trans-bottom-progress">
                        <span @click="goMap()">{{historyDetailList.transferInHeight}}/6 confirmed <img style="width: 12px" src="../assets/dialog/send.png"/> </span>
                        <div class="dia-transStatus-content-bottom">
                          <div class="dia-transStatus-content-bottom-bg" :style="{width:historyDetailList.transferInHeight/6*100+'%'}"></div>
                        </div>
                      </div>
                    </div>
                  </div>
               <!--   <div class="dia-trans dia-trans-two">
                    <div class="dia-trans-top">
                      <img src="../assets/dialog/success-write.png"/>
                      <div class="dia-trans-top-icon">
                        <img src="../assets/polygon.png"/>
                        <span>Polygon (Matic)</span>
                      </div>
                    </div>
                    <div class="dia-trans-bottom">
                      <img src="../assets/dialog/line-write.png"/>
                      <div class="dia-trans-bottom-progress">
                        <span>0/12 confirmed</span>
                        <div class="dia-transStatus-content-bottom">
                          <div class="dia-transStatus-content-bottom-bg" :style="{width:'0'+'%'}"></div>
                        </div>
                      </div>
                    </div>
                  </div> -->
                  <div class="dia-trans dia-trans-three">
                    <div class="dia-trans-top">
                      <img v-if="historyDetailList.confirmHeight==6 && historyDetailList.transferInHeight==6" src="../assets/dialog/success-red.png"/>
                      <img v-else src="../assets/dialog/success-write.png"/>
                      <div class="dia-trans-top-icon">
                        <span>Complete</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </template>

    <script>

    import Header from "@/components/Header";
    import Footer from "@/components/Footer";
    import Decimal from 'decimal.js'

    import BN from 'bn.js'

    const tokenAbi = require('@/config/token_abi.json');
    const mapAbi = require('@/config/mapData.json');
    import config from '@/config/base'


    export default {
      name: "Home.vue",
      components: {Footer, Header},
      data() {
        return {
          ethLine:'100',
          mapLine:'30',
          totalPage: [],//所有页面的数
          pageSize: 3, //每页显示数量
          pageNum: 1, //共几页
          currentPage: 1,//默认当前显示第一页
          total: 0,

          selectChain: -1,
          showSelectToken: false,//选择token
          showSelectChain: false,//选择链
          showTab: 0, //tab切换
          showAddress: false,//显示to地址
          showTranDetail: false,
          chainList: [
            {
              url: require('../assets/token/map.png'),
              name: 'MAP',
              path: '/home/map',
              coin: 'MAP',
              chainId: '22776'
            },
            {
              url: require('../assets/eth-icon.png'),
              name: 'Ethereum Mainnet',
              path: '/home/eth',
              coin: 'ETH',
              chainId: '1'
            },
            {
              url: require('../assets/binance.png'),
              name: 'Binance Smart Chain',
              path: '/home/binance',
              coin: 'BSC',
              chainId: '97'
            },
          ],//链列表
          chainForm: {
            name: 'Ethereum Mainnet',
            url: require('../assets/eth-icon-gray.png'),
            coin: 'ETH'
          },  //From Chain选择
          chainTo: {
            name: 'Makalu Testnet',
            url: require('../assets/token/map.png'),
            coin: 'MAP',
            chainId: '22776'
          }, //To Chain 选择
          selectToken: {
            name: 'MAP',
            coin: 'MAP',
            url: require('../assets/token/map-black.png')
          },// 选择Token
          tokenList: [
            {
              url: require('../assets/token/map-black.png'),
              name: 'MAP Protocol',
              coin: 'MAP',
              amount: '0.0',
              address:'0x9E976F211daea0D652912AB99b0Dc21a7fD728e4',
            },
            // {
            //   url: require('../assets/token/tether.png'),
            //   name: 'Tether USD',
            //   coin: 'USDT',
            //   amount: '0.0',
            //   address:'0xdac17f958d2ee523a2206206994597c13d831ec7',
            // },
            {
              url: require('../assets/token/usd.png'),
              name: 'USD Coin',
              coin: 'USDC',
              amount: '0.0',
              address:'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            },
            {
              url: require('../assets/token/idv.png'),
              name: 'Idavoll Network',
              coin: 'IDV',
              amount: '0.0',
              address:'0x92ec47df1aa167806dfa4916d9cfb99da6953b8f',
            },
            // {
            //   url: require('../assets/eth-icon.png'),
            //   name: 'ETH',
            //   coin: 'ETH',
            //   amount: '0.0',
            //   address:'0x0000000000000000000000000000000000000000',
            // },
          ],//Token列表
          historyList: [],//history记录
          historyFromLogo: '', //历史记录 From logo
          historyToLogo: '',//历史记录 To logo

          sourcePath: 'eth',//formChain
          tokenCoin: 'usdc',//token
          destNetwork: 'map',//toChain
          balanceZ: 0,//Token的余额
          sendAmount: '',//From发送价格
          sendAllAmount: '',//From价格*10*18
          receivedAmount: 0.0,//To兑换获得的价格,
          searchVal: '',  //弹窗链查找默认输入为空
          searchToken:'',//弹窗 Token查找
          sortAddress: '',//短地址
          langAddress: '',//全部地址
          allAddress: '',//输入的地址
          allowance: false,
          langToAddress: '',//To到的长地址
          approveHash: '',//approveHash
          transHash: '',//transHash
          timer: '',
          historyDetailList:'',//历史记录详情
          setTimeHistory:null,
          historyHash: '',//查看历史详情传的数据
          historyCoin:'',//历史单位

          transferBtn:false,
          checkApproveToken:''
        }
      },
      watch: {
        //检测到获取了地址
        account_default_address() {
          this.getAllData()
        }
      },
      computed: {
        listChain() {
          var _this = this;
          //逻辑-->根据input的value值筛选goodsList中的数据
          if (!_this.isNumber(_this.searchVal)){
            var arrByZM = [];//声明一个空数组来存放数据
            for (var i = 0; i < _this.chainList.length; i++) {
              //for循环数据中的每一项（根据name值）
              if (_this.chainList[i].name.search(_this.searchVal) != -1) {
                //判断输入框中的值是否可以匹配到数据，如果匹配成功
                arrByZM.push(_this.chainList[i]);
                //向空数组中添加数据
              }
            }
          }
          else  {
            var arrByZM = [];//声明一个空数组来存放数据
            for (var i = 0; i < _this.chainList.length; i++) {
              //for循环数据中的每一项（根据name值）
              if (_this.tokenList[i].chainId.search(_this.searchVal) != -1) {
                //判断输入框中的值是否可以匹配到数据，如果匹配成功
                arrByZM.push(_this.chainList[i]);
                //向空数组中添加数据
              }
            }
          }

          //逻辑-->升序降序排列 false: 默认从小到大 true：默认从大到小
          //判断，如果要letter不为空，说明要进行排序
          // if(this.letter != ''){
          //   arrByZM.sort(function( a , b){
          //     if(_this.original){
          //       return b[_this.letter] - a[_this.letter];
          //     }else{
          //       return a[_this.letter] - b[_this.letter];
          //     }
          //   });
          // }
          //一定要记得返回筛选后的数据
          return arrByZM;
        },
        listToken() {
          var _this = this;
          //逻辑-->根据input的value值筛选goodsList中的数据
          var inputContent= _this.searchToken.substring(0,2)
          // console.log(inputContent)
          if(inputContent!=='0x') {
            var arrByZM = [];//声明一个空数组来存放数据
            for (var i = 0; i < _this.tokenList.length; i++) {
              //for循环数据中的每一项（根据name值）
              if (_this.tokenList[i].name.search(_this.searchToken) != -1) {
                //判断输入框中的值是否可以匹配到数据，如果匹配成功
                arrByZM.push(_this.tokenList[i]);
                //向空数组中添加数据
              }
            }
          }
          else {
            var arrByZM = [];//声明一个空数组来存放数据
            for (var i = 0; i < _this.tokenList.length; i++) {
              //for循环数据中的每一项（根据name值）
              if (_this.tokenList[i].address.search(_this.searchToken) != -1) {
                //判断输入框中的值是否可以匹配到数据，如果匹配成功
                arrByZM.push(_this.tokenList[i]);
                //向空数组中添加数据
              }
            }
          }


          //逻辑-->升序降序排列 false: 默认从小到大 true：默认从大到小
          //判断，如果要letter不为空，说明要进行排序
          // if(this.letter != ''){
          //   arrByZM.sort(function( a , b){
          //     if(_this.original){
          //       return b[_this.letter] - a[_this.letter];
          //     }else{
          //       return a[_this.letter] - b[_this.letter];
          //     }
          //   });
          // }
          //一定要记得返回筛选后的数据
          return arrByZM;
        },
        account_default_address() {
          return this.$store.state.account.default_address
        },
      },
      created() {
      },
      methods: {
        goEth() {
          if (this.historyDetailList.confirmHeight>0) {
            window.open(`https://ropsten.etherscan.io/tx/${this.historyDetailList.fromHash}`,'blank')
          }

        },

        goMap() {
          if (this.historyDetailList.transferInHeight>0) {
            window.open(`https://makalu.mapscan.io/tx/${this.historyDetailList.transferInHash}`,'blank')
          }

        },

        //判断是否是数组
        isNumber(value) {         //验证是否为数字
          var patrn = /^(-)?\d+(\.\d+)?$/;
          if (patrn.exec(value) == null || value == "") {
            return false
          } else {
            return true
          }
        },

        //打开Token弹窗
        async actionShowToken() {

          let v = this
          v.showSelectToken = true
          // console.log('======',v.showSelectToken)
          var chainName;

          //链名字的币种
          chainName = v.chainForm.coin

          //获取地址
          for (let item of v.tokenList) {
            // console.log("Coin   ", item, chainName)
            //如果当前链的币种是选择链上的主币   获取主币余额
            if (item.coin == chainName) {
              this.getBalance(item)
            }
            //代币余额
            else {

              let token_address = config.TOKENS.ETH[item.coin];
              // item.amount = '0.00';
              // console.log('token-Address', token_address, item)
              if (!token_address) {
                continue;
              }
              this.getTokenBalance(item)
            }
          }
        },

        //获取主币余额
        async getBalance(item){
          let v = this
          var local_address = await v.action.getAddress()
          v.myWeb3.eth.getBalance(local_address).then(result => {
            // item.amount = '0.00'
            if (result) {
              item.amount = new Decimal(result).div(Math.pow(10, 18)).toFixed(6)
            }
            // console.log('Main币的余额', item.amount)
          })
        },
        async getTokenBalance(item){
          let v = this
          let token_address = config.TOKENS.ETH[item.coin];
          var local_address = await v.action.getAddress()
          //创建合约
          let contract = new v.myWeb3.eth.Contract(tokenAbi, token_address)
          // console.log('contract',contract)
          //查询代币余额
          let balance = await contract.methods.balanceOf(local_address).call();
          // console.log('代币余额', balance)
          //获取代币精度
          let decimals = await contract.methods.decimals().call()
          // console.log(decimals, 'decimals')
          this.decimals = decimals
          if (balance) {
            item.amount = new Decimal(balance).div(Math.pow(10, decimals))
            item.amount = Math.floor( item.amount * 1000000) /1000000
            // if (item.amount==0){
            //   item.amount = '0.00';
            // }
          }
        },


        //选择Token
        async actionSelectToken(item, index) {
          const chainName = this.chainForm.coin
          // console.log('actionSelectToken', index, item)
          // console.log('========', chainName, item.coin)
          let path = item.coin;
          switch (index) {
            case 0:
              path = 'USDT';
              break;
            case 1:
              path = 'USDC';
              break;
            case 2:
              path = 'MAP';
              break;
          }

          this.tokenCoin = path
          this.selectToken.name = item.name
          this.selectToken.url = item.url
          this.selectToken.coin = item.coin


          var chain = this.chainForm.coin
          console.log('item.coin',config.TOKENS[chain][this.selectToken.coin])

          // this.selectToken. = item.

          this.balanceZ = item.amount


          this.showSelectToken = false

          // let approvedResult = await this.checkApproved(this.selectToken.coin);
          // this.allowance = approvedResult;
          this.actionApproveOrTransfer()

          this.$router.push({
            path: '/',
            query: {token: this.tokenCoin, sourceNetwork: this.sourcePath, destNetwork: this.destNetwork}
          })


        },

        //判断按钮Approve还是Trans
        async actionApproveOrTransfer() {


          //判断选择的Token是否是代币

          const chainName = this.chainForm.coin
          // console.log('Chain-Token', chainName, this.selectToken.coin)

          // 是主币
          if (chainName === this.selectToken.coin) {
            return;
          }

          //是代币
          let approvedResult = await this.checkApproved(this.selectToken.coin);
          this.allowance = approvedResult;
          this.approveHash = '';
          //
          // if (approvedResult) {
          //   console.log('Approved')
          //   return
          // } else {
          //   console.log('not Approved')
          //   let actionApproveResult = await this.actionApprove(this.selectToken.coin);
          // }

          return;

        },

        //发送Transfer交易
        async actionTrans() {
          let v = this
          let reward_address = config.mapAddress
          var local_address = await v.action.getAddress()
          console.log('local_address', local_address)

          //判断输入金额是否大于0

          if (!v.sendAmount) {
            v.$toast('Please enter the amount')
            return
          }

          //当前链
          var chain = v.chainForm.coin
          console.log('chain', chain)

          //当前选择Token
          var TokenAddress = config.TOKENS[chain][v.selectToken.coin]
          console.log('TokenAddress', TokenAddress)


          //decimal
          var chainId = await v.action.getChainId()
          chainId = chainId.substr(2)

          var token = config.tokenList[chainId].list

          var decimal;

          token.forEach((i,k) => {
            if (i.contract.toLowerCase()==TokenAddress.toLowerCase()) {
              decimal= i.decimal
              return
            }
          })

          console.log('decimal==',decimal)

          let stakeNum = new Decimal(v.sendAmount).mul(Math.pow(10, decimal))
          console.log('stakeNum', stakeNum)
          let bl = new Decimal(v.balanceZ).mul(Math.pow(10, decimal));



          if (stakeNum.comparedTo(bl) > 0) {
            v.$toast('Insufficient balance')
            return
          }


          //输入的金额
          v.sendAllAmount = new Decimal(v.sendAmount).mul(Math.pow(10, decimal))
          console.log('amount', v.sendAllAmount.toFixed())

          //To的链Id
          var chainId = '22776'
          console.log('chainid', chainId)


          //To地址
          // if (v.allAddress) {
          //   v.langToAddress = v.allAddress
          // } else {
          //   v.langToAddress = v.langAddress
          // }

          console.log('ToAddress', v.langToAddress)


          //调用合约执行
          let reward_contract = new v.myWeb3.eth.Contract(mapAbi, reward_address)
          console.log('reward_contract', reward_contract)


          const reward_stakeData = reward_contract.methods.transferOutToken(TokenAddress, v.langToAddress, v.sendAllAmount.toFixed(), chainId).encodeABI()
          console.log('reward_stakeData', reward_stakeData)


          //报错
          var error;
          try {
            var gas = await v.myWeb3.eth.estimateGas({
              from: local_address,
              to: reward_address,
              data: reward_stakeData
            })
          } catch (e) {
            let result = e.message.substring(e.message.indexOf("{"))
            error = JSON.parse(result).message
            console.log('error', error)
            this.$toast(error)
          }
          console.log('gas', gas)
          if (error) {
            return
          }


          //
          const rewardReceipt = await v.myWeb3.eth.sendTransaction({
            from: local_address,
            to: reward_address,
            data: reward_stakeData
          }).on('transactionHash', function (hash) {
            v.transHash = hash
            v.transferBtn = true
            v.actionSubBridge()
            console.log(`hash`, hash)
            v.$toast('Transaction has send please wait result')
          }).on('receipt', function (receipt) {
            //receipt 成功
            v.transferBtn = false
            console.log(`result`, receipt)
          }).on('error', function (receipt) {
            //receipt 失败
            console.log(`error`, receipt)
          })
          console.log('rewardReceipt', rewardReceipt);
          this.getAllData()
        },

        //交易成功后 给后端传数据
        async actionSubBridge() {
          let v = this

          var local_address = await v.action.getAddress()

          var chain = v.chainForm.coin

          //获取当前链ID
          var fromChain = await v.action.getChainId()
          console.log('Chain',fromChain)
          fromChain = new BN(fromChain.slice(2), 16)
          console.log('fromChain',(fromChain))

          // console.log('Token========',config.TOKENS[chain][v.selectToken.coin])


          var params = {
            contract: config.mapAddress,//合约地址
            from: local_address, //from地址
            to: v.langToAddress, //to 地址
            tokenAddress: config.TOKENS[chain][v.selectToken.coin],//代币地址
            amount: v.sendAllAmount,//数量
            fromChainid:fromChain,
            toChainid: '22776', //目标链ChainId
            hash: v.transHash  //hash
          }
          let result = v.$http.getSubBrigge(params)
          if (result.code == 200) {
          }

        },


        //获取历史记录
        async actionHistory() {
          let v = this
          var local_address = await v.action.getAddress()
          var params = {
            address: local_address,
            pageNo: v.currentPage,
            pageSize: v.pageSize,
          }
          var result = await v.$http.historyList(params)
          // console.log(result)
          if (result.code == 200) {
            v.historyList = result.data.list
            v.total = result.data.total
            v.pageNum = Math.ceil(v.total / v.pageSize) || 1;
            // console.log('hisTory', v.historyList)


            for (const item of v.historyList) {
              var newObject = {}
              var fromChainId = item.fromChainid
              var toChainId = item.toChainid


              //FromChainId  对应的logo
              if (fromChainId == 3) {
                newObject.fromLogo = require('../assets/eth-icon.png')
                newObject.fromChainName ='ETH'
              }
              else if (fromChainId == 1) {
                newObject.fromLogo = require('../assets/eth-icon.png')
                newObject.fromChainName ='ETH'
              }
              else if (fromChainId == 22776) {
                newObject.fromLogo = require('../assets/token/map.png')
                newObject.fromChainName ='MAP'
              }

              // console.log('fromLogo', item.fromLogo)

              //ToChainId 对应的logo

              if (toChainId == 3) {
                newObject.toLogo = require('../assets/eth-icon.png')
                newObject.toChainName ='ETH'
              }
              else if (toChainId == 1) {
                newObject.toLogo = require('../assets/eth-icon.png')
                newObject.toChainName ='ETH'
              }
              else if (toChainId == 22776) {
                newObject.toLogo = require('../assets/token/map.png')
                newObject.toChainName ='MAP'
              }

              // console.log('amount', item.amount)


              //token地址
              // item.tokenAddress
              var chainId = await v.action.getChainId()
              chainId= chainId.substr(2)
              // console.log('chainId', chainId)


              var token=config.tokenList[chainId].list

              token.forEach((i,k) => {
                // console.log("i.contract",i.contract)
                if (i.contract.toLowerCase()==item.tokenAddress.toLowerCase()) {
                  newObject.coin= i.name

                  var decimal = i.decimal
                  console.log('decimal',decimal)

                  //余额
                  newObject.amount = new Decimal(item.amount).div(Math.pow(10, decimal)).toFixed()

                  return
                }
              })

              // console.log('newObject',newObject)

              Object.assign(item, newObject)

            }
            // console.log('historyList', v.historyList)

          }
        },


        //获取历史详情
       async actionHistoryDetail(item) {
          let v = this
          v.showTranDetail=true

          v.historyHash= item.hash
          v.historyCoin= item.coin

          var result = await v.$http.historyDetail({txHash: v.historyHash})
          // console.log(result)
          if (result.code==200) {
            v.historyDetailList = result.data
            // v.historyDetailList.sending = new Decimal(v.historyDetailList.sending).div(Math.pow(10, 18))
            v.historyDetailList.sending = new Decimal(v.historyDetailList.sending).div(Math.pow(10, v.historyDetailList.fromDecimal))
            v.historyDetailList.receiving =   v.historyDetailList.receiving ? new Decimal(v.historyDetailList.receiveDecimal).div(Math.pow(10, v.historyDetailList.decimal)) :  null
            //高度
            if (v.historyDetailList.confirmHeight) {
              v.historyDetailList.confirmHeight=(v.historyDetailList.confirmHeight - v.historyDetailList.fromHeight)>6 ? 6 : (v.historyDetailList.confirmHeight - v.historyDetailList.fromHeight)
            }
            else  {
              v.historyDetailList.confirmHeight=0
            }

            //
            if (v.historyDetailList.transferInConfirmHeight) {
              v.historyDetailList.transferInHeight=(v.historyDetailList.transferInConfirmHeight - v.historyDetailList.transferInHeight)>6 ? 6 : (v.historyDetailList.transferInConfirmHeight - v.historyDetailList.transferInHeight)
            }
            else  {
              v.historyDetailList.transferInHeight=0
            }
          }

         v.setTimeHistory= setInterval(() =>{
           v.refersHistoryDetail()
         },2000)
         // console.log(v.setTimeHistory)

        },

        //重新调取历史详情
       async refersHistoryDetail() {
         let v = this
          var result = await v.$http.historyDetail({txHash:v.historyHash})
          // console.log(result)
          if (result.code==200) {
            v.historyDetailList = result.data

            v.historyDetailList.sending = new Decimal(v.historyDetailList.sending).div(Math.pow(10, v.historyDetailList.fromDecimal))
            v.historyDetailList.receiving =   v.historyDetailList.receiving ? new Decimal(v.historyDetailList.receiving).div(Math.pow(10, v.historyDetailList.receiveDecimal)) :  null
            //高度
            if (v.historyDetailList.confirmHeight) {
              v.historyDetailList.confirmHeight=(v.historyDetailList.confirmHeight - v.historyDetailList.fromHeight)>6 ? 6 : (v.historyDetailList.confirmHeight - v.historyDetailList.fromHeight)
            }
            else  {
              v.historyDetailList.confirmHeight=0
            }

            //
            if (v.historyDetailList.transferInConfirmHeight) {
              v.historyDetailList.transferInHeight=(v.historyDetailList.transferInConfirmHeight - v.historyDetailList.transferInHeight)>6 ? 6 : (v.historyDetailList.transferInConfirmHeight - v.historyDetailList.transferInHeight)
            }
            else  {
              v.historyDetailList.transferInHeight=0
            }

            // if((v.historyDetailList.confirmHeight - v.historyDetailList.fromHeight)>=6 && v.historyDetailList.transferInConfirmHeight - v.historyDetailList.transferInHeight>=6) {
            //   clearInterval(v.setTimeHistory)
            //   v.setTimeHistory=null
            // }
            if (result.data.state==1) {
                clearInterval(v.setTimeHistory)
                v.setTimeHistory=null
            }

          }



        },

        //关闭历史详情
        closeHistoryList() {
          this.showTranDetail=false
          this.actionHistory()
          clearInterval(this.setTimeHistory)
          this.setTimeHistory=null;
        },

        //获取地址
        async getSortAddress() {
          this.sortAddress = await this.action.getSortAddress()
          this.langToAddress = await this.action.getAddress()
        },



        //获取代币余额
        async getZbalance() {
          let v = this
          // let balance = v.myWeb3.eth.getBalance(local_address).then(result => {
          //   console.log(result)
          //
          //   v.balanceZ = new Decimal(result).div(Math.pow(10, 18)).toFixed(6)
          // })
          // console.log('主币余额', balance)

          if (!v.myWeb3) {
            return
          }

          //创建合约

          let token_address = config.tokenCoin
          var local_address = await v.action.getAddress()

          // console.log('token_address  local_address',token_address,local_address)
          let contract = new v.myWeb3.eth.Contract(tokenAbi, token_address)
          // console.log('contract',contract)
          let balance = await contract.methods.balanceOf(local_address).call();
          console.log('balance', balance)
          //获取代币精度
          let decimals = await contract.methods.decimals().call()
          console.log(decimals,'decimals')
          this.decimals = decimals
          if(balance){
            this.balanceZ = new Decimal(balance).div(Math.pow(10, decimals))
            this.balanceZ=Math.floor(this.balanceZ * 1000000) /1000000
          }
        },


        //切换链
        handleLink(item, index) {
          var v = this
          // console.log(index)
          let path;
          let chain;

          //路由判断
          switch (index) {
            case 0:
              path = 'map';
              chain = '0x58f8';//map
              break;
            case 1:
              path = 'eth';
              chain = '0x100';//火币 TextChain
              break;
            case 2:
              path = 'bsc';
              chain = '0x61'//bsc TextChain
              break;
            case 3:
              path = 'arbitrum';
              chain = '0xa4b1'
              break;
            case 4:
              path = 'xDai';
              chain = '0x64'
              break;
          }

          this.$router.push({
            path: '/',
            query: {token: this.tokenCoin, sourceNetwork: this.sourcePath, destNetwork: this.destNetwork}
          })


          //To 选择
          if (this.selectChain == 1) {
            this.destNetwork = path
            this.chainTo.name = item.name
            this.chainTo.url = item.url
            v.showSelectChain = false
            return
          }

          //From 切换链
          window.ethereum &&
          window.ethereum
              .request({
                method: 'wallet_switchEthereumChain',
                params: [
                  {
                    chainId: chain
                  },
                ],
              })
              .then(() => {
                // console.log('Change Success')
                //切换网络
                if (this.selectChain == 0) {
                  this.sourcePath = path
                  this.chainForm.name = item.name
                  this.chainForm.url = item.url

                }
                v.showSelectChain = false

              })
              .catch((e) => {
                console.log(e)
              })
        },

        //打开选择链弹窗
        actionChain(i) {
          this.showSelectChain = true
          if (i == 0) {
            this.selectChain = 0
          } else if (i == 1) {
            this.selectChain = 1
          }
        },

        //显示地址
       async actionShowAddress() {
          this.showAddress = true
        },

        //输入地址填写
        async getInputAddress() {
          let v = this
          v.sortAddress = v.allAddress.substr(0, 9) + '...' + v.allAddress.substr(38)
          this.langToAddress=v.allAddress
          v.showAddress = false
        },

        //approve
        async actionApprove(token) {
          console.log('token', token)
          // if (this.balance<=0) {
          //   this.$toast('Insufficient balance')
          //   return
          // }
          let v = this
          //当前链
          var chain = this.chainForm.coin
          let reward_address = config.mapAddress
          let token_address = config.TOKENS[chain][token]
          var local_address = await v.action.getAddress()
          console.log('configtoken', config.TOKENS[chain][token])
          // if (config[tokenAddress] === undefined) {
          //   this.$toast('Token Undefined')
          //   return ;
          // }

          //approve
          let contract = new v.myWeb3.eth.Contract(tokenAbi, token_address)
          const approveData = contract.methods.approve(reward_address, '1000000000000000000000000000').encodeABI();
          console.log('approvedata', approveData)

          return new Promise(async resolve => {

            //报错
            let error = null;
            try {
              await v.myWeb3.eth.estimateGas({
                from: local_address,
                to: token_address,
                data: approveData
              })
            } catch (e) {
              let result = e.message.substring(e.message.indexOf("{"))
              error = JSON.parse(result).message
              this.$toast(error)
            }
            if (error) {
              resolve(false);
            }

            v.myWeb3.eth.sendTransaction({
              from: local_address,
              to: token_address,
              value: 0,
              data: approveData
            }).on('transactionHash', function (hash) {
              //hash
              console.log(`hash: ` + hash)
              v.$toast('Transaction has send please wait result')
              v.approveHash = hash;
              v.checkApproveToken = token
              v.timer = setInterval(v.checkApproved, 1000);
              //server order
            }).on('receipt', function (receipt) {
              //receipt
              console.log(receipt)
              resolve(true);
            }).on('error', function (receipt) {
              //receipt
              console.log(receipt)
              resolve(false);
            })
          })

        },

        //检查是否approve
        async checkApproved(token) {

          let v = this
          if(!v.myWeb3){
            return
          }
           token = token?token: v.checkApproveToken
          console.log('Token',token)
          var chain = this.chainForm.coin


          if (config.TOKENS[chain][token] === '') {
            return false;
          }

          var local_address = await v.action.getAddress()

          let contract = new v.myWeb3.eth.Contract(tokenAbi, config.TOKENS[chain][token])
          // console.log(`rewardaddress`, config.mapAddress)
          contract.methods.allowance(local_address, config.mapAddress).call(function (error, result) {
            if (result != 0) {
              v.allowance = true;
              //清空检测事件
              v.approveHash = '';
              v.checkApproveToken = ''
              clearInterval(v.timer);
            }
          });



          // let v = this
          //   var tokenAddress = token
          //   console.log(`check approving`)
          //
          //   // if (config[tokenAddress] === undefined) {
          //   //   this.$toast('Token Undefined')
          //   //   return false;
          //   // }
          //   var chain = this.chainForm.coin
          //
          //   var local_address = await v.action.getAddress()
          //
          //   console.log('TokenAddress', config.TOKENS[chain][tokenAddress])
          //   let contract = new v.myWeb3.eth.Contract(tokenAbi, config.TOKENS[chain][tokenAddress])
          //   console.log(`rewardaddress`, config.mapAddress)
          //   try {
          //     contract.methods.allowance(local_address, config.mapAddress).call(function (error, result) {
          //       console.log('contrantCheckApproved', result)
          //       if (error) {
          //         resolve(false);
          //       } else if (result == 0) {
          //         resolve(false);
          //       } else {
          //         v.allowance = true;
          //         //清空检测事件
          //         v.approveHash = '';
          //         clearInterval(v.timer);
          //         resolve(true);
          //       }
          //
          //     });
          //   } catch (e) {
          //     console.log("CheckApprove", e)
          //     resolve(false);
          //   }

        },


        //下一页
        nextPage() {
          if (this.currentPage === this.pageNum) return
          this.currentPage = this.currentPage + 1;
          this.actionHistory();
        },
        //上一页
        prePage() {
          if (this.currentPage === 1) return;
          this.currentPage = this.currentPage - 1
          this.actionHistory()

        },

        async getAllData() {
          let approvedResult = await this.checkApproved(this.selectToken.coin);
          console.log('approvedResult', approvedResult)
          this.allowance = approvedResult;
          this.getSortAddress()
          this.getZbalance()
          // this.actionHistory()
        },
      },

      beforeDestroy() {
          clearInterval(this.setTimeHistory);
          this.setTimeHistory=null;
      },
      mounted() {
        this.getAllData()
      },
    }
    </script>

    <style scoped lang="less">


    .bridge {
      padding-top: 61px;
      padding-bottom: 64px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #f8f8f8;
    }

    .bridge-content {
      width: 622px;
      border-radius: 30px;
      border-radius: 30px;
      background: white;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      box-sizing: border-box;
      padding: 32px;
    }

    .bridge-title {
      width: 100%;
      //font-family: Poppins;
      font-size: 24px;
      font-weight: 600;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .tran {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .tran-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 22px;

      span {
        cursor: pointer;
      }

      img {
        margin-left: 20px;
        width: 29px;
        cursor: pointer;
      }
    }

    .tran-title-line-black {
      margin-top: 19px;
      width: 100%;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .tran-title-line {
      margin-top: 18px;
      width: 100%;
      height: 3px;
      border-radius: 6.5px;
      background-color: #e44e3a;
    }


    //tran

    .tran-from {
      padding-top: 41px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .tran-to {
      padding-top: 19px;
    }

    .tran-from-left {
      //font-family: Poppins;
      font-size: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .tran-from-btn {
      border: solid 1px #e44e3a;
      padding: 7px 16px 6px 11px;
      margin-left: 9px;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 0.1);
      cursor: pointer;

      img {
        width: 26px;
      }

      span {
        padding: 0 10px;
      }

      img:nth-child(3) {
        width: 12px;
      }
    }

    .tran-from-right {
    }

    .tran-send {
      margin-top: 15px;
      border-radius: 12px;
      background-color: rgba(0, 0, 0, 0.05);
      //padding: 15px 12px;
      padding: 30px 30px 25px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
    }

    .tran-send-top {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      //font-family: Poppins;
      font-size: 14px;
    }

    .tran-send-bottom {
      padding-top: 14px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      span {
        font-size: 20px;
        font-weight: 600;
      }

      input {
        height: 30px;
        color: black;
        font-size: 20px;
        font-weight: 600;
        background: rgba(0, 0, 0, 0);
      }
    }

    .tran-send-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      border: solid 1px #e44e3a;
      padding: 7px 16px 6px 8px;
      border-radius: 8px;
      cursor: pointer;
      background: white;
      //box-sizing: border-box;
      span {
        font-size: 14px;
        padding-left: 9px;
        padding-right: 26px;
      }

      img {
        width: 30px;
      }
    }

    .tran-send-btns {
      padding: 11px 16px 12px 10px;
    }

    .tran-send-btn-address {
      padding-right: 11px !important;
    }

    .tran-send-arrow-icon {
      width: 12px !important
    }


    .tran-change {
      padding-top: 21px;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 30px;
      }
    }

    .tran-send-fee {
      padding-top: 5px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 12px;

      img {
        margin-right: 7px;
        width: 20px;
      }

      span {
        opacity: 0.3;
      }
    }

    .tran-connect {
      padding-top: 47px;

      button {
        cursor: pointer;
        width: 100%;
        height: 55px;
        border-radius: 8px;
        background-color: #e44e3a;
        //font-family: Poppins;
        font-size: 16px;
        color: white;
      }
    }

    .tran-connect-approve {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background: #545050 !important;
      img {
        width: 80px;
      }
    }

    .tran-send-address {
      margin-top: 17px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      border-radius: 8px 0 0 8px;
      font-size: 12px;

      span {
        color: white;
        border-radius: 8px 0 0 8px;
        background: #E44E3A;
        padding: 12px 14px 11px 10px;
        width: 22%;
      }

    }

    .tran-send-address-input {
      width: 68%;
      height: 43px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid #E44E3A;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 0 8px 8px 0;

      input {
        width: 100%;
        height: 92%;
        //font-family: Poppins;
        font-size: 14px;
        padding-left: 13px;
        color: black;
        background: rgba(255, 255, 255, 0);
      }

      ::-webkit-input-placeholder {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #84868B;
        line-height: 28px;
        padding-left: 10px;
      }


      img {
        cursor: pointer;
        margin-left: 9px;
        margin-right: 14px;
        width: 20px;
      }
    }


    //dialog

    .dialog-selectChain {
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .dialog-content {
      width: 41%;
      height: 65%;
      border-radius: 30px;
      background: #FFFFFF;
      box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 46px 0 50px 0;
    }

    .dialog-content-trans {
      padding-top: 34px;
      padding-bottom: 40px;
      height: 80%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .dialog-content-trans-detail {
      width: 80%;
      overflow-y:scroll;
      display: flex;
      flex-direction: column;
    }

    .dialog-selectChain-title {
      width: 80%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      //font-family: Poppins;
      font-size: 22px;
      font-weight: 600;

      span {
        text-align: center;
        width: 100%;
      }

      img {
        cursor: pointer;
        width: 18px;
      }
    }

    .dialog-selectChain-search {
      border-radius: 8px;
      border: solid 1px rgb(228, 78, 58);
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 80%;
      padding: 9px;
      margin-top: 22px;

      img {
        width: 26px;
        cursor: pointer;
      }

      input {
        width: 100%;
        height: 100%;
        background-color: white;
        color: black;
        padding-left: 10px;
      }

      ::-webkit-input-placeholder {
        //font-family: Poppins;
        font-size: 12px;
      }
    }

    .dialog-selectChain-coin {
      width: 100%;
      padding-top: 20px;
    }

    .dialog-Chain-coin {
      //margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .dialog-Chain-coin:hover {
      width: 100%;
      background: rgba(0, 0, 0, 0.05);

      .dialog-selectChain-coin-content {
        span {
          //border-bottom: 0;
        }
      }
    }

    .dialog-selectChain-coin-content {
      width: 80%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      cursor: pointer;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      img {
        padding-top: 20px;
        width: 40px;
        margin-right: 9px;
      }

      span {
        width: 100%;
        padding-top: 29px;
        padding-bottom: 29px;
      }
    }


    .dialog-token {
      width: 100%;
      height: 80%;
      overflow-x: scroll;;
      margin-top: 5px;
    }

    .dialog-token-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }

    .dialog-token-content:hover {
      background: rgba(0, 0, 0, 0.05);

      .dialog-token-content-line:nth-child(n+1) {
        height: 0;
      }
    }

    .dialog-token-contentlist {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }


    .dialog-token-content-line {
      margin-top: 20px;
      width: 80%;
      height: 1px;
      background: rgba(0, 0, 0, 0.1);
    }

    .dialog-token-detail {
      margin-top: 20px;
      width: 82%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .dialog-token-detail-left {
      display: flex;
      flex-direction: row;
      align-items: center;

      img {
        width: 40px;
      }
    }

    .dialog-token-detail-left-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-left: 9px;
      padding-top: 15px;
      font-size: 16px;

      span {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.3);
      }
    }

    .dialog-token-detail-left-right {
      //font-family: Poppins;
      font-size: 16px;
      font-weight: 500;
      word-wrap: break-word;
    }


    //dialog history


    .dialog-trans-detail-line {
      margin-top: 12px;
      width: 85%;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    .dialog-trans-detail {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 30px;
      width: 100%;
    }

    .dialog-trans-detail-left {
      //font-family: Poppins;
      font-size: 16px;
      font-weight: 600;
      width: 22%;
    }

    .dialog-trans-detail-right {
      box-sizing: border-box;
      //margin-left: 35px;
      width: 78%;
      //font-family: Poppins;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      background: rgba(0, 0, 0, 0.05);
      padding: 9px 47px 14px 20px;
      border-radius: 10px;

      span:nth-child(1) {
        color: #e44e3a;
        font-size: 16px;
        padding-top: 4px;
      }

      span:nth-child(2) {
        width: 100%;
        word-wrap: break-word;
      }
    }

    .dialog-trans-detail-rights {
      display: flex;
      flex-direction: column;
      background: rgba(0, 0, 0, 0.05);
      padding: 21px 24px 28px 20px;
      border-radius: 10px;
      width: 75%;
    }

    .dia-transStatus-content-bottom {
      margin-top: 6px;
      width: 100%;
      height: 5px;
      border-radius: 3px;
      background: rgba(228, 78, 58, 0.2);
    }

    .dia-transStatus-content-bottom-bg {
      width: 80px;
      height: 5px;
      border-radius: 3px;
      background-color: rgb(228, 78, 58);
    }

    .dia-trans {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .dia-trans-two {
      margin-top: 8px;
    }

    .dia-trans-three {
      margin-top: 30px;
    }

    .dia-trans-top {
      display: flex;
      flex-direction: row;
      align-items: center;

      img {
        width: 21px;
      }
    }

    .dia-trans-top-icon {
      padding-left: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;

      img {
        width: 35px;
      }

      span {
        padding-left: 10px;
        //font-family: Poppins;
        font-size: 14px;
        font-weight: 500;
      }
    }

    .dia-trans-bottom {
      width: 100%;
      //padding-left: 10px;
      padding-top: 10px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;

      img {
        margin-left: 10px;
        width: 1px;
      }
    }

    .dia-trans-bottoms {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-end;
      img {
        margin-left: 5px;
      }
    }

    .dia-trans-bottom-arrow {
      width: 11px !important;
      padding-left: 0;
    }

    .dia-trans-bottom-progress {
      margin-left: 30px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      span {
        cursor: pointer;
        opacity: 0.6;
        font-size: 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
        img {
          width: 12px;
          margin-left: 5px;
          margin-bottom: 2px;
        }
      }
    }

    .dia-trans-bottom-progress-two {
      margin-left: 40px;
    }


    //history

    .history {
      position: relative;
    }

    .history-list {
      margin-top: 30px;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.05);
      padding: 21px 30px 17px 31px;
      border-radius: 12px;
      box-sizing: border-box;
    }

    .history-ant {
      //position: absolute;
      //bottom: 27px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 123px;

      img {
        width: 39px;
      }

      span {
        padding-top: 3px;
        opacity: 0.3;
        //font-family: Poppins;
        font-size: 12px;
      }
    }

    .history-top {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .history-coin {
      display: flex;
      flex-direction: row;
      align-items: center;

      img {
        width: 40px;
      }

      span {
        padding-left: 10px;
      }

      img:nth-child(3) {
        width: 18px;
        margin: 0 20px;
      }
    }

    .history-status {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 8px;
      background: white;
      border: solid 1px rgba(228, 78, 58, 1);
      padding: 11px 11px 11px 12px;
      color: #e44e3a;

      img {
        width: 8px;
        margin-left: 8px;
      }
    }

    .history-status-success {
      border: solid 1px #4FC320;
      color: #4FC320;
    }

    .history-status-cancel {
      border: solid 1px rgba(255, 184, 46, 1);
      color: #ffb82e;
    }

    .history-bottom {
      padding-top: 13px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      //font-family: Poppins;
      font-size: 16px;
      font-weight: 500;

      span:nth-child(2) {
        font-family: PingFangSC;
        font-size: 14px;
      }
    }


    //分页
    .home-page {
      margin-top: 50px;
      margin-bottom: 80px;
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;

      .btn-pre {
        margin-right: 20px;
        margin-left: 20px;

        button {
          //cursor: pointer;
          outline: none;
          border: 0;
          width: 158px;
          height: 33px;
          //background: #2196F3;
          background: rgba(228, 78, 58, 0.2);
          border-radius: 20px;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 22px;
        }
      }

      .current-page {
        cursor: pointer;
        padding-left: 10px;
      }

      .current-page :hover {
        cursor: pointer;
        padding-left: 10px;
        color:  rgba(228, 78, 58, 1);
      }

      .btn-next {
        margin-right: 20px;
        margin-left: 20px;

        button {
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 33px;
          cursor: pointer;
          outline: none;
          border: 0;
          width: 158px;
          height: 33px;
          background:  rgba(228, 78, 58, 1);
          border-radius: 20px;
        }
      }
    }

    .home-page-not {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 200px;
    }

    @media (max-width: 1200px) {
      .dialog-content {
        width: 60%;
      }
    }


    @media (max-width: 960px) {
      .bridge-content {
        width: 70%;
        padding: 30px 10px 30px 10px;
      }

      //trans
      .tran-title {
        font-size: 16px;

        img {
          width: 20px;
          margin-left: 10px;
        }
      }

      .tran-from-btn {
        padding: 7px;
        font-size: 12px;

        span {
          padding: 0 5px;
        }

        img {
          width: 20px;
        }
      }

      .tran-from-left {
        font-size: 12px;
      }

      .tran-from-right {
        font-size: 12px;
        text-align: right;
      }

      .tran-send {
        //padding: 25px 20px;
      }


      .tran-send-bottom {
        span {
          font-size: 22px;
        }
      }

      .tran-send-btn {
        padding: 5px 8px;

        img {
          width: 20px;
        }

        span {
          padding-right: 10px;
          font-size: 14px !important;
        }
      }

      .tran-send-btns {
        padding: 5px 8px;
      }

      .tran-send-btn-address {
        padding-left: 0 !important;
        padding-right: 10px !important;
      }

      .tran-send-fee {
        font-size: 12px;

        img {
          //width: 8px;
        }
      }


      //dialog
      .dialog-content {
        width: 60%;
        padding: 30px 0 30px 0;
      }

      .dialog-selectChain-title {
        font-size: 18px;

        img {
          width: 12px;
        }
      }

      .dialog-selectChain-search {
        padding: 5px;

        img {
          width: 18px;
        }
      }

      .dialog-selectChain-coin-content {
        img {
          width: 35px;
          padding-top: 18px;
        }

        span {
          padding-top: 25px;
          padding-bottom: 20px;
        }
      }

      .dialog-token-detail-left {
        img {
          width: 30px;
        }
      }

      .dialog-token-detail-left-text {
        font-size: 14px;
      }

      .dialog-token-detail-left-right {
        font-size: 16px;
      }

      .dialog-token-content-line {
        margin-top: 15px;
      }

      .tran-send-address {
        font-size: 12px;

        span {
          width: 28%;
          //padding: 14px 5px 14px 5px;
        }
      }

      ::-webkit-input-placeholder {
        font-size: 12px;
        padding-left: 0;
      }

      .tran-send-address-input {
        //width: 60%;
        input {
          font-size: 12px;
          padding-left: 5px;
        }

        img {
          width: 15px;
          margin: 0 5px;
        }
      }


      //history
      .history-coin {
        img {
          width: 30px;
        }
      }


      .history-list {
        padding: 20px 10px;
      }


      .history-status {
        padding: 8px;
        font-size: 14px;
      }

      .history-bottom {
        font-size: 16px;

        span:nth-child(2) {
          text-align: right;
        }
      }

      //dialog trans
      .dialog-trans-detail {
        width: 90%;
        margin-top: 10px;
      }

      .dialog-trans-detail-left {
        font-size: 14px;
        width: 26%;
      }

      .dialog-trans-detail-right {
        padding: 10px;
        font-size: 12px;
        width: 74%;

        span:nth-child(1) {
          font-size: 14px;
        }

        span:nth-child(2) {
          width: 100%;
          word-wrap: break-word;
        }
      }

      .dialog-trans-detail-rights {
        padding: 15px 10px;
      }

      .dia-transStatus-content {
        padding-top: 7px;
      }

      .dia-transStatus-content-two {
        padding-top: 38px;
      }

      .dia-transStatus {
        padding-left: 10px;
      }

      .dia-transStatus-content-top {
        img {
          width: 25px;
        }
      }

      .dia-trans-top {
        img {
          width: 16px;
        }

        span {
          font-size: 14px;
        }
      }

      .dia-trans-bottom {
        padding-left: 0;

        img {
          margin-left: 7px;
        }
      }

      .dia-trans-bottom-progress {
        margin-left: 10px;
      }

      .dia-trans-bottom-progress-two {
        margin-left: 18px;
      }


      .dia-trans-bottoms {
        img {
          margin-left: 2px;
        }
      }

      .dia-trans-top-icon {
        img {
          width: 22px;
        }
      }

      .dialog-content-trans {
        padding: 20px 0;
        width: 60% ;
      }

      .dia-trans-three {
        margin-top: 20px;
      }


      .home-page {
        .btn-pre {
          button {
            width: 100px;
            font-size: 14px;
          }
        }
      }


    }

    @media (max-width: 780px) {

      .dialog-content {
        width: 90%;
      }
      .bridge-content {
        width: 90%;
        padding: 30px 10px 30px 10px;
      }
      .dialog-content-trans {
        width: 90%;
      }

      .dialog-token-detail-left-text {
        font-size: 14px;
      }

      .tran-send-bottom {
        input {
          width: 80%;
        }
      }

      .dialog-token-detail-left-right {
        font-size: 14px;
      }
    }


    </style>
