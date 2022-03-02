        <template>
          <div class="home">

            <Header @listenTab="acitonEmitHeader" :loadingHistory="historyLoading"/>

            <div class="header-middle">
              <div @click="actionOpenTransfer(showTab=0)" :class="showTab==0?'header-middle-tran-active':'header-middle-trans'">Transfer funds</div>
              <div @click="actionHistory(showTab=1)" :class="showTab==1?'header-middle-tran-active header-middle-his-active':'header-middle-trans header-middle-his'">
                History
                <img v-show="historyLoading && historyLoading>0" class="loading-icon" src="../assets/cycle.png"/>
              </div>
            </div>


            <div class="bridge">
              <div class="bridge-switch" v-show="!chainSuccess">
                <img src="../assets/warn-two.png"/>
                <span>You must switch <span style="color:#e44e3a;padding-left: 0">{{chainForm.chainName}}</span>  to begin the transfer</span>
              </div>
              <div class="bridge-content">
               <!-- <div class="bridge-title">
                  <div class="tran">
                    <div @click="actionOpenTransfer(showTab=0)" class="tran-title"><span>Transfer funds</span></div>
                    <div :class="showTab==0?'tran-title-line':'tran-title-line-black'" class=""></div>
                  </div>
                   <div class="tran">
                       <div @click="showTab=2" class="tran-title"><span>Transfer Nft</span></div
                          <div :class="showTab==2?'tran-title-line':'tran-title-line-black'" class=""></div>
                    </div>
                  <div class="tran">
                    <div @click="actionHistory(showTab=1)" class="tran-title">
                      <span>History</span>
                      <img v-show="historyLoading && historyLoading>0" class="loading-icon" src="../assets/dialog/loading.png"/>
                    </div>
                    <div :class="showTab==1?'tran-title-line':'tran-title-line-black'" class=""></div>
                  </div>
                </div> -->
                <!--              tranfer-->
                <div v-show="showTab==0">
                  <!--                tran-from-->
                  <div class="tran-from">
                    <div class="tran-from-left">
                      <span>From</span>
                      <div @click="actionChain(0)" class="tran-from-btn">
                        <!--                  <div class="tran-from-btn">-->
                        <img :src="chainForm.chainImg"/>
                        <span>{{ chainForm.chainName }}</span>
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
                      <input id="tran-send-bottom-red" @input="actionInputFont()" v-model="sendAmount" placeholder="0.0"/>
                      <div @click="actionOpenToken()" class="tran-send-btn">
                        <img :src="selectToken.url"/>
                        <span>{{ selectToken.name }}</span>
                        <img class="tran-send-arrow-icon" src="../assets/arrow-bottom-black.png"/>
                      </div>
                    </div>
                    <div class="tran-send-vault">
                      <span>Vault:</span>
                      <span>1111 {{selectToken.symbol}}</span>
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
                    <!--<div class="tran-custom">
                      <div class="tran-custom-content">
                        <div class="tran-custom-left">
                          <img v-if="!showAddress" @click.stop="showAddress=true" src="../assets/frame.png"/>
                          <img v-else @click.stop="showAddress=false" src="../assets/frame-red.png"/>
                          <span>Custom</span>
                        </div>
                        <div class="tran-custom-right">
                          <input :disabled="showAddress?false:'disabled'" v-model="langToAddress">
                        </div>
                      </div>

                    </div> -->
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
                   <div class="tran-send-fee">
                      <img src="../assets/error.png"/>
                      <span style="padding-top: 3px">Cross-chain transaction fee:{{ gasFeeVue }} MAP</span>
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
                            :class="chainSuccess==false ? 'tran-connect-approve' :''" id="tranferBtn" @click="actionTrans()">Transfer
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
                        <img :src="chainForm.chainImg"/>
                        <span>{{ chainForm.chainName }}</span>
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
                    <div class="tran-send-fee">
                      <img src="../assets/error.png"/>
                      <span style="padding-top: 3px">Cross-chain transaction fee:{{ gasFeeVue }} MAP</span>
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
              <!--<div  class="bridge-rate" v-show="showTab==0">
                <div class="bridge-rate-content">
                    <div class="bridge-rate-content-item">
                      <div class="bridge-rate-left">Bridge Rate:</div>
                      <div class="bridge-rate-right">1 ETH on   <img/>    ≈ 1.0000717639923096 ETH on <img/></div>
                    </div>
                  <div class="bridge-rate-content-item">
                    <div class="bridge-rate-left">
                      Fee<img src="../assets/error.png"/>
                    </div>
                    <div class="bridge-rate-right">0.00048004 ETH</div>
                  </div>
                  <div class="bridge-rate-content-item">
                    <div class="bridge-rate-left">Minimum Received<img src="../assets/error.png"/></div>
                    <div class="bridge-rate-right">0.098527 ETH</div>
                  </div>
                  <div class="bridge-rate-content-item">
                    <div class="bridge-rate-left">Estimated Time of Arrival</div>
                    <div class="bridge-rate-right">5-20 minutes</div>
                  </div>
                  <div class="bridge-rate-content-item">
                    <div class="bridge-rate-left">Received Gas Tokens on Arrival <img src="../assets/error.png"/></div>
                    <div class="bridge-rate-right">0.002 MATIC</div>
                  </div>
                </div>
              </div> -->
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
                    Below is the supported token list from {{chainForm.chainName}} to {{chainTo.chainName}}. More tokens can be found if you select other chains.
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
                                        <span @click="goToScan()">{{ historyDetailList.transferInHeight }}/6 confirmed <img
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
                <span>{{errorMessage}}</span>
              </div>
            </div>

          </div>
        </template>

        <script>

        import Header from "@/components/Header";
        import Footer from "@/components/Footer";
        import Decimal from 'decimal.js'

        import BN from 'bn.js'
        import moment from "moment";

        const tokenAbi = require('@/config/token_abi.json');
        const mapAbi = require('@/config/mapData.json');
        import config from '@/config/configTest'


        export default {
          name: "Home.vue",
          components: {Footer, Header},
          data() {
            return {
              showErrorMessage:false,//显示错误认识弹窗
              errorMessage:'Your gas fee is not enough Your gas fee is not enough',//错误信息
              showInsuffcientBalance:false,//余额不足提醒
              chooseApprove:-1,//点击按钮是Approve还是ApproveMap
              account:'',//用户地址
              historyTimerLoading: [],
              historyLoading: null,
              setTimeHistoryLoading: false,

              statusTimer: false,

              chainSuccess: false,//当前选择链和当前链是否一致
              gasFee: 0,//gas费
              gasFeeVue: 0,//gas费页面显示
              ethLine: '100',
              mapLine: '30',
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
              // chainList: [
              //   {
              //     url: require('../assets/token/map.png'),
              //     name: 'MAP',
              //     path: '/home/map',
              //     chain: 'MAP',
              //     chainId: '22776'
              //   },
              //   {
              //     url: require('../assets/eth-icon.png'),
              //     name: 'Ethereum Mainnet',
              //     path: '/home/eth',
              //     chain: 'ETH',
              //     chainId: '1'
              //   },
              //   {
              //     url: require('../assets/binance.png'),
              //     name: 'Binance Smart Chain',
              //     path: '/home/binance',
              //     chain: 'BSC',
              //     chainId: '97'
              //   },
              // ],//链列表
              chainList: [],
              chainForm: {
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
              tokenAllList: {
                "80001":[{"id":16,"tokenId":"USDT","address":"0x7B97F454324C5224DC241E9b75EEa5af66D8997A","name":"USDT","chainId":80001,"isMint":0,"symbol":"USDT","decimal":6,"img":"https://files.maplabs.io/bridge/usdt.png"},{"id":17,"tokenId":"MintToken","address":"0x54B60B0E70AAB57210ac658Bd9D4f57436b6F413","name":"MintToken","chainId":80001,"isMint":1,"symbol":"MintToken","decimal":18,"img":"https://files.maplabs.io/bridge/idv.png"},{"id":18,"tokenId":"MAP","address":"0x659BC6aD25AEea579f3eA91086fDbc7ac0432Dc4","name":"MAP","chainId":80001,"isMint":0,"symbol":"MAP","decimal":18,"img":"https://files.maplabs.io/bridge/map.png"},{"id":19,"tokenId":"ETH","address":"0xaDd16759942D1dc2A7a2789c642b91F92bF561D7","name":"ETH","chainId":80001,"isMint":0,"symbol":"ETH","decimal":18,"img":"https://files.maplabs.io/bridge/eth.png"}],
                "97":[{"id":3,"tokenId":"USDT","address":"0x876776d918845330ce55869F4f784304179B3fdB","name":"USDT","chainId":97,"isMint":0,"symbol":"USDT","decimal":6,"img":"https://files.maplabs.io/bridge/usdt.png"},{"id":6,"tokenId":"MintToken","address":"0x58392329E23eB6783aA010449f41d0D1685770A3","name":"MintToken","chainId":97,"isMint":1,"symbol":"MintToken","decimal":18,"img":"https://files.maplabs.io/bridge/idv.png"},{"id":9,"tokenId":"MAP","address":"0x624F96Ea37bBbEA15Df489f9083Fe786BAf15723","name":"MAP","chainId":97,"isMint":0,"symbol":"MAP","decimal":18,"img":"https://files.maplabs.io/bridge/map.png"},{"id":15,"tokenId":"ETH","address":"0x173381BfA52b998E09A54288705aA65Bfa3c0CEB","name":"ETH","chainId":97,"isMint":0,"symbol":"ETH","decimal":18,"img":"https://files.maplabs.io/bridge/eth.png"}],
                "3":[{"id":1,"tokenId":"USDT","address":"0xD100135b823661EbdE67d12dCA7567723834014d","name":"USDT","chainId":3,"isMint":0,"symbol":"USDT","decimal":6,"img":"https://files.maplabs.io/bridge/usdt.png"},{"id":4,"tokenId":"MintToken","address":"0x4FeF2283a7012021e43Bae13aaAEBE9B638D5c10","name":"MintToken","chainId":3,"isMint":1,"symbol":"MintToken","decimal":18,"img":"https://files.maplabs.io/bridge/idv.png"},{"id":7,"tokenId":"MAP","address":"0x47f423C44976Fbe745588020b85B09A56458f9C0","name":"MAP","chainId":3,"isMint":0,"symbol":"MAP","decimal":18,"img":"https://files.maplabs.io/bridge/map.png"},{"id":13,"tokenId":"ETH","address":"0x0000000000000000000000000000000000000000","name":"ETH","chainId":3,"isMint":0,"symbol":"ETH","decimal":18,"img":"https://files.maplabs.io/bridge/eth.png"}],
                "22776":[{"id":2,"tokenId":"USDT","address":"0x1f027B5B09924AC420002C1d09F7241c2041045A","name":"USDT","chainId":22776,"isMint":0,"symbol":"USDT","decimal":6,"img":"https://files.maplabs.io/bridge/usdt.png"},{"id":5,"tokenId":"MintToken","address":"0x6f8a032FfB7872e347D726437d95e52678C8092D","name":"MintToken","chainId":22776,"isMint":1,"symbol":"MintToken","decimal":18,"img":"https://files.maplabs.io/bridge/idv.png"},{"id":8,"tokenId":"MAP","address":"0x0000000000000000000000000000000000000000","name":"MAP","chainId":22776,"isMint":0,"symbol":"MAP","decimal":18,"img":"https://files.maplabs.io/bridge/map.png"},{"id":14,"tokenId":"ETH","address":"0x86451bd490Ff3607B4311F45d524A2b170Da03E2","name":"ETH","chainId":22776,"isMint":0,"symbol":"ETH","decimal":18,"img":"https://files.maplabs.io/bridge/eth.png"}]},
              // tokenAllList:[],
              historyList: [],//history记录
              historyFromLogo: '', //历史记录 From logo
              historyToLogo: '',//历史记录 To logo

              sourcePath: 'ETH',//formChain
              tokenCoin: 'MAP',//token
              destNetwork: 'MAP',//toChain
              balanceZ: 0,//Token的余额
              sendAmount: '',//From发送价格
              sendAllAmount: '',//From价格*10*18
              receivedAmount: '0.0',//To兑换获得的价格,
              searchVal: '',  //弹窗链查找默认输入为空
              searchToken: '',//弹窗 Token查找
              sortAddress: '',//短地址
              langAddress: '',//全部地址
              allAddress: '',//输入的地址
              allowance: false,
              langToAddress: '',//To到的长地址
              approveHash: '',//approveHash
              transHash: '',//transHash
              timer: '',
              historyDetailList: '',//历史记录详情
              setTimeHistory: null,
              historyHash: '',//查看历史详情传的数据
              historyCoin: '',//历史单位
              fromLogo: '', //历史详情fromlogo
              toLogo: '', //历史详情tologo
              fromHref: '',//历史详情from链接
              toHref: '',//历史详情to链接
              transferBtn: false,
              checkApproveToken: '',
              changeChain: false,  //切换料
              loadingToken: false, //Token列表loading
              dialogApproving: false, //弹窗Approving显示
              dialogTransing: false, //弹窗Transfering显示
              dialogNft: false, //弹窗NFT显示
              approveMap: false, //是否Approve Map过
              allowanceMap: false,//Approve Map
              approveMapHash: '',//Approve Map hash
              // dialogApproving: false,//approveing map diaglog
              mapBalance: '',
              chainIdRes: 1,

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
            },
            //检测到获取了地址
            account_default_address() {
              console.log('change address')
              clearInterval(this.setTimeHistory);
              this.setTimeHistory = null;
              clearInterval(this.statusTimer)
              this.statusTimer = null
              this.getAllData()
              this.actionTimerHistory()
            },
            // account_change_chain() {
            //   clearInterval(this.setTimeHistory);
            //   this.setTimeHistory = null;
            //   clearInterval(this.historyTimerLoading)
            //   this.historyTimerLoading = null
            //   clearInterval(this.statusTimer)
            //   this.statusTimer = null
            //   this.getAllData()
            // },
            searchToken(newV, oldV) {
              // console.log('searchToken',newV)
              // if (newV.length<2){
              //   return ;
              // }

              var _this = this;
              //逻辑-->根据input的value值筛选goodsList中的数据
              var inputContent = _this.searchToken.substring(0, 2)
              // //console.log(inputContent)
              var arrByZM = [];//声明一个空数组来存放数据
              if (inputContent !== '0x') {

                let tokenListRes = _this.tokenAllList[_this.chainIdRes]
                if (tokenListRes) {
                  for (var i = 0; i < tokenListRes.length; i++) {
                    //for循环数据中的每一项（根据name值）
                    // console.log('tokenList',tokenListRes)
                    if (tokenListRes[i] && tokenListRes[i].name.toUpperCase().search(_this.searchToken.toUpperCase()) != -1) {
                      //判断输入框中的值是否可以匹配到数据，如果匹配成功
                      arrByZM.push(tokenListRes[i]);
                      //向空数组中添加数据
                    }
                  }
                }
              } else {
                let tokenListRes = _this.tokenAllList[_this.chainIdRes]
                if (tokenListRes) {
                  for (var i = 0; i < tokenListRes.length; i++) {
                    //for循环数据中的每一项（根据name值）
                    if (tokenListRes[i] && tokenListRes[i].address.search(_this.searchToken) != -1) {
                      //判断输入框中的值是否可以匹配到数据，如果匹配成功
                      arrByZM.push(tokenListRes[i]);
                      //向空数组中添加数据
                    }
                  }
                }

              }
              _this.selectTokens = arrByZM;
              console.log(_this.selectTokens)
            },
            '$store.state.account.change_chain'(data) {
              clearInterval(this.setTimeHistory);
              this.setTimeHistory = null;
              clearInterval(this.statusTimer)
              this.statusTimer = null
              this.getAllData()
              this.actionTimerHistory()
              this.$emit('ChainChanged', data);
            },
            dialogApproving(newValue) {
              // console.log("dialogApproving", newValue, new Date())
            },
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
            acitonEmitHeader(data) {
              this.showTab = data
              if (  this.showTab ==0) {
                this.actionOpenTransfer(this.showTab)
              }
              else if (  this.showTab ==1) {
                this.actionHistory(this.showTab=1)
              }
            },

            getApproveStatus(key, tokenAddress) {
              // console.log('getApproveStatus',{key,tokenAddress});
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
              // console.log('setApproveStatus', status)
              // console.trace('setApproveStatus');
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

            //关闭提示错误的弹窗
            closeErrorMessage() {
              this.errorMessage=''
            },

            //获取最大值
            actionMaxBalance() {
              this.sendAmount = this.balanceZ
              this.actionInputFont()
            },

            //输入数值超出时 显示红色
            actionInputFont() {

              if (! this.sendAmount) {
                return
              }

              let amount = this.sendAmount.toString().replace(/[^\d.]/g, "")
              this.sendAmount = amount

              let input = document.getElementById('tran-send-bottom-red')
              let transfer = document.getElementById('tranferBtn')

              console.log('amount',new Decimal(this.sendAmount).sub(new Decimal(this.balanceZ)).toFixed())

              //余额不足时 input字体颜色  Transfer按钮颜色  余额不足提醒
              if (new Decimal(this.sendAmount).sub(new Decimal(this.balanceZ)) > 0) {
                input.style.color = '#E44E3A'
                this.showInsuffcientBalance = true
                transfer.className='tran-connect-approve'
              } else {
                input.style.color = 'black'
                this.showInsuffcientBalance = false
                transfer.className=''
              }
            },

            //获取gas费
            async actionGasFee() {
              let v = this
              let contract_address = v.chainForm.contract
              let toChainId = v.chainTo.chainId
              // console.log('toChainId', toChainId)
              // console.log('contract_address', contract_address)
              //创建合约
              let contract = new v.myWeb3.eth.Contract(mapAbi, contract_address)
              // console.log('contract', contract)
              //查询代币余额
              let gas = await contract.methods.chainGasFee(toChainId).call();

              v.gasFee = gas

              // console.log(`gas test bbbbbbb`,gas,toChainId)
              v.gasFeeVue = new Decimal(gas).div(new Decimal(Math.pow(10, 18)))
              // console.log(`gas test ccccccc`,gas)
              // console.log('gas', parseInt(gas))
            },

            //交换链
            actionChangeChain() {

              var v = this
              this.selectChain = 0
              this.changeChain = true

              this.handleLink(v.chainTo)

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
              var patrn = /^(-)?\d+(\.\d+)?$/;
              if (patrn.exec(value) == null || value == "") {
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

            //Token弹窗余额获取
            async actionShowToken() {

              if (this.selectTokens) {
                this.selectTokens.forEach(item => {
                  item.amount = null;
                })
              }
              let v = this
              var chainName;

              //链名字的币种
              chainName = v.chainForm.chain

              var chainId = await v.action.getChainId()
              chainId = new BN(chainId.slice(2), 16)

              v.tokenList = v.tokenAllList[chainId]
              v.selectTokens = v.tokenAllList[chainId]


              let formTokenList = v.tokenAllList[chainId]
              let toTokenList = v.tokenAllList[v.chainTo.chainId]
              let intersection = []

              for (const item of formTokenList) {
                for (const i of toTokenList) {
                  if (item.symbol == i.symbol) {
                    intersection.push(item)
                  }
                }
              }
              v.tokenList = intersection
              v.selectTokens = intersection

              if (!v.tokenList || v.tokenList.length == 0) {
                v.tokenList = []
                return
              }


              //获取地址
              let a = [];
              let flag = false;
              for (let i = 0; i < v.tokenList.length; i++) {
                let item = v.tokenList[i]
                //如果当前链的币种是选择链上的主币   获取主币余额
                let item2 = {};
                if (item.address == '0x0000000000000000000000000000000000000000') {
                  item2 = await v.getBalance(item)
                }
                //代币余额
                else {
                  item2 = await v.getTokenBalance(item)
                }

                a.push(JSON.parse(JSON.stringify(item2)))

              }
              v.tokenList = a
              v.selectTokens = a;

              for (const item of v.selectTokens) {
                if (v.selectToken.name == item.symbol) {
                  v.balanceZ = item.amount
                }
              }

            },

            //选择Token
            async actionSelectToken(item, index) {

              this.selectToken.symbol = item.symbol
              this.selectToken.name = item.symbol
              this.selectToken.url = item.img
              this.selectToken.address = item.address
              this.selectToken.isMint = item.isMint

              // this.selectToken=item

              // console.log('selecToken', this.selectToken.address)

              this.balanceZ = item.amount

              this.showSelectToken = false

              this.actionApproveOrTransfer()

              this.actionStatus()

            },

            //获取主币余额
            async getBalance(item) {
              // console.log('getBalance')
              //console.log('TokenAddress', item.address)
              let v = this
              var local_address = await v.action.getAddress()
              if (!v.myWeb3) {
                return
              }
              let result = await v.myWeb3.eth.getBalance(local_address)
              //console.log('主币Balance', result)


              v.tokenList.forEach((i, k) => {
                if (i.symbol == item.symbol) {
                  var newObject = {}
                  var decimal = i.decimal
                  newObject.amount = new Decimal(result).div(Math.pow(10, decimal))
                  newObject.amount = Math.floor(newObject.amount * 1000000) / 1000000
                  // item.amount = newObject.amount
                  item = Object.assign(item, newObject)
                  item = JSON.parse(JSON.stringify(item));
                  //console.log('主币余额', item.amount)
                }
              })
              return item
            },

            //获取代币余额
            async getTokenBalance(item) {
              // console.log('getTokenBalance', item)
              let v = this
              let token_address = item.address;
              var local_address = await v.action.getAddress()

              if (!v.myWeb3) {
                return
              }
              if (!v.chainList) {
                return
              }
              let contract = new v.myWeb3.eth.Contract(tokenAbi, token_address)

              // 查询代币余额
              let balance = await contract.methods.balanceOf(local_address).call();
              //获取代币精度
              let decimals = item.decimal


              if (balance) {
                var newObject = {}
                newObject.amount = new Decimal(balance).div(Math.pow(10, decimals))
                newObject.amount = Math.floor(newObject.amount * 1000000) / 1000000
                // console.log('newObject.amount',newObject.amount)
                item = Object.assign(item, newObject)
                item = JSON.parse(JSON.stringify(item));
                // if (item.amount==0){
                //   item.amount = '0.00';
                // }
              }
              return item
            },

            //判断按钮Approve还是Trans
            actionApproveOrTransfer() {
              //判断选择的Token是否是代币
              // 是主币
              if (this.selectToken.address === '0x0000000000000000000000000000000000000000') {
                this.allowance = true;
                //清空检测事件
                this.approveHash = '';
              }else{
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
              let reward_address = v.chainForm.contract
              // console.log('reward_address', reward_address)
              var local_address = await v.action.getAddress()
              //console.log('local_address', local_address)

              //判断输入金额是否大于0

              if (!v.sendAmount) {
                v.$toast('Please enter the amount')
                return
              }


              //当前链
              var chain = v.chainForm.chain
              //console.log('chain', chain)

              //当前选择Token
              var TokenAddress = v.selectToken.address
              // console.log('TokenAddress', TokenAddress)


              //chainid
              var chainId = await v.action.getChainId()
              chainId = chainId.substr(2)

              let decimal;

              //通过Token地址获取当前Token的decimal
              v.tokenList.forEach((i, k) => {
                  if (i.symbol == 'MAP'){
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
              var chainId = this.chainTo.chainId


              //调用合约执行
              let reward_contract = new v.myWeb3.eth.Contract(mapAbi, reward_address)

              var valueFee;

              console.log(TokenAddress,'TokenAddress')

              if (TokenAddress == '0x0000000000000000000000000000000000000000') {
                reward_stakeData = reward_contract.methods.transferOutNative(v.langToAddress, v.sendAllAmount.toFixed(), chainId).encodeABI()
                if (parseInt(v.chainForm.chainId) == 22776) {
                  valueFee = new Decimal(v.sendAllAmount).add(new Decimal(v.gasFee))
                } else {
                  valueFee = new Decimal(v.sendAllAmount)
                }
                transParams = {
                  from: local_address,
                  to: reward_address,
                  data: reward_stakeData,
                  value: valueFee.toFixed(0)
                }
              }

              else {

                if (v.selectToken.isMint == 1) {
                  reward_stakeData = reward_contract.methods.transferOutTokenBurn(TokenAddress, v.langToAddress, v.sendAllAmount.toFixed(), chainId).encodeABI()
                  // console.log('reward_stakeData', reward_stakeData)
                  if (parseInt(v.chainForm.chainId) == 22776) {
                    valueFee = new Decimal(v.gasFee)
                  } else {
                    valueFee = 0
                  }
                  transParams = {
                    from: local_address,
                    to: reward_address,
                    data: reward_stakeData,
                    value: valueFee.toFixed()
                  }
                  // console.log('transParams',transParams)
                } else  {
                  reward_stakeData = reward_contract.methods.transferOutToken(TokenAddress, v.langToAddress, v.sendAllAmount.toFixed(), chainId).encodeABI()
                  if (parseInt(v.chainForm.chainId) == 22776) {
                    valueFee = new Decimal(v.gasFee)
                  } else {
                    valueFee = 0
                  }
                  transParams = {
                    from: local_address,
                    to: reward_address,
                    data: reward_stakeData,
                    value: valueFee.toFixed()
                  }
                }

              }
              console.log('reward_stakeData',reward_stakeData)
              console.log('transParams',transParams)



              if (parseInt(v.chainForm.chainId) == 22776) {
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
                var gas = await v.myWeb3.eth.estimateGas(transParams)
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
              const rewardReceipt = await v.myWeb3.eth.sendTransaction(transParams).on('transactionHash', function (hash) {
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

              var local_address = await v.action.getAddress()

              var chain = v.chainForm.coin

              //获取当前链ID
              var fromChain = await v.action.getChainId()
              //console.log('Chain', fromChain)
              fromChain = parseInt(fromChain.slice(2), 16)
              //console.log('fromChain', (fromChain))


              var params = {
                contract: this.chainForm.contract,//合约地址
                from: local_address, //from地址
                to: v.langToAddress, //to 地址
                tokenAddress: v.selectToken.address,//代币地址
                amount: v.sendAllAmount,//数量
                fromChainid: fromChain,
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
              clearInterval(this.setTimeHistoryLoading)
              this.setTimeHistoryLoading = null
            },


            //查询未完成的历史交易
            async actionUndoneTransfer() {
              let v = this

              var local_address = await v.action.getAddress()
              var params = {
                chainId: v.chainForm.chainId,
                address: local_address,
              }

              var result = await v.$http.undoneTransfer(params)
              // console.log('History',result)
              if (result.code == 200) {
                v.historyLoading = result.data.count
              }

              console.log('status',v.historyTimerLoading)
              console.log( v.historyLoading,"333")

              console.log(v.historyTimerLoading, "888")
              if (v.historyTimerLoading != null && v.historyTimerLoading.length > 0 && v.historyLoading != null && v.historyLoading <= 0) {
                console.log('aaaaaaaaa')
                v.historyTimerLoading.forEach((item, index) => {
                  console.log(item)
                  clearInterval(item);
                })
                v.historyTimerLoading = [];
                v.actionHistory()
              }

            },


            //调取历史loading 定时器
            actionTimerHistory() {
              let v = this
              let timer = setInterval(()=> {
                v.actionUndoneTransfer()
              },2000)
              console.log('timer',timer)
              v.historyTimerLoading.push(timer)
              console.log(v.historyTimerLoading, "555")
            },


            //获取历史记录
            async actionHistory() {
              let v = this
              var local_address = await v.action.getAddress()
              var chainId = await v.action.getChainId()
              chainId = parseInt(chainId.slice(2), 16)

              var params = {
                chainId: chainId,
                address: local_address,
                pageNo: v.currentPage,
                pageSize: v.pageSize,
              }

              var result = await v.$http.historyList(params)

              if (result.code == 200) {
                v.historyList = result.data.list
                v.total = result.data.total
                v.pageNum = Math.ceil(v.total / v.pageSize) || 1;

                if (v.historyList.length <= 0) {
                  return
                }


                for (const item of v.historyList) {
                  var newObject = {}
                  var fromChainId = item.fromChainid
                  var toChainId = item.toChainid

                  for (const i of v.chainList) {
                    if (fromChainId == i.chainId) {
                      newObject.fromLogo = i.chainImg
                      newObject.fromChainName = i.chainName
                    }
                    if (toChainId == i.chainId) {
                      newObject.toLogo = i.chainImg
                      newObject.toChainName = i.chainName
                    }
                  }

                  var token = v.tokenAllList[fromChainId]

                  token.forEach((i, k) => {
                    // console.log("i.contract",i)
                    if (i.address.toLowerCase() == item.tokenAddress.toLowerCase()) {
                      newObject.coin = i.symbol
                      newObject.coinImg = i.img

                      var decimal = i.decimal
                      //console.log('decimal', decimal)

                      //余额
                      newObject.amount = new Decimal(item.amount).div(Math.pow(10, decimal)).toFixed()

                      //转到对应链的余额
                      if (item.inAmount){
                        newObject.inAmount = new Decimal(item.inAmount).div(Math.pow(10, decimal)).toFixed()
                      }else {
                        newObject.inAmount = 'Processing'
                      }


                      //时间
                      newObject.nowTime = moment.utc(item.updatedAt).local().format("yyyy-MM-DD HH:mm:ss")

                      return
                    }
                  })


                  Object.assign(item, newObject)

                }

              }
            },

            //获取历史详情
            async actionHistoryDetail(item) {
              let v = this
              v.showTranDetail = true

              v.historyHash = item.hash
              v.historyCoin = item.coin

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

            //获取地址
            async getSortAddress() {
              this.sortAddress = await this.action.getSortAddress()
              this.langToAddress = await this.action.getAddress()
            },

            //切换链
            async handleLink(item) {
              let chainId = this.$store.state.account.change_chain

              let v = this;
              //To 选择
              if (this.selectChain === 1) {
                if (item.chain === v.chainForm.chain) {
                  v.$toast('Source Chain and Destination Chain cannot be the same')
                  return
                }
                this.chainTo = JSON.parse(JSON.stringify(item));
                this.destNetwork = item.chain
                v.showSelectChain = false
                this.$router.push({
                  path: '/',
                  query: {
                    token: v.selectChain.symbol,
                    sourceNetwork: v.$route.query.sourceNetwork,
                    destNetwork: v.chainTo.chain
                  }
                })
                v.getAllData()
                return
              }
              if (!window.ethereum) {
                return
              }
              //获取0xchainId
              let chain = '0x' + parseInt(item.chainId).toString(16)
              //获取rpc 需要转换成 数组
              let rpc = Array(item.rpc)
              let method;
              let params;
              // console.log('handleLink 01',chainId,chain)
              if (chain == '0x1' || chain == '0x3') {
                method = 'wallet_switchEthereumChain';
                params = {
                  chainId: chain,
                }
              } else {
                method = 'wallet_addEthereumChain';
                params = {
                  chainId: chain,
                  rpcUrls: rpc,
                  chainName: item.chainName,
                }
              }

              //From 切换链
              window.ethereum.request({
                method: method,
                params: [params],
              }).then(async () => {
                //   //切换网络
                // console.log('切换')
                var id = await v.action.getChainId()
                if (chain != id) {
                  return
                }
                //如果点击的是交换双链按钮
                if (v.changeChain) {
                  let temp = v.chainTo;
                  v.chainTo = v.chainForm;
                  v.chainForm = temp;
                  v.changeChain = false;
                  v.$router.push({
                    path: '/',
                    query: {
                      token: v.selectChain.symbol,
                      sourceNetwork: v.$route.query.destNetwork,
                      destNetwork: v.chainTo.chain
                    }
                  })
                  v.getAllData()
                  // v.actionTimerHistory()
                  return;
                }
                // console.log(' v.chainTo', v.chainTo, v.chainForm)
                //from
                if (v.selectChain !== 0) {
                  return
                }
                //正常切换From链

                v.selectToken.address = null
                v.sourcePath = item.chain
                v.chainForm = JSON.parse(JSON.stringify(item));
                v.showSelectChain = false
                if (v.chainForm.chain === v.chainTo.chain) {
                  v.chainTo = this.getDifChain(v.chainTo.chain)
                }
                v.$router.replace({
                  path: '/',
                  query: {sourceNetwork: item.chain, destNetwork: v.chainTo.chain}
                })
                v.getAllData()
                // v.actionTimerHistory()
              })
                  .catch((e) => {
                    v.$router.replace({
                      path: '/',
                      query: {sourceNetwork: v.$route.query.sourceNetwork, destNetwork: v.$route.query.destNetwork}
                    })
                    //console.log(e)
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
              this.allAddress = this.langToAddress
              let addressCss = document.getElementById('tran-send-amount')
              addressCss.style.display='none'
            },

            //输入地址填写
            async getInputAddress() {
              let v = this
              v.sortAddress = v.allAddress.substr(0, 9) + '...' + v.allAddress.substr(38)
              this.langToAddress = v.allAddress
              console.log('address',this.langToAddress)
              v.showAddress = false
              let addressCss = document.getElementById('tran-send-amount')
              addressCss.style.display='flex'
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
              // var chain = this.chainForm.coin
              let reward_address = v.chainForm.contract
              let token_address = v.selectToken.address
              v.tokenAllList[v.chainForm.chainId].forEach(item => {
                if (v.selectToken.symbol == item.symbol) {
                  token_address = item.address
                  console.log('token_address', token_address)
                }
              })

              var local_address = await v.action.getAddress()

              //approve
              let contract = new v.myWeb3.eth.Contract(tokenAbi, token_address)
              const approveData = contract.methods.approve(reward_address, '1000000000000000000000000000').encodeABI();
              //console.log('approvedata', approveData)

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
                  // let result = e.message.substring(e.message.indexOf("{"))
                  // error = JSON.parse(result).message
                  // this.$toast(error)
                  v.showErrorMessage = true
                  v.errorMessage = e.message
                }
                if (error) {
                  resolve(false);
                }

                v.myWeb3.eth.sendTransaction({
                  from: local_address,
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
                  localStorage.setItem('approve',1);
                  this.setApproveStatus(local_address + reward_address, token_address, 'doing');
                  // this.setApproveStatus(local_address+reward_address,token_address,'true');
                  //server order
                }).on('receipt', function (receipt) {
                  //receipt
                  //console.log(receipt)
                  // console.log('receipt',receipt)
                  v.dialogApproving = false
                  v.allowance = true;
                  this.setApproveStatus(local_address + reward_address, token_address, false);
                  let timer = setInterval(() => {
                    v.checkApproved(timer)
                  }, 1000);
                  resolve(true);
                }).on('error', function (receipt) {
                  //receipt
                  localStorage.removeItem(local_address + reward_address)
                  // localStorage.setItem(local_address+reward_address+token_address,'false')
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
              // var chain = this.chainForm.coin
              let reward_address = v.chainForm.contract
              let token_address;
              v.tokenAllList[v.chainForm.chainId].forEach(item => {
                if (item.symbol == 'MAP') {
                  token_address = item.address
                  console.log('map token_address', token_address)
                }
              })

              var local_address = await v.action.getAddress()
              v.approveMapHash = '111';

              //approve
              let contract = new v.myWeb3.eth.Contract(tokenAbi, token_address)
              const approveData = contract.methods.approve(reward_address, '1000000000000000000000000000').encodeABI();
              // console.log('approvedata', approveData)

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
                  // let result = e.message.substring(e.message.indexOf("{"))
                  // error = JSON.parse(result).message
                  // this.$toast(error)
                  v.showErrorMessage = true
                  v.errorMessage = e.message
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
                  //console.log(`hash: ` + hash)
                  // v.$toast('Transaction has send please wait result')
                  v.dialogApproving = true
                  v.approveMapHash = hash;
                  localStorage.setItem('approve',2);
                  v.setApproveStatus(local_address + reward_address, token_address, 'doing');
                }).on('receipt', function (receipt) {
                  //receipt
                  //console.log(receipt)
                  v.dialogApproving = false
                  v.allowanceMap = true
                  v.approveMapHash = false;
                  v.setApproveStatus(local_address + reward_address, token_address, false);
                  let timer = setInterval(() => {
                    v.checkMapApproved(timer)
                  }, 1000);
                  resolve(true);
                }).on('error', function (receipt) {
                  //receipt
                  localStorage.removeItem(local_address + reward_address)
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
              let approving = this.getApproveStatus(`${this.account}${v.chainForm.contract}`, v.selectToken.address);
              if (approving == 'done') {
                //关闭弹窗
                v.dialogApproving = false;
                v.dialogApproving = false;
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
              if (!v.myWeb3) {
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

              let token = v.selectToken.name
              let local_address = await v.action.getAddress()
              let tokenAddress = ''

              v.tokenAllList[v.chainForm.chainId].forEach(item => {
                if (item.symbol == token) {
                  tokenAddress = item.address
                  return
                }
              })
              let approving = this.getApproveStatus(`${local_address}${v.chainForm.contract}`, tokenAddress)
              // v.dialogApproving = false;
              console.log('change', approving)
              if (approving === 'done') {
                // console.log(approving)
                v.allowance = true;
                //清空检测事件
                v.approveHash = '';
                v.checkApproveToken = ''
                v.dialogApproving = false;
                v.dialogApproving = false;
                v.dialogApproving = false;
                if (timer) {
                  clearInterval(timer);
                }
                this.setApproveStatus(`${local_address}${v.chainForm.contract}`, tokenAddress, false);
                return;
              } else if (approving === 'doing') {
                v.allowance = false
                v.approveHash = true
              } else if (approving === 'none') {
                v.approveHash = false
                v.dialogApproving = false;
              }
              // console.log('dialog========', v.dialogApproving)

              let contract = new v.myWeb3.eth.Contract(tokenAbi, tokenAddress)
              contract.methods.allowance(local_address, v.chainForm.contract).call((error, result) => {
                if (result && result != 0) {
                  v.allowance = true;
                  //清空检测事件
                  v.approveHash = '';
                  v.checkApproveToken = ''
                  if (timer) {
                    clearInterval(timer);
                  }
                  v.dialogApproving = false;
                  this.setApproveStatus(`${local_address}${v.chainForm.contract}`, tokenAddress, false);
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

              if (!v.myWeb3) {
                return
              }

              let local_address = await v.action.getAddress()
              var tokenAddress = ''
              let token = v.selectToken.name

              v.tokenAllList[v.chainForm.chainId].forEach(item => {

                if (item.symbol == token) {
                  tokenAddress = item.address
                  return
                }
              })

              let approving = this.getApproveStatus(`${local_address}${v.chainForm.contract}`, tokenAddress)
              // v.dialogApproving = false;
              console.log('approving', approving)

              if (parseInt(v.chainForm.chainId) != 22776) {

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
                    v.setApproveStatus(`${local_address}${v.chainForm.contract}`, tokenAddress, false);
                    return;
                  } else if (approving === 'doing') {
                    v.allowanceMap = false
                    v.approveMapHash = true
                  } else if (approving === 'none') {
                    v.approveMapHash = false
                    v.dialogApproving = false;
                    // v.dialogApproving = false
                  }

                  let contract = new v.myWeb3.eth.Contract(tokenAbi, tokenAddress)

                  contract.methods.allowance(local_address, v.chainForm.contract).call(function (error, result) {
                    if (result && result != 0) {
                      v.allowanceMap = true
                      v.approveMapHash = true
                      if (timer) {
                        clearInterval(timer);
                      }
                      v.dialogApproving = false;
                      v.setApproveStatus(`${local_address}${v.chainForm.contract}`, tokenAddress, false);
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

            //获取链列表
            async actionGetChain() {
              let v = this
              let result = await v.$http.chainList()
              if (result.code == 200) {
                v.chainList = result.data.list

                //判断当前路由路由
                const params = JSON.parse(JSON.stringify(this.$route.query));
                ;
                // const params = this.$route.query;
                // if (!params.sourceNetwork) {

                let chainId = await v.action.getChainId()

                if ((chainId == config.ethId || chainId == config.ethDefaultId)) {
                  params.sourceNetwork = 'ETH'
                } else if ((chainId == '0x58f8' || chainId == '58f8')) {
                  params.sourceNetwork = 'MAP'
                  params.destNetwork = 'ETH'
                } else if ((chainId == config.bscId || chainId == config.bscDefaultId)) {
                  params.sourceNetwork = 'BSC'
                } else if ((chainId == config.polygonId || chainId == config.polygonDefaultId)) {
                  params.sourceNetwork = 'MATIC'
                } else {
                  params.sourceNetwork = 'ETH'
                }

                let sourceNetwork = params.sourceNetwork ? params.sourceNetwork : 'ETH';
                let destNetwork = params.destNetwork ? params.destNetwork : 'MAP';

                v.$router.push({path: 'home', query: {sourceNetwork: sourceNetwork, destNetwork: destNetwork}})

                for (let chains of v.chainList) {
                  let sourceNetwork = params.sourceNetwork ? params.sourceNetwork : 'ETH';
                  let destNetwork = params.destNetwork ? params.destNetwork : 'MAP';

                  // chainForm
                  for (let chains of v.chainList) {
                    if (chains.chain.toUpperCase() == sourceNetwork.toUpperCase()) {
                      v.chainForm = JSON.parse(JSON.stringify(chains));
                    }
                    if (chains.chain.toUpperCase() == destNetwork.toUpperCase()) {
                      v.chainTo = JSON.parse(JSON.stringify(chains));
                    }
                  }
                }

                // let sourceNetwork = params.sourceNetwork ? params.sourceNetwork : 'ETH';
                // let destNetwork = params.destNetwork ? params.destNetwork : 'MAP';

                //chainForm
                // for (let chains of v.chainList) {
                //   if (chains.chain.toUpperCase() == sourceNetwork.toUpperCase()) {
                //     v.chainForm = JSON.parse(JSON.stringify(chains));
                //   }
                //   if (chains.chain.toUpperCase() == destNetwork.toUpperCase()) {
                //     v.chainTo = JSON.parse(JSON.stringify(chains));
                //   }
                // }
                this.actionTokenList()

              }
            },

            //获取Token列表
            async actionTokenList() {
              // console.log('actionTokenList')
              let v = this
              let result = await v.$http.tokenList()
              if (result.code = 200) {
                v.tokenAllList = result.data.list
              }
              v.actionCheckChainToken()
            },

            //获取Chain的Token
            async actionCheckChainToken() {
              var v = this;
              var chainId = await v.action.getChainId()
              chainId = new BN(chainId.slice(2), 16)

              v.tokenList = v.tokenAllList[chainId]

              var tokenlist = v.tokenAllList[chainId]
              var flag = false
              for (var i = 0; i < tokenlist.length; i++) {
                if (tokenlist[i].symbol == 'MAP') {
                  v.selectToken.name = tokenlist[i].symbol
                  v.selectToken.address = tokenlist[i].address
                  v.selectToken.url = tokenlist[i].img
                  v.selectToken.isMint = tokenlist[i].isMint
                  // v.selectToken = tokenlist[i]
                  v.checkMapApproved(v.statusTimer);
                  flag = true
                  break;
                }
              }
              if (!flag) {
                v.selectToken.name = tokenlist[0].symbol
                v.selectToken.url = tokenlist[0].img
                v.selectToken.address = tokenlist[0].address
                v.selectToken.isMint = tokenlist[0].isMint
                let approvedResult = await v.checkMapApproved(v.statusTimer);
                v.allowance = approvedResult;
              }
            },

            //判断当前链跟选择的from链是否一致
            async actionChainSuccess() {
              if (parseInt(this.chainForm.chainId) == parseInt(this.chainIdRes)) {
                this.chainSuccess = true
              } else {
                this.chainSuccess = false
              }

            },

            async getChainIdRes() {
              var chainId = await this.action.getChainId()
              this.chainIdRes = new BN(chainId.slice(2), 16)
            },

            async getAllData() {
              this.sendAmount = ''
              let address = await this.action.getAddress();
              if (!address) {
                window.local.reload();
                return;
              }
              this.account=address;
              await this.getChainIdRes()
              await this.getSortAddress()
              await this.actionGetChain()
              await this.actionChainSuccess()
              await this.actionShowToken()
              this.actionStatus()
              // await this.actionMapStatus()
            },
          },

          beforeDestroy() {
            clearInterval(this.setTimeHistory);
            this.setTimeHistory = null;
            clearInterval(this.historyTimerLoading)
            this.historyTimerLoading.length=0
            clearInterval(this.statusTimer)
            this.statusTimer = null

          },

          mounted() {
            //local_address+reward_address+token_address
            this.getAllData()
            clearInterval(this.historyTimerLoading)
            this.historyTimerLoading.length = 0
            this.actionTimerHistory()
          },
        }
        </script>

        <style scoped lang="less">

        //rate
        .bridge-rate {
            width: 494px;
            max-width: 494px;
            border-radius: 10px;
            border: solid 1px #e44e3a;
            background-color: rgba(228, 78, 58, 0.05);
        }

        .bridge-rate-content {
          padding: 16px 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .bridge-rate-content-item {
          padding-top: 13px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }

        .bridge-rate-left {
            font-family: PingFangSC;
            font-size: 12px;
            font-weight: 500;
            color: rgba(0,0,0,0.55);
            display: flex;
            flex-direction: row;
            align-items: center;
          img {
            margin-left: 5px;
            width: 16px;
          }
        }

        .bridge-rate-right {
          font-family: PingFangSC;
          font-size: 12px;
          font-weight: 500;
        }



        .history-lists {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .history-tops {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .history-tops-icon {
          img {
            width: 24px;
          }

        }

        .history-tops-from {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-left: 6px;
        }

        .history-tops-from-text {
          font-family: 'productBold';
          //width: 103%;
          font-size: 13px;
          font-weight: 600;
          padding-top: 5px;
        }

        .history-tops-tranfrom {
          img {
            width: 18px;
            margin: 0 13px;
          }
        }

        .historys-statu {
          padding-left: 5px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .historys-coin-time {
          padding-top: 10px !important;
        }

        .history-top-amounts {
          margin-left: 0 !important;
        }


        .redColor {
          color: #E44E3A;
        }

        .loading-icon {
          width: 15px;
          margin-left: 3px;
          -webkit-animation: circle 3s infinite linear;
        }


        .header-middle {
          margin-top: 20px;
          margin-bottom: 10px;
          font-size: 14px;
          color: #333;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-family: 'productBold';
          display: none;
        }

        .header-middle-trans {
          cursor: pointer;
          width: 110px;
          height: 35px;
          border-radius: 10px;
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-family: 'productBold';
          transition: border-color .3s cubic-bezier(.645,.045,.355,1);
        }

        .header-middle-tran-active {
          width: 110px;
          height: 35px;
          border-radius: 10px;
          background-color: #0e1012;
          font-weight: bold;
          color: white;
          font-family: 'productBold';
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

        @-webkit-keyframes circle {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }


        .bridge {
          padding-top: 51px;
          padding-bottom: 34px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #f8f8f8;
        }

        .bridge-switch {
          margin-top: -31px;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-radius: 12px;
          background-color: rgba(228, 78, 58,0.1);
          padding: 13px 70px;
          margin-bottom:20px ;
          img {
            width: 24px;
          }
          span {
            font-size: 12px;
            font-weight: 500;
            padding-left: 10px;
          }
        }

        .bridge-content {
          width: 558px;
          max-width: 558px;
          min-height: 552px;
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
          font-family: 'poppinSemiBold';

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
          margin-top: 22px;
          width: 100%;
          height: 1px;
          opacity: 0.2;
          background-color: #e44e3a;
        }

        .tran-title-line {
          margin-top: 22px;
          width: 100%;
          height: 3px;
          border-radius: 6.5px;
          background-color: #e44e3a;
        }


        //tran

        .tran-from {
          font-size: 13px;
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
          padding: 5px 13px 5px 11px;
          margin-left: 9px;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-radius: 12px;
          background-color: rgba(89, 45, 45, 0.05);
          cursor: pointer;
          font-size: 12px;
          font-family: 'productBold';

          img {
            width: 25px;
          }

          span {
            padding: 0 10px;
          }

          img:nth-child(3) {
            width: 12px;
          }
        }

        .tran-from-btn-nft {
          margin-top: 20px;
          background: white;
          display: flex;
          justify-content: space-between;

          img:nth-child(2) {
            width: 12px;
          }
        }

        .tran-from-nft-img {
          display: flex;
          flex-direction: row;
          align-items: center;

          span {
            padding-left: 10px;
            padding-right: 0;
          }
        }

        .tran-from-right {
        }

        .tran-send {
          margin-top: 10px;
          border-radius: 12px;
          background-color: rgba(89, 45, 45, 0.05);
          //padding: 15px 12px;
          padding: 17px 19px 20px 20px;
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
          padding-top: 13px;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          span {
            font-family: 'productBold';
            font-size: 20px;
          }

          input {
            font-family: 'productBold';
            height: 30px;
            color: black;
            font-size: 20px;
            font-weight: 600;
            background: rgba(0, 0, 0, 0);
          }
        }

        .tran-send-vault {
          width: 100%;
          padding-top: 12px;
          text-align: left;
          font-size: 12px;
          span:nth-child(1) {
            opacity: 0.5;
          }
          span:nth-child(2) {
            padding-left: 5px;
           color: rgba(89, 45, 45,0.4)
          }
        }



        .tran-send-btn {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 5px 13px 5px 11px;
          border-radius: 8px;
          cursor: pointer;
          background: white;
          border-radius: 8px;
          span {
            font-size: 12px;
            padding-left: 9px;
            padding-right: 26px;
            font-family: 'productBold';
          }

          img {
            width: 25px;
          }
        }

        .tran-send-btns {
          padding: 11px 16px 12px 10px;
        }

        .tran-send-btn-address {
          padding-right: 11px !important;
        }

        .tran-send-arrow-icon {
          width: 15px !important
        }


        .tran-change {
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;

          img {
            cursor: pointer;
            width: 32px;
          }
        }

        .tran-send-fee {
          padding-top: 7px;
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

        .tran-insuff {
          padding-top: 22px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          margin-bottom: -8px;
          img {
            width: 24px;
          }
          span {
            font-weight: bold;
            padding-left: 10px;
            font-family: ProductSans;
            font-size: 14px;
            color: rgb(228, 78, 58);
          }
        }

        .tran-connect {
          padding-top: 30px;

          button {
            cursor: pointer;
            width: 100%;
            height: 55px;
            border-radius: 8px;
            background-color: #e44e3a;
            font-family: 'productBold';
            font-size: 16px;
            color: white;
          }
        }

        .tran-connect-approve {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          background: rgba(89, 45, 45,0.4) !important;

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
        }

        .tran-send-address-left {
          color: white;
          border-radius: 8px 0 0 8px;
          background: #E44E3A;
          width: 124px;
          height: 35px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;

          span {

          }

          img {
            display: none;
            width: 17px;
          }
        }

        .tran-send-address-input {
          width: 73%;
          height: 35px;
          box-sizing: border-box;
          background: white;
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
            background: white;
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
            width: 15px;
          }
        }

        //cutom
        .tran-custom {
          margin-top: 15px;
          border-radius: 10px;
          background-color: white;
          width: 100%;
          //padding: 10px 21px;
        }
        .tran-custom-content  {
          padding: 10px 21px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }


        .tran-custom-left {
          display: flex;
          flex-direction: row;
          align-items: center;
          span {
            font-size: 12px;
            padding-left: 5px;
          }
          img {
            width: 15px;
            cursor: pointer;
          }
        }

        .tran-custom-right {
          width: 75%;
          input {
            text-align: right;
            text-align: right;
            width: 100%;
            font-size: 12px;
          }
        }


        //nft send

        .nft-send {
          margin-top: 20px;
          background: rgba(0, 0, 0, 0.05);
          mix-blend-mode: normal;
          border-radius: 12px;
          padding: 25px 20px 30px 20px;
        }

        .nft-send-top {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }

        .nft-card {
          padding-top: 19px;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }

        .nft-card-left {
          img {
            width: 250px;
          }
        }

        .nft-card-right {
          display: flex;
          flex-direction: column;
          align-items: end;
          justify-content: flex-end;
        }

        .nft-card-line {
          width: 90%;
          height: 0.86px;
          left: 973px;
          top: 397.07px;

          background: #000000;
          mix-blend-mode: normal;
          opacity: 0.1;
        }

        .nft-card-title {
          padding-top: 58px;
          font-size: 14px;
        }

        .nft-card-icon {
          padding-top: 18px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
        }

        .nft-card-copy {
          width: 22px;
          height: 22px;
          background: rgba(228, 78, 58, 0.1);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          img {
            width: 12px;
          }

          &:nth-child(2) {
            margin-left: 5px;
          }
        }

        .nft-send-text {
          padding-top: 44px;
          font-size: 13px;
          line-height: 20px;
          width: 75%;
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
          max-width: 558px;
          width: 558px;
          max-height: 544px;
          border-radius: 30px;
          background: #FFFFFF;
          box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.05);
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
          color: #E44E3A;
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
          font-family: 'productBold';
          width: 85%;
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
          border: solid 1px rgba(89, 45, 45,0.5);
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
          border: solid 1px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);

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
          background-color: rgba(89, 45, 45, 0.05);
          border: 0;
        }


        .dialog-token {
          width: 100%;
          height: 80%;
          margin-top: 5px;
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
          border: solid 1px rgba(0, 0, 0, 0.05);
        }

        .dialog-token-content:hover {
          height: 50px;
          border: 0;
          background-color: rgba(89, 45, 45, 0.05);
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
          font-family: 'productBold';
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

        .dialog-token-bell {
            padding: 15px 12px;
            border-radius: 15px;
            background-color: rgba(228, 78, 58, 0.06);
            display: flex;
            flex-direction: row;
            align-items: center;
            img {
              width: 15px;
            }
            span {
              padding-left: 13px;
              font-family: PingFangSC;
              font-size: 12px;
            }
        }


        //dialog history


        .dialog-trans-detail-line {
          margin-top: 12px;
          width: 90%;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .dialog-trans-detail {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 20px;
          width: 100%;
          height: 60%;
        }

        .dialog-trans-detail:nth-child(4) {
          align-items: flex-start;
        }

        .dialog-trans-detail-left {
          font-family: 'productBold';
          font-size: 16px;
          width: 20%;
        }

        .dialog-trans-left-status {
          padding-top: 20px;
        }

        .dialog-trans-detail-right {
          box-sizing: border-box;
          //margin-left: 35px;
          width: 80%;
          //font-family: Poppins;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          background: rgba(89, 45, 45, 0.05);
          padding: 9px 47px 14px 20px;
          border-radius: 10px;

          span:nth-child(1) {
            color: #e44e3a;
            font-size: 14px;
            font-weight: bold;
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
          background: rgba(89, 45, 45, 0.05);
          padding: 21px 24px 28px 20px;
          border-radius: 10px;
          width: 75%;
        }

        .dialog-trans-detail-rights-status {
          //height: 85%;
          height: 260px;
          max-height: 260px;
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
          margin-top: 8px;
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
            width: 25px;
          }

          span {
            padding-left: 10px;
            font-family: ProductSans;
            //font-family: Poppins;
            font-size: 13px;
          }
        }

        .dia-trans-bottom {
          width: 100%;
          //padding-left: 10px;
          padding-top: 5px;
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


        //dialog nft
        .dialog-content-nft {
          width: 622px;
          height: 428px;
          max-width: 622px;
          max-height: 428px;
        }



        .dialog-nft {
          width: 100%;
          box-sizing: border-box;
          cursor: pointer;

          img {
            width: 45px;
            margin-right: 20px;
          }
        }

        .dialog-nft:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .dialog-nft-item {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          padding: 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .dialog-nft-item:nth-last-child {
          border-bottom: 0px
        }


        .dialog-nft-left {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 50%;
          //padding-left: 20px;
        }

        .dialog-nft-name {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          span {
            font-size: 16px;
          }
        ;

          span:nth-child(2) {
            font-size: 12px;
            opacity: 0.5;
          }
        }

        .dialog-nft-line {
          width: 80%;
          background: #000000;
          opacity: 0.1;
        }

        //dialog warn

        .dialog-content-warn {
          width: 255px;
          max-width: 255px;
          padding: 11px 11px 40px 11px;
          border-radius: 20px;
          span {
            text-align: center;
            width: 80%;
            font-size: 14px;
            font-family: 'productBold';
            padding-top: 18px;
            word-wrap: break-word;
          }
        }

        .dialog-warn-close {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          img {
            cursor: pointer;
            width: 14px;
          }
        }

        .dialog-warn-icon {
          padding-top: 7px;
          img {
            width: 32px;
          }
        }


        //history

        .history {
          position: relative;
        }

        .history-title {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-family: 'productBold';
          font-size: 20px;
          font-weight: bold;
          padding-bottom: 10px;
          img {
            width: 22px;
            margin-left: 9px;
          }
        }

        .history-h5-bottom {
          padding-top: 8px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }

        .history-h5 {
          display: none;
        }

        .history-list {
          margin-top: 10px;
          cursor: pointer;
          background: rgba(0, 0, 0, 0.05);
          padding: 20px 20px 18px 20px;
          border-radius: 12px;
          box-sizing: border-box;
        }

        .history-top {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }



        .history-top-show {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .history-top-left {
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            width: 25px;
          }

        }

        .history-top-left-two {
          padding-left: 42px;
        }

        .history-top-amount {
          margin-left: 35px;
          padding-top: 3px;
          border-radius: 4px;
          border: 1px dashed rgba(0,0,0,0.15);
          width: 80px;
          height: 25px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-family: ProductSans;
          font-size: 12px;
          font-weight: 600;
          color: #e44e3a;
        }

        .history-top-coin {
          padding-left: 5px;
          font-family: 'productBold';
          font-size: 12px;
        }

        .history-coin {
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            width: 24px;
          }

          span {
            padding-left: 10px;
            font-family: PingFangSC;
            font-size: 13px;
          }

          img:nth-child(3) {
            width: 18px;
            margin: 0 30px;
          }
        }

        .history-coin-time {
          opacity: 0.5;
          font-size: 12px;
        }

        .history-status {
          margin-left: 5px;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-radius: 8px;
          background: white;
          border: solid 1px rgba(228, 78, 58, 1);
          padding: 8px 10px;
          color: #e44e3a;
          width: 96px;
          height: 30px;
          position: relative;
          box-sizing: border-box;
          img {
            width: 7px;
            position: absolute;
            right: 11px;
            margin-left: 8px;
          }
          span {
            font-family: 'productBold';
            font-size: 12px;
            padding-left: 11px;
          }
        }

        .history-status-success {
          border: solid 1px #4FC320;
          color: #4FC320;
          width: 96px;
          span {
            padding-left: 0;
          }
        }

        .history-status-cancel {
          border: solid 1px rgba(255, 184, 46, 1);
          color: #ffb82e;
          span {
            padding-left: 0;
          }
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
          margin-top: 131px;
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
              width: 221px;
              height: 50px;
              border-radius: 10px;
              background: rgba(89, 45, 45, 0.4);
              font-size: 16px;
              font-family: 'productBold';
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
            color: rgba(228, 78, 58, 1);
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
              width: 221px;
              height: 50px;
              border-radius: 10px;
              background: rgba(228, 78, 58, 1);
            }
          }
        }

        .home-page-not {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 200px;
        }



        @media (max-width: 1520px) {
          .dialog-content-trans {
            height: 80%;
          }

          .dialog-trans-detail-rights-status {
            height: 120px;
            overflow-y: scroll;
          }
        }

        @media (max-width: 1200px) {
          .dialog-content {
            width: 60%;
          }
        }

        @media (max-height: 1000px) {
          .dialog-trans-detail-rights-status {
            overflow-y: scroll;
            height: 140px;
          }
        }


        @media (max-width: 960px) {
          .bridge {
            padding-top: 20px;
          }

          .header-middle {
            display: flex;
          }
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

          .tran-send-address {
            font-size: 12px;

            span {
              width: 22%;
              //padding: 14px 5px 14px 5px;
            }
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


          //dialog
          .dialog-content {
            width: 60%;
            padding-bottom: 50px;
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

          .dialog-selectChain-coin {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .dialog-token-detail-left-right {
            font-size: 16px;
          }

          .dialog-token-content-line {
            margin-top: 15px;
          }

          ::-webkit-input-placeholder {
            font-size: 12px;
            padding-left: 0;
          }


          //history
          .history-coin {
            font-size: 12px;

            img {
              width: 25px;
            }

            //img:nth-child(3) {
            //  margin: 0 10px;
            //}

            span {
              padding-left: 5px;
            }
          }

          .history-top-left-two {
            //padding-left: 0;
          }

          .history-status {
            width: 125px;
            padding: 5px 2px;
            font-size: 12px;

            img {
              width: 5px;
            }

            span {
              padding-left: 25px;
            }
          }

          .history-status-success {
            span {
              text-align: center;
            }
          }

          .history-status-cancel {
            span {
              text-align: center;
            }
          }

          .history-bottom {
            font-size: 16px;

            span:nth-child(2) {
              //text-align: right;
            }
          }

          //dialog trans
          .dialog-trans-detail {
            width: 100%;
            margin-top: 10px;
          }

          .dialog-trans-detail-left {
            font-size: 14px;
            width: 26%;
          }

          .dialog-trans-detail-right {
            padding: 5px 10px;
            font-size: 12px;
            width: 74%;

            span:nth-child(1) {
              font-weight: bold;
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
            width: 60%;
            height: 80%;
          }

          .home-page {
            .btn-pre {
              button {
                width: 100px;
                font-size: 14px;
              }
            }

            .btn-next {
              button {
                width: 100px;
                font-size: 14px;
              }
            }

          }


        }

        @media (max-width: 780px) {

          .bridge {
            padding-top: 10px;
          }

          .dialog-content {
            width: 90%;
          }

          .bridge-content {
            width: 90%;
            padding: 20px 10px 20px 10px;
          }

          .dialog-content-trans {
            width: 90%;
            height: 70%;
          }

          .tran-send-bottom {
            input {
              width: 80%;
            }
          }

          .dialog-token-detail-left-right {
            font-size: 14px;
          }

          .dialog-content-trans-detail {
            width: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          //trans
          .tran-send {
            padding: 17px 9px 22px 10px;
          }

          .tran-from:nth-child(2) {
            padding-top: 15px;
          }

          .home-page {
            margin-top: 50px;
          }

          .tran-send-bottom {
            padding-top: 17px;
          }

          .tran-from-btn {
            padding: 5px 8px;

            img:nth-child(3) {
              width: 10px;
            }
          }

          .tran-change {
            img {
              width: 25px;
            }
          }

          .tran-send-address-left {
            width: 10%;

            span {
              display: none;
            }

            img {
              display: block;
            }
          }

          .tran-send-fee {
            padding-top: 19px;
          }

          .home-page-not {
            padding: 100px;
          }

          .tran-send-address-input {
            width: 90%;
          }

          .history {
            display: none;
          }

          .history-h5 {
            display: block;
          }

          .history-status {
            border: 0px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            img {
              position: static;
              width: 5px;
            }

            span {
              padding-left: 5px;
            }
          }

          .history-coin {
            span {
              font-size: 12px !important;
            }
            img:nth-child(3) {
              margin: 0 16px;
            }
          }

          .history-top-left-two {
            padding-left: 0;
          }




        }


        </style>
