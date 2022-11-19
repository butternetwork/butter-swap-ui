<template>
  <div class="home">

    <Header @listenTab="actionEmitHeader" :loadingHistory="historyLoading" @exit="actionEixt"/>

    <div class="header-middle">
      <div @click="actionOpenTransfer(showTab=0)" :class="showTab==0?'header-middle-tran-active':'header-middle-trans'">
        Transfer funds
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
        <span>You must switch <span style="color:#e44e3a;padding-left: 0">{{ chainFrom.chainName }}</span>  to begin the transfer</span>
      </div>
      <div class="bridge-content">
        <!--              tranfer-->
        <div v-show="showTab==0">
          <!--                tran-from-->
          <div class="tran-from">
            <div class="tran-from-left">
              <span>From</span>
              <div @click="actionChain(2)" class="tran-from-btn">
                <!--                  <div class="tran-from-btn">-->
                <img :src="chainFrom.chainLogo"/>
                <span>{{ chainFrom.chainName }}</span>
                <img src="../assets/arrow-bottom-black.png"/>
              </div>
            </div>
            <div class="tran-from-right">Source Chain</div>
          </div>
          <!--                send-->
          <div class="tran-send">
            <div class="tran-send-top">
              <span>Sending Amount:</span>
              <span @click="actionMaxBalance()" style="cursor: pointer">Max: {{ balanceZ }}</span>
            </div>
            <div class="tran-send-bottom">
              <input id="tran-send-bottom-red" @input="actionInputFont()" v-model="sendAmount" maxlength="20"
                     placeholder="0.0"/>
              <div @click="actionOpenToken()" class="tran-send-btn">
                <img :src="selectToken.logo"/>
                <span>{{ selectToken.symbol }}</span>
                <img class="tran-send-arrow-icon" src="../assets/arrow-bottom-black.png"/>
              </div>
            </div>
            <div v-show="showFromVault" class="tran-send-vault">
              <span>Vault:</span>
              <span v-if="fromVault && fromVault.isMintable">{{ selectToken.symbol }} is a mintable token on {{this.chainTo.chainName}}</span>
              <span v-else>{{ fromVault }} {{ selectToken.symbol }}</span>
            </div>
          </div>
          <!--                change-->
          <div class="tran-change">
            <img @click="actionChangeChain()" src="../assets/change.png"/>
          </div>
          <!--                tran-to-->
          <div class="tran-from tran-to">
            <div class="tran-from-left">
              <span>To  </span>
              <div @click="actionChain(1)" style="margin-left: 28px" class="tran-from-btn">
                <!--                  <div style="margin-left: 28px" class="tran-from-btn">-->
                <img :src="chainTo.chainLogo"/>
                <span>{{ chainTo.chainName }}</span>
                <img src="../assets/arrow-bottom-black.png"/>
              </div>
            </div>
            <div class="tran-from-right">Destination Chain</div>
          </div>
          <div class="tran-send">
            <div class="tran-send-top">
              <span>Receiving Amount:</span>
              <span>Received Address:</span>
            </div>
            <div id="tran-send-amount" class="tran-send-bottom">
              <span v-if="receivedAmountLoading"> <img style="width:21px" src="../assets/loading2.gif"/></span>
              <span v-else>{{ receivedAmount }}</span>
              <div @click.stop="actionShowAddress()" class="tran-send-btn tran-send-btns">
                <span class="tran-send-btn-address">{{ sortAddress }}</span>
                <img class="tran-send-arrow-icon tran-send-arrow-icons" src="../assets/edit.png"/>
              </div>
            </div>
            <div v-show="showToVault" class="tran-send-vault">
              <span>Vault:</span>
              <span v-if="toVault && toVault.isMintable">{{ selectToken.symbol }} is a mintable token  on {{this.chainFrom.chainName}}</span>
              <span v-else>{{ toVault }} {{ selectToken.symbol }}</span>

            </div>
            <div @click.stop="showAddress=true" v-show="showAddress" class="tran-send-address">
              <div class="tran-send-address-left">
                <span>Received Address:</span>
                <img src="../assets/address.png"/>
              </div>
              <div class="tran-send-address-input">
                <input v-model="allAddress" placeholder="Please enter the address"/>
                <img @click.stop="getInputAddress()" src="../assets/frame-red.png"/>
              </div>
            </div>
          </div>
<!--          <div v-show="receivedAmountLoading" class="tran-send tran-send-loading">-->
<!--            <img style="width:21px" src="../assets/loading2.gif"/>-->
<!--            <span>Fetching best price...</span>-->
<!--          </div>-->
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
<!--            <button v-if="!allowanceMap && !approveMapHash" :class="chainSuccess==false ? 'tran-connect-approve' :''"-->
<!--                    @click="actionMapApprove()">Approve MAP-->
<!--            </button>-->
<!--            <button v-if="!allowanceMap &&  approveMapHash" class="tran-connect-approve">-->
<!--              Approving... <img src="../assets/loading.gif"/>-->
<!--            </button>-->
            <button v-if="allowance && !transferBtn"
                    :class="chainSuccess==false ? 'tran-connect-approve' :''" id="transfers-btn" @click="actionTrans()">
              Transfer
            </button>
            <button v-if="allowance && transferBtn" class="tran-connect-approve">
              Transfering... <img src="../assets/loading.gif"/>
            </button>
          </div>
        </div>

        <!--                            nft-->
        <div v-show="showTab==2">
          <!--                tran-from-->
          <div class="tran-from">
            <div class="tran-from-left">
              <span>From</span>
              <div @click="actionChain(0)" class="tran-from-btn">
                <!--                  <div class="tran-from-btn">-->
                <img :src="chainFrom.chainLogo"/>
                <span>111</span>
                <img src="../assets/arrow-bottom-red.png"/>
              </div>
            </div>
            <div class="tran-from-right">Source Chain</div>
          </div>
          <!--          send nft-->
          <div class="nft-send">
            <div class="nft-send-top">
              <span>Sending NFT :</span>
              <span>2 NFTs</span>
            </div>
            <!--                  card-->
            <div class="nft-card">
              <div class="nft-card-left">
                <img src="../assets/nft/card.png"/>
              </div>
              <div class="nft-card-right">
                <div class="nft-card-line"></div>
                <div class="nft-card-title">Non-Fungible Baby (NFB)</div>
                <div class="nft-card-icon">
                  <div class="nft-card-copy">
                    <img src="../assets/nft/copy.png"/>
                  </div>
                  <div class="nft-card-copy">
                    <img src="../assets/nft/forward.png"/>
                  </div>
                </div>
                <div class="nft-send-text">
                  Huge thanks to our 1st-month supporters,loneliness fades away with you accompany by.
                </div>
              </div>
            </div>

            <!--                  choose-->
            <div @click="dialogNft=true" class="tran-from-btn tran-from-btn-nft">
              <div class="tran-from-nft-img">
                <img :src="selectNFT.img"/>
                <span>{{ selectNFT.name }}</span>
                <span>{{ selectNFT.id }}</span>
              </div>

              <img src="../assets/arrow-bottom-red.png"/>
            </div>

          </div>


          <!--                change-->
          <div class="tran-change">
            <img @click="actionChangeChain()" src="../assets/change.png"/>
          </div>
          <!--                tran-to-->
          <div class="tran-from tran-to">
            <div class="tran-from-left">
              <span>To  </span>
              <div @click="actionChain(1)" style="margin-left: 28px" class="tran-from-btn">
                <!--                  <div style="margin-left: 28px" class="tran-from-btn">-->
                <img :src="chainTo.chainLogo"/>
                <span>{{ chainTo.chainName }}</span>
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
              <span>{{ receivedAmount }}</span>
              <!--                  <span>{{ receivedAmount }}</span>-->
              <div @click.stop="actionShowAddress()" class="tran-send-btn tran-send-btns">
                <span class="tran-send-btn-address">{{ sortAddress }}</span>
                <img class="tran-send-arrow-icon tran-send-arrow-icons" src="../assets/arrow-bottom-black.png"/>
              </div>
            </div>
            <div @click.stop="showAddress=true" v-show="showAddress" class="tran-send-address">
              <div class="tran-send-address-left">
                <span>Received Address:</span>
                <img src="../assets/address.png"/>
              </div>
              <div class="tran-send-address-input">
                <input v-model="allAddress" placeholder="Please enter the address"/>
                <img v-if="allAddress" @click.stop="getInputAddress()" src="../assets/success.png"/>
                <img v-else src="../assets/success-gray.png"/>
              </div>
            </div>
          </div>
          <!--                connect-->
          <div class="tran-connect">
            <button v-if="!allowance && !approveHash && allowanceMap" @click="actionApprove()">Approve</button>
            <button v-if="!allowance &&  approveHash" class="tran-connect-approve">
              Approving... <img src="../assets/loading.gif"/>
            </button>
            <button v-if="!allowanceMap && !approveMapHash" @click="actionMapApprove()">Approve MAP</button>
            <button v-if="!allowanceMap &&  approveMapHash" class="tran-connect-approve">
              Approving... <img src="../assets/loading.gif"/>
            </button>
            <button v-if="allowance && !transferBtn && allowanceMap" @click="actionTrans()">Transfer</button>
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
              <!--                      <img v-show="historyLoading && historyLoading>0" class="loading-icon" src="../assets/dialog/loading.png"/>-->
            </div>
            <div style="min-height: 300px">
              <div v-show="historyList" v-for="(item,index) in historyList" @click="actionHistoryDetail(item)"
                   :key="index"
                   class="history-list history-lists">
                <div class="history-tops">
                  <div class="history-tops-icon">
                    <img :src="item.fromLogo"/>
                  </div>
                  <div class="history-tops-from">
                    <div class="history-top-left">
                      <span class="history-top-amount history-top-amounts">{{ item.amount }}</span>
                      <span class="history-top-coin">{{ item.coin }}</span>
                    </div>
                    <div class="history-tops-from-text">
                      <span>{{ item.fromChainName }}</span>
                    </div>
                  </div>
                  <div class="history-tops-tranfrom">
                    <img src="../assets/tranform.png"/>
                  </div>
                </div>
                <div class="history-tops">
                  <div class="history-tops-icon">
                    <img :src="item.toLogo"/>
                  </div>
                  <div class="history-tops-from">
                    <div class="history-top-left">
                      <span class="history-top-amount history-top-amounts">{{ item.inAmount }}</span>
                      <span class="history-top-coin">{{ item.coin }}</span>
                    </div>
                    <div class="history-tops-from-text">
                      <span>{{ item.toChainName }}</span>
                    </div>
                  </div>
                </div>
                <div class="historys-statu">
                  <div v-if="item.state==0" class="history-status history-status-cancel">
                    <span>Pending</span>
                    <img src="../assets/arrow-right-yellow.png"/>
                  </div>
                  <div v-else-if="item.state==1" class="history-status history-status-success">
                    <span>Complete</span>
                    <img src="../assets/arrow-right-green.png"/>
                  </div>
                  <div v-else-if="item.state==998" class="history-status">
                    <span>Failed</span>
                    <img src="../assets/arrow-right-red.png"/>
                  </div>
                  <div v-else class="history-status history-status-cancel">
                    <span>Processing</span>
                    <img src="../assets/arrow-right-yellow.png"/>
                  </div>
                  <span class="history-coin-time historys-coin-time">{{ item.nowTime }}</span>
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
            <div class="history-ant">
              <!--              <img src="../assets/ant.png"/>-->
              <!--              <span>In the end</span>-->
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
                      <span class="history-top-coin">{{ item.coin }}</span>
                    </div>
                    <div class="history-top-left history-top-left-two">
                      <span class="history-top-amount">{{ item.inAmount }}</span>
                      <span class="history-top-coin">{{ item.coin }}</span>
                    </div>
                  </div>
                </div>
                <div class="history-bottom">
                  <div class="history-coin">
                    <img :src="item.fromLogo"/> <span>{{ item.fromChainName }}</span>
                    <img src="../assets/tranform.png"/>
                    <img :src="item.toLogo"/> <span>{{ item.toChainName }}</span>
                  </div>
                </div>
              </div>
              <!--                          h5time-->
              <div class="history-h5-bottom">
                <div>
                  <span class="history-coin-time">{{ item.nowTime }}</span>
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
                  <div v-else-if="item.state==998" class="history-status">
                    <span>Failed</span>
                    <img src="../assets/arrow-right-red.png"/>
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
            <div class="history-ant">
              <!--              <img src="../assets/ant.png"/>-->
              <!--              <span>In the end</span>-->
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
              Fee<img src="../assets/error.png"/>
            </div>
            <div v-if="receivedAmountLoading" class="bridge-rate-right bridge-rate-right-loading">
              <img style="width:20px" src="../assets/loading2.gif"/>
              {{selectToken.symbol}}
            </div>
            <div v-else class="bridge-rate-right">{{ gasFeeVue }} {{selectToken.symbol}}</div>
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
            <img style="width: 50px;margin-top: 15px" src="../assets/loading2.gif"/>
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
              <span>{{ historyDetailList.sending }} {{ historyDetailList.coin }}</span>
              <span>{{ historyDetailList.from }}</span>
            </div>
          </div>
          <!--            receiving-->
          <div class="dialog-trans-detail">
            <div class="dialog-trans-detail-left">Receiving</div>
            <div class="dialog-trans-detail-right">
                            <span v-if="historyDetailList.receiving">{{ historyDetailList.receiving }}  {{
                                historyDetailList.coin
                              }}</span>
              <span v-else>Processing</span>
              <span>{{ historyDetailList.to }}</span>
            </div>
          </div>
          <!--            fee-->
          <div class="dialog-trans-detail">
            <div class="dialog-trans-detail-left">Fee</div>
            <div class="dialog-trans-detail-right">
                                  <span v-if="historyDetailList.receiving"
                                        class="dialog-trans-detail-fee">{{
                                      historyDetailList.sending - historyDetailList.receiving
                                    }}  {{
                                      historyDetailList.coin
                                    }}</span>
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
                  <img v-if="historyDetailList.confirmHeight>0" src="../assets/dialog/success-red.png"/>
                  <img v-else src="../assets/dialog/success-write.png"/>
                  <div class="dia-trans-top-icon">
                    <img :src="fromLogo"/>
                    <span>{{ historyDetailList.fromChainName }}</span>
                  </div>
                </div>
                <div class="dia-trans-bottom dia-trans-bottoms">
                  <div>
                    <img v-if="historyDetailList.confirmHeight==6" class="dia-trans-bottom-arrow"
                         src="../assets/dialog/line-red.png"/>
                    <img v-else class="dia-trans-bottom-arrow" src="../assets/dialog/line-write.png"/>
                  </div>
                  <div class="dia-trans-bottom-progress">
                                        <span @click="goEth()">{{ historyDetailList.confirmHeight }}/6 confirmed <img
                                            src="../assets/dialog/send.png"/> </span>
                    <div class="dia-transStatus-content-bottom">
                      <div class="dia-transStatus-content-bottom-bg"
                           :style="{width:historyDetailList.confirmHeight/6*100+'%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
              <!--                    relayer-->
              <div v-show="historyDetailList.fromChainId!=22776 && historyDetailList.toChainId!=22776"
                   class="dia-trans dia-trans-two">
                <div class="dia-trans-top">
                  <div>
                    <img v-if="historyDetailList.relayerConfirmHeight>0" src="../assets/dialog/success-red.png"/>
                    <img v-else src="../assets/dialog/success-write.png"/>
                  </div>
                  <div class="dia-trans-top-icon">
                    <img src="../assets/token/map.png"/>
                    <span>MAP Protocol</span>
                  </div>
                </div>
                <div class="dia-trans-bottom dia-trans-bottoms">
                  <div>
                    <img v-if="historyDetailList.relayerConfirmHeight==6" class="dia-trans-bottom-arrow"
                         src="../assets/dialog/line-red.png"/>
                    <img v-else class="dia-trans-bottom-arrow" src="../assets/dialog/line-write.png"/>
                  </div>
                  <div class="dia-trans-bottom-progress">
                                  <span @click="goMap()">{{ historyDetailList.relayerConfirmHeight }}/6 confirmed <img
                                      style="width: 12px" src="../assets/dialog/send.png"/> </span>
                    <div class="dia-transStatus-content-bottom">
                      <div class="dia-transStatus-content-bottom-bg"
                           :style="{width:historyDetailList.relayerConfirmHeight/6*100+'%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
              <!--                    to-->
              <div class="dia-trans dia-trans-two">
                <div class="dia-trans-top">
                  <div>
                    <img v-if="historyDetailList.transferInHeight>0" src="../assets/dialog/success-red.png"/>
                    <img v-else src="../assets/dialog/success-write.png"/>
                  </div>
                  <div class="dia-trans-top-icon">
                    <img :src="toLogo"/>
                    <span>{{ historyDetailList.toChainName }}</span>
                  </div>
                </div>
                <div class="dia-trans-bottom dia-trans-bottoms">
                  <div>
                    <img v-if="historyDetailList.transferInHeight==6" class="dia-trans-bottom-arrow"
                         src="../assets/dialog/line-red.png"/>
                    <img v-else class="dia-trans-bottom-arrow" src="../assets/dialog/line-write.png"/>
                  </div>
                  <div class="dia-trans-bottom-progress">
                                        <span @click="goToScan()">{{
                                            historyDetailList.transferInHeight
                                          }}/6 confirmed <img
                                              style="width: 12px"
                                              src="../assets/dialog/send.png"/> </span>
                    <div class="dia-transStatus-content-bottom">
                      <div class="dia-transStatus-content-bottom-bg"
                           :style="{width:historyDetailList.transferInHeight/6*100+'%'}"></div>
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
                  <img v-if="historyDetailList.confirmHeight==6 && historyDetailList.transferInHeight==6"
                       src="../assets/dialog/success-red.png"/>
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

    <!--          Map approve弹窗-->
    <!-- <div v-show="dialogApproving" class="dialog-selectChain">
       <div class="dialog-content dialog-content-approve">
         <div class="dialog-approve-title">
           <img @click="dialogApproving=false" src="../assets/cancel.png"/>
         </div>
         <img class="loading-icon" src="../assets/dialog/loading.png"/>
         <div class="dialog-content-approve-text">Approving...</div>
       </div>
     </div> -->

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

const tokenAbi = require('@/config/token_abi.json');
const mapAbi = require('@/config/mapData.json');
import config from '@/config/base'
import near from '@/config/near'

//sdk
import {getBridgeFee, getVaultBalance} from "butterjs-sdk/dist/core/tools/dataFetch";
import { SUPPORTED_CHAIN_LIST,MCS_CONTRACT_ADDRESS_SET,ID_TO_CHAIN_ID} from 'butterjs-sdk/dist/constants/index.js';
import {ID_TO_SUPPORTED_TOKEN} from "butterjs-sdk/dist/constants/supported_tokens.js";
import { getTokenCandidates } from "butterjs-sdk/dist/core/tools/dataFetch.js";
import {Token} from "butterjs-sdk/dist/entities/index.js";
import {EVMNativeCoin} from "butterjs-sdk/dist/entities/native/EVMNativeCoin.js";
import { ButterBridge } from "butterjs-sdk/dist/core/bridge/bridge.js";


import * as nearAPI from "near-api-js";
const { connect, Contract ,keyStores } = nearAPI;
import { parseNearAmount } from 'near-api-js/lib/utils/format';


export default {
  name: "Home.vue",
  components: {Footer, Header},
  data() {
    return {
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
        chainName: "MAP Testnet",
        chainLogo: require('../assets/token/map.png'),
        chain: 'MAP',
        chainId: '212',
        contract: MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID('212')],
      },  //From Chain选择
      chainTo: {
        chainName: "BSC Testnet",
        chainLogo: require('../assets/token/bsc.png'),
        chain: 'BSC',
        chainId: '97',
        contract: MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID('97')],
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
      chainIdHex: config.bsc.chainHex,
      chainIdNumber:config.bsc.chainId,

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
      this.receivedAmount = new Decimal(this.sendAmount).sub(new Decimal(this.gasFeeVue))
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
    searchToken(newV, oldV) {
      //逻辑-->根据input的value值筛选goodsList中的数据
      let inputContent = this.searchToken.substring(0, 2)
      let arrByZM = [];//声明一个空数组来存放数据
      let tokenListRes = ID_TO_SUPPORTED_TOKEN(this.chainIdNumber)
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
        v.toVault = new Decimal(vaultsFrom.balance).div(Math.pow(10,v.selectToken.decimals))
      }

      if (vaultsTo && vaultsTo.isMintable) {
        v.fromVault = vaultsTo
      }
      else  {
        v.fromVault = new Decimal(vaultsTo.balance).div(Math.pow(10,v.selectToken.decimals))
      }

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
      if (this.historyDetailList.confirmHeight > 0) {
        window.open(`${this.fromHref}tx/${this.historyDetailList.fromHash}`, '_blank')
      }

    },

    //到map浏览器
    goMap() {
      if (this.historyDetailList.relayerConfirmHeight > 0) {
        window.open(`https://makalu.mapscan.io/tx/${this.historyDetailList.relayerHash}`, '_blank')
      }
    },

    //到To地址
    goToScan() {
      if (this.historyDetailList.transferInHeight > 0) {
        window.open(`${this.toHref}tx/${this.historyDetailList.transferInHash}`, '_blank')
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
        this.showInsuffcientBalance = false
        return
      }
      this.showFee = false
      let transfer = document.getElementById('transfers-btn')
      let amount = this.sendAmount.toString().replace(/[^\d.]/g, "")
      this.sendAmount = amount
      let input = document.getElementById('tran-send-bottom-red')

      //余额不足时 input字体颜色  Transfer按钮颜色  余额不足提醒
      if (new Decimal(this.sendAmount).sub(new Decimal(this.balanceZ)) > 0) {
        input.style.color = '#E44E3A'
        this.showInsuffcientBalance = true
        transfer.className = 'tran-connect-approve'
        this.showFee = false
      } else {
        this.showFee = true
        this.actionGasFee()
        input.style.color = 'black'
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

      console.log('amount',this.chainTo.chainId,tokenDetail,amount.toFixed().toString(),provider)

      const fee = await getBridgeFee(
          tokenDetail,
          this.chainTo.chainId,
          amount.toFixed().toString(),
          provider
      );
      console.log('amount',fee.amount)

      this.gasFeeVue = new Decimal(fee.amount).div(new Decimal(Math.pow(10, this.selectToken.decimals))).toFixed()
      this.receivedAmount = new Decimal(this.sendAmount).sub(new Decimal(this.gasFeeVue))
      this.receivedAmountLoading = false
      console.log('gasFeeVue fee', this.gasFeeVue);
      console.log('approve', this.allowance, this.transferBtn);


      // return


      // let web3 = await this.$client(this.chainIdHex);
      //
      // let contractAddress = MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(this.chainFrom.chainId)]
      //
      // let contract = new web3.eth.Contract(mapAbi,contractAddress)
      // // let contract = new web3.eth.Contract(mapAbi, this.chainFrom.contract)
      //
      // let gas = await contract.methods.chainGasFee(this.chainTo.chainId).call();
      // console.log('gas',gas)
      // this.gasFee = gas
      // try {
      //   this.gasFeeVue = new Decimal(gas).div(new Decimal(Math.pow(10, 18)))
      // } catch (e) {
      //   this.gasFeeVue = '0';
      // }
    },

    //交换链
    actionChangeChain() {
      this.selectChain = 0
      this.changeChain = true
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
      let selectTokens = this.$copyObject(ID_TO_SUPPORTED_TOKEN(this.chainIdNumber.toString()));
      let formTokenList = this.$copyObject(ID_TO_SUPPORTED_TOKEN(this.chainIdNumber.toString()));
      let toTokenList = this.$copyObject(ID_TO_SUPPORTED_TOKEN(this.chainTo.chainId));

      if (!formTokenList || !toTokenList || formTokenList.length === 0 || toTokenList.length === 0) {
        this.tokenList = [];
        this.selectTokens = selectTokens;
        return;
      }


      //获取地址
      let temp = [];
      for (let i = 0; i < tokenCandidates.length; i++) {
        let item = tokenCandidates[i]
        console.log(tokenCandidates[0])
        //如果当前链的币种是选择链上的主币   获取主币余额
        let item2 = {};
        if (item.address === '0x0000000000000000000000000000000000000000') {
          item2 = await v.getBalance(item)
        }
        //代币余额
        else {
          item2 = await v.getTokenBalance(item)
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
      this.selectToken.url = item.logo
      this.selectToken.address = item.address
      this.selectToken.isToken = item.isToken
      this.selectToken.isNative = item.isNative

      // this.selectToken=item

      // console.log('selecToken', this.selectToken.address)

      this.balanceZ = item.amount

      this.showSelectToken = false

      this.actionApproveOrTransfer()

      this.actionStatus()

      this.actionVaultBalance()

      this.actionInputFont()

    },

    //获取主币余额
    async getBalance(item) {
      let web3 = await this.$client(this.chainIdHex);
      if (!web3 || !this.tokenList) {
        return item
      }

      let balance;

      //NEAR 链的情况
      if (item.symbol === 'NEAR') {
        // gets account balance
        const nearConnection = await connect(config.connectionConfig);

        const account = await nearConnection.account(this.account);
        balance = await account.getAccountBalance();
        balance = balance.total;
        console.log('balance', balance)
      } else {
        balance = await web3.eth.getBalance(this.account)
      }

      //其他链的情况

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
      let web3 = await this.$client(this.chainIdHex);

      if (!this.chainList || !web3) {
        return item;
      }
      let token_address = item.address;
      let balance;

      //near链上
      if (this.chainFrom.symbol === 'NEAR') {

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
      }
      //metamask上
      else {
        let contract = new web3.eth.Contract(tokenAbi, token_address)
        // 查询代币余额
        balance = await contract.methods.balanceOf(this.account).call();
      }


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


      // return
      let reward_address = v.chainFrom.contract

      //判断输入金额是否大于0

      if (!v.sendAmount) {
        v.$toast('Please enter the amount')
        return
      }

      // if (this.toVault && new Decimal(this.toVault).sub(new Decimal(this.sendAmount)) < 0) {
      //   v.$toast('Insufficient balance')
      //   return
      // }


      const bridge = new ButterBridge();

      v.sendAllAmount = new Decimal(v.sendAmount).mul(Math.pow(10, v.selectToken.decimals)).toString()

      console.log('sendAllAmount', v.sendAllAmount)


      if (this.langToAddress == '') {
        this.langToAddress = await this.$store.getters.getAddress
      }

      if (this.chainTo.symbol=='NEAR') {
        console.log('this.langToAddress.lastIn',this.langToAddress.lastIndexOf('.testnet'))

        let testnet = /.testnet$/
        let near = /.near$/

        //校验near上时 地址要以.testnet .near 结尾
        if ( testnet.test(this.langToAddress) || near.test(this.langToAddress))   {

        }else  {
          this.$toast('Please enter the address of the NEAR chain')
          return
        }
      }
      else  {
        let address = /^0x/
        console.log('address.test(this.langToAddress)',address.test(this.langToAddress))
        if ( address.test(this.langToAddress))   {

        }else  {
          this.$toast(`Please enter the address of the ${this.chainTo.symbol} chain`)
          return
        }

      }


      console.log('isNative',v.selectToken.isNative)

      let tokenDetail = v.selectToken

      console.log('this.selectToken',tokenDetail,this.sendAllAmount)

      let request = {
        fromAddress: v.account,
        fromToken: tokenDetail,
        fromChainId: this.chainFrom.chainId,
        toChainId: this.chainTo.chainId,
        toAddress: this.langToAddress,
        amount: this.myWeb3.utils.toWei(v.sendAmount).toString(),
        options: {signerOrProvider: this.myWeb3.eth},
      };

      console.log('request',request)
      console.log('this.myWeb3.eth',this.myWeb3.eth,this.myWeb3.eth.currentProvider)


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
          amount: this.myWeb3.utils.toWei(v.sendAmount).toString(),
          options: {signerOrProvider: this.myWeb3.eth, gas: adjustedGas},
        };
      }


      console.log('bridgeRequest',bridgeRequest)

      const receipt = await bridge.bridgeToken(bridgeRequest);
      console.log('tx receipt', receipt,receipt.transactionHash);

      if (this.chainFrom.symbol=='NEAR') {
        this.$router.push(`/home?sourceNetwork=NEAR&destNetwork=${this.$route.query.destNetwork}&ts=${Date.now()}`)
        return
      }




      const promiReceipt = receipt.promiReceipt;
      await promiReceipt
          .on('transactionHash', function (hash) {
            console.log('hash', hash);
            v.transHash = hash
            v.transferBtn = true
            if (v.transHash != null && v.transHash != '') {
              v.actionSubBridge()
            }
            // console.log(`hash`, hash)
            v.dialogTransing = true
          })
          .on('receipt', function (receipt) {
            console.log('receipt', receipt);
            v.allowance = true
            v.transferBtn = false
            v.dialogTransing = false
          });
          this.getAllData()
          this.actionTimerHistory()



      // console.log('statusToken',statusToken)

      return



          //当前链
      var chain = v.chainFrom.chain
      //console.log('chain', chain)

      //当前选择Token
      var TokenAddress = v.selectToken.address
      // console.log('TokenAddress', TokenAddress)

      let decimal;

      //通过Token地址获取当前Token的decimal
      v.tokenList.forEach((i, k) => {
        if (i.symbol == 'MAP') {
          v.mapBalance = new Decimal(i.amount).mul(new Decimal(Math.pow(10, 18)))
        }
        if (i.address.toLowerCase() == TokenAddress.toLowerCase()) {
          decimal = i.decimal
          return
        }
      })


      var reward_stakeData;

      var transParams;


      //输入的金额
      v.sendAllAmount = new Decimal(v.sendAmount).mul(Math.pow(10, decimal))

      //To的链Id
      let chainId = this.chainTo.chainId


      //调用合约执行
      let web3 = await this.$client(this.chainIdHex);
      let reward_contract = new web3.eth.Contract(mapAbi, reward_address)

      var valueFee;

      // console.log(TokenAddress, 'TokenAddress')

      if (this.langToAddress==''){
        this.langToAddress = await this.$store.getters.getAddress
      }

      console.log('this.langToAddres',this.langToAddress)

      if (TokenAddress == '0x0000000000000000000000000000000000000000') {
        reward_stakeData = reward_contract.methods.transferOutNative(this.langToAddress, v.sendAllAmount.toFixed(), chainId).encodeABI()
        if (parseInt(v.chainFrom.chainId) == 22776) {
          valueFee = new Decimal(v.sendAllAmount).add(new Decimal(v.gasFee))
        } else {
          valueFee = new Decimal(v.sendAllAmount)
        }
        transParams = {
          from: this.account,
          to: reward_address,
          data: reward_stakeData,
          value: valueFee.toFixed(0)
        }
      } else {

        if (v.selectToken.isMint == 1) {
          reward_stakeData = reward_contract.methods.transferOutTokenBurn(TokenAddress, this.langToAddress, v.sendAllAmount.toFixed(), chainId).encodeABI()
          // console.log('reward_stakeData', reward_stakeData)
          if (parseInt(v.chainFrom.chainId) == 22776) {
            valueFee = new Decimal(v.gasFee)
          } else {
            valueFee = 0
          }
          transParams = {
            from: this.account,
            to: reward_address,
            data: reward_stakeData,
            value: valueFee.toFixed()
          }
          // console.log('transParams',transParams)
        } else {
          reward_stakeData = reward_contract.methods.transferOutToken(TokenAddress, this.langToAddress, v.sendAllAmount.toFixed(), chainId).encodeABI()
          if (parseInt(v.chainFrom.chainId) == 22776) {
            valueFee = new Decimal(v.gasFee)
          } else {
            valueFee = 0
          }
          transParams = {
            from: this.account,
            to: reward_address,
            data: reward_stakeData,
            value: valueFee.toFixed()
          }
        }

      }
      // console.log('reward_stakeData', reward_stakeData)
      // console.log('transParams', transParams)


      if (parseInt(v.chainFrom.chainId) == 22776) {
        if (v.selectToken.address == '0x0000000000000000000000000000000000000000') {
          // console.log('valueFee', parseInt(valueFee))
          // console.log('mapBalance', parseInt(v.mapBalance))
          if (valueFee.comparedTo(v.mapBalance) > 0) {
            v.$toast('Insufficient balance')
            return
          }
        } else {
          if (new Decimal(v.gasFee).comparedTo(v.mapBalance) > 0) {
            v.$toast('Insufficient balance')
            return
          }
        }
      } else {
        if (new Decimal(v.gasFee).comparedTo(v.mapBalance) > 0) {
          v.$toast('Insufficient balance')
          return
        }
      }


      //报错
      var error;
      try {
        var gas = await web3.eth.estimateGas(transParams)
      } catch (e) {
        // let result = e.message.substring(e.message.indexOf("{"))
        // error = JSON.parse(result).message
        v.showErrorMessage = true
        v.errorMessage = e.message
        // this.$toast(error)
      }
      //console.log('gas', gas)
      if (error) {
        return
      }

      //
      v.allowance = true
      v.transferBtn = true
      const rewardReceipt = await this.$web3.eth.sendTransaction(transParams).on('transactionHash', function (hash) {
        v.transHash = hash
        v.transferBtn = true
        if (v.transHash != null && v.transHash != '') {
          v.actionSubBridge()
        }
        // console.log(`hash`, hash)
        v.dialogTransing = true
        // v.$toast('Transaction has send please wait result')
      }).on('receipt', function (receipt) {
        //receipt 成功
        v.transferBtn = false
        v.dialogTransing = false
        //console.log(`result`, receipt)
      }).on('error', function (receipt) {
        //receipt 失败
        v.allowance = true
        v.transferBtn = false
        v.dialogTransing = false
        //console.log(`error`, receipt)
      })
      // console.log('rewardReceipt', rewardReceipt);
      this.getAllData()
      this.actionTimerHistory()
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
      let result = await this.$http.historyList({
        chainId: this.chainIdNumber,
        address: this.account,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
      })
      if (result.code !== 200) {
        return;
      }
      this.historyList = result.data.list
      return
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
        let fromChainId = item.fromChainid
        let toChainId = item.toChainid
        let fromDecimal
        let toDecimal
        let fromSymobl

        for (const chain of this.chainList) {
          if (fromChainId == chain.chainId) {
            newObject.fromLogo = chain.chainImg
            newObject.fromChainName = chain.chainName
          }
          if (toChainId == chain.chainId) {
            newObject.toLogo = chain.chainImg
            newObject.toChainName = chain.chainName
          }
        }
        let tokens = ID_TO_SUPPORTED_TOKEN(fromChainId)
        let tokenTo = ID_TO_SUPPORTED_TOKEN(toChainId)


        for (let i = 0; i < tokens.length; i++) {
          let token = tokens[i];
          if (token.address.toLowerCase() === item.tokenAddress.toLowerCase()) {
            newObject.coin = token.symbol
            fromSymobl = token.symbol
            newObject.coinImg = token.img
            fromDecimal = token.decimal
            //时间
            newObject.nowTime = moment.utc(item.updatedAt).local().format("yyyy/MM/DD HH:mm:ss")
            break;
          }

        }

        for (let i = 0; i < tokenTo.length; i++) {
          let token = tokenTo[i];
          if (fromSymobl === token.symbol) {
            toDecimal = token.decimal
            // console.log(token.decimal)
          }
        }

        //余额
        newObject.amount = parseFloat(new Decimal(item.amount).div(Math.pow(10, fromDecimal)).toFixed(6))

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

      v.historyHash = item.hash

      v.fromLogo = item.fromLogo
      v.toLogo = item.toLogo

      var result = await v.$http.historyDetail({txHash: v.historyHash})
      // //console.log(result)
      if (result.code == 200) {
        v.historyDetailList = result.data
        // v.historyDetailList.sending = new Decimal(v.historyDetailList.sending).div(Math.pow(10, 18))
        v.historyDetailList.sending = new Decimal(v.historyDetailList.sending).div(Math.pow(10, v.historyDetailList.fromDecimal))
        v.historyDetailList.receiving = v.historyDetailList.receiving ? new Decimal(v.historyDetailList.receiving).div(Math.pow(10, v.historyDetailList.receiveDecimal)) : null
        //高度from
        if (v.historyDetailList.confirmHeight) {
          v.historyDetailList.confirmHeight = (v.historyDetailList.confirmHeight - v.historyDetailList.fromHeight) > 6 ? 6 : (v.historyDetailList.confirmHeight - v.historyDetailList.fromHeight)
        } else {
          v.historyDetailList.confirmHeight = 0
        }

        //高度map
        if (v.historyDetailList.relayerConfirmHeight) {
          v.historyDetailList.relayerConfirmHeight = (v.historyDetailList.relayerConfirmHeight - v.historyDetailList.relayerHeight) > 6 ? 6 : (v.historyDetailList.relayerConfirmHeight - v.historyDetailList.relayerHeight)
        } else {
          v.historyDetailList.relayerConfirmHeight = 0
        }

        //高度to
        if (v.historyDetailList.transferInConfirmHeight) {
          v.historyDetailList.transferInHeight = (v.historyDetailList.transferInConfirmHeight - v.historyDetailList.transferInHeight) > 6 ? 6 : (v.historyDetailList.transferInConfirmHeight - v.historyDetailList.transferInHeight)
        } else {
          v.historyDetailList.transferInHeight = 0
        }


        //链接
        v.chainList.forEach(item => {
          // console.log('item', item)
          if (v.historyDetailList.fromChainId == item.chainId) {
            v.fromHref = item.scanUrl
            // console.log(v.fromHref, 'fromHref')
          }
          if (v.historyDetailList.toChainId == item.chainId) {
            v.toHref = item.scanUrl
            // console.log(v.toHref, 'toHref')
          }

        })


      }

      v.setTimeHistory = setInterval(() => {
        v.refersHistoryDetail()
      }, 2000)
      // //console.log(v.setTimeHistory)

    },

    //重新调取历史详情
    async refersHistoryDetail() {
      let v = this
      var result = await v.$http.historyDetail({txHash: v.historyHash})
      // //console.log(result)
      if (result.code == 200) {
        v.historyDetailList = result.data

        v.historyDetailList.sending = new Decimal(v.historyDetailList.sending).div(Math.pow(10, v.historyDetailList.fromDecimal))
        v.historyDetailList.receiving = v.historyDetailList.receiving ? new Decimal(v.historyDetailList.receiving).div(Math.pow(10, v.historyDetailList.receiveDecimal)) : null
        //高度from
        if (v.historyDetailList.confirmHeight) {
          v.historyDetailList.confirmHeight = (v.historyDetailList.confirmHeight - v.historyDetailList.fromHeight) > 6 ? 6 : (v.historyDetailList.confirmHeight - v.historyDetailList.fromHeight)
        } else {
          v.historyDetailList.confirmHeight = 0
        }
        //高度map
        if (v.historyDetailList.relayerConfirmHeight) {
          v.historyDetailList.relayerConfirmHeight = (v.historyDetailList.relayerConfirmHeight - v.historyDetailList.relayerHeight) > 6 ? 6 : (v.historyDetailList.relayerConfirmHeight - v.historyDetailList.relayerHeight)
        } else {
          v.historyDetailList.relayerConfirmHeight = 0
        }
        //高度to
        if (v.historyDetailList.transferInConfirmHeight) {
          v.historyDetailList.transferInHeight = (v.historyDetailList.transferInConfirmHeight - v.historyDetailList.transferInHeight) > 6 ? 6 : (v.historyDetailList.transferInConfirmHeight - v.historyDetailList.transferInHeight)
        } else {
          v.historyDetailList.transferInHeight = 0
        }

        // if((v.historyDetailList.confirmHeight - v.historyDetailList.fromHeight)>=6 && v.historyDetailList.transferInConfirmHeight - v.historyDetailList.transferInHeight>=6) {
        //   clearInterval(v.setTimeHistory)
        //   v.setTimeHistory=null
        // }
        if (result.data.state == 1) {
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

      if (this.selectChain === 1) {
        if (item.chainName === this.chainFrom.chainName) {
          this.$toast(this.$t('Source Chain and Destination Chain cannot be the same'))
          return;
        }
        // let toTokenList = this.$copyObject(this.tokenAllList[item.chainId]);
        // console.log('toTokenList',toTokenList)
        // for (const token of toTokenList) {
        //   console.log('this.selectToken.symbol ',v.selectToken.symbol , token.symbol)
        //   if (! token.symbol==v.selectToken.symbol ){
        //     this.$toast('There is currently no such coin on the chain')
        //     return
        //   }
        // }
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
        // this.getAllData()
        this.receivedAmount = 0
        this.actionGasFee()
        this.actionStatus()
        this.actionInputFont()
        this.actionVaultBalance()
        if (this.$route.query.destNetwork=='BSC' || this.$route.query.destNetwork=='MAP') {
          let address = await this.$store.getters.getAddress;
          this.sortAddress = this.$formatAddress(address);
        }else  {
          this.sortAddress = ''
        }
        return
      }



      if (item.symbol== 'NEAR') {
        console.log('item.chainName === this.chainFrom.chainName',item.chainName , this.chainFrom.chainName)
        if (this.selectChain==0) {
          this.chainTo = this.chainFrom
        }
        if (item.chainName === this.chainTo.chainName) {
          this.$toast(this.$t('Source Chain and Destination Chain cannot be the same'))
          return;
        }

        let nearAccount = await near.asyncNearWallet()
        v.account= nearAccount.currentUser.accountId
        console.log(' v.account', v.account)
        this.chainIdNumber = item.chainId
        this.$store.commit("setAddress",nearAccount.currentUser.accountId);
        this.chainFrom = JSON.parse(JSON.stringify(item));
        this.showSelectChain = false

        // console.log(' this.chainFrom.symbol', this.chainFrom.symbol,this.chainTo.symbol)
        // this.$store.dispatch('logout')
        this.$router.push(`/home?sourceNetwork=${this.chainFrom.symbol}&destNetwork=${this.chainTo.symbol}&ts=${Date.now()}`)
        console.log('query',this.$route.query )
        this.actionTokenList()
        // this.actionShowToken()
        this.actionGasFee()
        this.actionStatus()
        this.actionInputFont()
        this.actionVaultBalance()
        this.actionApproveOrTransfer()
            // v.requestData()
        return
      }

      if (item.chainName === this.chainFrom.chainName) {
        this.$toast(this.$t('Source Chain and Destination Chain cannot be the same'))
        return;
      }


      if (window.ethereum.chainId === new Decimal(item.chainId).toHex()) {
        this.chainIdNumber = item.chainId

        let account = await this.myWeb3.eth.getAccounts()
        this.$store.commit("setAddress",account[0]);
        this.$store.commit("setChainId",item.chainId);
        this.chainFrom = JSON.parse(JSON.stringify(item));
        this.showSelectChain = false

        console.log('qqqqqqq',account,item.chainId)
        v.$router.push(`/home?sourceNetwork=${item.symbol}&destNetwork=${v.chainTo.symbol}&ts=${Date.now()}`)
        this.actionTokenList()
        // this.actionShowToken()
        this.actionGasFee()
        this.actionStatus()
        this.actionInputFont()
        this.actionVaultBalance()
        this.actionApproveOrTransfer()
        return
      }

      this.$watcher.getProvider().then(async provider => {
        // let chainId = item.chainId.toHex();
        console.log('item.chainId',item.chainId)
        let chainId = new Decimal(item.chainId).toHex();
        let params = {chainId}
        if (provider) {
          try {
            console.log('========')
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: chainId }]
            });
            return true;
          } catch (error) {
            try {
              let chains = this.$store.getters.getChains;
              console.log('chains',chains)
              let chain = chains[chainId];
              params.rpcUrls = [item.rpc];
              params.chainName = chain.name;
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
        console.log('========',this.chainFrom,this.chainTo)
        this.showSelectChain=false;
        //成功后 历史记录变成第一页
        v.currentPage=1
      }).catch(error => {
        this.chainFrom = JSON.parse(JSON.stringify(item));
        v.requestData()
      });
    },

    //打开选择链弹窗
    actionChain(i) {
      this.selectChain = i;
      this.searchVal=''
      this.showSelectChain = true;
    },

    //判断当前的From chain 与 To chain 是否一样
    getDifChain(chainName) {
      for (let item of this.chainList) {
        if (chainName !== item.chain) {
          return JSON.parse(JSON.stringify(item));
        }
      }
      return null;

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

      let addressCss = document.getElementById('tran-send-amount')
      addressCss.style.display = 'none'
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
      let reward_address = MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]
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

    // MAP approve
    async actionMapApprove() {
      this.actionChainSuccess()

      if (this.chainSuccess == false) {
        this.$toast('Network error,please link to the correct network')
        return
      }

      let v = this
      //当前链
      // var chain = this.chainFrom.coin
      let reward_address = MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]
      let token_address;
      ID_TO_SUPPORTED_TOKEN(v.chainFrom.chainId).forEach(item => {
        if (item.symbol == 'MAP') {
          token_address = item.address
          // console.log('map token_address', token_address)
        }
      })

      v.approveMapHash = '111';

      //approve
      let web3 = await this.$client(this.chainIdHex);
      let contract = new web3.eth.Contract(tokenAbi, token_address)
      const approveData = contract.methods.approve(reward_address, '1000000000000000000000000000').encodeABI();
      // console.log('approvedata', approveData)

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
          v.approveMapHash = hash;
          localStorage.setItem('approve', 2);
          v.setApproveStatus(v.account + reward_address, token_address, 'doing');
        }).on('receipt', (receipt) => {
          //receipt
          //console.log(receipt)
          v.dialogApproving = false
          v.allowanceMap = true
          v.approveMapHash = false;
          v.setApproveStatus(v.account + reward_address, token_address, false);
          let timer = setInterval(() => {
            v.checkMapApproved(timer)
          }, 1000);
          resolve(true);
        }).on('error', (receipt) => {
          //receipt
          localStorage.removeItem(v.account + reward_address)
          v.approveMapHash = false;
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
      let approving = this.getApproveStatus(`${v.account}${MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]}`, v.selectToken.address);
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



      let approving = this.getApproveStatus(`${v.account}${MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]}`, tokenAddress)

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
        this.setApproveStatus(`${v.account}${MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]}`, tokenAddress, false);
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
      contract.methods.allowance(v.account, MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]).call((error, result) => {
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
          v.setApproveStatus(`${v.account}${MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(v.chainFrom.chainId)]}`, tokenAddress, false);
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
        // let result = await this.$http.chainList()
        // if (result.code === 200) {
        //   this.chainList = result.data.list
        v.chainList = SUPPORTED_CHAIN_LIST
        console.log( v.chainList)

      // console.log('v.chainIdNumber',v.chainIdNumber,ew Decimal(v.chainIdNumber).toHex())
        let chainId = v.chainIdHex;
        let query = this.$route.query ? this.$route.query : {}
        let chains = await this.$store.getters.getChains;
        let chain = chains[chainId];
      console.log('chain',chains,chainId)

      //刷新
        if (this.selectChain == -1) {
          query.sourceNetwork=chain.symbol;
        } else
            //切换
        if (this.selectChain == 0) {
          if (!chain) {
            chain = chains[config.bsc.chainHex];
            // chain = chains['0x1'];
          }
          let temp = query.sourceNetwork;
          query.sourceNetwork = chain.symbol;
          query.destNetwork = temp;
        } else
            //from
        if (this.selectChain == 2) {
          query.sourceNetwork = chain.symbol;
        }

        if (!query.destNetwork || query.destNetwork=='' || query.sourceNetwork == query.destNetwork) {
          if (query.sourceNetwork == 'BSC') {
            query.destNetwork = 'MAP';
          } else {
            query.destNetwork = 'BSC';
          }
        }
        // if (!query.destNetwork || query.destNetwork=='' || query.sourceNetwork == query.destNetwork) {
        //   if (query.sourceNetwork == 'MAP') {
        //     query.destNetwork = 'ETH';
        //   } else {
        //     query.destNetwork = 'MAP';
        //   }
        // }

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
      console.log('this.chainIdNumber',this.chainIdNumber)
      this.tokenList = ID_TO_SUPPORTED_TOKEN(this.chainFrom.chainId.toString());
      // console.log(' this.tokenList', this.tokenList,ID_TO_SUPPORTED_TOKEN(this.chainIdNumber))

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

      console.log('tokenList1111111',this.tokenList)

      for (let i = 0; i < this.tokenList.length; i++) {
        // if (this.tokenList[i].symbol === 'NEAR') {
        if (this.tokenList[i].symbol === 'MAP') {
          selectToken = JSON.parse(JSON.stringify(this.tokenList[i]))
          flag = true;
          break;
        }
      }


      if (!selectToken) {
        selectToken = JSON.parse(JSON.stringify(this.tokenList[0]))
      }
      this.selectToken = selectToken;
      this.selectToken.url = selectToken.logo;

      const nearConnection = await connect(config.connectionConfig);
      const account = await nearConnection.account(this.account);
      let token_address = this.selectToken.address
      let web3 = await this.$client(this.chainIdHex);

      //主币余额
      if ( token_address === '0x0000000000000000000000000000000000000000') {
        if (this.selectToken.symbol === 'NEAR') {
          // gets account balance
          this.balanceZ = await account.getAccountBalance();
          this.balanceZ = this.balanceZ.total;
        } else {
          this.balanceZ = await web3.eth.getBalance(this.account)
        }
      }
      //代币余额
      else {
        if (this.chainFrom.symbol === 'NEAR') {
          const contractToken = new Contract(
              account,// the account object that is connecting
              token_address, // 代币的地址
              {
                // name of contract you're connecting to
                viewMethods: ["ft_balance_of"], // 获取余额的方法
              }
          );
          this.balanceZ  = await contractToken.ft_balance_of({'account_id': this.account}); // 用户账户地址
        }
        //metamask上
        else {
          let contract = new web3.eth.Contract(tokenAbi, token_address)
          // 查询代币余额
          this.balanceZ = await contract.methods.balanceOf(this.account).call();
        }
      }
      console.log(this.balanceZ );

      this.balanceZ = new Decimal(this.balanceZ).div(Math.pow(10,this.selectToken.decimals))
      this.balanceZ = Math.floor( this.balanceZ * 1000000) / 1000000

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
      console.log('chainSuccess',this.chainFrom.chainId.toString(),this.chainIdNumber)
      this.chainSuccess = this.chainFrom.chainId.toString() == this.chainIdNumber;
    },

    //provider
    actionProvider() {
      let provider = {
        url: 'http://18.142.54.137:7445', // map test rpc
        chainId: 212,
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


      this.account = address;
      this.sortAddress = this.$formatAddress(address);
      let chainId = await this.$store.getters.getChainId;
      this.chainIdHex = new Decimal(chainId).toHex();
      this.chainIdNumber = new Decimal(chainId).toNumber();

      let chains = await this.$store.getters.getChains;

      let chain=null;
      if (chains[chainId.toString()]) {
        chain = chains[chainId];
        this.error = false;
      } else {
        chain = null;
        this.error = true;
        this.isLoadingAllData = false;
        return
      }

      this.receivedAmount = '0.0'

      ///当前链是NEAR链
      if (this.$route.query.sourceNetwork==='NEAR') {
        console.log('111111')
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
        // this.$router.push(/`/home?sourceNetwork=${this.$route.query.sourceNetwork}&destNetwork=${this.$route.query.destNetwork}&ts=${Date.now()}`)
      }
      await this.actionGetChain()
      await this.actionTokenList()
      // await this.actionShowToken()
      await this.actionVaultBalance()
      this.actionStatus()
      this.actionInputFont()
      await this.actionChainSuccess()
      if (this.$route.query.destNetwork=='BSC' || this.$route.query.destNetwork=='MAP') {
      }else  {
        this.sortAddress = ''
      }
      this.isLoadingAllData = false;
    },

    async requestData() {
      this.$watcher.getProvider().then(provider => {
        this.getAllData();
        // this.actionTimerHistory();
      }).catch(err => {
      });
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
  },
}
</script>

<style scoped lang="less">
@import './Home.less';
//


</style>
