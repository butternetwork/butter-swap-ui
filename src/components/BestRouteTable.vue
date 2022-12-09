<template>
    <div class="best-route-table">
        <div class="best-route-table-header">
            <div class="header-route-path">Route</div>
            <div class="header-amount">Amount</div>
        </div>
        <div class="best-route-table-list">
            <div class="best-route-table-list-item">
                <div class="item-route-path">
                    {{ listData.path }}
                </div>
                <div class="item-amount">{{ listData.amount }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BestRouteCard",
    props: {
        listData: {
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

@media screen and (min-width: 941px) {
    .best-route-table {
    display: flex;
    padding: 21px 18px;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 10px 0 rgba(255, 209, 79, 0.15);
    border-radius: 12px;
    margin-top: 30px;
    background: #1b2025;
    .best-route-table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        .header-index {
            width: 120px;
            flex: 1;
        }
        .header-route-path {
            flex: 1;
        }
        .header-amount {
            width: 240px;
            flex-shrink: 0;
        }
        .header-diff {
            flex: 1;
        }
    }
    .best-route-table-list {
        .best-route-table-list-item {
            display: flex;
            align-items: center;
            .item-index {
                width: 120px;
                text-align: center;
                font-size: 50px;
                font-weight: 600;
                line-height: 40px;
                opacity: 0.1;
                color: #fff
            }
            .item-route-path {

            }
            .item-amount {

            }
            .item-diff {

            }
        }
    }
}
}
@media screen and (max-width: 940px) {
    .best-route-table {
    display: flex;
    padding: 20px 0;
    // padding-top: 36px;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 10px 0 rgba(255, 209, 79, 0.15);
    border-radius: 12px;
    margin-top: 30px;
    background: #1b2025;
    .best-route-table-header {
        display: none;
    }
    .best-route-table-list {
        .best-route-table-list-item {
            display: flex;
            align-items: center;
            padding: 20px 0;
            .item-index {
                width: 60px;
                text-align: center;
                font-size: 50px;
                font-weight: 600;
                line-height: 40px;
                opacity: 0.1;
                color: #fff
            }
            .item-route-path {

            }
            .item-amount {

            }
            .item-diff {

            }
        }
    }
}
}
</style>