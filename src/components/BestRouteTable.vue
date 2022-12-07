<template>
    <div class="best-route-table">
        <div class="best-route-table-header">
            <div class="header-index"></div>
            <div class="header-route-path">Route</div>
            <div class="header-amount">Amount</div>
            <div class="header-diff">Diff</div>
        </div>
        <div class="best-route-table-list">
            <div class="best-route-table-list-item" v-for="(item, index) in listData">
                <div class="item-index">{{ index }}</div>
                <div class="item-route-path">

                </div>
                <div class="item-amount">{{ item.amount }}</div>
                <div class="item-diff">{{ item.amount }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BestRouteCard",
    props: {
        listData: {
            type: Array,
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

@media screen and (min-width: 441px) {
    .best-route-table {
    display: flex;
    padding: 20px 0;
    padding-top: 36px;
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
        text-align: center;
        .header-index {
            width: 120px;
            flex: 1;
        }
        .header-route-path {
            flex: 1;
        }
        .header-amount {
            flex: 1;
        }
        .header-diff {
            flex: 1;
        }
    }
    .best-route-table-list {
        .best-route-table-list-item {
            display: flex;
            align-items: center;
            padding: 20px 0;
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
@media screen and (max-width: 440px) {
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