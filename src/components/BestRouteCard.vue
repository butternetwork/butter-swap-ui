<template>
    <div class="best-route-card">
        <div class="best-route-step-index">{{ routeData.index }}</div>
        <div class="best-route-step-label">{{ routeData.label }}</div>
        <div v-if="!routeData.paths.length" class="best-route-step-token">
            <div v-if="routeData.token === 'NEAR'">
                <img class="nearIcon" :src="routeData.tokenIcon" alt="">
                {{ routeData.token }}
            </div>
            <div v-if="routeData.token !== 'NEAR'">
                <img :src="routeData.tokenIcon" alt="">
                {{ routeData.token }}
            </div>
        </div>

        <div class="best-route-step-pathTable">
            <div class="paths" v-for="(paths, index) in swapRoute">
                <div class="amounts">
                    <div>
                        <svg viewBox="0 0 1024 1024" focusable="false" data-icon="swap-right" width="1em" height="1em" fill="#fff" aria-hidden="true"><path d="M873.1 596.2l-164-208A32 32 0 00684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg>
                        {{ Number(amountList[index].amountIn).toFixed(2) }}
                    </div>
                    <div>
                        <svg viewBox="0 0 1024 1024" focusable="false" data-icon="swap-left" width="1em" height="1em" fill="#fff" aria-hidden="true" style="
                                transform: rotatex(180deg);
                            "><path d="M872 572H266.8l144.3-183c4.1-5.2.4-13-6.3-13H340c-9.8 0-19.1 4.5-25.1 12.2l-164 208c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg>
                        {{ Number(amountList[index].amountOut).toFixed(2) }}
                    </div>
                </div>
                <div class="path" v-for="path in paths">
                    <img :src="path.icon" alt="">
                    <span>{{ path.symbol }}</span>
                    <div class="path-concatenation">
                        {{ ">" }}
                    </div>
                </div>
                <div class="dexName">{{ dexList[index] || 'bridge' }}</div>
            </div>
        </div>

        <!-- <div v-if="routeData.platform" class="best-route-step-platform">{{ routeData.platform }}</div> -->
    </div>
</template>

<script>
import amountIn from '@/assets/routeImg/in.svg'
import amountOut from '@/assets/routeImg/out.svg'

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
            amountIn: amountIn,
            amountOut: amountOut,
            swapRoute: [],
            dexList: [],
            amountList: [],
        }
    },
    mounted() {
        this.routeData.paths.forEach(item => {
            let pathLen = item.path.length,
                pathData = []
            item.path.forEach((pathItem, index) => {
                let { tokenIn, tokenOut } = pathItem
                pathData = index === pathLen - 1 ? pathData.concat([ tokenIn, tokenOut ]) : pathData.concat([ tokenIn ])
            })
            if (!pathData.length) {
                pathData.push(item.tokenIn, item.tokenOut)
            }
            this.dexList.push(item.dexName)
            this.swapRoute.push(pathData)
            this.amountList.push({
                amountIn: item.amountIn,
                amountOut: item.amountOut
            })
        })

        console.log(this.swapRoute, 'swapRoute')
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
    gap: 10px 0;
    flex-direction: column;
    .pathItem {
        display: flex;
    }
    .paths {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 0; 
        .amounts {
            display: flex;
            flex-direction: column;
            min-width: 80px;
            margin-right: 14px;
            font-size: 14px;
            opacity: .6;
            div {
                display: flex;
                align-items: center;
                gap: 4px;
            }
        }
        .path {
            display: flex;
            align-items: center;
            .path-concatenation {
                width: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            img {
                width: 30px;
                height: 30px;
                object-fit: cover;
                margin-right: 6px;
            }
        }
        .path:nth-last-child(2) .path-concatenation {
            display: none;
        }
    }
    .dexName {
        margin-left: auto;
        margin-right: 40px;
        display: flex;
        align-items: center;
        opacity: .6;
        font-size: 14px;
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
            margin-bottom: 8px;
        }
        .best-route-step-token > div {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 18px;
            font-weight: 700;
            // margin-left: 50px;
            img {
                width: 30px;
                height: 30px;
                object-fit: cover;
                margin-right: 6px;
                box-sizing: border-box;
            }
            .nearIcon {
                background-color: #666;
                padding: 4px;
                border-radius: 4px;
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
            margin-bottom: 8px;
        }
        .best-route-step-token {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 18px;
            font-weight: 700;
            // margin-left: 50px;
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