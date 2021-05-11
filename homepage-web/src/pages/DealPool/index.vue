<template>
  <div class="deal-container">
      <MiningHeader 
        :balance="balance" 
        :isConnected="isConnected"
        :account="account"
        :title="$t('title')"
        :titleDesc="$t('titleDesc')"
        @connectWallet="connectWallet"/>
  </div>
</template>

<script>
import MiningHeader from '../../components/MiningHeader'
import { ethers } from 'ethers'
export default {
    components: {
        MiningHeader
    },
    data () {
        return {
            balance: '',
            isConnected: false,
            account: '',
        }
    },
    methods: {
        /**
         * 连接钱包
         */
        async connectWallet () {
            // if (!this.network) {
            //   this.$message.error('网络错误')
            //   return
            // }
            if (window.ethereum) {
                window.ethereum.request({ method: 'eth_requestAccounts' })
                .then((accounts) => {
                if (accounts.length === 0) {
                    console.log('Please connect to MetaMask.');
                } else {
                    this.addHecoChain()
                }
                })
                .catch((err) => {
                if (err.code === 4001) {
                    console.log('Please connect to MetaMask.');
                } else {
                    console.error(err);
                }
                })
            } else {
                window.open('https://metamask.io/', '_self')
            }
        },
        /**
         * 添加heco公链
         */
        addHecoChain() {
            let param = {
                method: "wallet_addEthereumChain",
                params: [{
                chainId: "0x80",
                chainName: "Heco Mainnet",
                nativeCurrency: {
                    name: "Heco",
                    symbol: "HT",
                    decimals: 18
                },
                rpcUrls: ["https://http-mainnet-node.huobichain.com"],
                blockExplorerUrls: ["https://hecoinfo.com"]
                }]
            };
            window.ethereum.request(param).then((res) => {
                if (res && res.result === null) {
                window.location.reload()
                }
            }).catch((err) => {
                this.checkNetwork()
                if (err && err.code == 4001) {
                window.location.reload()
                }
            })
        },
        /**
         * 检测网络
         */
        checkNetwork() {
            if (!window.ethereum) {
                this.$message.error(this.$t('NoWallet'))
                return
            }
            let provider
            if (!window.ethereum) {
                provider = new ethers.providers.JsonRpcProvider(process.env.VUE_APP_RPC_URL);
            } else {
                provider = new ethers.providers.Web3Provider(window.ethereum);
            }
            provider.getNetwork().then(Network => {
                if (Network.chainId != process.env.VUE_APP_HECO_CHAINID) {
                    this.$message.error(this.$t('networkError'))
                    this.network = false
                } else {
                    this.network = true
                    this.initCoin(Network.chainId)
                    this.initAccount()
                }
            })
        },
    }
}
</script>

<style>

</style>