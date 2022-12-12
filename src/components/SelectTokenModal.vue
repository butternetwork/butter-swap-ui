<template>
  <div v-show="showSelectTokenModal" class="dialog-selectChain">
    <div class="dialog-content dialog-content-Token">
      <div class="dialog-selectChain-title">
        <span>Select a token</span>
        <img @click="closeSelectTokenModal()" src="../assets/cancel.png" />
      </div>
      <div class="dialog-selectChain-search">
        <img src="../assets/search.png" />
        <!-- <input v-model="searchToken" placeholder="Search token by name or address"> -->
      </div>
      <div class="dialog-token-bell">
        <img src="../assets/dialog/bell.png" />
        <span>
          Below is the supported token list from {{ chainFrom.chainName }} to
          {{ chainTo.chainName }}. More tokens can be found if you select other
          chains.
        </span>
      </div>
      <div class="dialog-token">
        <div v-if="selectTokens.length == 0">
          <img
            style="width: 60px; margin-top: 15px"
            src="../assets/loading2.gif"
          />
        </div>
        <div
          v-else
          v-for="(item, index) in selectTokens"
          :key="index"
          @click="actionSelectToken(item, index)"
          class="dialog-token-content"
        >
          <div class="dialog-token-contentlist">
            <div class="dialog-token-detail">
              <div class="dialog-token-detail-left">
                <img :src="item.logo" />
                <div class="dialog-token-detail-left-text">
                  {{ item.name }}
                  <!--                            <span> {{ item.symbol }}</span>-->
                </div>
              </div>
              <div
                v-if="item.amount != null && item.amount >= 0"
                class="dialog-token-detail-left-right"
              >
                {{ item.amount }}
                <span>{{ item.symbol }}</span>
              </div>
              <div v-else class="dialog-token-loading">
                <img style="width: 30px" src="../assets/loading2.gif" />
              </div>
            </div>
            <div class="dialog-token-content-line"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectTokenModal",
  props: {
    showSelectTokenModal: {
      type: Boolean,
      default: false,
    },
    chainFrom: {
      type: Object,
      default: {},
    },
    chainTo: {
      type: Object,
      default: {},
    },
    selectTokens: {
      type: Array,
      default: [],
    },
    source: {
        type: String,
        default: 'from'
    }
  },
  data() {
    return {};
  },
  methods: {
    closeSelectTokenModal() {
      this.$emit("closeModal", false);
    },
    actionSelectToken(item) {
        this.$emit("actionSelectToken", item, this.source)
    }
  },
};
</script>

<style scoped lang="less">
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
  z-index: 2;
}

.dialog-selectChain-headerChain {
  z-index: 10;
}

.dialog-content {
  max-width: 558px;
  width: 558px;
  max-height: 544px;
  border-radius: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: solid 1px rgba(255, 255, 255, 0.4);
  background-color: rgb(27, 32, 37);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 26px 30px 116px 30px;
  box-sizing: border-box;
}

.dialog-content-Token {
  padding-bottom: 87px;
}
.dialog-content-approve {
  max-width: 220px;
  max-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0 !important;
  img {
    width: 20%;
  }
}

.dialog-content-address {
  padding: 20px 10px;
  max-width: 280px;
  max-height: 250px;
  .dialog-approve-title {
    padding-bottom: 10px;
  }
}

.dialog-approve-title {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 20px;

  img {
    cursor: pointer;
    width: 11px;
  }
}

.dialog-content-approve-text {
  padding-top: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #f6d536;
}

.dialog-content-history-text {
  width: 70%;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  color: #f6d536;
}

.dialog-content-address-text {
  padding-top: 8px;
  font-size: 14px;
  width: 100%;
  text-align: center;
}

.dialog-content-address-confirm {
  margin-top: 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 32px;
  background: #f6d536;
  border-radius: 5px;
  color: #1a1b20;
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
  width: 90%;
  display: flex;
  flex-direction: column;
}

.dialog-selectChain-title {
  font-family: "productBold" !important;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;

  span {
    text-align: center;
    width: 100%;
  }

  img {
    cursor: pointer;
    width: 15px;
  }
}

.dialog-selectChain-search {
  border-radius: 15px;
  border: solid 1px rgba(255, 255, 255, 0.6);
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 9px;
  margin: 15px 0 10px 0;
  box-sizing: border-box;
  img {
    width: 20px;
    cursor: pointer;
  }

  input {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    color: white;
    padding-left: 10px;
  }

  ::-webkit-input-placeholder {
    //font-family: Poppins;
    font-size: 12px;
  }
}

.dialog-selectChain-coin {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.dialog-Chain-coin {
  width: 100%;
  margin-top: 10px;
}

.dialog-selectChain-coin-content {
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border-radius: 15px;
  border: solid 1px rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;

  img {
    margin-left: 11px;
    width: 28px;
    margin-right: 9px;
  }

  span {
    font-size: 13px;
  }
}

.dialog-selectChain-coin-content:hover {
  height: 50px;
  border: solid 1px rgb(246, 213, 54);
  background-color: rgb(27, 32, 37);
}
.dialog-token-bell {
  padding: 15px 12px;
  border-radius: 15px;
  background-color: rgb(228, 78, 58);
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    width: 15px;
  }
  span {
    padding-left: 13px;
    //font-family: PingFangSC;
    font-size: 12px;
  }
}
.dialog-token-detail-left-right {
  font-size: 16px;
}

.dialog-token-content-line {
  margin-top: 15px;
}
.dialog-token-detail-left-right {
  font-size: 14px;
}
.dialog-token {
  width: 100%;
  height: 80%;
  margin-top: 5px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialog-token-content {
  box-sizing: border-box;
  margin-top: 10px;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 15px;
  border: solid 1px rgba(255, 255, 255, 0.3);
}

.dialog-token-content:hover {
  height: 50px;
  border: solid 1px rgb(246, 213, 54);
}

.dialog-token-contentlist {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.dialog-token-detail {
  width: 92%;
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
    width: 22px;
  }
}

.dialog-token-detail-left-text {
  padding-left: 10px;
  font-family: "productBold" !important;
  font-size: 13px;
  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
  }
}

.dialog-token-detail-left-right {
  //font-family: Poppins;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  align-items: center;

  span {
    padding-left: 5px;
    text-align: right;
  }
}
</style>
