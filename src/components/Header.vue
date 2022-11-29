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
          <div v-else-if="exitConntet&&!error"><span class="header-intall"><img :src="chain?chain.icon:''"/>{{ chain?chain.network:'' }}</span></div>
        </div>

        <div class="header-connect">
          <div v-if="exitConntet"  @mouseover="showLogOut=true" @mouseleave="showLogOut=false" class="header-connect-content" id="connect-btn">
            <span @mouseover="showLogOut=true" @mouseleave="showLogOut=false" v-if="address" class="header-intall header-intalls">
            <img src="../assets/header/butter-logo.png"/>{{ $formatAddress(address) }}<span class="header-address-round"></span></span>
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
    </div>
<!--    <div class="header-line"></div>-->
  </div>
</template>

<script>
import config from '@/config/base'
import near from "@/config/near";
import connector from "@/store/connector";

export default {
  name: "Header",
  props: [
    'num',
    'loadingHistory',
    'exit'
  ],
  data() {
    return {
      showTab: 0,
      tabMore: false,//更新Tab
      tabIndex: 0,
      error: true,
      chain: null,
      exitConntet:false,
      showLogOut:false,//显示退出
    }
  },
  computed: {
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

    goCommunity() {
      window.open('https://t.me/MAPprotocolGroup','blank')
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
      let chainId = config.map.chainHex
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
      window.open('http://18.139.224.21:7001', '_blank')
    },
    async matchChain() {
      let chainId = await this.$store.getters.getChainId;
      let chains = await this.$store.getters.getChains;

      console.log('chainId',chains[chainId.toString()])

      let chain=null;
      if (chains[chainId.toString()]) {
        chain = chains[chainId];
        this.error = false;
      } else {
        chain = null;
        this.error = true;
      }
      let address = await this.$store.getters.getAddress;
      // console.log('matchChain',{chainId,chain:chains[chainId],address})
      if (address && address.length>0){
        this.chain=chain;
        // console.log('this.chain',this.chain)
      }
      console.log(' this.error', this.error)
      console.log('this.chain',this.chain)

    },
    async requestData() {
      // this.$watcher.getProvider().then((provider) => {
      //   this.matchChain();
      //   console.log('0000000')
      // }).catch(err => {
      //   this.error = true
      // })
      this.matchChain();
    }
  },
  mounted() {
    this.requestData();
    this.actionLoaclExit()
  }
}
</script>

<style scoped lang="less">

//tansfer
.header-middle {
  margin-left: 10%;
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
  border: solid 1px #E44E3A;
  background: #E44E3A;
  color: white;
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
  background-color: rgb(228, 78, 58);
  color: white;
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
    line-height: 35px;
    font-size: 12px;
    line-height: 35px;
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
  }


  .header-intalls {
    width: 120px;
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
