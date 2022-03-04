<template>
  <div class="header">
    <div class="header-container">
      <div class="header-left">
        <div @click="goMap" class="header-logo"><img src="../assets/logo.png"/></div>
      </div>

      <div class="header-middle">
        <div @click="actionShowTab(showTab=0)"
             :class="showTab==0?'header-middle-tran-active':'header-middle-trans'">
          {{ $t('Transfer funds') }}
        </div>
        <div @click="actionShowTab(showTab=1)"
             :class="showTab==1?'header-middle-tran-active header-middle-his-active':'header-middle-trans header-middle-his'">
          {{ $t('History') }}
          <img v-show="loadingHistory && loadingHistory>0" class="loading-icon" src="../assets/cycle.png"/>
        </div>
      </div>

      <div class="header-right">
        <div id="header-chain-content"  class="header-connect">
          <span class="header-error" v-if="error" @click="actionConnect()">{{ $t('Network Error') }}</span>
          <div v-else><span class="header-intall"><img :src="chain?chain.icon:''"/>{{ chain?chain.network:'' }}</span></div>
        </div>

        <div class="header-connect">
          <div v-if="exitConntet"  @mouseover="showLogOut=true" @mouseleave="showLogOut=false" class="header-connect-content" id="connect-btn">
            <span @mouseover="showLogOut=true" @mouseleave="showLogOut=false" v-if="address" class="header-intall header-intalls">
            <img src="../assets/ant-icon.png"/>{{ $formatAddress(address) }}<span class="header-address-round"></span></span>
            <span v-else @click="actionConnect()" class="header-intall" >{{ $t('Install Metamask') }}</span>
            <span id="logoutBtn" @click.prevent.stop="actionLogOut()" @mouseover="showLogOut=true" @mouseleave="showLogOut=false" v-show="showLogOut" class="header-intall header-intalls header-logout">Logout</span>
          </div>
          <div v-else class="header-connect-content">
            <span @click="actionConnect()"  class="header-intall  header-intall-error">Connect Wallet</span>
          </div>
        </div>

        <div  class="header-many" @mouseover="tabMore=true" @mouseleave="tabMore=false" @click.prevent.stop="actionShowMore()" >
          <div  @mouseover="tabMore=true" @mouseleave="tabMore=false"   class="header-many-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div  @mouseover="tabMore=true" @mouseleave="tabMore=false" v-show="tabMore" class="header-many-tab">
            <div @click="goSupport()" class="header-many-tab-item">Contract Support</div>
            <div @click="goTutorial()" class="header-many-tab-item">Tutorial</div>
          </div>
        </div>
      </div>
    </div>
    <div class="header-line"></div>
  </div>
</template>

<script>

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

    actionLogOut() {
      this.$store.commit("setAddress","");
      this.showLogOut = false
      this.$emit("exit",false)
      localStorage.setItem('exit',false)

      let chain= document.getElementById('header-chain-content')
      chain.style.visibility='hidden'


      this.exitConntet =  false
    },
    //intall
    async actionConnect() {
      this.$store.dispatch('connect')
      this.$emit("exit",true)
      localStorage.setItem('exit',true)

      let chain= document.getElementById('header-chain-content')
      chain.style.visibility='visible'
      this.exitConntet =  true
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
        this.$store.dispatch('connect')
        chain.style.visibility='visible'
        this.exitConntet =  true
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
    // actionConnect() {
    //   let chainId = this.$store.getters.accountId;
    //   this.$store.dispatch('connect');
    // },
    goMap() {
      window.open('https://www.maplabs.io/', '_blank')
    },
    async matchChain() {
      let chainId = await this.$store.getters.getChainId;
      let chains = await this.$store.getters.getChains;

      let chain=null;
      if (chains[chainId]) {
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

    },
    async requestData() {
      this.$watcher.getProvider().then((provider) => {
        this.matchChain();
      }).catch(err => {
        this.error = true
      })
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
  margin-left: 15%;
  font-size: 16px;
  color: #333;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'productBold';
}

.header-middle-trans {
  cursor: pointer;
  width: 130px;
  height: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: border-color .3s cubic-bezier(.645,.045,.355,1);
}

.header-middle-tran-active {
  width: 130px;
  height: 40px;
  border-radius: 10px;
  background-color: #0e1012;
  font-weight: bold;
  color: white;
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
  background-color: var(--white);
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
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding: 17px 0;
  background: white;
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
  background: rgba(228, 80, 60, 0.1);
  color: #e44e3a;
  border-radius: 5px;
}



.header {
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
  line-height: 40px;
  border: solid 1px #E44E3A;
  background: #E44E3A;
  color: white;
}

.header-intall {
  width: 162px;
  height: 40px;
  border-radius: 7px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  background: white;
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

@-webkit-keyframes circle {
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
  }

  .header-middle {
    display: none;
  }

  .header-container {
    width: 100%;
    align-items: flex-start;
    justify-content: flex-start;
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
