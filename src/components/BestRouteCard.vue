<template>
    <div class="best-route-card">
        <div class="best-route-step-index">{{ routeData.index }}</div>
        <div class="best-route-step-label">{{ routeData.label }}</div>
        <div v-if="!routeData.path.length" class="best-route-step-token">
            <img :src="routeData.tokenIcon" alt="">
            {{ routeData.token }}
        </div>

        <div class="best-route-step-pathTable">

        </div>

        <!-- <div v-if="routeData.platform" class="best-route-step-platform">{{ routeData.platform }}</div> -->
    </div>
</template>

<script>
export default {
    name: "BestRouteCard",
    props: {
        routeData: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {

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

.best-route-step-pathTable {
    display: flex;
    flex-direction: column;
    .pathItem {
        display: flex;
    }
}

@media screen and (min-width: 941px) {
    .best-route-card {
        min-width: 106px;
        min-height: 67px;
        position: relative;
        border-radius: 10px;
        background-color: #000;
        color: #fff;
        padding: 10px;
        box-sizing: border-box;
        flex-grow: 1;
        .best-route-step-index {
            position: absolute;
            top: 16px;
            right: 16px;
            font-weight: 600;
            font-size: 35px;
            line-height: 35px;
            opacity: .2;
            z-index: 0;
            pointer-events: none;
        }
        .best-route-step-label {
            color: #f6d536;
        }
        .best-route-step-token {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 700;
            img {
                width: 30px;
                height: 30px;
                object-fit: cover;
                margin-right: 6px;
            }
        }
        .best-route-step-platform {
            position: relative;
            padding-left: 8px;
            font-size: 14px;
            opacity: .6;
        }
        .best-route-step-platform::before {
            content: "-";
            position: absolute;
            width: 6px;
            height: 6px;
            // top: 8px;
            left: -2px;
            line-height: 20px;
            // background-color: #f6d536;
            // border-radius: 50%;
            opacity: .5;
        }
    }

    .best-route-card::before {
        top: 50%;
        left: -28px;
        width: 10px;
        height: 10px;
        transform: translateY(-50%);
        content: "";
        position: absolute;
        background-color: #f6d536;
        border-radius: 50%;
    }
    .best-route-card::after {
        top: calc(50% - 8px);
        left: -6.5px;
        width: 13px;
        height: 13px;
        content: "";
        position: absolute;
        border-radius: 2px;
        transform: rotate(45deg);
        background-color: #000;
    }
}
@media screen and (max-width: 940px) {
    .best-route-card {
        width: 100%;
        min-height: 67px;
        position: relative;
        border-radius: 10px;
        background-color: #000;
        color: #fff;
        padding: 10px;
        box-sizing: border-box;
        flex-grow: 1;
        .best-route-step-index {
            position: absolute;
            top: 16px;
            right: 16px;
            font-weight: 600;
            font-size: 50px;
            line-height: 40px;
            opacity: .1;
            z-index: 0;
            pointer-events: none;
        }
        .best-route-step-label {
            color: #f6d536;
        }
        .best-route-step-token {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 700;
            img {
                width: 30px;
                height: 30px;
                object-fit: cover;
                margin-right: 6px;
            }
        }
        .best-route-step-platform {
            position: relative;
            padding-left: 8px;
            font-size: 14px;
            opacity: .6;
        }
        .best-route-step-platform::before {
            content: "";
            position: absolute;
            width: 6px;
            height: 6px;
            top: 8px;
            left: -5px;
            background-color: #f6d536;
            border-radius: 50%;
            opacity: .5;
        }
    }

    .best-route-card::before {
        top: 50%;
        left: -28px;
        width: 10px;
        height: 10px;
        transform: translateY(-50%);
        content: "";
        position: absolute;
        background-color: #f6d536;
        border-radius: 50%;
    }
    .best-route-card::after {
        top: calc(50% - 8px);
        left: -6.5px;
        width: 13px;
        height: 13px;
        content: "";
        position: absolute;
        border-radius: 2px;
        transform: rotate(45deg);
        background-color: #000;
    }
}
</style>