import Web3 from 'web3';

class Watcher{
  constructor() {
    this.provider=null;
    this.timer=null;
    this.timerBang=null;
    this.client=null;
    this.limit=5;
    this.chainId = '';
    this.accounts=null;
    this.loop();
    this.listeners={
      accountChanged:[],
      chainChanged:[],
      providerChanged:[],
      clientChanged:[],
      providerReady:[]
    }
  }

  loopBang(){
    this.timerBang = setInterval(()=>{
      if(window.ethereum){
        if (window.ethereum!==this.provider){
          this.provider = window.ethereum;
          window.ethereum.on('accountsChanged', this.onAccountsChanged)
          window.ethereum.on('chainChanged', this.onChainChanged)
          this.onProviderChanged();
          this.onProviderReady();
        }
      }
    },5000);
  }

  loop() {
    if(this.provider){
      return;
    }
    if(!this.timer){
      this.timer = setInterval(()=>{
        if(window.ethereum){
          this.provider = window.ethereum;
          window.ethereum.on('accountsChanged', this.onAccountsChanged)
          window.ethereum.on('accountsChanged#evm', this.onAccountsChanged)
          window.ethereum.on('chainChanged', this.onChainChanged)
          this.onProviderReady();
          this.loopBang();
          if(this.timer){
            clearInterval(this.timer);
          }
        }
      },1000)
    }
  }

  onAccountsChanged=(data)=>{
    // console.log('Watcher onAccountsChanged',data)
    if(data!=null){
      data = JSON.parse(JSON.stringify(data))
      this.accounts = data;
      if (this.listeners.accountChanged){
        for (const listener of this.listeners.accountChanged) {
          listener(this.accounts);
        }
      }
    }
  }
  onChainChanged=(data)=>{
    // console.log('Watcher onChainChanged',data)
    if(data!==this.chainId){
      this.chainId = data;
      for (const listener of this.listeners['chainChanged']) {
        listener(this.chainId);
      }
    }
  }

  onProviderReady=()=>{
    // console.log('Watcher onProviderReady *v*!')
    for (const listener of this.listeners['providerReady']) {
      listener(this.provider);
    }
  }
  onProviderChanged=()=>{
    for (const listener of this.listeners['providerChanged']) {
      listener(this.provider);
    }
  }
  onClientChanged=()=>{
    for (const listener of this.listeners['clientChanged']) {
      listener(this.client);
    }
  }

  getProvider(){
    return new Promise((resolve ,reject)=> {
      // console.log('Watcher getProvider')
        if(this.provider){
          resolve(this.provider);
        }else{
          let times =this.limit;
          let temp = setInterval(()=>{
            if(this.provider){
              resolve(this.provider);
            }else{
              if(times<=0){
                clearInterval(temp);
                reject('No Provider Find.');
              }
            }
            times--;
          },1000)
        }
      }
    );
  }
  bindClient(client){
    return new Promise(async (resolve ,reject)=>{
      if(client==null){
        this.getProvider().then(provider=>{
          this.client=new Web3(provider);
          this.onClientChanged();
          resolve(this.client);
        }).catch(error=>{
          reject(error);
        });
      }else{
        this.client = client;
        this.onClientChanged();
        resolve(this.client);
      }
    })
  }

  /**
   *
   * @param event [accountChanged,chainChanged,providerChanged,clientChanged,providerReady]
   * @param callback
   * @returns {Watcher}
   */
  listen=(event,callback)=>{
    if (this.listeners[event]==null){
      this.listeners[event]=[];
    }
    this.listeners[event].push(callback);
    return this;
  }
  unlisten(callback){
    for (const event in this.listeners) {
      if(this.listeners[event]){
        let index = this.listeners[event].indexOf(callback);
        if(index>=0){
          this.listeners[event].splice(index, 1);
          return this;
        }
      }
    }
    return this;
  }
}

console.log(
    `
     ---- Happy Work ---- 
         
     ---- Happy Life ---- 
    `
)

export default Watcher;
