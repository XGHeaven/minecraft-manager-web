export function byte2Size(byte) {
  const pos = ~~(Math.log2(byte) / 10)
  return (byte / 2 ** (10 * pos)).toFixed(2) + ' ' + 'BKMGT'[pos]
}
