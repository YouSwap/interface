// 截取地址
export function getShowAddress (address) {
  const firstAddress = address.substring(0, 3);
  const AddressLength = address.length
  const lastAddress = address.substring(AddressLength - 3, AddressLength)
  return `${firstAddress}***${lastAddress}`
}
// 截取币种精度
export function getDecimalsCoin(number, decimals) {
  if (number.toString().indexOf('.') < 0) {
    return number
  }
  return number.toString().substring(0, number.toString().indexOf(".") + decimals + 1)
  // return parseInt(number).toFixed(decimals)
}
// 时间转化
export function formatTime (dateTime, sign = '/') {
  const date = new Date(dateTime * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  function s(t) {
    return t < 10 ? `0${t}` : t
  }
  return `${year}${sign}${s(month)}${sign}${s(day)} ${s(hours)}:${s(minutes)}:${s(seconds)}`
}
// 限制两位小数的输入
export function setTwoNumberDecimal(that) {
	var n = parseFloat(that.value);
  that.value = n.toFixed(2)
  return that
}
/**
 * @description 科学计数法转为string
 * @param {string, number} param
 */
/* eslint-disable*/
export function scientificNotationToString(param) {
  let strParam = String(param)
  let flag = /e/.test(strParam)
  if (!flag) return param

  // 指数符号 true: 正，false: 负
  let sysbol = true
  if (/e-/.test(strParam)) {
    sysbol = false
  }
  // 指数
  let index = Number(strParam.match(/\d+$/)[0])
  // 基数
  let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')

  if (sysbol) {
    return basis.padEnd(index + 1, 0)
  } else {
    return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
  }
}