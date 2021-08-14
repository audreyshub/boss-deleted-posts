export default function toCss(arg) {
  if (typeof arg === 'string') {
    if (/^\d+$/.test(arg)) {
      return arg + 'px'
    } else if (/rem|em|px|%?/g.test(arg)) {
      return arg
    } else {
      console.log(
        "CSS string must be a number, a string containing only a number, or a string containing either 'em', 'px', or 'rem'"
      )
      return undefined
    }
  } else if (typeof arg === 'number') {
    return arg + 'px'
  }
}
