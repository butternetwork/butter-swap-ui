<template>
  <div class="header">
    <div class="header-container">
      <div class="header-left">
        <div @click="goMap" class="header-logo"><img src="../assets/logo.png"/></div>
        <div class="header-beta">alpha</div>
      </div>

      <div class="header-middle">
        <div @click="actionShowTab(showTab=0)"
             :class="showTab==0?'header-middle-tran-active':'header-middle-trans'">
          Bridge
        </div>
        <div @click="actionShowTab(showTab=1)"
             :class="showTab==1?'header-middle-tran-active header-middle-his-active':'header-middle-trans header-middle-his'">
              History
          <img v-show="loadingHistory && loadingHistory>0" class="loading-icon" src="../assets/cycle.png"/>
        </div>
      </div>

      <div class="header-right">
        <div id="header-chain-content"  class="header-connect">
          <span class="header-error" v-if="error&&exitConntet" @click="actionNetwork()">
            <span>Network Error</span>
            <span>Click to switch</span>
          </span>
          <div @click="actionChain(2)" v-else-if="exitConntet&&!error">
            <span class="header-intall">
              <img :src="chain?chain.icon:''"/>{{ chain?chain.network:'' }}
            </span>
          </div>
        </div>

        <div class="header-connect">
          <div v-if="exitConntet"  @mouseover="showLogOut=true" @mouseleave="showLogOut=false" class="header-connect-content" id="connect-btn">
            <span @mouseover="showLogOut=true" @mouseleave="showLogOut=false" v-if="address" class="header-intall header-intalls">
                <img src="../assets/header/butter-logo.png"/>
                <span v-if="domainName" >{{ $formatAddress(domainName) }}</span>
                <span v-else>{{ $formatAddress(address) }}</span>
                <span class="header-address-round"></span>
            </span>
            <span v-else @click="actionConnect()" class="header-intall" >Connect Wallet</span>
            <span id="logoutBtn" @click.prevent.stop="actionLogOut()" @mouseover="showLogOut=true" @mouseleave="showLogOut=false" v-show="showLogOut" class="header-intall header-intalls header-logout">Logout</span>
          </div>
          <div v-else class="header-connect-content">
            <span @click="actionConnectI()"  class="header-intall  header-intall-error">Connect Wallet</span>
          </div>
        </div>

        <div  class="header-many" @mouseover="tabMore=true" @mouseleave="tabMore=false" @click.prevent.stop="actionShowMore()" >
          <div  @mouseover="tabMore=true" @mouseleave="tabMore=false"   class="header-many-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div  @mouseover="tabMore=true" @mouseleave="tabMore=false" v-show="tabMore" class="header-many-tab">
            <div @click="goSupport()" class="header-many-tab-item">Contact Support</div>
            <div @click="goTutorial()" class="header-many-tab-item">Tutorial</div>
            <div @click="goCommunity()" class="header-many-tab-item">Community</div>
          </div>
        </div>
      </div>

      <!--        选择链-->
      <div v-show="showSelectChain" class="dialog-selectChain dialog-selectChain-headerChain">
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
                <img :src="item.chainLogo"/>
                <span>{{ item.chainName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>

  </div>
</template>

<script>
import config from '@/config/base'
import near from "@/config/near";
import connector from "@/store/connector";
import {SUPPORTED_CHAIN_LIST_MAINNET} from "butterjs-sdk/dist/constants";
import Decimal from "decimal.js";
import eventBus from "@/eventBus";


export default {
  name: "Header",
  props: [
    'num',
    'loadingHistory',
    'exit'
  ],
  data() {
    return {
      chainFrom:{},
      selectChain: -1,
      chainList:{},//链的列表
      searchVal: '',  //弹窗链查找默认输入为空
      showSelectChain:false,
      showTab: 0,
      tabMore: false,//更新Tab
      tabIndex: 0,
      error: true,
      chain: null,
      exitConntet:false,
      showLogOut:false,//显示退出
      domainName:null,
      chainIdHex: config.map_mainnet.chainId,
    }
  },
  computed: {
    listChain() {
      var _this = this;
      if (!_this.chainList) {
        return
      }
      if (!_this.isNumber(_this.searchVal)) {
        var arrByZM = [];
        for (var i = 0; i < _this.chainList.length; i++) {
          //for循环数据中的每一项（根据name值）
          if (_this.chainList[i].chainName.toUpperCase().search(_this.searchVal.toUpperCase()) != -1) {
            //判断输入框中的值是否可以匹配到数据，如果匹配成功
            arrByZM.push(JSON.parse(JSON.stringify(_this.chainList[i])));
          }
        }
      } else {
        var arrByZM = [];
        for (var i = 0; i < _this.chainList.length; i++) {
          //search 需要传递 toString类型 才能传递
          if (_this.chainList[i] && (_this.chainList[i].chainId).toString().search((_this.searchVal).toString()) != -1) {
            //判断输入框中的值是否可以匹配到数据
            arrByZM.push(JSON.parse(JSON.stringify(_this.chainList[i])));
            // arrByZM.push(_this.chainList[i]);
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
    address() {
      return this.$store.state.address;
    },
    chainId() {
      return this.$store.state.chainId;
    },
  },
  watch: {
    address(newVal) {
      this.requestData();
    },
    chainId(newVal) {
      this.requestData();
    },
  },
  methods: {
    //判断是否是数组
    isNumber(value) {         //验证是否为数字
      let patrn = /^(-)?\d+(\.\d+)?$/;
      if (patrn.exec(value) == null || value === "") {
        return false
      } else {
        return true
      }
    },

    async handleLink(item) {
      //To 选择
      let v = this

      const provider = this.$store.getters.provider;
      console.log('provider',provider)
      let chainId = new Decimal(item.chainId).toHex();
      let params = {chainId}
      let account = await this.$web3.eth.getAccounts()


      if (item.symbol== 'NEAR') {
        let nearAccount = await near.asyncNearWallet()
        v.account= nearAccount.currentUser.accountId
        this.chainIdNumber = item.chainId
        this.$store.commit("setAddress",nearAccount.currentUser.accountId);
        chainId = config.near.chainId.toString()

        this.chainFrom = JSON.parse(JSON.stringify(item));
        this.showSelectChain = false
        this.$router.push(`/home?sourceNetwork=${this.chainFrom.symbol}&destNetwork=${this.$route.query.destNetwork}&ts=${Date.now()}`)
        return
      }


      if (window.ethereum.chainId === new Decimal(item.chainId).toHex()) {
        this.chainIdNumber = item.chainId
        this.$store.commit("setAddress",account[0]);
        this.$store.commit("setChainId",item.chainId);
        this.chainFrom = JSON.parse(JSON.stringify(item));
        this.showSelectChain = false
        v.$router.push(`/home?sourceNetwork=${item.symbol}&destNetwork=${this.$route.query.destNetwork}&ts=${Date.now()}`)
        return
      }

      if (provider) {
        try {
          let params = {chainId}
          let method = 'wallet_switchEthereumChain';
          let chains = this.$store.getters.getChains;
          let chain = chains[chainId];
          console.log('chain',chain)
          if (chain.symbol !== 'ETH') {
            method = 'wallet_addEthereumChain';
            params.rpcUrls = [item.rpc];
            params.chainName = item.chainName;
          }
          await provider.request({
            method: method,
            params: [params]
          });
          this.$store.commit("setAddress",account[0]);
          this.$store.commit("setChainId",item.chainId);
          this.$route.query.sourceNetwork=item.symbol
        } catch (error) {
          this.$router.push(`/home?sourceNetwork=${this.$route.query.sourceNetwork}&destNetwork=${this.$route.query.destNetwork}&ts=${Date.now()}`)
          v.requestData()
          // try {
          //   let chains = this.$store.getters.getChains;
          //   let chain = chains[chainId];
          //   params.rpcUrls = [item.rpc];
          //   params.chainName = item.chainName;
          //   console.log('params',params)
          //   await provider.request({
          //     method: 'wallet_addEthereumChain',
          //     params: [params]
          //   });
          //   this.$store.commit("setAddress",account[0]);
          //   this.$store.commit("setChainId",item.chainId);
          //   this.$route.query.sourceNetwork=item.symbol
          //   return true;
          // } catch (error) {
          //   this.requestData()
          //   console.error('Failed to setup the network in Metamask:', error);
          //   return false;
          // }
        }
      } else {
        console.error('Can not setup the HALO network on metamask because window.ethereum is undefined');
        return false;
      }
    },

    //打开选择链弹窗
    actionChain(i) {
      this.selectChain = i;
      this.searchVal=''
      this.showSelectChain = true;
    },

    //获取链列表
    async actionGetChain() {
      let v = this;
      v.chainList = SUPPORTED_CHAIN_LIST_MAINNET
      console.log( v.chainList)
      // let chainId = await this.$store.getters.getChainId;
      // console.log('chainId',chainId)
      // chainId = new Decimal(parseInt(chainId)).toHex();
      // let query = this.$route.query ? this.$route.query : {}
      // let chains = await this.$store.getters.getChains;
      // let chain = chains[chainId];
      // console.log('chain',chains,chainId)
      //
      // this.showSelectChain=false;
      // // this.$router.push(`/home?sourceNetwork=${query.sourceNetwork}&destNetwork=${query.destNetwork}&ts=${Date.now()}`)
      //
      // for (let item of this.chainList) {
      //   if (item.symbol.toUpperCase() === query.sourceNetwork.toUpperCase()) {
      //     v.chainFrom = JSON.parse(JSON.stringify(item));
      //   }
      // }
      // // }
    },

    goCommunity() {
      window.open('https://t.me/butternetwork','blank')
    },

   async actionLogOut() {
      this.$store.commit("setAddress","");
      this.showLogOut = false
      this.$store.dispatch('logout');
      // this.$emit("exit",false)
      // localStorage.setItem('exit',false)


     let chainId = await this.$store.getters.getChainId;

     console.log('chainId',chainId)

     if (chainId==config.near.chainHex) {
       near.closeNearWallet()
     }



     let chain= document.getElementById('header-chain-content')
      chain.style.visibility='hidden'




      this.exitConntet =  false
    },
    //intall
    async actionConnectI() {
      // this.$store.dispatch('connect')
      // this.$emit("exit",true)
      // localStorage.setItem('exit',true)
      //
      // let chain= document.getElementById('header-chain-content')
      // chain.style.visibility='visible'
      // this.exitConntet =  true
      try {
        await this.$store.dispatch('connect')
        // this.$emit("exit",true)
        // localStorage.setItem('exit',true)
        let username = localStorage.getItem('userDomain')
        this.domainName = username
        console.log('username',username)
        let chain= document.getElementById('header-chain-content')
        chain.style.visibility='visible'
        this.exitConntet =  true

      } catch (e) {
        console.error(e);
      }
    },

    //判断当前是否是断开情况
    async actionLoaclExit() {
      let exit = localStorage.getItem('exit')
      let chain= document.getElementById('header-chain-content')
      if (JSON.parse(exit) == false) {
        chain.style.visibility='hidden'
        this.showLogOut = false
        this.$store.commit("setAddress","");
        this.exitConntet =  false
        this.domainName = localStorage.getItem('userDomainn')
        console.log('domainName',this.domainName)
      }
      else  {
        if (connector.web3modal.cachedProvider) {
          await this.$store.dispatch('connect');
          chain.style.visibility='visible'
          this.exitConntet =  true
        }
      }

    },

    //教程
    goTutorial() {
      window.open('https://medium.com/marcopolo-protocol/map-protocol-cross-chain-bridge-tutorial-d3527952aac5?source=social.tw','blank')
    },
    goSupport() {
      window.open('https://73v04g7oykm.typeform.com/to/GFBqlCMJ?typeform-source=admin.typeform.com','blank')
      this.tabMore=false
    },
    actionShowMore(show){
      this.tabMore=show;
    },
    actionShowTab(tab) {
      this.$emit("listenTab", tab)
    },
    actionConnect() {
      // let chainId = this.$store.getters.accountId;
      this.$store.dispatch('connect');
    },
    async actionNetwork() {
      const provider = this.$store.getters.provider;
      let chainId = config.bsc_mainnet.chainHex
      if (provider) {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId }]
          });
          return true;
        } catch (error) {
          try {
            let params = {chainId}
            params.rpcUrls = [config.map.rpc];
            params.chainName = config.map.chainName;
            console.log('params',params)
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [params]
            });
            return true;
          } catch (error) {
            console.error('Failed to setup the network in Metamask:', error);
            return false;
          }
        }
      } else {
        console.error('Can not setup the HALO network on metamask because window.ethereum is undefined');
        return false;
      }
    },
    goMap() {
      window.open('https://test-bridge.butternetwork.io', '_blank')
    },
    async matchChain() {
      let chainId = await this.$store.getters.getChainId;
      let chains = await this.$store.getters.getChains;

      // //如果是near链的话
      if (this.$route.query.sourceNetwork==='NEAR') {
        chainId = config.near.chainHex
        console.log('config.near.chainId',chainId)
      }


      let chain=null;
      if (chains[chainId.toString()]) {
        chain = chains[chainId];
        this.error = false;
      } else {
        chain = null;
        this.error = true;
      }

      let address = await this.$store.getters.getAddress;
      if (address && address.length>0){
        this.chain=chain;
      }

    },
    async requestData() {
      // this.$watcher.getProvider().then((provider) => {
      //   this.matchChain();
      //   console.log('0000000')
      // }).catch(err => {
      //   this.error = true
      // })
      this.matchChain();
      this.actionGetChain()
    }
  },
  mounted() {
   eventBus.$on("listenTab",(res)=>{
      this.showTab = 1
    })
    this.requestData();
    this.actionLoaclExit()
  }
}
</script>

<style scoped lang="less">
@import '../views/Home';

//tansfer
.header-middle {
  margin-left: 9%;
  font-size: 16px;
  color: #333;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'productBold';
}

.header-middle-trans {
  position: relative;
  z-index: 1;
  cursor: pointer;
  width: 130px;
  height: 40px;
  border-radius: 10px;
  border: solid 1px rgba(255, 255, 255, 0.4);
  color: #f6d536;
  background: #1b2025;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: border-color .3s cubic-bezier(.645,.045,.355,1);
}

.header-middle-tran-active {
  position: relative;
  z-index: 2;
  width: 130px;
  height: 40px;
  border-radius: 10px;
  background-color: #f6d536;
  font-weight: bold;
  color: #1a1b20;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color .3s,background .3s,padding .3s cubic-bezier(.645,.045,.355,1);
}

.header-middle-his {
  margin-left: -12px;
}

.header-middle-his-active {
  margin-left: -7px;
}




//更多
.header-many {
  width: 40px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
}

.header-many-icon {
  width: 40px;
  height: 40px;
  border-radius: 7px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  background-color: #f6d536;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  span {
    width: 4px;
    height: 4px;
    background: #000;
    border-radius: 50%;
  }
  span:nth-child(2) {
    margin: 0 3px;
  }
}

.header-many-tab {
  z-index: 9;
  width: 130px;
  margin-top: 5px;
  border-radius: 7px;
  border: solid 1px rgba(255, 255, 255, 0.4);
  background-color: rgb(27, 32, 37);
  padding: 17px 0;
}

.header-many-tab-item {
  cursor: pointer;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  height: 35px;
  line-height: 35px;
}
.header-many-tab-item:hover {
  margin: 0 5px;
  background-color: rgb(246, 213, 54);
  color: #1b2025;
  border-radius: 5px;
}



.header {
  width: 100%;
  //height: 123px;
  //background: #1b2025;
  //background: url("../assets/header/header-bg.png")no-repeat;
  //background-size:100% 100%;
  position: relative;
  height: 81px;
}

.header-container {
  box-sizing: border-box;
  padding:20px 30px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
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

.header-beta {
  margin-left: 14px;
  margin-top: -20px;
  width: 35px;
  height: 16px;
  border-radius: 3px;
  background-color: #ffe094;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #000000;
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
  width: 100%;
  border-bottom:1px solid rgba(0, 0, 0,0.05);
  z-index: 8;
  position: absolute;
  top: 81px;
}

.header-right {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.header-connect {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
}

.header-connect-content {
  position: relative;
}

.header-logout {
  margin-top: 5px;
  position: relative;
  z-index: 9;
}


.header-error {
  width: 186px;
  height: 40px;
  border-radius: 8px;
  text-align: center;
  border: solid 1px #f6d536;;
  background: #f6d536;;
  color: #1b2025;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span:nth-child(2) {
    font-size: 12px;
    padding-top: 2px;
  }
}

.header-intall {
  width: 162px;
  height: 40px;
  border-radius: 7px;
  border: solid 1px rgba(255, 255, 255, 0.4);
  background-color: rgb(27, 32, 37);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  img {
    margin-right: 9px;
    margin-left: 4px;
    width: 25px;
    border: solid 1px rgb(0, 0, 0);
    border-radius: 50%;
  }
}

.header-intall-error {
  background-color: #f6d536;;
  color: #1b2025;
}

.header-intalls {
  img {
    border: 0;
  }
}

.header-intalls:hover {
  background-color: black;
  color: white;
}

.header-address-round {
  width: 6px;
  height: 6px;
  background: #23e9c3;
  border-radius: 100%;
  margin-left: 10px;
}

.loading-icon {
  margin-left: 5px;
  width: 15px;
  -webkit-animation: circle 3s infinite linear;
}

@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


@media (max-width: 1200px) {
  .header-container {
    width: 100%;
  }
}

@media (max-width: 960px) {
  .header {
    width: 100%;
    height: 123px;
  }


  .header-middle {
    display: none;
  }

  .header-container {
    width: 100%;
    align-items: flex-start;
    justify-content: center;
    padding: 10px 0;
  }

  .header-logo {
    img {
      width: 70px;
    }
  }

  .header-line {
    top: 60px;
  }


  .header-connect {
    margin-left: 10px;
    font-size: 12px;
    right: 5%;
  }

  .header-error {
    width: 100px;
    height: 35px;
    font-size: 12px;
    text-align: center;
  }

  .header-left {
    display: flex;
    height: 40px;
  }

  .header-many-icon {
    width: 35px;
    height: 37px;
  }


  .header-intall {
    width: 80px;
    height: 35px;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
    img {
      display: none;
      width: 20px;
    }
  }

  .header-beta {
    margin-top: 0;
    margin-left: 5px;
  }


  .header-intalls {
    width: 105px;
  }
  .header-many {

  }

  .header-many-tab {
    padding: 10px 0;
  }

  .tab-two {
    padding-left: 15px;
  }
}
</style>
