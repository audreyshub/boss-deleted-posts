const { validateIncomingData, queryShopify, statusReturn, preparePayload, CUSTOMER_QUERY } = require('./requestConfig')

let data
let customer

exports.handler = async (event, context) => {
  data = validateIncomingData(event)

  const payload = preparePayload(CUSTOMER_QUERY, {
    customerAccessToken: data.token,
  })

  try {
    customer = await queryShopify(payload)
    customer = customer.data.customer

    return statusReturn(200, {
      token: data.token,
      customer,
    })
  } catch (err) {
    return statusReturn(500, { error: err.message })
  }
}
