import Vue from 'vue'
import http from './http'

//接口方法定义
let requests = {
    getSubBrigge :(params) => http.post('/api/subBridge', params),//交易成功后发送
    historyList :(params) => http.post('/api/queryHistory', params),//查看历史记录
    historyDetail :(params) => http.post('/api/queryBridgeInfo', params),//查看历史记录详情
    chainList :(params) => http.post('/api/queryChainList', params),//链列表
    tokenList :(params) => http.post('/api/queryTokenList', params),//链列表
}
Vue.prototype.$http = requests;
export default requests;
