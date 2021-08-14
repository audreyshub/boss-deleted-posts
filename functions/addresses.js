const {
  validateIncomingData,
  queryShopify,
  statusReturn,
  preparePayload,
  CUSTOMER_QUERY,
} = require('./requestConfig')

let data
let customer
let defaultAddress
let addresses

exports.handler = async (event) => {
  data = validateIncomingData(event)

  const payload = preparePayload(CUSTOMER_QUERY, {
    customerAccessToken: data.token,
  })

  try {
    customer = await queryShopify(payload)
    // console.log(customer)
    defaultAddress = customer.data.customer.defaultAddress
    addresses = customer.data.customer.addresses

    return statusReturn(200, {
      token: data.token,
      defaultAddress,
      addresses,
    })
  } catch (err) {
    return statusReturn(500, { error: err.message })
  }
}
