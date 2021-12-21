    <template>
      <div class="footer">
          <div class="footer-content">
            <span>Powered by MAP Protocol</span>
            <div class="footer-line"></div>
            <div class="footer-icon">
<!--              <a href="" target="_blank"><img src="../assets/footer/dis.png"/></a>-->
              <a href="https://t.me/MarcoPoloMAP" target="_blank"><img src="../assets/footer/tele.png"/></a>
              <a href="https://twitter.com/MarcoPoloGlobal" target="_blank"><img  src="../assets/footer/tw.png"/></a>
              <a href="https://github.com/mapprotocol" target="_blank"><img  src="../assets/footer/github.png"/></a>
            </div>
          </div>
      </div>
    </template>

    <script>


    export default {
       name: "Footer",
       data() {
        return {

        }
      },
      created() {

      },
      computed: {
        account_default_address() {
          return this.$store.state.account.change_chain
        },
      },
      watch: {
        //检测到获取了地址
        account_default_address() {
        }
      },
    }
    </script>

    <style scoped lang="less">

    .footer {
      position: relative;
      background: #f8f8f8;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 14px 0;
      border-top: 1px solid rgba(0,0,0,0.1);
    }

    .footer-content {
      width: 1200px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      //font-family: Poppins;
      font-size: 12px;
    }

    .footer-line {
      width: 1px;
      height: 29px;
      opacity: 0.1;
      background-color: white;
      margin: 0 50px;
    }

    .footer-icon {
      width: 10%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      img {
        cursor: pointer;
        width: 30px;
      }
    }


    @media (max-width: 1200px) {
      .footer-content {
        width: 100%;
        justify-content: center;
      }
      .footer-icon {
        width: 20%;
      }
    }

    @media (max-width: 960px) {

      .footer-line {
        margin: 0 20px;
      }

      .footer-icon {
        width: 20%;
      }
    }

    @media (max-width: 760px) {
      .footer-icon {
        width: 30%;
      }
    }


    </style>
