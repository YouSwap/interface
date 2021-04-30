// 截取地址
export function getShowAddress (address, sign = 3) {
  const firstAddress = address.substring(0, sign);
  const AddressLength = address.length
  const lastAddress = address.substring(AddressLength - sign, AddressLength)
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
export function setNumberDecimal(that, number) {
	var n = parseFloat(that.value);
  that.value = n.toFixed(number)
  return that
}
// 时间转化 时分秒
export function formatDate(data) {
  var date = new Date(data);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD +" "+hh + mm + ss;
}