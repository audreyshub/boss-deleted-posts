const {
  validateIncomingData,
  queryShopify,
  statusReturn,
  preparePayload,
  CUSTOMER_ADDRESS_DELETE,
} = require('./requestConfig')

let data

exports.handler = async (event) => {
  data = validateIncomingData(event)

  const payload = preparePayload(CUSTOMER_ADDRESS_DELETE, {
    customerAccessToken: data.token,
    id: data.id,
  })

  try {
    addressDelete = await queryShopify(payload)

    // Return response as errors can exist within to be thrown in the frontend
    return statusReturn(200, addressDelete)
  } catch (err) {
    return statusReturn(500, { err })
  }
}
