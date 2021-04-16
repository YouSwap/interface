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
    account: '', // 当前登陆账户
    balance: 0,
    inviteNum: 0, // 邀请数量
    benefit: 0,
    platform: 2,
    coin: 'ETH'
  },
  mutations: {
    setCoin (state, data) {
      state.coin = data
    },
    setAccount (state, data) {
      state.account = data
    },
    setInviteNum (state, data) {
      state.inviteNum = data
    },
    setBenefit (state, data) {
      state.benefit = data
    },
    setBalance (state, data) {
      state.balance = data
    },
    setPlatform (state, data) {
      state.platform = data
    },
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
  }
};