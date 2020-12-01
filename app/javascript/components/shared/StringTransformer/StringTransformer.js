const CHARACTER_WIDTHS = { "0": 90, "1": 90, "2": 90, "3": 90, "4": 90, "5": 90, "6": 90, "7": 90, "8": 90, "9": 90, "A": 104, "average": 96, "B": 100, "C": 104, "D": 105, "E": 91, "F": 88, "G": 109, "H": 114, "I": 44, "J": 88, "K": 100, "L": 86, "M": 140, "N": 114, "O": 110, "P": 101, "Q": 110, "R": 99, "S": 95, "T": 95, "V": 102, "W": 142, "U": 104, "a": 87, "b": 90, "c": 84, "d": 90, "e": 85, "f": 56, "g": 90, "h": 88, "i": 39, "j": 38, "k": 81, "l": 39, "m": 140, "n": 88, "o": 91, "p": 90, "q": 91, "r": 54, "s": 83, "t": 52, "u": 88, "v": 78, "w": 120, "x": 79, "y": 76, "z": 79, "~": 109, "!": 41, "@": 144, "#": 99, "$": 90, "%": 117, "^": 67, "&": 100, "*": 69, "(": 55, ")": 56, "_": 72, "+": 91, "/": 66, "\\": 66, "|": 39, "{": 54, "}": 54, "[": 42, "]": 42, ";": 34, ":": 39, "'": 28, "\"": 51, "<": 81, ">": 84, "?": 76, "-": 44, ".": 42, ",": 31, " ": 40 }

export default class StringTransformer {
  static shorten(str, maxLength = 10) {
    if (str.length > maxLength) {
      str = `${str.substring(0, maxLength - 3)}...`
    }

    return str
  }

  static shortenWidth(str, maxWidth = 1000) {
    let shortened = '';
    const abbrWidth = CHARACTER_WIDTHS['.'] * 3;

    let width = 0;
    let charWidth = 0;

    str.split('').forEach((c) => {
      charWidth = c in CHARACTER_WIDTHS ? CHARACTER_WIDTHS[c] : CHARACTER_WIDTHS['average'];

      width += charWidth;

      if (width - abbrWidth < maxWidth) shortened = `${shortened}${c}`;
    });

    if (width > maxWidth) {
      return `${shortened}...`;
    } else {
      return str;
    }
  }

  static shortenWidthOld(str, maxWidth = 1000) {
    let full = '';
    let shortened = '';
    const abbrLength = CHARACTER_WIDTHS['.'] * 3;

    let length = 0;

    let charLength = 0;
    str.split('').forEach((c) => {
      if (c in CHARACTER_WIDTHS) {
        charLength = CHARACTER_WIDTHS[c];
      } else {
        charLength = CHARACTER_WIDTHS['average'];
      }

      length += charLength;

      if (length < maxWidth) {
        full = `${full}${c}`;
      }
      if (length - abbrLength < maxWidth) {
        shortened = `${shortened}${c}`;
      }

      if (length > maxWidth) {
        return `${shortened}...`;
      }
    })

    if (length > maxWidth) {
      return `${shortened}...`;
    } else {
      return str;
    }
  }
}