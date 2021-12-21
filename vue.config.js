'use strict'
module.exports = {
    publicPath: '/',
    /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
    productionSourceMap: false,
    /* 代码保存时进行eslint检测 */
    lintOnSave: true,
    // devServer: {
    //     proxy: {
    //         '/api': {     //这里最好有一个 /
    //             target: 'http://39.98.240.34:8201/api',  // 后台接口域名
    //             ws: true,        //如果要代理 websockets，配置这个参数
    //             secure: false,  // 如果是https接口，需要配置这个参数
    //             changeOrigin: true,  //是否跨域
    //             pathRewrite:{
    //                 '^/api':''
    //             }
    //         }
    //     }
    // }
};
