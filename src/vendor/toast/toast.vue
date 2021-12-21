<template>
    <div v-if="show" class="wrap">{{text}}</div>
</template>

<style scoped>
    .wrap{
        font-size: 14px;
        position: fixed;
        left: 50%;
        top:50%;
        background: rgba(0,0,0,.6);
        padding: 10px;
        border-radius: 5px;
        transform: translate(-50%,-50%);
        max-width: 90%;
        color:#fff;
        z-index: 22222;
    }
</style>
