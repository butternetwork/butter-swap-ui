<template>
  <div class="home">
    <div class="home-bg"></div>

    <Header @listenTab="actionEmitHeader" :loadingHistory="historyLoading" @exit="actionEixt"/>

    <div class="header-middle">
      <div @click="actionOpenTransfer(showTab=0)" :class="showTab==0?'header-middle-tran-active':'header-middle-trans'">
        Bridge
      </div>
      <div @click="actionHistory(showTab=1)"
           :class="showTab==1?'header-middle-tran-active header-middle-his-active':'header-middle-trans header-middle-his'">
        History
        <img v-show="historyLoading && historyLoading>0" class="loading-icon" src="../assets/cycle.png"/>
      </div>
    </div>

    <div class="bridge">
      <div :class="isLoadingAllData ? 'home-loading' : ''"  class=""></div>
      <div v-show="isLoadingAllData" class="dialog-selectChain dialog-loadinng">
        <div class="dialog-content dialog-content-approve dialog-content-loading">
          <img class="loading-icon" src="../assets/dialog/loading.png"/>
          <div class="dialog-content-approve-text">Waiting for connections</div>
        </div>
      </div>
      <div class="bridge-switch" v-show="!chainSuccess">
        <img src="../assets/warn-two.png"/>
        <span>You must connect to your wallet to begin transfer</span>
      </div>
      <div class="bridge-content">
        <!--              tranfer-->
        <div v-show="showTab==0">
          <!--                tran-from-->
          <div class="tranfer-from">
            <div class="tran-from">
              <div class="tran-from-left">
                <span>From</span>
              </div>
              <div class="tran-from-right">Source Chain</div>
            </div>
            <!--                send-->
            <div class="tran-send">
              <div class="tran-send-top">
                <span class="tran-send-balance" style="cursor: pointer">
                  Max: <span @click="actionMaxBalance()">{{ balanceZ }}</span>
                  <img @click="actionTokenList()"  src="../assets/refresh.png"/>
                </span>
                <input id="tran-send-bottom-red" @input="actionInputFont()" v-model="sendAmount" maxlength="20"
                       placeholder="0.0"/>
                <div v-show="showFromVault" class="tran-send-vault tran-send-vaults">
                  <span>Vault:</span>
                  <div v-if="vaultBalanceLoading">
                    <img style="width:30px" src="../assets/loading2.gif"/>
                  </div>
                  <div v-else>
                    <span class="font-yellow" v-if="fromVault && fromVault.isMintable">{{ selectToken.symbol }} is a mintable token on {{this.chainFrom.chainName}}</span>
                    <span class="font-yellow" v-else>{{ fromVault }} {{ selectToken.symbol }}</span>
                  </div>

                </div>
              </div>
              <div class="tran-send-bottom">
              <div @click="actionChain(2)" class="tran-from-btn">
                <div class="tran-send-btn-left">
                  <img :src="chainFrom.chainLogo"/>
                  <span>{{ chainFrom.chainName }}</span>
                </div>
                <img class="tran-send-arrow-icon" src="../assets/arrow-bottom-white.png"/>
              </div>
              <div @click="actionOpenToken()" class="tran-send-btn">
                <div class="tran-send-btn-left">
                  <img :src="selectToken.logo"/>
                  <span>{{ selectToken.symbol }}</span>
                </div>
                <img class="tran-send-arrow-icon" src="../assets/arrow-bottom-white.png"/>
              </div>
            </div>
            </div>
          </div>
          <!--                change-->
          <div class="tran-change">
            <img @click="actionChangeChain()" src="../assets/change.png"/>
          </div>
          <!--                tran-to-->
          <div class="tranfer-from tran-to">
            <div class="tran-from">
              <div class="tran-from-left">
                <span>To  </span>
              </div>
              <div class="tran-from-right">Destination Chain</div>
            </div>
            <div class="tran-send">
              <div class="tran-send-top">
<!--                <span class="tran-send-balance" @click="actionMaxBalance()" style="cursor: pointer">Max: {{ balanceZ }}</span>-->
                <div id="tran-send-amount" class="tran-receiveAmount">
                  <span v-if="receivedAmountLoading"> <img style="width:30px" src="../assets/loading2.gif"/></span>
                  <span v-else-if="receivedAmount<0">Amount is less than fee</span>
                  <span v-else>{{ receivedAmount }}</span>
                </div>
                <div v-show="showToVault" class="tran-send-vault">
                  <span>Vault:</span>
                  <div v-if="vaultBalanceLoading">
                    <img style="width:30px" src="../assets/loading2.gif"/>
                  </div>
                  <div v-else>
                    <span class="font-yellow" v-if="toVault && toVault.isMintable">{{ selectToken.symbol }} is a mintable token  on {{this.chainTo.chainName}}</span>
                    <span class="font-yellow" v-else>{{ toVault }} {{ selectToken.symbol }}</span>
                  </div>
                </div>
              </div>
              <div class="tran-send-bottom">
                <div @click="actionChain(1)" class="tran-from-btn">
                  <div class="tran-send-btn-left">
                    <img :src="chainTo.chainLogo"/>
                    <span>{{ chainTo.chainName }}</span>
                  </div>
                  <img class="tran-send-arrow-icon" src="../assets/arrow-bottom-white.png"/>
                </div>
                <div class="tran-send-btn">
                  <div class="tran-send-btn-left">
                    <img :src="selectToken.logo"/>
                    <span>{{ selectToken.symbol }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="tran-vault-address">

            </div>
          </div>
            <div class="tran-send-btn tran-send-btns">
              <span class="tran-send-btns-received">Receiving Address:</span>
              <div class="tran-send-address-input">
                <input v-model="allAddress" placeholder="Please enter the address"/>
              </div>
<!--              <span class="tran-send-btn-address">{{ sortAddress }}</span>-->
              <img class="tran-send-arrow-icon tran-send-arrow-icons" src="../assets/edit.png"/>
            </div>
            <div @click.stop="showAddress=true" v-show="showAddress" class="tran-send-address">
              <div class="tran-send-address-input">
                <input v-model="allAddress" placeholder="Please enter the address"/>
                <img @click.stop="getInputAddress()" src="../assets/frame-red.png"/>
              </div>
            </div>
            <!--                  余额不足提醒-->
            <div v-show="showInsuffcientBalance" class="tran-insuff">
              <img src="../assets/warn-two.png"/>
              <span>Insufficient balance</span>
            </div>
            <!--                connect-->
            <div class="tran-connect">
            <button v-if="!allowance && !approveHash && chainFrom.chainName!=='NEAR' "
                    :class="chainSuccess==false ? 'tran-connect-approve' :''" @click="actionApprove()">Approve
            </button>
            <button v-if="!allowance &&  approveHash" class="tran-connect-approve">
              Approving... <img src="../assets/loading.gif"/>
            </button>
            <button v-if="allowance && !transferBtn"
                    :class="chainSuccess==false ? 'tran-connect-approve' :''" id="transfers-btn" @click="showConfirmAddress=true">
              Transfer
            </button>
            <button v-if="allowance && transferBtn" class="tran-connect-approve">
              Transfering... <img src="../assets/loading.gif"/>
            </button>
          </div>

        </div>
        <!--                history-->
        <div v-show="showTab==1" class="">
          <!--                  pc-->
          <div class="history">
            <div class="history-title">
              History
            </div>
            <div style="min-height: 300px">
              <div v-show="historyList && chainSuccess" v-for="(item,index) in historyList" @click="actionHistoryDetail(item)"
                   :key="index"
                   class="history-list history-lists">
                <div class="history-tops">
                  <div class="history-tops-from">
                    <div class="history-top-left">
                      <span class="history-top-amount history-top-amounts">{{ item.amount }}</span>
                      <span class="history-top-coin">{{ item.sourceToken.symbol }}</span>
                    </div>
                    <div class="history-tops-from-text">
                      <div class="history-tops-icon">
                        <img :src="item.sourceChain.chainImg"/>
                      </div>
                      <span>{{ item.fromChainName }}</span>
                    </div>
                    <span class="history-coin-time historys-coin-time">{{ item.timestamp }}</span>
                  </div>
                  <div class="history-tops-tranfrom">
                    <img src="../assets/tranform.png"/>
                  </div>

                </div>
                <div class="history-tops">
                  <div class="history-tops-from">
                    <div class="history-top-left">
                      <span class="history-top-amount history-top-amounts">{{ item.inAmount }}</span>
                      <span class="history-top-coin">{{item.sourceToken.symbol  }}</span>
                    </div>
                    <div class="history-tops-from-text">
                      <div class="history-tops-icon">
                        <img :src="item.destinationChain.chainImg"/>
                      </div>
                      <span>{{ item.toChainName }}</span>
                    </div>
                    <span v-if="item.completeTime" class="history-coin-time historys-coin-time">{{ item.completeTime }}</span>
                    <span v-else class="history-coin-time historys-coin-time">Processing</span>
                  </div>
                </div>
                <div class="historys-statu">
                  <div v-if="item.state==0" class="history-status history-status-cancel">
                    <span>Pending</span>
                    <img src="../assets/arrow-right-write.png"/>
                  </div>
                  <div v-else-if="item.state==1" class="history-status history-status-success">
                    <span>Complete</span>
                    <img src="../assets/arrow-right-write.png"/>
                  </div>
                  <div v-else class="history-status history-status-cancel">
                    <span>Processing</span>
                    <img src="../assets/arrow-right-write.png"/>
                  </div>
<!--                  <span class="history-coin-time historys-coin-time">{{ item.timestamp }}</span>-->
                </div>
              </div>
            </div>

            <div>
              <div v-if="chainSuccess && historyList && historyList.length>0" class="home-page">
                <div :class="currentPage==1?'btn-pre':'btn-next'" @click="requestHistory(false)" class="">
                  <button>Previous</button>
                </div>
                <div>
                  <span style="color:#f7be1d ">{{ currentPage }}</span>/{{ pageNum }}
                </div>
                <div :class="currentPage==pageNum?'btn-pre':'btn-next'" @click="requestHistory()" class="">
                  <button>Next</button>
                </div>
              </div>
              <div v-else class="home-page-not">
                No data
              </div>
            </div>
          </div>
          <!--                  h5-->
          <div class="history-h5">
            <div class="history-title">
              History
              <!--                      <img v-show="historyLoading && historyLoading>0" class="loading-icon" src="../assets/dialog/loading.png"/>-->
            </div>
            <div v-show="historyList" v-for="(item,index) in historyList" @click="actionHistoryDetail(item)"
                 :key="index"
                 class="">
              <div class="history-list">
                <div class="history-top">
                  <div class="history-top-show">
                    <div class="history-top-left">
                      <span class="history-top-amount">{{ item.amount }}</span>
                      <span class="history-top-coin">{{ item.sourceToken.symbol }}</span>
                    </div>
                    <div class="history-top-left history-top-left-two">
                      <span class="history-top-amount">{{ item.inAmount }}</span>
                      <span class="history-top-coin">{{  item.sourceToken.symbol }}</span>
                    </div>
                  </div>
                </div>
                <div class="history-bottom">
                  <div class="history-coin">
                    <img :src="item.sourceChain.chainImg"/> <span>{{ item.fromChainName }}</span>
                    <img src="../assets/tranform.png"/>
                    <img :src="item.destinationChain.chainImg"/> <span>{{ item.toChainName }}</span>
                  </div>
                </div>
                <div class="history-bottom">
                  <span></span>
                  <span></span>
                </div>
              </div>
              <!--                          h5time-->
              <div class="history-h5-bottom">
                <div class="history-h5-bottom-timestamp">
                  <span class="history-coin-time"> <img :src="item.sourceChain.chainImg"/> {{ item.timestamp }}</span>
                  <span v-if="item.completeTime" class="history-coin-time"><img :src="item.destinationChain.chainImg"/> {{ item.completeTime }}</span>
                  <span v-else class="history-coin-time">Processing</span>
                </div>
                <div>
                  <div v-if="item.state==0" class="history-status history-status-cancel">
                    <span>Pending</span>
                    <img src="../assets/arrow-right-yellow.png"/>
                  </div>
                  <div v-else-if="item.state==1" class="history-status history-status-success">
                    <span>Complete</span>
                    <img src="../assets/arrow-right-green.png"/>
                  </div>
                  <div v-else class="history-status history-status-cancel">
                    <span>Processing</span>
                    <img src="../assets/arrow-right-yellow.png"/>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div v-if="historyList && historyList.length>0" class="home-page">
                <div :class="currentPage==1?'btn-pre':'btn-next'" @click="requestHistory(false)" class="">
                  <button>Previous</button>
                </div>
                <div>
                  <span style="color:#E44E3A ">{{ currentPage }}</span>/{{ pageNum }}
                </div>
                <div :class="currentPage==pageNum?'btn-pre':'btn-next'" @click="requestHistory()" class="">
                  <button>Next</button>
                </div>
              </div>
              <div v-else class="home-page-not">
                No data
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bridge-rate" v-show="showFee">
        <div class="bridge-rate-content">
          <!--  <div class="bridge-rate-content-item">
              <div class="bridge-rate-left">Bridge Rate:</div>
              <div class="bridge-rate-right">1 ETH on   <img/>    ≈ 1.0000717639923096 ETH on <img/></div>
            </div> -->
          <div class="bridge-rate-content-item">
            <div class="bridge-rate-left">
              Fee
              <div class="bridge-rate-detail">
                <div v-show="showFeeDetail" class="bridge-rate-detail-top">
                  <div class="bridge-rate-detail-text">
                    <span>Total Fee: {{gasFeeVue}} {{selectToken.symbol}}.</span>
                    <span v-if="bridgeFee && bridgeFee.highest===bridgeFee.lowest">Fixed rate of {{gasFeeVue}}  {{selectToken.symbol}}.</span>
                    <span v-else-if="bridgeFee && bridgeFee.highest!==bridgeFee.lowest">{{parseFloat(bridgeFee.rate)/100}}% of total value transferred, minimum {{bridgeFee.lowest}}  {{selectToken.symbol}}, maximum {{bridgeFee.highest}}  {{selectToken.symbol}}.</span>
                    <span>The Relayer Fee: {{feeDistribution ? parseFloat(feeDistribution.relayer)/100 : 0}}%.</span>
                    <span> Relayer Fee is used to cover the gas cost on the destination chain.</span>
                    <span v-show="feeDistribution">LP Fee: {{feeDistribution ? parseFloat(feeDistribution.lp)/100 : 0}}% .</span>
                    <span>LP fee is paid to Butter Bridge LPs.</span>
                    <span v-show="feeDistribution">Protocol Fee: {{feeDistribution ? parseFloat(feeDistribution.protocol)/100 : 0}}%.</span>
                  </div>
                  <img style="cursor: pointer" src="../assets/arrow-bottom-write.png"/>
                </div>
                <img @mouseover="showFeeDetail=true" @mouseout="showFeeDetail=false" src="../assets/error.png"/>
              </div>
            </div>
            <div v-if="receivedAmountLoading" class="bridge-rate-right bridge-rate-right-loading">
              <img style="width:25px" src="../assets/loading2.gif"/>
              {{selectToken.symbol}}
            </div>
            <div v-else class="bridge-rate-right">{{ gasFeeVue }} {{selectToken.symbol}}</div>
          </div>
          <div v-show="chainFrom.symbol!='NEAR'" class="bridge-rate-content-item">
            <div class="bridge-rate-left">
              Original Chain Gas Fee Estimate
            </div>
            <div v-if="receivedAmountLoading" class="bridge-rate-right bridge-rate-right-loading">
              <img style="width:25px" src="../assets/loading2.gif"/>
              {{selectToken.symbol}}
            </div>
            <div v-else-if="gasPrice" class="bridge-rate-right">{{ gasPrice }} {{chainFrom.symbol}}</div>
          </div>
          <div class="bridge-rate-content-item">
            <div class="bridge-rate-left">Estimated Time of Arrival</div>
            <div class="bridge-rate-right">2-3 minutes</div>
          </div>
        </div>
      </div>
      <!--      //退出蒙层-->
      <div v-show="showExit" class="bridge-content-contCover"></div>
    </div>

    <Footer/>


    <!--        选择链-->
    <div v-show="showSelectChain" class="dialog-selectChain">
      <div class="dialog-content">
        <div class="dialog-selectChain-title">
          <span v-if="selectChain==0">Select Source Chain</span>
          <span v-else>Select Destination Chain</span>
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

    <!--        选择token-->
    <div v-show="showSelectToken" class="dialog-selectChain">
      <div class="dialog-content dialog-content-Token">
        <div class="dialog-selectChain-title">
          <span>Select a token</span>
          <img @click="showSelectToken=false" src="../assets/cancel.png"/>
        </div>
        <div class="dialog-selectChain-search">
          <img src="../assets/search.png"/>
          <input v-model="searchToken" placeholder="Search token by name or address">
        </div>
        <div class="dialog-token-bell">
          <img src="../assets/dialog/bell.png"/>
          <span>
                    Below is the supported token list from {{ chainFrom.chainName }} to {{ chainTo.chainName }}. More tokens can be found if you select other chains.
                  </span>
        </div>
        <div class="dialog-token">
          <div v-if="selectTokens.length==0">
            <img style="width: 60px;margin-top: 15px" src="../assets/loading2.gif"/>
          </div>
          <div v-else v-for="(item,index) in selectTokens" :key="index" @click="actionSelectToken(item,index)"
               class="dialog-token-content">
            <div class="dialog-token-contentlist">
              <div class="dialog-token-detail">
                <div class="dialog-token-detail-left">
                  <img :src="item.logo"/>
                  <div class="dialog-token-detail-left-text">
                    {{ item.name }}
                    <!--                            <span> {{ item.symbol }}</span>-->
                  </div>
                </div>
                <div v-if="item.amount!=null && item.amount>=0"
                     class="dialog-token-detail-left-right">{{ item.amount }}
                  <span>{{ item.symbol }}</span>
                </div>
                <div v-else class="dialog-token-loading">
                  <img style="width:30px" src="../assets/loading2.gif"/>
                </div>
              </div>
              <div class="dialog-token-content-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--        history交易详情-->
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
              <span>{{ historyDetailList.amount }} {{ historyDetailList.tokenSymbol }}</span>
              <span>{{ historyDetailList.from }}</span>
            </div>
          </div>
          <!--            receiving-->
          <div class="dialog-trans-detail">
            <div class="dialog-trans-detail-left">Receiving</div>
            <div class="dialog-trans-detail-right">
              <span v-if="historyDetailList.inAmount">
                {{ historyDetailList.inAmount }}  {{historyDetailList.tokenSymbol }}</span>
              <span v-else>Processing</span>
              <span>{{ historyDetailList.to }}</span>
            </div>
          </div>
          <!--            fee-->
          <div class="dialog-trans-detail">
            <div class="dialog-trans-detail-left">Fee</div>
            <div class="dialog-trans-detail-right">
              <span v-if="historyDetailList.inAmount" class="dialog-trans-detail-fee">
                {{historyDetailList.fee }}  {{historyDetailList.tokenSymbol }}
              </span>
              <span v-else>Processing</span>
            </div>
          </div>
          <!--            status-->
          <div class="dialog-trans-detail">
            <div class="dialog-trans-detail-left dialog-trans-left-status">Status</div>
            <div class="dialog-trans-detail-rights dialog-trans-detail-rights-status">
              <!--                    from-->
              <div class="dia-trans">
                <div class="dia-trans-top">
                  <img v-if="historyDetailList.sourceHash" src="../assets/dialog/success-red.png"/>
                  <img v-else src="../assets/dialog/success-write.png"/>
                  <div class="dia-trans-top-icon">
                    <img :src="fromLogo"/>
                    <span>{{ historyDetailList.fromChain ? historyDetailList.fromChain.chainName :null }}</span>
                  </div>
                </div>
                <div class="dia-trans-bottom dia-trans-bottoms">
                  <div>
                    <img v-if="historyDetailList.sourceHash" class="dia-trans-bottom-arrow"
                         src="../assets/dialog/line-red.png"/>
                    <img v-else class="dia-trans-bottom-arrow" src="../assets/dialog/line-write.png"/>
                  </div>
                  <div @click="goEth()" class="dia-trans-bottom-sourceHash">
                    {{ $formatAddress(historyDetailList.sourceHash)}}
                    <img  src="../assets/dialog/send.png"/>
                  </div>
                </div>
              </div>
              <!--                    relayer-->
              <div v-show="historyDetailList.relayerHash" class="dia-trans dia-trans-two">
                <div class="dia-trans-top">
                  <div>
                    <img v-if="historyDetailList.relayerHash" src="../assets/dialog/success-red.png"/>
                    <img v-else src="../assets/dialog/success-write.png"/>
                  </div>
                  <div class="dia-trans-top-icon">
                    <img src="../assets/token/map.png"/>
                    <span>MAP Protocol</span>
                  </div>
                </div>
                <div class="dia-trans-bottom dia-trans-bottoms">
                  <div>
                    <img v-if="historyDetailList.relayerHash" class="dia-trans-bottom-arrow"
                         src="../assets/dialog/line-red.png"/>
                    <img v-else class="dia-trans-bottom-arrow" src="../assets/dialog/line-write.png"/>
                  </div>

                  <div v-show="historyDetailList.relayerHash" @click="goMap()" class="dia-trans-bottom-sourceHash">
                    {{ $formatAddress(historyDetailList.relayerHash)}}
                    <img  src="../assets/dialog/send.png"/>
                  </div>
                </div>
              </div>
              <!--                    to-->
              <div class="dia-trans dia-trans-two">
                <div class="dia-trans-top">
                  <div>
                    <img v-if="historyDetailList.toHash" src="../assets/dialog/success-red.png"/>
                    <img v-else src="../assets/dialog/success-write.png"/>
                  </div>
                  <div class="dia-trans-top-icon">
                    <img :src="toLogo"/>
                    <span>{{ historyDetailList.toChain ? historyDetailList.toChain.chainName : null }}</span>
                  </div>
                </div>
                <div class="dia-trans-bottom dia-trans-bottoms">
                  <div>
                    <img v-if="historyDetailList.toHash" class="dia-trans-bottom-arrow"
                         src="../assets/dialog/line-red.png"/>
                    <img v-else class="dia-trans-bottom-arrow" src="../assets/dialog/line-write.png"/>
                  </div>
                  <div v-show="historyDetailList.toHash" @click="goToScan()" class="dia-trans-bottom-sourceHash">
                    {{ $formatAddress(historyDetailList.toHash)}}
                    <img  src="../assets/dialog/send.png"/>
                  </div>
                </div>
              </div>
              <div class="dia-trans dia-trans-three">
                <div class="dia-trans-top">
                  <img v-if="historyDetailList.state===1"
                       src="../assets/dialog/success-red.png"/>
                  <img v-else src="../assets/dialog/success-write.png"/>
                  <div class="dia-trans-top-icon dia-trans-top-icon-com">
                    <span>Complete</span>
                  </div>
                </div>
              </div>
              <div class="dia-trans-top-add">
                <span @click="actionChangeChain(1)">Add destination network to your wallet</span>
                <span v-show="historyDetailList.fromChain && historyDetailList.fromChain.chainName!='NEAR' && historyDetailList.tokenAddress!='0x0000000000000000000000000000000000000000' " @click="actionAddToken(historyDetailList)">
                  Add token to your wallet
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!--          approve弹窗-->
    <div v-show="dialogApproving" class="dialog-selectChain">
      <div class="dialog-content dialog-content-approve">
        <div class="dialog-approve-title">
          <img @click="dialogApproving=false" src="../assets/cancel.png"/>
        </div>
        <img class="loading-icon" src="../assets/dialog/loading.png"/>
        <div class="dialog-content-approve-text">Approving...</div>
      </div>
    </div>

    <!--          transing弹窗-->
    <div v-show="dialogTransing" class="dialog-selectChain">
      <div class="dialog-content dialog-content-approve">
        <div class="dialog-approve-title">
          <img v-show="transferBtn" @click="dialogTransing=false" src="../assets/cancel.png"/>
        </div>
        <img class="loading-icon" src="../assets/dialog/loading.png"/>
        <div class="dialog-content-approve-text">Transfering...</div>
      </div>
    </div>

<!--    跳转到history的弹窗-->
    <div v-show="showGoHistory" class="dialog-selectChain">
      <div class="dialog-content dialog-content-approve">
        <div class="dialog-approve-title">
          <img  @click="getAllData(showGoHistory=false)" src="../assets/cancel.png"/>
        </div>
        <div @click="actionEmitHeader(1)" class="dialog-content-history-text">Go to History to see your transfer status</div>
      </div>
    </div>


<!--    确认地址的弹窗-->
    <div v-show="showConfirmAddress" class="dialog-selectChain">
      <div class="dialog-content dialog-content-address">
        <div class="dialog-approve-title">
          <img  @click="showConfirmAddress=false" src="../assets/cancel.png"/>
        </div>
        <div class="dialog-warn-icon">
          <img src="../assets/dialog/warn-two.png"/>
        </div>
        <div class="dialog-content-address-text">
         Warning: Please confirm your "receiving address" is correct and of the correct blockchain before proceeding
        </div>
        <div @click="actionTrans()" class="dialog-content-address-confirm">Confirm</div>
      </div>
    </div>




    <!--          nft弹窗-->
    <div v-show="dialogNft" class="dialog-selectChain">
      <div class="dialog-content dialog-content-nft">
        <div class="dialog-selectChain-title">
          <span>Select NFT</span>
          <img @click="dialogNft=false" src="../assets/cancel.png"/>
        </div>
        <div class="dialog-selectChain-search">
          <img src="../assets/search.png"/>
          <input v-model="searchToken" placeholder="Token address / Token ID / Token Name">
        </div>
        <div v-for="(item,index) in  nftList" :key="index" class="dialog-nft">
          <div class="dialog-nft-item">
            <div class="dialog-nft-left">
              <img :src="item.img"/>
              <div class="dialog-nft-name">
                <span>{{ item.name }}</span>
                <span>#{{ item.id }}</span>
              </div>
            </div>
            <div class="dialog-nft-name">
              <span>{{ item.name }} ( {{ item.symbol }} )</span>
              <span>{{ item.address }}</span>
            </div>
          </div>

          <div class="dialog-nft-line"></div>
        </div>

      </div>
    </div>


    <!--            提示错误弹窗-->
    <div v-show="showErrorMessage" class="dialog-selectChain">
      <div class="dialog-content dialog-content-warn">
        <div @click="closeErrorMessage(showErrorMessage=false)" class="dialog-warn-close">
          <img src="../assets/dialog/close-two.png"/>
        </div>
        <div class="dialog-warn-icon">
          <img src="../assets/dialog/warn-two.png"/>
        </div>
        <span>{{ errorMessage }}</span>
      </div>
    </div>

  </div>
</template>

<script>

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Decimal from 'decimal.js'
import moment from "moment";
import eventBus from "@/eventBus";

const tokenAbi = require('@/config/token_abi.json');
const mapAbi = require('@/config/mapData.json');
import config from '@/config/base'
import near from '@/config/near'
import Web3 from 'web3'

//sdk
import {getBridgeFee, getVaultBalance,getDistributeRate} from "butterjs-sdk/dist/core/tools/dataFetch";
import { SUPPORTED_CHAIN_LIST_MAINNET,MOS_CONTRACT_ADDRESS_SET,ID_TO_CHAIN_ID} from 'butterjs-sdk/dist/constants/index.js';
import {ID_TO_SUPPORTED_TOKEN} from "butterjs-sdk/dist/utils/tokenUtil.js";
import { getTokenCandidates } from "butterjs-sdk/dist/core/tools/dataFetch.js";
import {Token} from "butterjs-sdk/dist/entities/index.js";
import {verifyNearAccountId,validateAndParseAddressByChainId} from "butterjs-sdk/dist/utils/addressUtil.js";
import {EVMNativeCoin} from "butterjs-sdk/dist/entities/native/EVMNativeCoin.js";
import { ButterBridge } from "butterjs-sdk/dist/core/bridge/bridge.js";


import * as nearAPI from "near-api-js";
const { connect, Contract ,keyStores } = nearAPI;
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import store from "@/store";


export default {
  name: "Home.vue",
  components: {Footer, Header},
  data() {
    return {
      gasPrice:0,//Original Chain Gas
      showConfirmAddress:false,//确认地址的弹窗
      showGoHistory:false,//选择跳转历史记录
      showFeeDetail:false,//fee的详情展示
      mapChainId:config.map.chainId,
      vaultBalanceLoading:false,
      error:true,//是否在链上链接
      receivedAmountLoading:false,
      ReceivedAmount:0,
      showExit: false,//退出
      showFee: false,//显示Fee
      showFromVault: true,//From 如果代币是ismint 不显示
      showToVault: true,// From如果代币是ismint 不显示
      fromVault: 0,//fromVault
      toVault: 0,//toVault
      isLoadingAllData: false,
      showErrorMessage: false,//显示错误认识弹窗
      errorMessage: 'Your gas fee is not enough Your gas fee is not enough',//错误信息
      showInsuffcientBalance: false,//余额不足提醒
      account: '',//用户地址
      historyTimerLoading: [],
      historyLoading: null,
      setTimeHistoryLoading: false,

      statusTimer: false,

      chainSuccess: false,//当前选择链和当前链是否一致
      gasFee: 0,//gas费
      gasFeeVue: 0,//gas费页面显示
      feeDistribution:null,//fee
      bridgeFee:null,//fee
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
      chainList: [],
      chainFrom: {
        chainName: "BSC Mainnet",
        chainLogo: require('../assets/token/bsc.png'),
        chain: 'BSC',
        chainId: config.bsc_mainnet.chainId,
        contract: MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(config.bsc_mainnet.chainId)],
        symbol: 'BSC'
      },  //From Chain选择
      chainTo: {
        chainName: config.polygon.chainName,
        chainLogo: require('../assets/token/polygon.png'),
        chain: 'MATIC',
        chainId: config.polygon.chainId,
        contract: MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(config.polygon.chainId)],
        symbol: 'MATIC'
      }, //To Chain 选择
      selectToken: {},// 选择Token
      tokenList: [],//Token列表
      historyList: [],//history记录
      historyFromLogo: '', //历史记录 From logo
      historyToLogo: '',//历史记录 To logo
      sourcePath: 'ETH',//formChain
      destNetwork: 'MAP',//toChain
      balanceZ: 0,//Token的余额
      sendAmount: '',//From发送价格
      sendAllAmount: '',//From价格*10*18
      receivedAmount: '0.0',//To兑换获得的价格,
      searchVal: '',  //弹窗链查找默认输入为空
      searchToken: '',//弹窗 Token查找
      sortAddress: '',//短地址
      allAddress: '',//输入的地址
      allowance: false,
      langToAddress: '',//To到的长地址
      approveHash: '',//approveHash
      transHash: '',//transHash
      historyDetailList: '',//历史记录详情
      setTimeHistory: null,
      historyHash: '',//查看历史详情传的数据
      fromLogo: '', //历史详情fromlogo
      toLogo: '', //历史详情tologo
      fromHref: '',//历史详情from链接
      toHref: '',//历史详情to链接
      transferBtn: false,
      checkApproveToken: '',
      changeChain: false,  //切换料
      dialogApproving: false, //弹窗Approving显示
      dialogTransing: false, //弹窗Transfering显示
      dialogNft: false, //弹窗NFT显示
      allowanceMap: false,//Approve Map
      approveMapHash: '',//Approve Map hash
      // dialogApproving: false,//approveing map diaglog
      mapBalance: '',
      chainIdHex: config.bsc_mainnet.chainHex,
      chainIdNumber: config.bsc_mainnet.chainId,

      selectTokens: [],
      nftList: [
        {
          name: 'MAP Mapper  ',
          id: '#28387',
          img: require('../assets/dialog/card-icon.png'),
          address: '0X9f…91a8',
          symbol: ' MAP '
        },
        {
          name: 'MAP Mapper  ',
          id: '#28387',
          img: require('../assets/dialog/card-icon.png'),
          address: '0X9f…91a8',
          symbol: ' MAP '
        },
        {
          name: 'MAP Mapper  ',
          id: '#28387',
          img: require('../assets/dialog/card-icon.png'),
          address: '0X9f…91a8',
          symbol: ' MAP '
        }
      ],
      selectNFT: {
        name: 'MAP Mapper  ',
        id: '#28387',
        img: require('../assets/token/map.png')
      },//选择的nft
    }
  },

  watch: {
    sendAmount() {
      // this.receivedAmount = new Decimal(this.sendAmount).sub(new Decimal(this.gasFeeVue))
      if (this.sendAmount > 0) {
        this.showFee = true
      } else {
        this.showFee = false
      }
    },
    address(newVal) {
      this.allAddress = this.$store.getters.getAddress;
      this.langToAddress = this.$store.getters.getAddress;
      this.requestData();
    },
    chainId(newVal) {
      // console.log('Home Watch chainId',newVal)
      this.requestData();
    },
    async searchToken(newV, oldV) {
      //逻辑-->根据input的value值筛选goodsList中的数据
      let inputContent = this.searchToken.substring(0, 2)
      let arrByZM = [];//声明一个空数组来存放数据

      let prodiver = this.actionProvider()
      const tokenCandidates = await getTokenCandidates(
          this.chainFrom.chainId.toString(), // from chain
          this.chainTo.chainId.toString(), // to chain
          // prodiver
          prodiver
      );

      let tokenListRes = tokenCandidates
      if (tokenListRes) {
        if (inputContent !== '0x') {
          for (let i = 0; i < tokenListRes.length; i++) {
            //for循环数据中的每一项（根据name值）
            // console.log('tokenList',tokenListRes)
            if (tokenListRes[i] && tokenListRes[i].name.toUpperCase().search(this.searchToken.toUpperCase()) != -1) {
              //判断输入框中的值是否可以匹配到数据，如果匹配成功
              arrByZM.push(tokenListRes[i]);
              //向空数组中添加数据
            }
          }
        } else {
          for (let i = 0; i < tokenListRes.length; i++) {
            //for循环数据中的每一项（根据name值）
            if (tokenListRes[i] && tokenListRes[i].address.search(this.searchToken) != -1) {
              //判断输入框中的值是否可以匹配到数据，如果匹配成功
              arrByZM.push(tokenListRes[i]);
              //向空数组中添加数据
            }
          }
        }
      }
      this.selectTokens = arrByZM;
    },
    dialogApproving(newValue) {
      // console.log("dialogApproving", newValue, new Date())
    },
  },

  computed: {
    address() {
      return this.$store.state.address;
    },
    chainId() {
      return this.$store.state.chainId;
    },
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
    account_default_address() {
      return this.$store.state.account.default_address
    },
    account_change_chain() {
      return this.$store.state.account.change_chain
    },
  },

  created() {
  },

  methods: {
    async getSortAddress(hash) {
        if (hash) {
          return hash.substr(0, 9) + '...' + hash.substr(hash.length-8,hash.length())
        }
    },

    //退出
    async actionEixt(data) {
      if (data == false) {
        this.showExit = true
        this.sortAddress = '......'
        this.balanceZ = 0
        this.historyList = []
      } else {
        this.showExit = false
        await this.getAllData()
      }
    },

    async actionEixtMount() {
      let exit = localStorage.getItem('exit')
      if (JSON.parse(exit) == false) {
        await this.getAllData()
        this.showExit = true
        this.sortAddress = '......'
        this.balanceZ = 0
        this.historyList = []
      } else {
        this.showExit = false
        this.getAllData()
      }
    },

    //获取token信息
    actionTokenDetail() {
      let tokenDetail;
      let v = this

      // this.actionTokenList()

      //主币
      if (v.selectToken.address == '0x0000000000000000000000000000000000000000') {
        tokenDetail = new EVMNativeCoin(
            v.selectToken.chainId,
            v.selectToken.decimals,
            v.selectToken.symbol,
            v.selectToken.name,
            v.selectToken.logo,
        )
        return tokenDetail
      }
      //代币
      else {
        // console.log(' v.selectToken.chainId,', v.selectToken.chainId,)
        tokenDetail = new Token(
            v.selectToken.chainId,
            v.selectToken.address,
            v.selectToken.decimals,
            v.selectToken.symbol,
            v.selectToken.name,
            v.selectToken.logo,
        )
        return tokenDetail
      }

    },

    //获取vault
    async actionVaultBalance() {
      let v = this
      this.vaultBalanceLoading = true

      if (v.selectToken.address == null) {
        return;
      }


      let tokenDetail = v.actionTokenDetail()

      var prodiver = this.actionProvider()

      console.log('getVaultBalance', v.chainFrom.chainId,
          tokenDetail,
          v.chainTo.chainId,
          prodiver)

      let vaultsFrom = await getVaultBalance(
          v.chainFrom.chainId,
          tokenDetail,
          v.chainTo.chainId,
          prodiver
      )

      let vaultsTo = await getVaultBalance(
          v.chainTo.chainId,
          vaultsFrom.token,
          v.chainFrom.chainId,
          prodiver
      )
      if (vaultsFrom && vaultsFrom.isMintable) {
        v.toVault = vaultsFrom
      }
      else  {
        v.toVault = new Decimal(vaultsFrom.balance).div(Math.pow(10,vaultsFrom.token.decimals)).toFixed(6)
      }

      if (vaultsTo && vaultsTo.isMintable) {
        v.fromVault = vaultsTo
      }
      else  {
        v.fromVault = new Decimal(vaultsTo.balance).div(Math.pow(10,v.selectToken.decimals)).toFixed(6)
      }

      this.vaultBalanceLoading = false

      console.log('  v.FromVault',  vaultsFrom, vaultsTo )


    },

    actionEmitHeader(data) {
      this.showTab = data
      // eventBus.$on("listenTab",(message)=>{   //这里最好用箭头函数，不然this指向有问题
      //   this.showTab = message
      // })
      if (this.showTab === 0) {
        this.actionOpenTransfer()
      } else if (this.showTab === 1) {
        eventBus.$emit("listenTab",1)
        this.actionHistory()
      }
    },

    getApproveStatus(key, tokenAddress) {
      let approving = localStorage.getItem(key);
      if (approving) {
        if (typeof approving === 'string') {
          approving = JSON.parse(approving);
        }
        approving = approving[tokenAddress];
        if (approving == false) {
          return 'done';
        }
        if (approving) {
          return 'doing';
        }
      }
      return 'none';
    },

    setApproveStatus(key, tokenAddress, status) {
      let approving = localStorage.getItem(key);
      if (approving) {
        if (typeof approving === 'string') {
          approving = JSON.parse(approving);
        }
      } else {
        approving = {}
      }
      approving[tokenAddress] = status;
      localStorage.setItem(key, JSON.stringify(approving));
    },
    //到eth浏览器
    goEth() {
        if (this.historyDetailList.fromChain.chainName==='NEAR') {
          window.open(`${this.historyDetailList.fromChain.scanUrl}transactions/${this.historyDetailList.sourceHash}`, '_blank')
        }
        else  {
          window.open(`${this.historyDetailList.fromChain.scanUrl}tx/${this.historyDetailList.sourceHash}`, '_blank')
        }

    },

    //到map浏览器
    goMap() {
      if (this.historyDetailList.state === 2 || this.historyDetailList.state === 1) {
        window.open(`${this.historyDetailList.relayerChain.scanUrl}/tx/${this.historyDetailList.relayerHash}`, '_blank')
      }
    },

    //到To地址
    goToScan() {
      if (this.historyDetailList.toChain.chainName==='NEAR') {
        window.open(`${this.historyDetailList.toChain.scanUrl}transactions/${this.historyDetailList.toHash}`, '_blank')
      }
      else  {
        window.open(`${this.historyDetailList.toChain.scanUrl}tx/${this.historyDetailList.toHash}`, '_blank')
      }
    },

    //判断是否是数组
    isNumber(value) {         //验证是否为数字
      let patrn = /^(-)?\d+(\.\d+)?$/;
      if (patrn.exec(value) == null || value === "") {
        return false
      } else {
        return true
      }
    },

    //打开Token弹窗
    actionOpenToken() {
      this.searchToken = ''
      this.showSelectToken = true
      this.actionShowToken()
    },

    //增加代币
    actionAddToken(token) {
      let newToken = token

      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address:newToken.tokenAddress,
            symbol:newToken.tokenSymbol,
            decimals:newToken.fromTokenDecimal,
            // image: base64image,
          },
        },
      });
    },

    //关闭提示错误的弹窗
    closeErrorMessage() {
      this.showErrorMessage = false;
      this.errorMessage = ''
    },

    //获取最大值
    actionMaxBalance() {
      this.sendAmount = this.balanceZ
      this.actionInputFont()
    },

    //输入数值超出时 显示红色
    actionInputFont() {

      if (!this.sendAmount) {
        this.receivedAmount = 0
        this.showInsuffcientBalance = false
        return
      }
      this.showFee = false
      let transfer = document.getElementById('transfers-btn')
      let amount = this.sendAmount.toString().replace(/[^\d.]/g, "")
      this.sendAmount = amount
      let input = document.getElementById('tran-send-bottom-red')

      //余额不足时 input字体颜色  Transfer按钮颜色  余额不足提醒
      this.receivedAmount = new Decimal(this.sendAmount).sub(new Decimal(this.gasFeeVue))
      console.log('this.receivedAmount',this.receivedAmount.toFixed())
      if (new Decimal(this.sendAmount).sub(new Decimal(this.balanceZ)) > 0 || this.receivedAmount<0) {
        input.style.color = '#f6d536'
        this.showInsuffcientBalance = true
        this.actionGasFee()
        transfer.className = 'tran-connect-approve'
        // this.showFee = false
      } else {
        this.showFee = true
        this.actionGasFee()
        input.style.color = '#ffffff'
        this.showInsuffcientBalance = false
        transfer.className = ''
      }
    },

    //获取gas费
    async actionGasFee() {
      //创建合约
      //
      let tokenDetail = this.actionTokenDetail()
      // console.log('tokenDetail',tokenDetail)
      let provider = this.actionProvider()

      if (!this.sendAmount) {
        return
      }

      this.receivedAmountLoading = true

      let amount = new Decimal(this.sendAmount).mul(Math.pow(10, this.selectToken.decimals))

      const feeRate  = await getDistributeRate(config.map.chainId.toString())
      this.feeDistribution = feeRate
      console.log('feeRate',feeRate)

      let tokenList = ID_TO_SUPPORTED_TOKEN(this.chainFrom.chainId.toString());
      let mainDecimal;

      for (let item in tokenList) {
        if (tokenList[item].address === "0x0000000000000000000000000000000000000000") {
          mainDecimal = tokenList[item].decimals
        }
      }

      console.log('mainDecimal',tokenList,mainDecimal)

      const bridge = new ButterBridge();

      this.langToAddress = this.allAddress

      const fee = await getBridgeFee(
          tokenDetail,
          this.chainTo.chainId,
          amount.toFixed().toString(),
          provider
      );

      console.log('gasPrice', this.gasPrice)

      if (this.chainFrom.symbol == 'NEAR') {
        this.gasPrice = null
      }else  {

        let request = {
          fromAddress: this.account,
          fromToken: this.selectToken,
          fromChainId: this.chainFrom.chainId,
          toChainId: this.chainTo.chainId,
          toAddress: this.langToAddress,
          amount: this.$web3.utils.toWei(this.sendAmount).toString(),
          options: {signerOrProvider: this.$web3.eth},
        };

        console.log('request',request)

        try {
          const estimatedGas = await bridge.gasEstimateBridgeToken(request);
          console.log('gas estimate', estimatedGas);

          const adjustedGas = Math.floor(Number.parseFloat(estimatedGas) * 1.2).toString();
          console.log('adjustedGas',adjustedGas)

          let web3 = await this.$client(this.chainIdHex);
          let gasPrice = await web3.eth.getGasPrice()
          console.log('gasPriceeee',gasPrice)
          gasPrice = new Decimal(gasPrice).mul(new Decimal(adjustedGas)).div(Math.pow(10,mainDecimal))
          this.gasPrice =gasPrice
          console.log('gasPrice',gasPrice.toFixed())
        }catch (e) {
          this.gasPrice = 'Insufficient balance'
        }


      }


      console.log('amount',fee,fee.amount)
      console.log('feeRate',fee.feeRate)
      this.bridgeFee = fee.feeRate
      this.bridgeFee.lowest = new Decimal(this.bridgeFee.lowest).div(new Decimal(Math.pow(10, this.selectToken.decimals))).toFixed()
      this.bridgeFee.highest = new Decimal(this.bridgeFee.highest).div(new Decimal(Math.pow(10, this.selectToken.decimals))).toFixed()
      this.gasFeeVue = new Decimal(fee.amount).div(new Decimal(Math.pow(10, this.selectToken.decimals))).toFixed()
      this.receivedAmount = new Decimal(this.sendAmount).sub(new Decimal(this.gasFeeVue))
      this.receivedAmountLoading = false
      console.log('gasFeeVue fee', this.gasFeeVue);

    },

    //交换链
    actionChangeChain(num) {

      if (num===1) {
        this.selectChain = 0
        console.log('this.historyDetailList.toChain',this.historyDetailList.toChain)
        console.log(' this.chainList', this.chainList)
        let toChain;
        for (const item in this.chainList) {
          console.log( this.chainList[item])
          if ( this.chainList[item].chainId === this.historyDetailList.toChain.chainId) {
                toChain =  this.chainList[item]
          }

        }

        console.log('toChain',toChain)

        this.handleLink(toChain)
        return
      }
      this.selectChain = 0
      this.changeChain = true
      console.log(this.chainTo, 'chainTo')
      this.handleLink(this.chainTo)
    },

    //Token弹窗余额获取
    async actionShowToken() {
      console.log('==========',typeof this.chainIdNumber)
      // this.actionTokenList()
      if (this.selectTokens) {
        this.selectTokens.forEach(item => {
          item.amount = null;
        })
      }
      let v = this
      // await  this.actionTokenList()

      let prodiver = this.actionProvider()

      const tokenCandidates = await getTokenCandidates(
          v.chainFrom.chainId, // from chain
          v.chainTo.chainId, // to chain
          // prodiver
          prodiver
      );
      console.log('target token', tokenCandidates);

      let tokenList = this.$copyObject(tokenCandidates);
      let selectTokens = this.$copyObject(ID_TO_SUPPORTED_TOKEN(this.chainFrom.chainId.toString()));
      let formTokenList = this.$copyObject(ID_TO_SUPPORTED_TOKEN(this.chainFrom.chainId.toString()));
      let toTokenList = this.$copyObject(ID_TO_SUPPORTED_TOKEN(this.chainTo.chainId.toString()));

      if (!formTokenList || !toTokenList || formTokenList.length === 0 || toTokenList.length === 0) {
        this.tokenList = [];
        this.selectTokens = selectTokens;
        return;
      }


      //获取地址
      let temp = [];
      for (let i = 0; i < tokenCandidates.length; i++) {
        let item = tokenCandidates[i]
        console.log('item',item)
        //如果当前链的币种是选择链上的主币   获取主币余额
        let item2 = {};
        if (item.address === '0x0000000000000000000000000000000000000000') {
          if (this.chainFrom.symbol=='NEAR') {
            item2 = await v.getNearBalance(item)
          }
          else  {
            item2 = await v.getBalance(item)
          }
          // item2 = await v.getBalance(item)
        }
        //代币余额
        else {
          if (this.chainFrom.symbol=='NEAR') {
            item2 = await v.getNearTokenBalance(item)
          }
          else  {
            item2 = await v.getTokenBalance(item)
          }
          // item2 = await v.getTokenBalance(item)
        }
        temp.push(this.$copyObject(item2))
      }
      this.tokenList = temp;

      this.selectTokens = temp;
      for (const item of this.selectTokens) {
        if (this.selectToken.symbol === item.symbol) {
          this.balanceZ = item.amount
        }
      }

      // this.tokenAllList(this.chainIdNumber) = this.selectTokens
      let tokenlist = tokenCandidates
      tokenlist = this.selectTokens;

      console.log('tokenlist', tokenlist)
    },

    //选择Token
    async actionSelectToken(item, index) {

      this.selectToken.symbol = item.symbol
      this.selectToken.decimals = item.decimals
      this.selectToken.logo = item.logo
      this.selectToken.address = item.address
      this.selectToken.isToken = item.isToken
      this.selectToken.isNative = item.isNative

      // this.selectToken=item

      // console.log('selecToken', this.selectToken.address)

      this.balanceZ = item.amount

      this.showSelectToken = false

      this.actionApproveOrTransfer()

      this.actionStatus()

      this.actionShowToken()

      this.actionVaultBalance()

      this.actionInputFont()

    },

    //near链主币
    async getNearBalance(item) {
      let web3 = await this.$client(this.chainIdHex);
      if (!web3 || !this.tokenList) {
        return item
      }

      let balance;

      //NEAR 链的情况
        // gets account balance
        const nearConnection = await connect(config.connectionConfig);
        const account = await nearConnection.account(this.account);
        balance = await account.getAccountBalance();
        balance = balance.total;
        console.log('balance', balance)

      for (const token of this.tokenList) {
        if (token.symbol === item.symbol) {
          let newObject = {}
          let decimal = token.decimals
          newObject.amount = new Decimal(balance).div(Math.pow(10, decimal))
          newObject.amount = Math.floor(newObject.amount * 1000000) / 1000000
          item = Object.assign(item, newObject)
          item = JSON.parse(JSON.stringify(item));
          break;
        }
      }
      return item
    },

    //获取代币余额
    async getNearTokenBalance(item) {
      let web3 = await this.$client(this.chainIdHex);

      if (!this.chainList || !web3) {
        return item;
      }
      let token_address = item.address;
      let balance;

      //near链上
        const nearConnection = await connect(config.connectionConfig);
        const account = await nearConnection.account(this.account);
        const contractToken = new Contract(
            account,// the account object that is connecting
            token_address, // 代币的地址
            {
              // name of contract you're connecting to
              viewMethods: ["ft_balance_of"], // 获取余额的方法
            }
        );
        balance = await contractToken.ft_balance_of({'account_id': this.account}); // 用户账户地址
        console.log(balance);
      //metamask上

      //获取代币精度
      let decimals = item.decimals
      if (balance) {
        let newObject = {}
        newObject.amount = new Decimal(balance).div(Math.pow(10, decimals))
        newObject.amount = Math.floor(newObject.amount * 1000000) / 1000000
        item = Object.assign(item, newObject)
        item = JSON.parse(JSON.stringify(item));
      }
      return item
    },

    //获取主币余额
    async getBalance(item) {
      console.log('getBalance mainCoin')
      let web3 = await this.$client(this.chainIdHex);
      if (!web3 || !this.tokenList) {
        return item
      }

      let balance = await web3.eth.getBalance(this.account)

      for (const token of this.tokenList) {
        if (token.symbol === item.symbol) {
          let newObject = {}
          let decimal = token.decimals
          newObject.amount = new Decimal(balance).div(Math.pow(10, decimal))
          newObject.amount = Math.floor(newObject.amount * 1000000) / 1000000
          item = Object.assign(item, newObject)
          item = JSON.parse(JSON.stringify(item));
          break;
        }
      }
      return item
    },

    //获取代币余额
    async getTokenBalance(item) {
      console.log(this.account, this.chainIdHex, 'getBalance token')
      let web3 = await this.$client(this.chainIdHex);
      if (!this.chainList || !web3) {
        return item;
      }
      let token_address = item.address;
      let contract = new web3.eth.Contract(tokenAbi, token_address)
      console.log(contract, token_address, 'getBalance')
      let balance;

      balance = await contract.methods.balanceOf(this.account).call();

      //获取代币精度
      let decimals = item.decimals
      if (balance) {
        let newObject = {}
        newObject.amount = new Decimal(balance).div(Math.pow(10, decimals))
        newObject.amount = Math.floor(newObject.amount * 1000000) / 1000000
        item = Object.assign(item, newObject)
        item = JSON.parse(JSON.stringify(item));
      }
      return item
    },

    //判断按钮Approve还是Trans
    actionApproveOrTransfer() {
      if (this.selectToken.address === '0x0000000000000000000000000000000000000000') {
        this.allowance = true;
        //清空检测事件
        this.approveHash = '';
      } else {
        this.checkApproved()
      }

    },

    //发送Transfer交易
    async actionTrans() {

      this.actionChainSuccess()


      if (this.chainSuccess == false) {
        this.$toast('Network error,please link to the correct network')
        return
      }

      if (this.showInsuffcientBalance) {
        return
      }

      let v = this

      this.showConfirmAddress = false
      // return
      let reward_address = v.chainFrom.contract

      //判断输入金额是否大于0

      if (!v.sendAmount) {
        v.$toast('Please enter the amount')
        return
      }

      if (Object.prototype.toString.call(this.toVault) === '[object Object]') {

      }
      else {
        if (this.toVault && new Decimal(this.toVault).sub(new Decimal(this.sendAmount))<0) {
          v.$toast('Insufficient balance')
          return
        }
      }

      const bridge = new ButterBridge();

      v.sendAllAmount = new Decimal(v.sendAmount).mul(Math.pow(10, v.selectToken.decimals)).toString()

      console.log('sendAllAmount', v.sendAllAmount)

      this.langToAddress = this.allAddress


      if (this.langToAddress == '') {
        this.$toast('Address cannot be empty')
        return
      }


      if (v.chainTo.symbol==='NEAR') {
        //校验Received Address地址规则
        let nearAccountState = await verifyNearAccountId(
            this.langToAddress,
            this.chainTo.chainId
        );
        console.log('nearAccountState',nearAccountState)
        if (!nearAccountState.isValid) {
          // let msg = nearAccountState.errMsg.split(':')[1]
          // this.$toast(msg)
          this.$toast(`Incorrect Receiving Address ${this.langToAddress}`)
          return
        }
      }else  {
        try {
          let evmAddress = validateAndParseAddressByChainId( this.langToAddress, this.chainTo.chainId);
          console.log('evmAddress',evmAddress)
        }catch (e) {
          this.$toast(`Incorrect Receiving Address ${this.langToAddress}`)
          return
        }

      }

      let tokenDetail = v.selectToken

      console.log('this.selectToken',tokenDetail,this.sendAllAmount)

      let request = {
        fromAddress: v.account,
        fromToken: tokenDetail,
        fromChainId: this.chainFrom.chainId,
        toChainId: this.chainTo.chainId,
        toAddress: this.langToAddress,
        amount: this.$web3.utils.toWei(v.sendAmount).toString(),
        options: {signerOrProvider: this.$web3.eth},
      };
      console.log('request',request)

      let bridgeRequest;

      if (this.chainFrom.symbol == 'NEAR') {

        let nearConnect = await near.asyncNearWallet()

        bridgeRequest = {
          fromAddress: v.account,
          fromToken: v.selectToken,
          fromChainId: this.chainFrom.chainId,
          toChainId: this.chainTo.chainId,
          toAddress: this.langToAddress,
          amount: parseNearAmount(v.sendAmount).toString(),
          options: {
            nearProvider: nearConnect.walletConnection,
            gas: '100000000000000', // 例子
          },
        };

      } else {

        //gas预估

        console.log('estimatedGas')
        const estimatedGas = await bridge.gasEstimateBridgeToken(request);
        console.log('gas estimate', estimatedGas);


        // 3. Bridge(真正的Bridge)
        const adjustedGas = Math.floor(
            Number.parseFloat(estimatedGas) * 1.2
        ).toString();

        console.log('adjustedGas', adjustedGas)


        if (this.sendAmount && new Decimal(this.sendAmount).sub(new Decimal(this.gasFeeVue)) < 0) {
          v.$toast('The transfer amount needs to be greater than Fee')
            return
        }


        bridgeRequest = {
          fromAddress: v.account,
          fromToken: v.selectToken,
          fromChainId: this.chainFrom.chainId,
          toChainId: this.chainTo.chainId,
          toAddress: this.langToAddress,
          amount: this.$web3.utils.toWei(v.sendAmount).toString(),
          options: {signerOrProvider: this.$web3.eth, gas: adjustedGas},
        };
      }


      console.log('bridgeRequest',bridgeRequest)

      const receipt = await bridge.bridgeToken(bridgeRequest);
      console.log('tx receipt', receipt,receipt.transactionHash);

      if (this.chainFrom.symbol=='NEAR') {
        this.$router.push(`/home?sourceNetwork=NEAR&destNetwork=${this.$route.query.destNetwork}&ts=${Date.now()}`)
        v.showGoHistory = true
        return
      }


      const promiReceipt = receipt.promiReceipt;
      await promiReceipt
          .on('transactionHash', function (hash) {
            console.log('hash', hash);
            v.transHash = hash
            v.transferBtn = true
            // console.log(`hash`, hash)
            v.dialogTransing = true
          })
          .on('receipt', function (receipt) {
            console.log('receipt', receipt);
            v.allowance = true
            v.transferBtn = false
            v.dialogTransing = false
            v.showGoHistory = true
          });
          // if (!v.showGoHistory ) {
          //   this.getAllData()
          // }
          // this.actionTimerHistory()
    },

    //交易成功后 给后端传数据
    async actionSubBridge() {
      let v = this
      //获取当前链ID
      let params = {
        contract: this.chainFrom.contract,//合约地址
        from: this.account, //from地址
        to: this.account, //to 地址
        tokenAddress: v.selectToken.address,//代币地址
        amount: v.sendAllAmount,//数量
        fromChainid: this.chainIdNumber,
        toChainid: v.chainTo.chainId, //目标链ChainId
        hash: v.transHash  //hash
      }

      // console.log('params', params)
      let result = v.$http.getSubBrigge(params)
      if (result.code == 200) {
      }

    },

    //打开Transfer
    async actionOpenTransfer() {
      this.cleanLoadingTimer();
    },


    //查询未完成的历史交易
    async actionUndoneTransfer() {
      if (!this.account) {
        return;
      }
      let result = await this.$http.undoneTransfer({
        chainId: this.chainFrom.chainId,
        address: this.account,
      });
      if (result.code === 200) {
        this.historyLoading = result.data.count
      }
      result = this.cleanLoadingTimer();
      if (result) {
        this.actionHistory()
      }
    },


    //调取历史loading 定时器
    actionTimerHistory() {
      let timer = setInterval(() => {
        this.actionUndoneTransfer()
      }, 30000)
      this.historyTimerLoading.push(timer)
    },


    //获取历史记录
    async actionHistory() {
      this.showGoHistory = false
      console.log('history',this.chainIdNumber, this.account,this.currentPage,this.pageSize)
      let result = await this.$http.historyList({
        chainId: this.chainFrom.chainId,
        address: this.account,
        page: this.currentPage,
        size: this.pageSize,
      })
      if (result.code !== 200) {
        return;
      }
      this.historyList = result.data.list
      this.total = result.data.total
      this.pageNum = Math.ceil(this.total / this.pageSize) || 1;
      if (this.historyList.length <= 0) {
        return
      }
      let items = [];
      for (const item of this.historyList) {
        let newObject = {
          fromLogo: '',
          fromChainName: '',
          toLogo: '',
          toChainName: ''
        }
        let fromChainId = item.fromChainId
        let toChainId = item.destinationChain.chainId
        let fromDecimal
        let toDecimal
        let fromSymobl = this.selectToken.symbol

        console.log('fromChainId',fromChainId)

        for (const chain of this.chainList) {
          if (fromChainId == chain.chainId) {
            newObject.fromLogo = chain.chainLogo
            newObject.fromChainName = chain.chainName
          }
          if (toChainId == chain.chainId) {
            newObject.toLogo = chain.chainLogo
            newObject.toChainName = chain.chainName
          }
        }




        let tokens = ID_TO_SUPPORTED_TOKEN(fromChainId)
        let tokenTo = ID_TO_SUPPORTED_TOKEN(toChainId)

        console.log('tokenTo',tokenTo)

        for (let i = 0; i < tokenTo.length; i++) {
          let token = tokenTo[i];
          if (fromSymobl === token.symbol) {
            toDecimal = token.decimals
            // console.log(token.decimal)
          }
        }


        for (let i = 0; i < tokens.length; i++) {
          let token = tokens[i];
          if (token.address.toLowerCase() === item.sourceTokenAddress.toLowerCase()) {
            newObject.coin = token.symbol
            fromSymobl = token.symbol
            newObject.coinImg = token.logo
            fromDecimal = token.decimals
            //时间
            // newObject.nowTime = moment.utc(item.timestamp).local().format("yyyy/MM/DD HH:mm:ss")
            break;
          }

        }
        console.log('fromDecimal',fromDecimal,toDecimal)
        //余额
        newObject.amount = parseFloat(new Decimal(item.amount).div(Math.pow(10, item.sourceToken.decimal)).toFixed(6))

        //转到对应链的余额
        if (item.inAmount) {
          newObject.inAmount = parseFloat(new Decimal(item.inAmount).div(Math.pow(10, toDecimal)).toFixed(6))
        } else {
          newObject.inAmount = 'Processing'
        }


        Object.assign(item, newObject)
        items.push(Object.assign(item, newObject));
      }
      this.historyList = items;
    },

    //获取历史详情
    async actionHistoryDetail(item) {
      let v = this
      v.showTranDetail = true

      v.historyHash = item.id

      v.fromLogo = item.fromLogo
      v.toLogo = item.toLogo

      var result = await v.$http.historyDetail({id: v.historyHash})
      // //console.log(result)
      if (result.code == 200) {
        v.historyDetailList = result.data.info
        v.historyDetailList.amount = v.historyDetailList.amount  ? v.historyDetailList.amount : null
        v.historyDetailList.inAmount = v.historyDetailList.inAmount ? v.historyDetailList.inAmount : null

        console.log('v.historyDetailList.inAmount',v.historyDetailList.fromChain.chainId)
      }

      v.setTimeHistory = setInterval(() => {
        v.refersHistoryDetail()
      }, 3000)
      //console.log(v.setTimeHistory)

    },

    //重新调取历史详情
    async refersHistoryDetail() {
      let v = this
      var result = await v.$http.historyDetail({id: v.historyHash})
      // //console.log(result)
      if (result.code == 200) {
        v.historyDetailList = result.data.info
        v.historyDetailList.sending = v.historyDetailList.amount
        v.historyDetailList.receiving = v.historyDetailList.inAmount ? v.historyDetailList.inAmount : null

        if (result.data.info.state == 1) {
          clearInterval(v.setTimeHistory)
          v.setTimeHistory = null
        }

      }


    },

    //关闭历史详情
    closeHistoryList() {
      this.showTranDetail = false
      this.actionHistory()
      clearInterval(this.setTimeHistory)
      this.setTimeHistory = null;
    },

    //切换链
    async handleLink(item) {
      //To 选择
      let v = this

      console.log(item, 'handleLink')

      if (this.selectChain === 1) {
        // if (item.chainName === this.chainFrom.chainName) {
        //   this.$toast(this.$t('Source Chain and Destination Chain cannot be the same'))
        //   return;
        // }
        if (item.chainName !== this.chainFrom.chainName) {
          console.log('chainTo',this.chainTo)
          this.chainTo = JSON.parse(JSON.stringify(item));
          this.destNetwork = item.symbol
          this.showSelectChain = false
          await this.$router.push({
            path: '/',
            query: {
              sourceNetwork: this.$route.query.sourceNetwork,
              destNetwork: this.chainTo.symbol,
              ts: Date.now(),
            }
          })
          this.receivedAmount = 0
          this.actionShowToken()
          this.actionGasFee()
          this.actionStatus()
          this.actionInputFont()
          this.actionVaultBalance()
          if (this.$route.query.destNetwork=='BSC' || this.$route.query.destNetwork=='MAP' || this.$route.query.destNetwork=='MATIC') {
            let address = await this.$store.getters.getAddress;
            this.sortAddress = this.$formatAddress(address);
          }else  {
            this.sortAddress = ''
          }
          return
        } else  {
          this.actionChangeChain()
        }
      }
      const provider = this.$store.getters.provider;
      console.log('provider',provider)
      let chainId = new Decimal(item.chainId).toHex();
      let params = {chainId}
      let account = await this.$web3.eth.getAccounts()

      console.log('item.symbol',item.symbol,this.chainFrom.symbol,this.chainTo.symbol)

      if (item.symbol== 'NEAR') {
        console.log('item.chainName === this.chainFrom.chainName',item.chainName , this.chainFrom.chainName)
        if (this.selectChain==0) {
          this.chainTo = this.chainFrom
        }
        let nearAccount = await near.asyncNearWallet()
        v.account= nearAccount.currentUser.accountId
        console.log(' v.account', v.account)
        this.chainIdNumber = item.chainId
        this.$store.commit("setAddress",nearAccount.currentUser.accountId);
        this.chainFrom = JSON.parse(JSON.stringify(item));
        this.showSelectChain = false

        console.log(' this.chainFrom.symbol',this.$route.query, this.chainFrom.symbol,this.chainTo.symbol)
        this.$router.push(`/home?sourceNetwork=${this.chainFrom.symbol}&destNetwork=${this.chainTo.symbol}&ts=${Date.now()}`)
        console.log('query',this.$route.query )
        v.requestData()
        return
      }

      // if (item.chainName === this.chainFrom.chainName) {
      //   this.$toast(this.$t('Source Chain and Destination Chain cannot be the same'))
      //   return;
      // }

      //near链接上的情况下 切换near连
      if (window.ethereum.chainId === new Decimal(item.chainId).toHex()) {
        this.chainIdNumber = item.chainId

        console.log('account[0]',account[0])
        this.$store.commit("setAddress",account[0]);
        this.$store.commit("setChainId",item.chainId);
        // this.chainFrom = JSON.parse(JSON.stringify(item));
        this.showSelectChain = false
        console.log('item.symbol',item.symbol,this.chainFrom.symbol,this.chainTo.symbol)
        v.$router.push(`/home?sourceNetwork=${this.chainTo.symbol}&destNetwork=${this.chainFrom.symbol}&ts=${Date.now()}`)
        return
      }

      let itemChainId = item.chainId

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
          })
          this.$route.query.sourceNetwork=item.symbol
          return  true
        } catch (error) {
          console.log('error',error)
          this.showSelectChain=false;
          v.requestData()
          return  false
        }
      } else {
        console.error('Can not setup the HALO network on metamask because window.ethereum is undefined');
        return false;
      }
      // this.showSelectChain=false;
      //成功后 历史记录变成第一页
      v.currentPage=1

      // this.$watcher.getProvider().then(async provider => {
      //   let chainId = new Decimal(item.chainId).toHex();
      //   let params = {chainId}
      //   if (provider) {
      //     try {
      //       await provider.request({
      //         method: 'wallet_switchEthereumChain',
      //         params: [{ chainId: chainId }]
      //       });
      //       let account = await this.myWeb3.eth.getAccounts()
      //       this.$store.commit("setAddress",account[0]);
      //       this.$store.commit("setChainId",item.chainId);
      //       this.$route.query.sourceNetwork=item.symbol
      //       return true;
      //     } catch (error) {
      //       try {
      //         let chains = this.$store.getters.getChains;
      //         let chain = chains[chainId];
      //         params.rpcUrls = [item.rpc];
      //         params.chainName = chain.name;
      //         await provider.request({
      //           method: 'wallet_addEthereumChain',
      //           params: [params]
      //         });
      //         let account = await this.myWeb3.eth.getAccounts()
      //         this.$store.commit("setAddress",account[0]);
      //         this.$store.commit("setChainId",item.chainId);
      //         this.$route.query.sourceNetwork=item.symbol
      //         return true;
      //       } catch (error) {
      //         console.error('Failed to setup the network in Metamask:', error);
      //         return false;
      //       }
      //     }
      //   } else {
      //     console.error('Can not setup the HALO network on metamask because window.ethereum is undefined');
      //     return false;
      //   }
      //   console.log('========',this.chainFrom,this.chainTo)
      //   console.log('   this.showSelectChain', this.showSelectChain)
      //   this.showSelectChain=false;
      //   //成功后 历史记录变成第一页
      //   v.currentPage=1
      // }).catch(error => {
      //   this.chainFrom = JSON.parse(JSON.stringify(item));
      //   v.requestData()
      // });
    },

    //打开选择链弹窗
    actionChain(i) {
      this.selectChain = i;
      this.searchVal=''
      this.showSelectChain = true;
    },

    //显示地址
    async actionShowAddress() {
      this.showAddress = true
      if (this.allAddress == '') {
        if (this.$route.query.destNetwork=='BSC' || this.$route.query.destNetwork=='MAP') {
          this.allAddress = this.account;
        }else  {
          this.allAddress = ''
        }
        // this.allAddress = this.account;
      }else {
        if (this.$route.query.destNetwork=='BSC' || this.$route.query.destNetwork=='MAP') {
          this.allAddress = await this.$store.getters.getAddress;
        }else  {
          this.allAddress = ''
        }
      }

      if (this.sortAddress==='') {
        if (this.$route.query.destNetwork=='BSC' || this.$route.query.destNetwork=='MAP') {
          this.allAddress = await this.$store.getters.getAddress;
        }else  {
          this.allAddress = ''
        }
      }

      // let addressCss = document.getElementById('tran-send-amount')
      // addressCss.style.display = 'none'
    },

    //输入地址填写
    async getInputAddress() {
      let v = this
      console.log('v.allAddress',v.allAddress)
      if (v.allAddress == '') {
        if (this.$route.query.destNetwork=='BSC' || this.$route.query.destNetwork=='MAP') {
          this.allAddress = await this.$store.getters.getAddress;
        }else  {
          this.allAddress = ''
        }
        // v.allAddress = await this.$store.getters.getAddress;
        v.sortAddress = v.allAddress.substr(0, 9) + '...' + v.allAddress.substr(38)
        v.showAddress = false
        let addressCss = document.getElementById('tran-send-amount')
        addressCss.style.display = 'flex'
        v.langToAddress = v.allAddress
        return
      } else  {
        v.langToAddress = v.allAddress
      }
      v.sortAddress = v.allAddress.substr(0, 9) + '...' + v.allAddress.substr(38)
      // this.account = v.allAddress
      v.langToAddress = v.allAddress
      v.showAddress = false
      let addressCss = document.getElementById('tran-send-amount')
      addressCss.style.display = 'flex'
    },

    //approve
    async actionApprove(token) {

      this.actionChainSuccess()

      if (this.chainSuccess == false) {
        this.$toast('Network error,please link to the correct network')
        return
      }

      let v = this

      v.approveHash = '111';

      //当前链
      // var chain = this.chainFrom.coin
      let reward_address = MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]
      let token_address = v.selectToken.address
      ID_TO_SUPPORTED_TOKEN(v.chainFrom.chainId).forEach(item => {
        if (v.selectToken.symbol == item.symbol) {
          token_address = item.address
          // console.log('token_address', token_address)
        }
      })
      //approve
      let web3 = await this.$client(this.chainIdHex);
      let contract = new web3.eth.Contract(tokenAbi, token_address)
      const approveData = contract.methods.approve(reward_address, '1000000000000000000000000000').encodeABI();
      //console.log('approvedata', approveData)

      return new Promise(async resolve => {
        //报错
        let error = null;
        try {
          await this.$web3.eth.estimateGas({
            from: this.account,
            to: token_address,
            data: approveData
          })
        } catch (e) {
          // let result = e.message.substring(e.message.indexOf("{"))
          // error = JSON.parse(result).message
          // this.$toast(error)
          v.showErrorMessage = true
          v.errorMessage = e.message
        }
        if (error) {
          resolve(false);
        }

        this.$web3.eth.sendTransaction({
          from: this.account,
          to: token_address,
          value: 0,
          data: approveData
        }).on('transactionHash', (hash) => {
          //hash
          //console.log(`hash: ` + hash)
          // v.$toast('Transaction has send please wait result')
          v.dialogApproving = true
          v.approveHash = hash;
          v.checkApproveToken = token
          v.chainSuccess = true
          localStorage.setItem('approve', 1);
          this.setApproveStatus(v.account + reward_address, token_address, 'doing');
          //server order
        }).on('receipt', (receipt) => {
          //receipt
          //console.log(receipt)
          // console.log('receipt',receipt)
          v.dialogApproving = false
          v.allowance = true;
          this.setApproveStatus(v.account + reward_address, token_address, false);
          let timer = setInterval(() => {
            v.checkApproved(timer)
          }, 1000);
          resolve(true);
        }).on('error', (receipt) => {
          //receipt
          localStorage.removeItem(v.account + reward_address)
          v.approveHash = false;
          v.dialogApproving = false
          //console.log(receipt)
          resolve(false);
        })
      })

    },

    //判断approve刷新后的状态
    actionStatus() {
      let v = this

      if (v.statusTimer) {
        clearInterval(v.statusTimer);
        v.statusTimer = null;
      }
      let approving = this.getApproveStatus(`${v.account}${MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]}`, v.selectToken.address);
      if (approving == 'done') {
        //关闭弹窗
        v.dialogApproving = false;
        v.checkApproved()
        return;
      }
      let timer
      if (approving == 'doing') {
        //打开弹窗
        v.dialogApproving = true
        timer = setInterval(() => {
          v.checkApproved(timer);
        }, 1000);
        v.statusTimer = timer
      }
    },

    //检查是否approve
    async checkApproved(timer) {
      // console.log(timer ? timer.toString() : '没有Timer')
      let v = this
      if (!this.$web3) {
        return
      }
      if (!v.selectToken.address) {
        return
      }

      if (v.chainFrom.symbol=='NEAR') {
        //Near链上 代币不用approve
        v.allowance = true;
        v.transferBtn = false
        v.approveHash = ''
        console.log('1111111',v.chainFrom.symbol)
        return true
      }



      if (v.selectToken.address == '0x0000000000000000000000000000000000000000') {
        // console.log('主币不用Approve')
        v.allowance = true;
        v.transferBtn = false
        v.approveHash = ''
        return true
      }

      if (!v.account) {
        return
      }

      let token = v.selectToken.symbol
      let tokenAddress = ''

      ID_TO_SUPPORTED_TOKEN(v.chainFrom.chainId).forEach(item => {
        if (item.symbol == token) {
          tokenAddress = item.address
          return
        }
      })



      let approving = this.getApproveStatus(`${v.account}${MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]}`, tokenAddress)

      console.log('approving',approving)

      // v.dialogApproving = false;
      if (approving === 'done') {
        // console.log(approving)
        v.allowance = true;
        //清空检测事件
        v.approveHash = '';
        v.transferBtn = false
        v.checkApproveToken = ''
        v.dialogApproving = false;

        if (timer) {
          clearInterval(timer);
        }
        this.setApproveStatus(`${v.account}${MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]}`, tokenAddress, false);
        console.log(' v.allowance ', v.allowance , v.transferBtn )
        return;
      } else if (approving === 'doing') {
        v.allowance = false
        v.approveHash = true
      } else if (approving === 'none') {
        v.approveHash = false
        v.dialogApproving = false;
      }

      let contract = new this.$web3.eth.Contract(tokenAbi, tokenAddress)
      // console.log('contract',contract,tokenAddress)
      let addressUser = await this.$web3.eth.getAccounts()
      console.log('addressUser',addressUser,v.chainFrom.chainId,v.chainIdNumber)
      store.commit("setAddress",addressUser[0]);
      contract.methods.allowance(addressUser[0], MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]).call((error, result) => {
        console.log('result',result)
        if (result && result != 0) {
          v.allowance = true;
          //清空检测事件
          v.approveHash = '';
          v.transferBtn = false
          v.checkApproveToken = ''
          if (timer) {
            clearInterval(timer);
          }
          v.dialogApproving = false;
          v.setApproveStatus(`${addressUser[0]}${MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]}`, tokenAddress, false);
        } else {
          v.allowance = false;
          // v.approveHash = false;
        }
        if (error) {
        }
      });

    },

    async requestHistory(isNext = true) {
      if (isNext) {
        if (this.currentPage === this.pageNum) return;

      } else {
        if (this.currentPage === 1) return;
      }

      if (isNext) {
        this.currentPage++;
      } else {
        this.currentPage--;
      }
      this.actionHistory();
    },

    //获取链列表
    async actionGetChain() {
        let v = this;
        v.chainList = SUPPORTED_CHAIN_LIST_MAINNET
        console.log( v.chainList)

      // console.log('v.chainIdNumber',v.chainIdNumber,ew Decimal(v.chainIdNumber).toHex())
        let chainId = v.chainIdHex;
        let query = this.$route.query ? this.$route.query : {}
        let chains = await this.$store.getters.getChains;
        let chain = chains[chainId];
      console.log('chains',chains,chainId)

      //刷新
      console.log('this.selectChain ',this.selectChain )
        if (this.selectChain == -1) {
          console.log('aaaaaaa')
          console.log('chain'.chain)
          if (chain) {
            query.sourceNetwork=chain.symbol;
          }else {
            query.sourceNetwork='BSC';
          }
        } else
            //切换
        if (this.selectChain == 0) {
          console.log('bbbbbbb')
          if (!chain) {
            chain = chains[config.map.chainHex];
          }
          console.log(' query.sourceNetwork ',this.chainFrom.symbol, this.chainTo.symbol)
          console.log(' query.sourceNetwork ',query.sourceNetwork , query.destNetwork)
          // let temp = query.sourceNetwork;
          query.sourceNetwork = chain.symbol;

          if (this.chainFrom.symbol==='NEAR') {
            query.destNetwork = this.chainFrom.symbol;
          }else {
            query.destNetwork =  this.chainTo.symbol;
          }
        } else
            //from
        if (this.selectChain == 2) {
          console.log('cccccccccccccc')
          chain = chains[chainId]
          query.sourceNetwork = chain.symbol;
          query.destNetwork = this.chainTo.symbol;
        }

      console.log('query',query)

        if (!query.destNetwork || query.destNetwork=='' || query.sourceNetwork == query.destNetwork) {
          console.log('query.destNetwork',query.destNetwork)
          if (query.sourceNetwork == 'MATIC') {
            query.destNetwork = 'BSC';
          } else {
            query.destNetwork = 'MATIC';
          }
        }

        this.showSelectChain=false;
        this.$router.push(`/home?sourceNetwork=${query.sourceNetwork}&destNetwork=${query.destNetwork}&ts=${Date.now()}`)

        for (let item of this.chainList) {
          if (item.symbol.toUpperCase() === query.sourceNetwork.toUpperCase()) {
            v.chainFrom = JSON.parse(JSON.stringify(item));
          }
          if (item.symbol.toUpperCase() === query.destNetwork.toUpperCase()) {
            v.chainTo = JSON.parse(JSON.stringify(item));
          }
        }
      // }
    },

    //获取Token列表
    async actionTokenList() {
      if (!this.chainList || this.chainList.length <= 0) {
        this.tokenAllList = [];
        return;
      }
      let v = this

      console.log('this.chainFrom.chainId.toString()',this.chainFrom,this.chainFrom.chainId.toString())
      this.tokenList = ID_TO_SUPPORTED_TOKEN(this.chainFrom.chainId.toString());
      console.log(' this.tokenList', this.tokenList,ID_TO_SUPPORTED_TOKEN(this.chainIdNumber))

      let selectToken = null;
      let flag = false;
      if (!this.tokenList) {
        return
      }

      let prodiver = this.actionProvider()

      console.log('getTokenCandidates',v.chainFrom.chainId.toString(),v.chainTo.chainId.toString())// to )

      const tokenCandidates = await getTokenCandidates(
          v.chainFrom.chainId.toString(), // from chain
          v.chainTo.chainId.toString(), // to chain
          // prodiver
          prodiver
      );
      this.tokenList = tokenCandidates

      console.log('tokenList',this.tokenList)

      for (let i = 0; i < this.tokenList.length; i++) {
        // if (this.tokenList[i].symbol === 'NEAR') {
        if (this.tokenList[i].symbol === 'BSC') {
          selectToken = JSON.parse(JSON.stringify(this.tokenList[i]))
          flag = true;
          break;
        }
      }

      if (!selectToken && this.tokenList.length) {
        selectToken = JSON.parse(JSON.stringify(this.tokenList[0]))
      }
      this.selectToken = selectToken;
      this.selectToken.url = selectToken.logo;

      // const nearConnection = await connect(config.connectionConfig);
      // const account = await nearConnection.account(this.account);
      // let token_address = this.selectToken.address
      // console.log('this.chainIdHex',this.chainIdHex)
      // let web3 = await this.$client(parseInt(this.chainIdHex));

      // //主币余额
      // if ( token_address === '0x0000000000000000000000000000000000000000') {
      //   if (this.selectToken.symbol === 'NEAR') {
      //     // gets account balance
      //     this.balanceZ = await account.getAccountBalance();
      //     this.balanceZ = this.balanceZ.total;
      //   } else {
      //     this.balanceZ = await web3.eth.getBalance(this.account)
      //   }
      // }
      // //代币余额
      // else {
      //   if (this.chainFrom.symbol === 'NEAR') {
      //     const contractToken = new Contract(
      //         account,// the account object that is connecting
      //         token_address, // 代币的地址
      //         {
      //           // name of contract you're connecting to
      //           viewMethods: ["ft_balance_of"], // 获取余额的方法
      //         }
      //     );
      //     this.balanceZ  = await contractToken.ft_balance_of({'account_id': this.account}); // 用户账户地址
      //   }
      //   //metamask上
      //   else {
      //     let contract = new web3.eth.Contract(tokenAbi, token_address)
      //     // 查询代币余额
      //     this.balanceZ = await contract.methods.balanceOf(this.account).call();
      //   }
      // }
      // console.log(this.balanceZ );
      //
      // this.balanceZ = new Decimal(this.balanceZ).div(Math.pow(10,this.selectToken.decimals))
      // this.balanceZ = Math.floor( this.balanceZ * 1000000) / 1000000

      let approvedResult = await this.checkApproved(this.statusTimer);
      console.log('approvedResult',approvedResult,this.statusTimer)
      // let approvedResult = await this.checkMapApproved(this.statusTimer);
      if (approvedResult == 'undefined') {
        approvedResult = false
      }
      if (!flag) {
        this.allowance = approvedResult;
      }
    },

    //判断当前链跟选择的from链是否一致
    async actionChainSuccess() {
      this.chainSuccess = this.chainFrom.chainId.toString() == this.chainIdNumber;
      console.log('chainSuccess',this.chainFrom.chainId.toString(),this.chainIdNumber)
    },

    //provider
    actionProvider() {
      let provider = {
        url: config.map_mainnet.rpc, // map test rpc
        // url: 'http://18.142.54.137:7445', // map test rpc
        chainId: config.map_mainnet.chainId, // 22776
      };
      return provider
    },

    async getAllData() {
      console.log('window.ethereum.chainId',window.ethereum.chainId)
      this.isLoadingAllData = true;
      this.sendAmount = ''
      let address = await this.$store.getters.getAddress;
      if (!address) {
        window.ethereum.enable()
        this.isLoadingAllData = false;
        return;
      }

      console.log('query',this.$route.query)

      this.showTranDetail = false
      this.account = address;
      this.sortAddress = this.$formatAddress(address);
      this.allAddress= address
      let chainId = await this.$store.getters.getChainId;
      console.log('chainId',chainId)
      this.chainIdHex = new Decimal(chainId).toHex();
      this.chainIdNumber = BigInt(chainId)
      this.chainIdNumber = String(this.chainIdNumber).split('n')[0]
      // this.chainIdNumber = new Decimal(chainId).toNumber();

      let chains = await this.$store.getters.getChains;

      console.log(chainId.toString(), 'chains chains')

      let chain=null;
      if (chains[chainId.toString()]) {
        chain = chains[chainId];
        this.error = false;
      } else {
        chain = null;
        this.error = true;
        this.isLoadingAllData = false;
        this.chainSuccess = false
        return
      }

      this.receivedAmount = '0.0'
      console.log('this.chainIdNumber',this.chainIdNumber)
      ///当前链是NEAR链
      // if (this.chainIdNumber===config.near.chainId) {
      if (this.$route.query.sourceNetwork==='NEAR') {
        let nearAccount = await near.asyncNearWallet()
        this.account= nearAccount.currentUser.accountId
        console.log(' v.account', this.account)
        this.chainIdHex = config.near.chainHex
        this.chainIdNumber = config.near.chainId.toString()
        this.$store.commit("setAddress",nearAccount.currentUser.accountId);
        this.$store.commit("setChainId",config.near.chainId);
        this.allowance = true;
        this.transferBtn = false
        this.allowanceMap = true
        this.approveHash = ''
        this.allAddress= ''
      }
      await this.actionGetChain()
      await this.actionTokenList()
      await this.actionShowToken()
      await this.actionChainSuccess()
      this.actionStatus()
      this.isLoadingAllData = false;
      await this.actionVaultBalance()
      await this.actionGasFee()
      this.actionInputFont()
      await this.actionHistory()
    },

    async requestData() {
      this.getAllData();
      // this.$watcher.getProvider().then(provider => {
      //   this.getAllData();
      // }).catch(err => {
      // });
    },

    cleanHistoryTimer() {
      if (this.setTimeHistory) {
        clearInterval(this.setTimeHistory);
        this.setTimeHistory = null;
      }
    },
    cleanLoadingTimer() {
      let result = false;
      // if (this.historyTimerLoading && this.historyTimerLoading.length > 0) {
      //   for (const timer of this.historyTimerLoading) {
      //     clearInterval(timer);
      //   }
      //   result = true;
      // }
      if (this.historyTimerLoading != null && this.historyTimerLoading.length > 0 && this.historyLoading != null && this.historyLoading <= 0) {
        this.historyTimerLoading.forEach((item, index) => {
          // console.log(item)
          clearInterval(item);
        })
        this.historyTimerLoading = [];
        result = true
      }
      return result;
    },
    cleanStatusTimer() {
      if (this.statusTimer) {
        clearInterval(this.statusTimer);
        this.statusTimer = null;
      }
    },
  },

  beforeDestroy() {
    this.isLoadingAllData = false;
    this.cleanHistoryTimer();
    this.cleanLoadingTimer();
    this.cleanStatusTimer();
  },

 async mounted() {
   //token列表

    this.isLoadingAllData = false;
    this.cleanHistoryTimer();
    this.cleanLoadingTimer();
    this.cleanStatusTimer();
    this.requestData();
    this.actionEixtMount()

    console.log(SUPPORTED_CHAIN_LIST_MAINNET, 'SUPPORTED_CHAIN_LIST_MAINNET')
    console.log('config', config)
  },
}
</script>

<style scoped lang="less">
@import './Home.less';
//


</style>
