import ns from 'number-string'

export const discountCurrency = (price, compareAtPrice) => {
  const nPrice = ns.toNumber(price)
  const nCompareAtPrice = ns.toNumber(compareAtPrice)
  return nCompareAtPrice - nPrice
}

export const discountPercent = (price, compareAtPrice) => {
  const nPrice = ns.toNumber(price)
  const nCompareAtPrice = ns.toNumber(compareAtPrice)
  return `${(nPrice / nCompareAtPrice) * 100}%`
}
