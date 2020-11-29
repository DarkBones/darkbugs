const CHARACTER_WIDTHS = {
  A: 106,
  B: 102,
  C: 106,
  D: 99
}

export default class String {
  static shorten(str, maxLength = 10) {
    if (str.length > maxLength) {
      str = `${str.substring(0, maxLength - 3)}...`
    }

    return str
  }

  static shortenWidth(str, maxWidth = 1000) {

  }
}