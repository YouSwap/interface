// 截取地址
export function getShowAddress (address) {
  const firstAddress = address.substring(0, 3);
  const AddressLength = address.length
  const lastAddress = address.substring(AddressLength - 3, AddressLength)
  return `${firstAddress}***${lastAddress}`
}
// 截取币种精度
export function getDecimalsCoin(number, decimals) {
  if (typeof number === 'number') {
    number = number + ''
  }
  if (number.indexOf('.') === -1) {
    return number
  }
  return number.substring(0, number.indexOf(".") + decimals)
}
// 时间转化
export function formatTime (dateTime, sign = '/') {
  const date = new Date(dateTime * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  function s(t) {
    return t < 10 ? `0${t}` : t
  }
  return `${year}${sign}${s(month)}${sign}${s(day)}`
}
// 限制两位小数的输入
export function setTwoNumberDecimal(that) {
	var n = parseFloat(that.value);
  that.value = n.toFixed(2)
  return that
}