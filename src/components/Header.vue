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
        <div class="header-connect">
          <span class="header-error" v-if="error" @click="actionConnect()">{{ $t('Network Error') }}</span>
          <div v-else><span class="header-intall"><img :src="chain.icon"/>{{ chain.network }}</span></div>
        </div>

        <div class="header-connect">
          <div>
            <span v-if="address" class="header-intall header-intalls">
            <img src="../assets/ant-icon.png"/>{{ $formatAddress(address) }}<span class="header-address-round"></span></span>
            <span v-else class="header-intall">{{ $t('Install Metamask') }}</span>
          </div>
        </div>
        <div class="header-many">
          <div @click="tabMore=!tabMore" class="header-many-icon">
            <span></span><span></span><span></span>
          </div>
          <div v-show="tabMore" class="header-many-tab">
            <div class="header-many-tab-item">{{ $t("Docs") }}</div>
            <div class="header-many-tab-item">{{ $t('Tutorial') }}</div>
            <div class="header-many-tab-item">{{ $t('FAQ') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Header",
  props: [
    'num',
    'loadingHistory'
  ],
  data() {
    return {
      showTab: 0,
      tabMore: false,//更新Tab
      tabIndex: 0,
      error: true,
      chain: null,
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
    actionShowMore(show){
      this.tabMore=show;
    },
    actionShowTab(tab) {
      this.$emit("listenTab", tab)
    },
    actionConnect() {
      let chainId = this.$store.getters.accountId;
      this.$store.dispatch('connect');
    },
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
      console.log('matchChain',{chainId,chain:chains[chainId],address})
      if (address && address.length>0){
        this.chain=chain;
      }

    },
    async requestData() {
      this.$watcher.getProvider().then((provider) => {
        this.matchChain();
      }).catch(err => {
        v.error = true
      })
    }
  },
  mounted() {
    this.requestData();
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
  transition: border-color .3s cubic-bezier(.645, .045, .355, 1);
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
  transition: border-color .3s, background .3s, padding .3s cubic-bezier(.645, .045, .355, 1);
}

.header-middle-his {
  margin-left: -12px;
}

.header-middle-his-active {
  margin-left: -7px;
}


//更多
.header-many {
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
  position: absolute;
  z-index: 9;
  top: 60px;
  width: 130px;
  border-radius: 7px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding: 17px 0;
  background: white;
}

.header-many-tab-item {
  cursor: pointer;
  text-align: center;
  font-family: PingFangSC;
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.header-container {
  padding: 20px 30px;
  margin: 0 auto;
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
  background: #E44E3A;
  color: white;
}

.header-intall {
  width: 186px;
  height: 40px;
  border-radius: 7px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: PingFangSC;
  font-size: 13px;
  font-weight: 500;

  img {
    margin-right: 9px;
    margin-left: 4px;
    width: 25px;
  }
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

  .header-error {
    width: 100px;
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    line-height: 35px;
    text-align: center;
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
    height: 35px;
  }

  .tab-two {
    padding-left: 15px;
  }
}

</style>
