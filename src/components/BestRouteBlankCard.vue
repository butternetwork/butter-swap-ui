<template>
    <div class="best-route-blank-card">
        <div v-if="!isLoading" class="blank-img">
            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="151" viewBox="0 0 150 151" fill="inherit">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M36.1111 56.0635C42.2476 56.0635 47.2222 61.0777 47.2222 67.2631C47.2222 72.4329 43.747 76.7846 39.0228 78.0742C39.0803 78.3061 39.1108 78.5487 39.1108 78.7984V98.3977C39.1108 102.808 40.8491 107.032 43.9357 110.144C47.0215 113.254 51.2017 114.997 55.5553 114.997C59.9089 114.997 64.0891 113.254 67.1749 110.144C70.2615 107.032 71.9998 102.808 71.9998 98.3977V53.5993C71.9998 47.6132 74.3587 41.8676 78.5652 37.6276C82.7725 33.3868 88.4839 31 94.4442 31C100.405 31 106.116 33.3868 110.323 37.6276C114.53 41.8676 116.889 47.6132 116.889 53.5993V78.7984C116.889 79.086 116.848 79.3641 116.773 79.6273C121.511 80.9073 125 85.266 125 90.446C125 96.6314 120.025 101.646 113.889 101.646C107.752 101.646 102.778 96.6314 102.778 90.446C102.778 85.2662 106.267 80.9076 111.005 79.6274C110.929 79.3641 110.889 79.086 110.889 78.7984V53.5993C110.889 49.1892 109.15 44.9646 106.064 41.8534C102.978 38.743 98.7979 37 94.4442 37C90.0906 37 85.9104 38.743 82.8246 41.8534C79.738 44.9646 77.9998 49.1892 77.9998 53.5993V98.3977C77.9998 104.384 75.6408 110.129 71.4343 114.369C67.227 118.61 61.5157 120.997 55.5553 120.997C49.595 120.997 43.8836 118.61 39.6763 114.369C35.4698 110.129 33.1108 104.384 33.1108 98.3977V78.7984C33.1108 78.5487 33.1414 78.306 33.1989 78.0741C28.4749 76.7843 25 72.4327 25 67.2631C25 61.0777 29.9746 56.0635 36.1111 56.0635ZM42.2222 67.2631C42.2222 63.8017 39.4489 61.0635 36.1111 61.0635C32.7734 61.0635 30 63.8017 30 67.2631C30 70.7245 32.7734 73.4627 36.1111 73.4627C39.4489 73.4627 42.2222 70.7245 42.2222 67.2631ZM120 90.446C120 86.9846 117.227 84.2464 113.889 84.2464C110.551 84.2464 107.778 86.9846 107.778 90.446C107.778 93.9074 110.551 96.6456 113.889 96.6456C117.227 96.6456 120 93.9074 120 90.446Z" fill="inherit"/>
            </svg>
            <div>No Routing Information</div>
            <div>Select the token which you want to swap on the left side.</div>
        </div>
        <div v-if="isLoading" class="blank-loading">
            <img :src="loadingImg" alt="">
        </div>
    </div>
</template>

<script>
import loadingImg from '@/assets/loading2.gif'

export default {
    name: "BestRouteCard",
    props: {
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loadingImg: loadingImg,
        }
    },
    watch: {

    },
    computed: {

    },
    methods: {

    },
}
</script>

<style scoped lang="less">
.best-route-blank-card {
    width: 100%;
    height: 300px;
    border: 1px solid #ccc;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    fill: #fff;
    .blank-img {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }
    .blank-loading {
        width: 200px;
        height: 200px;
        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>