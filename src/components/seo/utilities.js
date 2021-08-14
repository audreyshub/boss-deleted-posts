export const getShopifyImage = (shopifySource) => {
  if (!shopifySource) return
  const splitImageSrc = shopifySource.split(/\.(?=[^\.]+$)/)
  const newUrl = `${splitImageSrc[0]}_1000x.${splitImageSrc[1]}`
  return newUrl
}

export const oneYearFromNow = () => {
  Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1 // getMonth() is zero-based
    var dd = this.getDate()

    return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-')
  }

  return new Date()
}
