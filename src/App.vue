<template>
  <div id="app">
<!--    <Header/>-->
    <router-view></router-view>
  </div>
</template>

<script>
    import Header from "@/components/Header";
    export default {
        name: 'App',
        components: {
          Header
        },
        methods: {
        },
        created() {
        },
        mounted() {
        }
    }
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: 'productRegular' !important;
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
  color: #ffffff;
  font-family: 'productRegular' ;
  width: 100%;
  height: 100%;
  background: #1b2025;
  min-height: 100vh;
  /*background: #1b2025 url("assets/home-bg.png")  no-repeat right top;*/
  /*background-size: 100% 100%;*/
  /*background-attachment:fixed;*/
  /*background-color:;*/
}
::-webkit-input-placeholder {
  font-size: 24px;
  font-weight: 600;
  color: #84868B;
  line-height: 28px;
  /*padding-left: 10px;*/
  font-family: 'productRegular';
}
::-moz-placeholder {
  font-size: 24px;
  font-weight: 600;
  color: #84868B;
  line-height: 28px;
  /*padding-left: 10px;*/
  font-family: 'productRegular';
} /* ie */
input:-moz-placeholder {
  font-size: 24px;
  font-weight: 600;
  color: #84868B;
  line-height: 28px;
  /*padding-left: 10px;*/
  font-family: 'productRegular';
}
</style>
