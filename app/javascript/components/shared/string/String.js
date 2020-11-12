export default class String {
  static shorten(str, maxLength = 10) {
    if (str.length > maxLength) {
      str = `${str.substring(0, maxLength - 3)}...`
    }

    return str
  }
}