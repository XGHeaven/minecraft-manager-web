export function byte2Size(byte) {
  const pos = ~~(Math.log2(byte) / 10)
  return (byte / 2 ** (10 * pos)).toFixed(2) + ' ' + 'BKMGT'[pos]
}

export function clone(object) {
  if (object.slice) return object.slice()
  if (object.call) return object
  if (typeof object === 'object') {
    let o = {}
    for (let key in object) {
      if (object.hasOwnProperty(key)) o[key] = clone(object[key])
    }
  }
  return object
}
