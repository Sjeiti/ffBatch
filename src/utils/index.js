export const outerXML = node => new XMLSerializer().serializeToString(node.documentElement)

export const parseXMLString = s => {
  const parser = new DOMParser()
  return parser.parseFromString(s, 'text/xml')
}
