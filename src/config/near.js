//测试网

import * as nearAPI from "near-api-js";

const { connect, WalletConnection ,KeyPair } = nearAPI;

import config from "./base";

import {ID_TO_CHAIN_ID, MOS_CONTRACT_ADDRESS_SET} from "butterjs-sdk/dist/constants";

import store from "@/store";


let currentUser;


export default {

    async asyncNearWallet() {

        const nearConnection = await connect(config.connectionConfig);

        const walletConnection = new WalletConnection(nearConnection);

        let contract = MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(config.near.chainId.toString())]

        //判断是否登录获取账户信息
        if (walletConnection.getAccountId()) {
            currentUser = {
                accountId: walletConnection.getAccountId(),
                balance: (await walletConnection.account().state()).amount,
            };
        }

        //登录成功
        if (walletConnection.isSignedIn() ){
            const walletAccountObj = walletConnection.account();
            const account = await nearConnection.account(currentUser.accountId);
            await account.getAccessKeys()
            store.commit("setAddress",currentUser.accountId);
            store.commit("setChainId",config.near.chainId.toString());
            console.log('walletAccountObj',walletAccountObj)
            console.log('success')
        }
        //没有登录
        else  {
            walletConnection.requestSignIn(
                contract, // contract requesting access
                "Butter Bridge", // optional title
                "https://test-bridge.butternetwork.io" , // optional redirect URL on success
                "https://test-bridge.butternetwork.io" , // optional redirect URL on success
                // "http://18.139.224.21:7001", // optional redirect URL on success
            );

            store.commit("setAddress",currentUser.accountId);
            store.commit("setChainId",config.near.chainId.toString());
            // this.$router.push(`/home?sourceNetwork=NEAR&destNetwork=${this.$route.query.destNetwork}&ts=${Date.now()}`)
        }

        console.log('currentUser',currentUser,walletConnection)

    return {currentUser,walletConnection}


    },


    async closeNearWallet() {

        const nearConnection = await connect(config.connectionConfig);

        const walletConnection = new WalletConnection(nearConnection);


        return   walletConnection.signOut();

    },


}

