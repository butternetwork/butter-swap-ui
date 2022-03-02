<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
        name: 'App',
        components: {
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
  color: #333333;
  font-family: 'productRegular';
}
::-webkit-input-placeholder {
  font-size: 20px;
  font-weight: 600;
  color: #84868B;
  line-height: 28px;
  padding-left: 10px;
  font-family: 'productRegular';
}
::-moz-placeholder {
  font-size: 16px;
  font-weight: 600;
  color: #84868B;
  line-height: 28px;
  padding-left: 10px;
  font-family: 'productRegular';
} /* ie */
input:-moz-placeholder {
  font-size: 16px;
  font-weight: 600;
  color: #84868B;
  line-height: 28px;
  padding-left: 10px;
  font-family: 'productRegular';
}
</style>
