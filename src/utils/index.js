export const outerXML = node => new XMLSerializer().serializeToString(node.documentElement)

export const parseXMLString = s => {
  const parser = new DOMParser()
  return parser.parseFromString(s, 'text/xml')
}

/**
 * Convert hex value to rgb
 * @param {string} hex
 * @return {number[]}
 */
export function hex2rgb(hex){
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result && result.splice(1).map(n=>parseInt(n, 16))
}

/**
 * Convert rgb values to hex
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @return {string}
 */
export function rgb2hex(r, g, b){
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
}
