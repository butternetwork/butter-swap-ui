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
              <div @click="actionChain(0)" class="tran-from-btn">
                <!--                  <div class="tran-from-btn">-->
                <img :src="chainFrom.chainImg"/>
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
              <input id="tran-send-bottom-red"  @input="actionInputFont()" v-model="sendAmount" maxlength="20" placeholder="0.0"/>
              <div @click="actionOpenToken()" class="tran-send-btn">
                <img :src="selectToken.url"/>
                <span>{{ selectToken.symbol }}</span>
                <img class="tran-send-arrow-icon" src="../assets/arrow-bottom-black.png"/>
              </div>
            </div>
            <div v-show="showFromVault" class="tran-send-vault">
              <span>Vault:</span>
              <span>{{fromVault}} {{selectToken.symbol}}</span>
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
                <img :src="chainTo.chainImg"/>
                <span>{{ chainTo.chainName }}</span>
                <img src="../assets/arrow-bottom-black.png"/>
              </div>
            </div>
            <div class="tran-from-right">Destination Chain</div>
          </div>
          <div class="tran-send">
            <div class="tran-send-top">
              <span>Received Amount:</span>
              <span>Received Address:</span>
            </div>
            <div id="tran-send-amount" class="tran-send-bottom">
              <span>{{ receivedAmount }}</span>
              <div @click.stop="actionShowAddress()" class="tran-send-btn tran-send-btns">
                <span class="tran-send-btn-address">{{ sortAddress }}</span>
                <img class="tran-send-arrow-icon tran-send-arrow-icons" src="../assets/edit.png"/>
              </div>
            </div>
            <div v-show="showToVault" class="tran-send-vault">
              <span>Vault:</span>
              <span>{{toVault}} {{selectToken.symbol}}</span>
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
          <!--                  余额不足提醒-->
          <div v-show="showInsuffcientBalance" class="tran-insuff">
            <img src="../assets/warn-two.png"/>
            <span>Insufficient balance</span>
          </div>
          <!--                connect-->
          <div class="tran-connect">
            <button v-if="!allowance && !approveHash && allowanceMap"
                    :class="chainSuccess==false ? 'tran-connect-approve' :''" @click="actionApprove()">Approve
            </button>
            <button v-if="!allowance &&  approveHash" class="tran-connect-approve">
              Approving... <img src="../assets/loading.gif"/>
            </button>
            <button v-if="!allowanceMap && !approveMapHash" :class="chainSuccess==false ? 'tran-connect-approve' :''"
                    @click="actionMapApprove()">Approve MAP
            </button>
            <button v-if="!allowanceMap &&  approveMapHash" class="tran-connect-approve">
              Approving... <img src="../assets/loading.gif"/>
            </button>
            <button v-if="allowance && !transferBtn && allowanceMap"
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
                <img :src="chainFrom.chainImg"/>
                <span>{{ chainFrom.chainName }}</span>
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
                <img :src="chainTo.chainImg"/>
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
      <div  class="bridge-rate" v-show="showFee">
        <div class="bridge-rate-content">
          <!--  <div class="bridge-rate-content-item">
              <div class="bridge-rate-left">Bridge Rate:</div>
              <div class="bridge-rate-right">1 ETH on   <img/>    ≈ 1.0000717639923096 ETH on <img/></div>
            </div> -->
          <div class="bridge-rate-content-item">
            <div class="bridge-rate-left">
              Fee<img src="../assets/error.png"/>
            </div>
            <div class="bridge-rate-right">{{ gasFeeVue }} MAP</div>
          </div>
          <div class="bridge-rate-content-item">
            <div class="bridge-rate-left">Estimated Time of Arrival</div>
            <div class="bridge-rate-right">5-20 minutes</div>
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
              <img :src="item.chainImg"/>
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
          <div v-for="(item,index) in selectTokens" :key="index" @click="actionSelectToken(item,index)"
               class="dialog-token-content">
            <div class="dialog-token-contentlist">
              <div class="dialog-token-detail">
                <div class="dialog-token-detail-left">
                  <img :src="item.img"/>
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


export default {
  name: "Home.vue",
  components: {Footer, Header},
  data() {
    return {
      showExit:false,//退出
      showFee:false,//显示Fee
      showFromVault:true,//From 如果代币是ismint 不显示
      showToVault:true,// From如果代币是ismint 不显示
      fromVault:0,//fromVault
      toVault:0,//toVault
      isLoadingAllData:false,
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
        chainName: 'Ethereum Mainnet',
        chainImg: require('../assets/eth-icon-gray.png'),
        chain: 'ETH',
        chainId: config.defaultChainFrom,
        contract: config.mapAddress,
      },  //From Chain选择
      chainTo: {
        chainName: 'Makalu Testnet',
        chainImg: require('../assets/token/map.png'),
        chain: 'MAP',
        chainId: config.defaultChainTo,
        contract: config.toAddress,
      }, //To Chain 选择
      selectToken: {},// 选择Token
      tokenList: [],//Token列表
      // tokenAllList: {
      //   "1":[{"id":2,"tokenId":"IDV","address":"0x92ec47df1aa167806dfa4916d9cfb99da6953b8f","name":"Idavoll Network","chainId":1,"isMint":0,"symbol":"IDV","decimal":18,"img":"https://files.maplabs.io/bridge/idv.png"},{"id":6,"tokenId":"USDC","address":"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48","name":"USD Coin","chainId":1,"isMint":0,"symbol":"USDC","decimal":6,"img":"https://files.maplabs.io/bridge/usdc.png"},{"id":10,"tokenId":"MAP","address":"0x9e976f211daea0d652912ab99b0dc21a7fd728e4","name":"MAP Protocol","chainId":1,"isMint":0,"symbol":"MAP","decimal":18,"img":"https://files.maplabs.io/bridge/map.png"},{"id":12,"tokenId":"ETH","address":"0x0000000000000000000000000000000000000000","name":"ETH","chainId":1,"isMint":0,"symbol":"ETH","decimal":18,"img":"https://files.maplabs.io/bridge/eth.png"}],
      //   "22776":[{"id":1,"tokenId":"IDV","address":"0xeac6cfd6e9e2fa033d85b7abdb6b14fe8aa71f2a","name":"Idavoll Network","chainId":22776,"isMint":1,"symbol":"IDV","decimal":18,"img":"https://files.maplabs.io/bridge/idv.png"},{"id":5,"tokenId":"USDC","address":"0x9f722b2cb30093f766221fd0d37964949ed66918","name":"USD Coin","chainId":22776,"isMint":1,"symbol":"USDC","decimal":18,"img":"https://files.maplabs.io/bridge/usdc.png"},{"id":9,"tokenId":"MAP","address":"0x0000000000000000000000000000000000000000","name":"MAP Protocol","chainId":22776,"isMint":0,"symbol":"MAP","decimal":18,"img":"https://files.maplabs.io/bridge/map.png"},{"id":11,"tokenId":"ETH","address":"0x05ab928d446d8ce6761e368c8e7be03c3168a9ec","name":"ETH","chainId":22776,"isMint":1,"symbol":"ETH","decimal":18,"img":"https://files.maplabs.io/bridge/eth.png"}]
      // },//Token所有列表
      tokenAllList:{
        "1":[{"id":2,"tokenId":"IDV","address":"0x92ec47df1aa167806dfa4916d9cfb99da6953b8f","name":"Idavoll Network","chainId":1,"isMint":1,"symbol":"IDV","decimal":18,"img":"https://files.maplabs.io/bridge/idv.png"},{"id":6,"tokenId":"USDC","address":"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48","name":"USD Coin","chainId":1,"isMint":0,"symbol":"USDC","decimal":6,"img":"https://files.maplabs.io/bridge/usdc.png"},{"id":10,"tokenId":"MAP","address":"0x9e976f211daea0d652912ab99b0dc21a7fd728e4","name":"MAP Protocol","chainId":1,"isMint":0,"symbol":"MAP","decimal":18,"img":"https://files.maplabs.io/bridge/map.png"},{"id":12,"tokenId":"ETH","address":"0x0000000000000000000000000000000000000000","name":"ETH","chainId":1,"isMint":0,"symbol":"ETH","decimal":18,"img":"https://files.maplabs.io/bridge/eth.png"}],"56":[{"id":13,"tokenId":"MAP","address":"0x8105ECe4ce08B6B6449539A5db23e23b973DfA8f","name":"MAP Protocol","chainId":56,"isMint":1,"symbol":"MAP","decimal":18,"img":"https://files.maplabs.io/bridge/map.png"},{"id":15,"tokenId":"ETH","address":"0x2170Ed0880ac9A755fd29B2688956BD959F933F8","name":"ETH","chainId":56,"isMint":0,"symbol":"ETH","decimal":18,"img":"https://files.maplabs.io/bridge/eth.png"},{"id":18,"tokenId":"USDC","address":"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d","name":"USD Coin","chainId":56,"isMint":0,"symbol":"USDC","decimal":18,"img":"https://files.maplabs.io/bridge/usdc.png"},{"id":20,"tokenId":"BUSD","address":"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56","name":"Binance-Peg BUSD","chainId":56,"isMint":0,"symbol":"BUSD","decimal":18,"img":"https://files.maplabs.io/bridge/busd.png"}],"22776":[{"id":1,"tokenId":"IDV","address":"0xeac6cfd6e9e2fa033d85b7abdb6b14fe8aa71f2a","name":"Idavoll Network","chainId":22776,"isMint":1,"symbol":"IDV","decimal":18,"img":"https://files.maplabs.io/bridge/idv.png"},{"id":5,"tokenId":"USDC","address":"0x9f722b2cb30093f766221fd0d37964949ed66918","name":"USD Coin","chainId":22776,"isMint":1,"symbol":"USDC","decimal":18,"img":"https://files.maplabs.io/bridge/usdc.png"},{"id":9,"tokenId":"MAP","address":"0x0000000000000000000000000000000000000000","name":"MAP Protocol","chainId":22776,"isMint":0,"symbol":"MAP","decimal":18,"img":"https://files.maplabs.io/bridge/map.png"},{"id":11,"tokenId":"ETH","address":"0x05ab928d446d8ce6761e368c8e7be03c3168a9ec","name":"ETH","chainId":22776,"isMint":1,"symbol":"ETH","decimal":18,"img":"https://files.maplabs.io/bridge/eth.png"},{"id":19,"tokenId":"BUSD","address":"0x35bF4004C3Fc9f509259d4942da6bae3669e1Db1","name":"Mapped Binance USD","chainId":22776,"isMint":1,"symbol":"BUSD","decimal":18,"img":"https://files.maplabs.io/bridge/busd.png"}],"137":[{"id":14,"tokenId":"MAP","address":"0xBAbceE78586d3e9E80E0d69601A17f983663Ba6a","name":"MAP Protocol","chainId":137,"isMint":1,"symbol":"MAP","decimal":18,"img":"https://files.maplabs.io/bridge/map.png"},{"id":16,"tokenId":"ETH","address":"0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619","name":"ETH","chainId":137,"isMint":0,"symbol":"ETH","decimal":18,"img":"https://files.maplabs.io/bridge/eth.png"},{"id":17,"tokenId":"USDC","address":"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174","name":"USD Coin","chainId":137,"isMint":0,"symbol":"USDC","decimal":6,"img":"https://files.maplabs.io/bridge/usdc.png"}]},
      // tokenAllList: {
      //   "80001": [{
      //     "id": 16,
      //     "tokenId": "USDT",
      //     "address": "0x7B97F454324C5224DC241E9b75EEa5af66D8997A",
      //     "name": "USDT",
      //     "chainId": 80001,
      //     "isMint": 0,
      //     "symbol": "USDT",
      //     "decimal": 6,
      //     "img": "https://files.maplabs.io/bridge/usdt.png"
      //   }, {
      //     "id": 17,
      //     "tokenId": "MintToken",
      //     "address": "0x54B60B0E70AAB57210ac658Bd9D4f57436b6F413",
      //     "name": "MintToken",
      //     "chainId": 80001,
      //     "isMint": 1,
      //     "symbol": "MintToken",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/idv.png"
      //   }, {
      //     "id": 18,
      //     "tokenId": "MAP",
      //     "address": "0x659BC6aD25AEea579f3eA91086fDbc7ac0432Dc4",
      //     "name": "MAP",
      //     "chainId": 80001,
      //     "isMint": 0,
      //     "symbol": "MAP",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/map.png"
      //   }, {
      //     "id": 19,
      //     "tokenId": "ETH",
      //     "address": "0xaDd16759942D1dc2A7a2789c642b91F92bF561D7",
      //     "name": "ETH",
      //     "chainId": 80001,
      //     "isMint": 0,
      //     "symbol": "ETH",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/eth.png"
      //   }],
      //   "97": [{
      //     "id": 3,
      //     "tokenId": "USDT",
      //     "address": "0x876776d918845330ce55869F4f784304179B3fdB",
      //     "name": "USDT",
      //     "chainId": 97,
      //     "isMint": 0,
      //     "symbol": "USDT",
      //     "decimal": 6,
      //     "img": "https://files.maplabs.io/bridge/usdt.png"
      //   }, {
      //     "id": 6,
      //     "tokenId": "MintToken",
      //     "address": "0x58392329E23eB6783aA010449f41d0D1685770A3",
      //     "name": "MintToken",
      //     "chainId": 97,
      //     "isMint": 1,
      //     "symbol": "MintToken",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/idv.png"
      //   }, {
      //     "id": 9,
      //     "tokenId": "MAP",
      //     "address": "0x624F96Ea37bBbEA15Df489f9083Fe786BAf15723",
      //     "name": "MAP",
      //     "chainId": 97,
      //     "isMint": 0,
      //     "symbol": "MAP",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/map.png"
      //   }, {
      //     "id": 15,
      //     "tokenId": "ETH",
      //     "address": "0x173381BfA52b998E09A54288705aA65Bfa3c0CEB",
      //     "name": "ETH",
      //     "chainId": 97,
      //     "isMint": 0,
      //     "symbol": "ETH",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/eth.png"
      //   }],
      //   "3": [{
      //     "id": 1,
      //     "tokenId": "USDT",
      //     "address": "0xD100135b823661EbdE67d12dCA7567723834014d",
      //     "name": "USDT",
      //     "chainId": 3,
      //     "isMint": 0,
      //     "symbol": "USDT",
      //     "decimal": 6,
      //     "img": "https://files.maplabs.io/bridge/usdt.png"
      //   }, {
      //     "id": 4,
      //     "tokenId": "MintToken",
      //     "address": "0x4FeF2283a7012021e43Bae13aaAEBE9B638D5c10",
      //     "name": "MintToken",
      //     "chainId": 3,
      //     "isMint": 1,
      //     "symbol": "MintToken",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/idv.png"
      //   }, {
      //     "id": 7,
      //     "tokenId": "MAP",
      //     "address": "0x47f423C44976Fbe745588020b85B09A56458f9C0",
      //     "name": "MAP",
      //     "chainId": 3,
      //     "isMint": 0,
      //     "symbol": "MAP",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/map.png"
      //   }, {
      //     "id": 13,
      //     "tokenId": "ETH",
      //     "address": "0x0000000000000000000000000000000000000000",
      //     "name": "ETH",
      //     "chainId": 3,
      //     "isMint": 0,
      //     "symbol": "ETH",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/eth.png"
      //   }],
      //   "22776": [{
      //     "id": 2,
      //     "tokenId": "USDT",
      //     "address": "0x1f027B5B09924AC420002C1d09F7241c2041045A",
      //     "name": "USDT",
      //     "chainId": 22776,
      //     "isMint": 0,
      //     "symbol": "USDT",
      //     "decimal": 6,
      //     "img": "https://files.maplabs.io/bridge/usdt.png"
      //   }, {
      //     "id": 5,
      //     "tokenId": "MintToken",
      //     "address": "0x6f8a032FfB7872e347D726437d95e52678C8092D",
      //     "name": "MintToken",
      //     "chainId": 22776,
      //     "isMint": 1,
      //     "symbol": "MintToken",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/idv.png"
      //   }, {
      //     "id": 8,
      //     "tokenId": "MAP",
      //     "address": "0x0000000000000000000000000000000000000000",
      //     "name": "MAP",
      //     "chainId": 22776,
      //     "isMint": 0,
      //     "symbol": "MAP",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/map.png"
      //   }, {
      //     "id": 14,
      //     "tokenId": "ETH",
      //     "address": "0x86451bd490Ff3607B4311F45d524A2b170Da03E2",
      //     "name": "ETH",
      //     "chainId": 22776,
      //     "isMint": 0,
      //     "symbol": "ETH",
      //     "decimal": 18,
      //     "img": "https://files.maplabs.io/bridge/eth.png"
      //   }]
      // },
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
      chainIdHex: 1,
      chainIdNumber: 1,

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
      this.receivedAmount = this.sendAmount
      if (this.sendAmount>0) {
        this.showFee=true
      }else {
        this.showFee=false
      }
    },
    address(newVal) {
      this.requestData();
    },
    chainId(newVal) {
      console.log('Home Watch chainId',newVal)
      this.requestData();
    },
    searchToken(newV, oldV) {
      //逻辑-->根据input的value值筛选goodsList中的数据
      let inputContent = this.searchToken.substring(0, 2)
      let arrByZM = [];//声明一个空数组来存放数据
      let tokenListRes = this.tokenAllList[this.chainIdNumber]
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
        this.sortAddress='......'
        this.balanceZ=0
        this.historyList = []
      }
      else  {
        this.showExit = false
        await this.getAllData()
      }
    },

    async actionEixtMount() {
      let exit = localStorage.getItem('exit')
      if (JSON.parse(exit) == false) {
        await this.getAllData()
        this.showExit = true
        this.sortAddress='......'
        this.balanceZ=0
        this.historyList = []
      }
      else  {
        this.showExit = false
        this.getAllData()
      }
    },

    //获取vault
    async actionVaultBalance() {
      let v = this
      let toTokenMint;
      let toDecimal;
      let toAddress;
      if (v.selectToken.address==null){
        return;
      }
      let contract = new v.myWeb3.eth.Contract(tokenAbi, v.selectToken.address)
      // console.log("actionVaultBalance chainFrom", v.chainFrom)
      // From
      if (v.selectToken.isMint && v.selectToken.isMint==1) {
        // console.log('mint')
        v.fromVault = 0
        v.showFromVault=false
      }
      else if (v.selectToken.address=='0x0000000000000000000000000000000000000000') {
        // console.log('zhuFrom',v.chainFrom)
        let contractFrom = new v.myWeb3.eth.Contract(mapAbi,v.chainFrom.contract)
        // console.log('contractFrom',contractFrom)
        let tokenFromAddress = await contractFrom.methods.wToken().call()
        // console.log(tokenFromAddress,'tokenFromAddress')
        let contractZhu = new v.myWeb3.eth.Contract(tokenAbi,tokenFromAddress)
        let fromVault = await contractZhu.methods.balanceOf(v.chainFrom.contract).call();
        // console.log('fromVault',fromVault)

        v.fromVault = new Decimal(fromVault).div(Math.pow(10,v.selectToken.decimal)).toFixed(4)
        v.showFromVault=true
      }
      else {
        // console.log('daiFrom')
        let fromVault = await contract.methods.balanceOf(v.chainFrom.contract).call();
        v.fromVault = new Decimal(fromVault).div(Math.pow(10,v.selectToken.decimal)).toFixed(4)
        v.showFromVault=true
      }

      //To
      for (const item of v.tokenAllList[v.chainTo.chainId]) {
        if (item.name == v.selectToken.name) {
          toTokenMint = item.isMint
          toDecimal = item.decimal
          toAddress = item.address
        }
      }


      const Web3 = require('web3');

      let myToWeb3 = new Web3(v.chainTo.rpc);

      let toContract = new myToWeb3.eth.Contract(tokenAbi, toAddress)

      if (toTokenMint==1) {
        v.toVault = 0
        v.showToVault=false
      }
      else if (toAddress=='0x0000000000000000000000000000000000000000') {
        // console.log('zhuTo')
        let contractTo = new myToWeb3.eth.Contract(mapAbi,v.chainTo.contract)
        let tokenToAddress = await contractTo.methods.wToken().call()
        let toContractZhu = new myToWeb3.eth.Contract(tokenAbi, tokenToAddress)
        let toVault = await toContractZhu.methods.balanceOf(v.chainTo.contract).call();

        v.toVault = new Decimal(toVault).div(Math.pow(10,toDecimal)).toFixed(4)
        v.showToVault=true
      }
      else {
        // console.log('daiTo')
        let toVault = await toContract.methods.balanceOf(v.chainTo.contract).call();
        v.toVault =  new Decimal(toVault).div(Math.pow(10,toDecimal)).toFixed(4)
        v.showToVault=true
      }



    },

    actionEmitHeader(data) {
      this.showTab = data
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
      this.showFee=false
      let transfer = document.getElementById('transfers-btn')
      let amount = this.sendAmount.toString().replace(/[^\d.]/g, "")
      this.sendAmount = amount
      let input = document.getElementById('tran-send-bottom-red')

      //余额不足时 input字体颜色  Transfer按钮颜色  余额不足提醒
      if (new Decimal(this.sendAmount).sub(new Decimal(this.balanceZ)) > 0) {
        input.style.color = '#E44E3A'
        this.showInsuffcientBalance = true
        transfer.className='tran-connect-approve'
        this.showFee=false
      } else {
        this.showFee=true
        input.style.color = 'black'
        this.showInsuffcientBalance = false
        transfer.className=''
      }
    },

    //获取gas费
    async actionGasFee() {
      //创建合约
      let web3 = await this.$client(this.chainIdHex);
      let contract = new web3.eth.Contract(mapAbi, this.chainFrom.contract)
      // console.log(this.chainTo.chainId, this.chainFrom.contract)
      let gas = await contract.methods.chainGasFee(this.chainTo.chainId).call();
      this.gasFee = gas
      try {
        this.gasFeeVue = new Decimal(gas).div(new Decimal(Math.pow(10, 18)))
      } catch (e) {
        this.gasFeeVue = '0';
      }
    },

    //交换链
    actionChangeChain() {
      this.selectChain = 0
      this.changeChain = true
      this.handleLink(this.chainTo)
    },

    //Token弹窗余额获取
    async actionShowToken() {

      if (this.selectTokens) {
        this.selectTokens.forEach(item => {
          item.amount = null;
        })
      }
      let v = this
      let tokenList = this.$copyObject(this.tokenAllList[this.chainIdNumber]);
      let selectTokens = this.$copyObject(this.tokenAllList[this.chainIdNumber]);
      let formTokenList = this.$copyObject(this.tokenAllList[this.chainIdNumber]);
      let toTokenList = this.$copyObject(this.tokenAllList[this.chainTo.chainId]);
      if (!formTokenList || !toTokenList || formTokenList.length === 0 || toTokenList.length === 0) {
        this.tokenList = [];
        this.selectTokens = selectTokens;
        return;
      }
      let intersection = [];
      for (const item of formTokenList) {
        for (const token of toTokenList) {
          if (item.symbol === token.symbol) {
            item.amount = 0;
            intersection.push(this.$copyObject(item));
          }
        }
      }

      //获取地址
      let temp = [];
      for (let i = 0; i < intersection.length; i++) {
        let item = intersection[i]
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

    },

    //选择Token
    async actionSelectToken(item, index) {

      this.selectToken.symbol = item.symbol
      this.selectToken.symbol = item.symbol
      this.selectToken.url = item.img
      this.selectToken.address = item.address
      this.selectToken.isMint = item.isMint

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
      let result = await web3.eth.getBalance(this.account)
      for (const token of this.tokenList) {
        if (token.symbol === item.symbol) {
          let newObject = {}
          let decimal = token.decimal
          newObject.amount = new Decimal(result).div(Math.pow(10, decimal))
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
      let contract = new web3.eth.Contract(tokenAbi, token_address)
      // 查询代币余额
      let balance = await contract.methods.balanceOf(this.account).call();
      //获取代币精度
      let decimals = item.decimal
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
        this.checkMapApproved()
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

      if (TokenAddress == '0x0000000000000000000000000000000000000000') {
        reward_stakeData = reward_contract.methods.transferOutNative(this.account, v.sendAllAmount.toFixed(), chainId).encodeABI()
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
          reward_stakeData = reward_contract.methods.transferOutTokenBurn(TokenAddress, this.account, v.sendAllAmount.toFixed(), chainId).encodeABI()
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
          reward_stakeData = reward_contract.methods.transferOutToken(TokenAddress, this.account, v.sendAllAmount.toFixed(), chainId).encodeABI()
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
        console.log(`hash`, hash)
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
      }, 2000)
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
        let tokens = this.tokenAllList[fromChainId]
        let tokenTo = this.tokenAllList[toChainId]


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
          let token = tokens[i];
          if (fromSymobl === token.symbol) {
            toDecimal= token.decimal
            // console.log(token.decimal)
          }
        }

        //余额
        newObject.amount = new Decimal(item.amount).div(Math.pow(10, fromDecimal)).toFixed()

        //转到对应链的余额
        if (item.inAmount) {
          newObject.inAmount = new Decimal(item.inAmount).div(Math.pow(10,toDecimal)).toFixed()
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
      // console.log('handleLink===>>>',item)
      //To 选择
      let v = this
      if (this.selectChain === 1) {
        // console.log('handleLink===>>> 01')
        if (item.chain === this.chainFrom.chain) {
          this.$toast(this.$t('Source Chain and Destination Chain cannot be the same'))
          return;
        }
        this.chainTo = JSON.parse(JSON.stringify(item));
        this.destNetwork = item.chain
        this.showSelectChain = false
        await this.$router.push({
          path: '/',
          query: {
            token: this.selectChain.symbol,
            sourceNetwork: this.$route.query.sourceNetwork,
            destNetwork: this.chainTo.chain,
            ts: Date.now(),
          }
        })
        // this.getAllData()
        this.actionGasFee()
        this.actionStatus()
        this.actionInputFont()
        return
      }

      this.$watcher.getProvider().then(provider => {
        let chainId = new Decimal(item.chainId).toHex();
        console.log('chainId',chainId)
        let method = 'wallet_switchEthereumChain';
        let params = {chainId}
        let chains = this.$store.getters.getChains;
        let chain = chains[chainId];
        if (chain.symbol !== 'ETH') {
          method = 'wallet_addEthereumChain';
          params.rpcUrls = [item.rpc];
          params.chainName = chain.name;
        }
        provider.request({method, params: [params]})
        // v.requestData()
        this.showSelectChain = false;
        // window.ethereum.request({method,params:[params]});
      }).catch(error => {
        v.requestData()

      });
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
      this.allAddress = this.account;
      let addressCss = document.getElementById('tran-send-amount')
      addressCss.style.display = 'none'
    },

    //输入地址填写
    async getInputAddress() {
      let v = this
      if (v.allAddress=='') {
        v.allAddress =  await this.$store.getters.getAddress;
        v.sortAddress = v.allAddress.substr(0, 9) + '...' + v.allAddress.substr(38)
        v.showAddress = false
        let addressCss = document.getElementById('tran-send-amount')
        addressCss.style.display='flex'
        v.langToAddress = v.allAddress
        return
      }
      v.sortAddress = v.allAddress.substr(0, 9) + '...' + v.allAddress.substr(38)
      this.account = v.allAddress
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
      let reward_address = v.chainFrom.contract
      let token_address = v.selectToken.address
      v.tokenAllList[v.chainFrom.chainId].forEach(item => {
        if (v.selectToken.symbol == item.symbol) {
          token_address = item.address
          console.log('token_address', token_address)
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
          console.log("approv 1 :", v.account)
          this.setApproveStatus(v.account + reward_address, token_address, 'doing');
          //server order
        }).on('receipt', (receipt) => {
          //receipt
          //console.log(receipt)
          // console.log('receipt',receipt)
          v.dialogApproving = false
          v.allowance = true;
          console.log("approv 2", v.account)
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
      let reward_address = v.chainFrom.contract
      let token_address;
      v.tokenAllList[v.chainFrom.chainId].forEach(item => {
        if (item.symbol == 'MAP') {
          token_address = item.address
          console.log('map token_address', token_address)
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
          console.log("approv 3", v.account)
          v.setApproveStatus(v.account + reward_address, token_address, 'doing');
        }).on('receipt', (receipt) => {
          //receipt
          //console.log(receipt)
          v.dialogApproving = false
          v.allowanceMap = true
          v.approveMapHash = false;
          console.log("approv 4", v.account)
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
      let approving = this.getApproveStatus(`${v.account}${v.chainFrom.contract}`, v.selectToken.address);
      if (approving == 'done') {
        //关闭弹窗
        v.dialogApproving = false;
        v.dialogApproving = false;
        v.checkMapApproved()
        return;
      }
      let timer
      if (approving == 'doing') {
        //打开弹窗
        v.dialogApproving = true
        timer = setInterval(() => {
          v.checkMapApproved(timer);
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

      if (v.selectToken.address == '0x0000000000000000000000000000000000000000') {
        // console.log('主币不用Approve')
        v.allowance = true;
        v.transferBtn = false
        v.allowanceMap = true
        v.approveHash = ''
        return
      }

      if (!v.account) {
        return
      }

      let token = v.selectToken.symbol
      let tokenAddress = ''

      v.tokenAllList[v.chainFrom.chainId].forEach(item => {
        if (item.symbol == token) {
          tokenAddress = item.address
          return
        }
      })
      let approving = this.getApproveStatus(`${v.account}${v.chainFrom.contract}`, tokenAddress)
      // v.dialogApproving = false;
      console.log('change', approving)
      if (approving === 'done') {
        // console.log(approving)
        v.allowance = true;
        //清空检测事件
        v.approveHash = '';
        v.checkApproveToken = ''
        v.dialogApproving = false;

        if (timer) {
          clearInterval(timer);
        }
        console.log("approv 5", v.account)
        this.setApproveStatus(`${v.account}${v.chainFrom.contract}`, tokenAddress, false);
        return;
      } else if (approving === 'doing') {
        v.allowance = false
        v.approveHash = true
      } else if (approving === 'none') {
        v.approveHash = false
        v.dialogApproving = false;
      }
      // console.log('dialog========', v.dialogApproving)

      let contract = new this.$web3.eth.Contract(tokenAbi, tokenAddress)
      contract.methods.allowance(v.account, v.chainFrom.contract).call((error, result) => {
        console.log('result',result)
        if (result && result != 0) {
          v.allowance = true;
          //清空检测事件
          v.approveHash = '';
          v.checkApproveToken = ''
          if (timer) {
            clearInterval(timer);
          }
          v.dialogApproving = false;
          console.log("approv 6", v.account)
          v.setApproveStatus(`${v.account}${v.chainFrom.contract}`, tokenAddress, false);
        } else {
          v.allowance = false;
          // v.approveHash = false;
        }
        if (error) {
        }
      });

    },

    //检查MAP是否approve
    async checkMapApproved(timer) {
      let v = this

      if (!this.$web3) {
        return
      }
      if (!v.account) {
        return
      }

      var tokenAddress = ''
      let token = v.selectToken.symbol

      v.tokenAllList[v.chainFrom.chainId].forEach(item => {

        if (item.symbol == token) {
          tokenAddress = item.address
          return
        }
      })

      let approving = this.getApproveStatus(`${v.account}${v.chainFrom.contract}`, tokenAddress)
      // v.dialogApproving = false;
      console.log('approving', approving)

      if (parseInt(v.chainFrom.chainId) != 22776) {

        await v.actionGasFee()

        if (v.gasFee > 0) {
          v.allowanceMap = false
          v.approveMapHash = false

          v.tokenList.forEach(item => {

            if (item.symbol == 'MAP') {
              tokenAddress = item.address
              return
            }
          })


          if (approving === 'done') {
            v.allowanceMap = true
            v.approveMapHash = ''
            v.dialogApproving = false;
            // v.dialogApproving = false
            if (timer) {
              clearInterval(timer);
            }
            console.log("approv 7", v.account)
            v.setApproveStatus(`${v.account}${v.chainFrom.contract}`, tokenAddress, false);
            // return;
          } else if (approving === 'doing') {
            v.allowanceMap = false
            v.approveMapHash = true
          } else if (approving === 'none') {
            v.approveMapHash = false
            v.dialogApproving = false;
            // v.dialogApproving = false
          }

          let contract = new this.$web3.eth.Contract(tokenAbi, tokenAddress)
          console.log("approv account", v.account)
          contract.methods.allowance(v.account, v.chainFrom.contract).call(function (error, result) {
            if (result && result != 0) {
              v.allowanceMap = true
              v.approveMapHash = true
              if (timer) {
                clearInterval(timer);
              }
              v.dialogApproving = false;
              // console.log("approv 8", v.account)
              v.setApproveStatus(`${v.account}${v.chainFrom.contract}`, tokenAddress, false);
              v.checkApproved(v.statusTimer)
            } else {
              v.allowanceMap = false
            }
            if (error) {
              //console.log('error', error)
            }
          });

        } else {
          v.allowanceMap = true
          v.approveMapHash = true
          v.checkApproved(v.statusTimer)
        }

      } else {
        v.allowanceMap = true
        v.approveMapHash = true
        await v.actionGasFee()
        await v.checkApproved(v.statusTimer)
      }

    },

    async requestHistory(isNext=true){
      if (isNext){
        if (this.currentPage === this.pageNum) return;

      }else {
        if (this.currentPage === 1) return;
      }

      if (isNext){this.currentPage ++;}else{this.currentPage --;}
      this.actionHistory();
    },

    //获取链列表
    async actionGetChain() {
      console.log('actionGetChain',new Date())
      let v = this;
      let result = await this.$http.chainList()
      if (result.code === 200) {
        this.chainList = result.data.list
        //判断当前路由路由
        const query = this.$route.query ? JSON.parse(JSON.stringify(this.$route.query)) : {};
        let chains = await this.$store.getters.getChains;
        let chainId = new Decimal(this.chainIdNumber).toHex();
        let chain = chains[chainId];
        if (!chain) {
          chain = chains['0x1'];
        }
        query.sourceNetwork = chain.symbol;
        query.destNetwork = 'MAP';
        if (query.sourceNetwork === 'MAP') {
          query.destNetwork = 'ETH';
        }
        query.ts = Date.now();
        await this.$router.push({path: 'home', query})

        for (let item of this.chainList) {
          if (item.chain.toUpperCase() === query.sourceNetwork.toUpperCase()) {
            v.chainFrom = JSON.parse(JSON.stringify(item));
          }
          if (item.chain.toUpperCase() === query.destNetwork.toUpperCase()) {
            v.chainTo = JSON.parse(JSON.stringify(item));
          }
        }
      }
    },

    //获取Token列表
    async actionTokenList() {
      if (!this.chainList || this.chainList.length <= 0) {
        this.tokenAllList = [];
        return;
      }
      let result = await this.$http.tokenList()
      if (result.code !== 200) {
        this.tokenAllList = [];
        return;
      }
      this.tokenAllList = result.data.list;
      this.tokenList = this.tokenAllList[this.chainIdNumber];
      let selectToken = null;
      let flag = false;
      if (!this.tokenList) {
        return
      }
      for (let i = 0; i < this.tokenList.length; i++) {
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
      this.selectToken.url = selectToken.img;

      let approvedResult = await this.checkMapApproved(this.statusTimer);
      if (!flag) {
        this.allowance = approvedResult;
      }
    },

    //判断当前链跟选择的from链是否一致
    async actionChainSuccess() {
      this.chainSuccess = new Decimal(this.chainFrom.chainId).toNumber() == this.chainIdNumber;
    },

    async getAllData() {
      // if (this.isLoadingAllData){
      //   console.log('Home getAllData 01')
      //   // window.location.reload();
      //   return;
      // }
      this.isLoadingAllData=true;
      this.sendAmount = ''
      let address = await this.$store.getters.getAddress;
      if (!address) {
        window.ethereum.enable()
        this.isLoadingAllData=false;
        this.$router.push('home')
        return;
      }
      this.account = address;
      this.sortAddress = this.$formatAddress(address);
      let chainId = await this.$store.getters.getChainId;
      this.chainIdHex = new Decimal(chainId).toHex();
      this.chainIdNumber = new Decimal(chainId).toNumber();
      await this.actionGetChain()
      await this.actionTokenList()
      await this.actionChainSuccess()
      await this.actionShowToken()
      await this.actionVaultBalance()
      this.actionGasFee()
      this.actionStatus()
      this.actionInputFont()
      this.isLoadingAllData=false;
      // await this.actionMapStatus()
    },

    async requestData() {
      this.$watcher.getProvider().then(provider => {
        this.getAllData();
        this.actionTimerHistory();
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
    this.isLoadingAllData=false;
    this.cleanHistoryTimer();
    this.cleanLoadingTimer();
    this.cleanStatusTimer();
  },

  mounted() {
    this.isLoadingAllData=false;
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
