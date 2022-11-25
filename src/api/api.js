import Vue from 'vue'
import http from './http'

//接口方法定义
let requests = {
    getSubBrigge :(params) => http.post('/api/subBridge', params),//交易成功后发送
    historyList :(params) => http.get('/api/queryBridgeHistoryByAddress', params),//查看历史记录
    historyDetail :(params) => http.get('/api/queryBridgeInfoById', params),//查看历史记录详情
    undoneTransfer :(params) => http.get('/api/queryUndoneTransfer', params),//查询未完成的交易列表
}
Vue.prototype.$http = requests;
export default requests;
