    <template>
      <div class="footer">
          <div class="footer-content">
            <div class="footer-icon">
<!--              <a href="" target="_blank"><img src="../assets/footer/dis.png"/></a>-->
              <a href="https://t.me/MarcoPoloMAP" target="_blank"><img src="../assets/footer/tele.png"/></a>
              <a href="https://twitter.com/MarcoPoloGlobal" target="_blank"><img  src="../assets/footer/tw.png"/></a>
              <a href="https://github.com/mapprotocol" target="_blank"><img  src="../assets/footer/github.png"/></a>
            </div>
            <span>Powered by MAP Protocol</span>
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
      },
      watch: {
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
      padding: 15px 0;
      //border-top: 1px solid rgba(0,0,0,0.1);
    }

    .footer-content {
      width: 1200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      span {
        padding-top: 11px;
      }
    }

    .footer-line {
      width: 1px;
      height: 29px;
      opacity: 0.1;
      background-color: black;
      margin: 0 50px;
    }

    .footer-icon {
      width: 8%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      img {
        cursor: pointer;
        width: 24px;
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
