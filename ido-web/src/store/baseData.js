const HA_HA = 'HA_HA';
const totalUsdtAmountOfPriIEO = 'totalUsdtAmountOfPriIEO'
const upperLimitYouOfPriIEO = 'upperLimitYouOfPriIEO'
const startHeightOfPriIEO = 'startHeightOfPriIEO'
const startTime = 'startTime'
const endHeightOfPriIEO = 'endHeightOfPriIEO'
const endTime = 'endTime'
const status = 'status'
const _youAddress = '_youAddress'
const isInWhiteList = 'isInWhiteList'
const youPriceOfPriIEO = 'youPriceOfPriIEO'
const supplyYouForPriIEO = 'supplyYouForPriIEO'
const usdtBalanceOf = 'usdtBalanceOf'
const holders = 'holders'
const transfers = 'transfers'
const totalSupply = 'totalSupply'
const lan = 'lan'
const isNotConnect = 'isNotConnect'
const RemainingBlockchain = 'RemainingBlockchain'
const startBlock = 'startBlock'
const endBlock = 'endBlock'
const walletAddress = 'walletAddress'
const nodata = 'nodata'
const RemainingBlockchainEnd = 'RemainingBlockchainEnd'
const network = 'network'
const showGetYouBtn = 'showGetYouBtn'
const targetUsdtAmountOfPubIDO = 'targetUsdtAmountOfPubIDO'
const bottomLimitUsdtOfPubIDO = 'bottomLimitUsdtOfPubIDO'
const totalUsdtAmountOfPubIDO = 'totalUsdtAmountOfPubIDO'

export default {
  state: {
    totalUsdtAmountOfPriIEO: '',  // 总募集资金
    upperLimitYouOfPriIEO: '',    // 最高参与资金
    startHeightOfPriIEO: '',      // 开始块高
    startTime: '',                // 开始时间
    endHeightOfPriIEO: '',        // 结束块高
    endTime: '',                  // 开始时间
    status: '',
    _youAddress: '',              // YouSwap Token地址
    isInWhiteList: '',            // 是否在白名单
    youPriceOfPriIEO: '',         // You的价格(xxx/USDT)
    approve: '',                  // usdt token去授权
    privateOffering: '',          // 兑换
    supplyYouForPriIEO: '',       // YOU的总兑换数量
    swapProgress: '',             // 兑换进度
    totalSupply: '',              // YOU总供应量
    usdtBalanceOf: '',            //当前用户usdt的数量
    holders: '',                  // 持币人数 
    transfers: '',                // 交易次数
    lan: '',                      // 当前语言
    isNotConnect: false,
    RemainingBlockchain: '',      // 剩余区块
    startBlock: '',                  //开始块高
    endBlock: '',                  //结束块高
    walletAddress: '',             //当前用户的钱包地址
    nodata: '',
    RemainingBlockchainEnd: '',
    network: '',
    showGetYouBtn: '',
    targetUsdtAmountOfPubIDO: '',    //总募集资金
    bottomLimitUsdtOfPubIDO: '',     //最低参与资金
    totalUsdtAmountOfPubIDO: '',     //已经募集到的资金usdt
  },
  mutations: {
    [HA_HA](state, result) {
      state.haha = result;
    },
    [totalUsdtAmountOfPriIEO](state, result) {
      state.totalUsdtAmountOfPriIEO = result;
    },
    [upperLimitYouOfPriIEO](state, result) {
      state.upperLimitYouOfPriIEO = result;
    },
    [startHeightOfPriIEO](state, result) {
      state.startHeightOfPriIEO = result;
    },
    [endHeightOfPriIEO](state, result) {
      state.endHeightOfPriIEO = result;
    },
    [startTime](state, result) {
      state.startTime = result;
    },
    [endTime](state, result) {
      state.endTime = result;
    },
    [status](state, result) {
      state.status = result;
    },
    [_youAddress](state, result) {
      state._youAddress = result;
    },
    [isInWhiteList](state, result) {
      state.isInWhiteList = result;
    },
    [youPriceOfPriIEO](state, result) {
      state.youPriceOfPriIEO = result;
    },
    [supplyYouForPriIEO](state, result) {
      state.supplyYouForPriIEO = result;
    },
    [usdtBalanceOf](state, result) {
      state.usdtBalanceOf = result;
    },
    [holders](state, result) {
      state.holders = result;
    },
    [transfers](state, result) {
      state.transfers = result;
    },
    [totalSupply](state, result) {
      state.totalSupply = result;
    },
    [lan](state, result) {
      state.lan = result;
    },
    [isNotConnect](state, result) {
      state.isNotConnect = result;
    },
    [RemainingBlockchain](state, result) {
      state.RemainingBlockchain = result;
    },
    [startBlock](state, result) {
      state.startBlock = result;
    },
    [endBlock](state, result) {
      state.endBlock = result;
    },
    [walletAddress](state, result) {
      state.walletAddress = result;
    },
    [nodata](state, result) {
      state.nodata = result;
    },
    [RemainingBlockchainEnd](state, result) {
      state.RemainingBlockchainEnd = result;
    },
    [network](state, result) {
      state.network = result;
    },
    [showGetYouBtn](state, result) {
      state.showGetYouBtn = result;
    },
    [targetUsdtAmountOfPubIDO](state, result) {
      state.targetUsdtAmountOfPubIDO = result;
    },
    [bottomLimitUsdtOfPubIDO](state, result) {
      state.bottomLimitUsdtOfPubIDO = result;
    },
    [totalUsdtAmountOfPubIDO](state, result) {
      state.totalUsdtAmountOfPubIDO = result;
    },
  }
};