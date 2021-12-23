<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
    import bus from './bus.js'
    export default {
        name: 'App',
        components: {
            // Home
        },
        methods: {
            scanMetaMaskAccount() {
                let v = this
                setTimeout(function () {
                    window.ethereum.enable()
                    v.action.scanMetaMaskAccount()
                }, 1000)
            },
        },
        created() {
            bus.appvue = this
            bus.$store = this.$store
        },
        mounted() {
            this.scanMetaMaskAccount()
            this.action.listenMetaMask()
        }
    }
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

button {
  border: 0;
  outline-style: none;
}

input {
  outline-style: none;
  border: 0;
}


#app {
  width: 100%;
  height: 100vh;
  background-color: #f8f8f8;
  color: black;
  font-family: 'poppinssemibold';
}
::-webkit-input-placeholder {
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 600;
  color: #84868B;
  line-height: 28px;
  padding-left: 10px;
}
::-moz-placeholder {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 600;
  color: #84868B;
  line-height: 28px;
  padding-left: 10px;
} /* ie */
input:-moz-placeholder {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 600;
  color: #84868B;
  line-height: 28px;
  padding-left: 10px;
}
</style>
