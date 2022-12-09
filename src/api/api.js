import Vue from 'vue'
import http from './http'

//接口方法定义
let requests = {
    getSubBrigge :(params) => http.post('/omniscan-api/subBridge', params),//交易成功后发送
    historyList :(params) => http.get('/omniscan-api/queryBridgeHistoryByAddress', params),//查看历史记录
    historyDetail :(params) => http.get('/omniscan-api/queryBridgeInfoById', params),//查看历史记录详情
    undoneTransfer :(params) => http.get('/omniscan-api/queryUndoneTransfer', params),//查询未完成的交易列表

    bestPath: (params) => http.get('/api/router/best_route', params),
}
Vue.prototype.$http = requests;
export default requests;
