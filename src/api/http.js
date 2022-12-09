import Axios from 'axios'
Axios.defaults.headers['Content-Type'] = 'application/json';
Axios.defaults.timeout = 30000;
import config from '../config'

let request = function (path, params, isPost) {
    // Axios.defaults.baseURL = config.baseUrl
    Axios.defaults.baseURL = '/'

    // eslint-disable-next-line no-undefined
    if (params === undefined) {
        params = {}
    }
    return new Promise(resolve => {
        if (isPost) {
            return Axios.post(path, params, {}).then(
                res => {
                    // console.log(`res`,res)
                    // if(res.data && res.data.code && res.data.code == 200){
                    if(res.data){
                        resolve(res.data);
                    }
                },
                err => {
                    // console.log(`err`,err)
                    resolve({code: -1, message: '请求错误', text: JSON.stringify(err)});
                });
        } else {
            return Axios.get(path, {
                params: params,
            }).then(
                res => {
                    if(res.data && res.data.code && res.data.code == 200 || res.data && res.status === 200) {
                        resolve(res.data);
                    }

                },
                err => {
                    resolve({code: -1, message: '请求错误', text: JSON.stringify(err)});
                });
        }
    });
};


export default {
    post(path, params, isChain) {
        return request(path, params, true, isChain);
    },
    get(path, params) {
        return request(path, params, false);
    }
}




