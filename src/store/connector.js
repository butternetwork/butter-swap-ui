import * as UAuthWeb3Modal from "@uauth/web3modal";
import UAuthSPA from "@uauth/js";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import Web3Modal from "web3modal";
import Web3 from "web3";
import Decimal from "decimal.js";
import store from "@/store/index";
import Vue from "vue";

class Connector {
    constructor() {
        this.web3 = null;
        this.provider = null;
        this.web3modal = null;
        this.initWeb3Modal();
    }

    initWeb3Modal() {

        const uauthOptions = {
            clientID: "4b5a89d2-9384-41be-824e-8d0bce9f8867",//测试 e22e8fc1-04da-4ecc-89de-c446854294d2
            redirectUri: "https://test-bridge.butternetwork.io",//http://localhost:8080
            scope: "openid wallet"
        };
        // const uauthOptions = {
        //     clientID: "e22e8fc1-04da-4ecc-89de-c446854294d2",//测试 e22e8fc1-04da-4ecc-89de-c446854294d2
        //     redirectUri: "http://localhost:8080/",//http://localhost:8080
        //     scope: "openid wallet"
        // };

        const trustDisplay = {
            description: "Connect to your Trust Wallet",
            logo: "data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxNTguOCAxODQiIHZpZXdCb3g9IjAgMCAxNTguOCAxODQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzU0IDM1MSkiPjxwYXRoIGQ9Im0tMjc0LjYtMzQzLjdjMjkuMyAyMi43IDYyLjkgMjEuMyA3Mi41IDIxLjMtMi4xIDEyOS4xLTE4LjEgMTExLjktNzIuNSAxNDguMS01NC40LTM2LjItNzAuMy0xOS03Mi40LTE0OC4xIDkuNSAwIDQzIDEuNCA3Mi40LTIxLjN6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibS0yNzQuNi0zNDMuNyA0LjItNS41Yy0yLjUtMS45LTYtMS45LTguNSAwem03Mi41IDIxLjMgNi45LjFjMC0xLjktLjctMy42LTItNS0xLjMtMS4zLTMuMS0yLjEtNC45LTIuMXptLTcyLjUgMTQ4LjEtMy44IDUuOGMyLjMgMS41IDUuMyAxLjUgNy43IDB6bS03Mi40LTE0OC4xdi02LjljLTEuOSAwLTMuNi43LTQuOSAyLjEtMS4zIDEuMy0yIDMuMS0yIDV6bTY4LjEtMTUuOGMzMS40IDI0LjMgNjcuMyAyMi43IDc2LjcgMjIuN3YtMTMuOGMtOS44IDAtNDEuMSAxLjItNjguMy0xOS45em02OS44IDE1LjdjLS41IDMyLjEtMS45IDU0LjgtNC41IDcxLjYtMi42IDE2LjYtNi4yIDI2LjYtMTEgMzMuNi00LjggNy4zLTEwLjggMTEuNi0xOS43IDE2LjktOSA1LjQtMjAuMyAxMS4yLTM0LjMgMjAuNGw3LjcgMTEuNWMxMy4zLTguOCAyNC4zLTE0LjUgMzMuNy0yMC4xIDkuNS01LjcgMTcuOC0xMS45IDI0LjEtMjEgNi4zLTkuNCAxMC41LTIxLjYgMTMuMi0zOS4yIDIuNy0xNy40IDQuMS00MSA0LjYtNzMuNXptLTYxLjcgMTQyLjRjLTEzLjktOS4zLTI1LjMtMTUuMS0zNC4yLTIwLjRzLTE0LjktOS42LTE5LjctMTYuOWMtNC43LTctOC40LTE2LjktMTAuOS0zMy42LTIuNi0xNi44LTMuOS0zOS40LTQuNS03MS42bC0xMy45LjNjLjUgMzIuNCAyIDU2IDQuNiA3My41IDIuNyAxNy42IDYuOCAyOS44IDEzLjEgMzkuMiA2LjMgOS4xIDE0LjYgMTUuMyAyNCAyMSA5LjQgNS42IDIwLjQgMTEuMiAzMy43IDIwLjF6bS03Ni4yLTEzNS40YzkuMyAwIDQ1LjMgMS42IDc2LjYtMjIuN2wtOC40LTExYy0yNy4yIDIxLjEtNTguNSAxOS45LTY4LjIgMTkuOXoiIGZpbGw9IiMzMzc1YmIiLz48L2c+PC9zdmc+",
            name: "Trust"
        }

        const providerOptions = {
            disableInjectedProvider: false,
            cacheProvider: true,
            // prefix.
            'custom-uauth': {
                // The UI Assets
                display: UAuthWeb3Modal.display,

                // The Connector
                connector: UAuthWeb3Modal.connector,

                // The SPA libary
                package: UAuthSPA,

                // The SPA libary options
                options: uauthOptions,
            },

            // 'custom-trustwallet': {
            //     display: trustDisplay,
            //     connector: () => {
            //         if (!window.trustwallet) {
            //             // alert('trust wallet is not install')
            //             console.log('trust wallet is not install')
            //             WalletConnectQRCodeModal.open('https://trustwallet.com/')
            //         } else {
            //             return window.trustwallet
            //         }
            //     },

            //     package: WalletConnectProvider,
            // },

            // For full functionality we include the walletconnect provider as well.
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: 'c16539ab6e244057b498657341375a3d',
                },
            },
        }

        const web3modal = new Web3Modal({
            cacheProvider: true,
            providerOptions,
        });
        UAuthWeb3Modal.registerWeb3Modal(web3modal);
        this.web3modal = web3modal;
    }

    async connect() {
        const uauthOptions = {
            clientID: "4b5a89d2-9384-41be-824e-8d0bce9f8867",//测试 e22e8fc1-04da-4ecc-89de-c446854294d2
            redirectUri: "https://test-bridge.butternetwork.io",//http://localhost:8080
            scope: "openid wallet"
        };

        // const uauthOptions = {
        //     clientID: "e22e8fc1-04da-4ecc-89de-c446854294d2",//测试 e22e8fc1-04da-4ecc-89de-c446854294d2
        //     redirectUri: "http://localhost:8080/",//http://localhost:8080
        //     scope: "openid wallet"
        // };

        try {
            this.provider = await this.web3modal.connect();

            const web3 = new Web3(this.provider);
            console.log('this.provider',this.provider)

            const info = await Promise.all([web3.eth.getAccounts(), web3.eth.getChainId()]);
            Vue.prototype.$web3 = web3;
            Vue.prototype.$client = () => {
                return web3;
            };
            Vue.prototype.$provider = this.provider;
            this.accountChanged(info[0]);
            this.chainChanged(info[1]);
            this.addListener();
            if (this.web3modal.providerController.cachedProvider==='custom-uauth') {
                let user = await new UAuthSPA(uauthOptions).user()
                localStorage.setItem('userDomain',user.sub)
                return {
                    account: user.sub.toString(),
                    chainId: info[1],
                };
            } else {
                localStorage.removeItem('userDomain')
                return {
                    account: info[0][0],
                    chainId: info[1],
                };
            }
            // return {
            //     account: info[0][0],
            //     chainId: info[1],
            // };
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    addListener() {
        this.provider.on("accountsChanged", this.accountChanged);

        this.provider.on("chainChanged", this.chainChanged);

        this.provider.on("disconnect", () => {
            this.web3modal.clearCachedProvider();
            store.commit('logout');
        });
    }

    chainChanged(chainId) {
        const id = new Decimal(chainId).toHex();
        store.commit('setChainId', id);
    }

    accountChanged(accounts) {
        if (typeof accounts === 'string') {
            console.log('accounts',accounts)
            store.commit('setAddress', accounts);
        } else {
            store.commit('setAddress', accounts[0]);
        }
    }
}

const connector = new Connector();

export default connector;
