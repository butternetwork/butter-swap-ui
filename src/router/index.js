/*
2 * 路由对象模块
3 * */
import Vue from 'vue'
import VueRouter from 'vue-router'

/*引入*/
const Home = () => import('../views/Home');
const Vault = () => import('../views/Vault');

//申明使用插件
Vue.use(VueRouter)


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/home' //系统默认页
        },
        {
            path: '/home',
            component: Home,
        },
        // {
        //     path: '/vault',
        //     component: Vault,
        // },
    ]
})
