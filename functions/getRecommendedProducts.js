const { validateIncomingData, queryRecommendedProducts, statusReturn } = require('./requestConfig')

let data
let products

exports.handler = async (event) => {
  data = validateIncomingData(event)

  try {
    products = await queryRecommendedProducts(data)

    return statusReturn(200, products)
  } catch (err) {
    return statusReturn(500, { error: err.message })
  }
}
