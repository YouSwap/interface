// 截取地址
export function getShowAddress(address) {
  const firstAddress = address.substring(0, 3)
  const AddressLength = address.length
  const lastAddress = address.substring(AddressLength - 3, AddressLength)
  return `${firstAddress}***${lastAddress}`
}
// 截取币种精度
export function getDecimalsCoin(number, decimals) {
  if (number.toString().indexOf('.') < 0) {
    return number
  }
  return number.toString().substring(0, number.toString().indexOf('.') + decimals + 1)
  // return parseInt(number).toFixed(decimals)
}
// 时间转化
export function formatTime(dateTime, sign = '/') {
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
  return `${year}${sign}${s(month)}${sign}${s(day)} ${s(hours)}:${s(
    minutes
  )}:${s(seconds)}`
}
// *精度丢失问题解决
//乘法
export var floatMultiply = (arg1, arg2) => {
  arg1 = Number(arg1)
  arg2 = Number(arg2)
  if ((!arg1 && arg1 !== 0) || (!arg2 && arg2 !== 0)) {
    return null
  }
  arg1 = toNonExponential(arg1)
  arg2 = toNonExponential(arg2)
  var n1, n2
  var r1, r2 // 小数位数
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  n1 = Number(arg1.toString().replace('.', ''))
  n2 = Number(arg2.toString().replace('.', ''))
  return (n1 * n2) / Math.pow(10, r1 + r2)
}
// 除法
let toNonExponential = (num) => {
  const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
}
export function floatDivide(arg1, arg2) {
  arg1 = Number(arg1)
  arg2 = Number(arg2)
  if (!arg2) {
    return null
  }
  if (!arg1 && arg1 !== 0) {
    return null
  } else if (arg1 === 0) {
    return 0
  }
  arg1 = toNonExponential(arg1)
  arg2 = toNonExponential(arg2)
  var n1, n2
  var r1, r2 // 小数位数
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  n1 = Number(arg1.toString().replace('.', ''))
  n2 = Number(arg2.toString().replace('.', ''))
  return floatMultiply(n1 / n2, Math.pow(10, r2 - r1))
  // return (n1 / n2) * Math.pow(10, r2 - r1);   // 直接乘法还是会出现精度问题
}
