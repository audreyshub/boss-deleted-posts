const {
  validateIncomingData,
  queryShopify,
  statusReturn,
  preparePayload,
  CUSTOMER_QUERY,
} = require('./requestConfig')

let data
let customer
let customerId

exports.handler = async (event) => {
  data = validateIncomingData(event)

  const payload = preparePayload(CUSTOMER_QUERY, {
    customerAccessToken: data.token,
  })

  try {
    customer = await queryShopify(payload)
    customerId = customer.data.customer.id

    return statusReturn(200, {
      token: data.token,
      customerId,
    })
  } catch (err) {
    return statusReturn(500, { error: err.message })
  }
}
