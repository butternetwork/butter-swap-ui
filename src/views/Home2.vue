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
              account:'',//用户地址
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
            address(newVal) {
              this.requestData();
            },
            chainId(newVal) {
              this.requestData();
            },
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
                    destNetwork: v.chainTo.chain,
                    ts:Date.now(),
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
                      destNetwork: v.chainTo.chain,
                      ts:Date.now(),
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

                v.$router.push({path: 'home', query: {sourceNetwork: sourceNetwork, destNetwork: destNetwork,ts:Date.now(),}})

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

            async requestData(){
              this.$watcher.getProvider().then(provider=>{
                this.getAllData();
                this.actionTimerHistory();
              }).catch(err =>{});
            },

            cleanHistoryTimer(){
              if (this.setTimeHistory){
                clearInterval(this.setTimeHistory);
                this.setTimeHistory = null;
              }
            },
            cleanLoadingTimer(){
              if(this.historyTimerLoading && this.historyTimerLoading.length>0){
                for (const timer of this.historyTimerLoading) {
                  clearInterval(timer);
                }
              }
              this.historyTimerLoading=[];
            },
            cleanStatusTimer(){
              if(this.statusTimer){
                clearInterval(this.statusTimer);
                this.statusTimer=null;
              }
            },
          },

          beforeDestroy() {
            this.cleanHistoryTimer();
            this.cleanLoadingTimer();
            this.cleanStatusTimer();
          },

          mounted() {
            this.cleanHistoryTimer();
            this.cleanLoadingTimer();
            this.cleanStatusTimer();
            this.requestData();
            //local_address+reward_address+token_address
          },
        }
        </script>

        <style scoped lang="less">
        @import './Home.less';


        </style>
