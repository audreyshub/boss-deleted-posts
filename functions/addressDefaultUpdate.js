const {
  validateIncomingData,
  queryShopify,
  statusReturn,
  preparePayload,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE,
} = require('./requestConfig')

let data
let addressDefaultUpdate

exports.handler = async (event) => {
  data = validateIncomingData(event)

  const payload = preparePayload(CUSTOMER_DEFAULT_ADDRESS_UPDATE, {
    customerAccessToken: data.token,
    addressId: data.id,
  })

  try {
    addressDefaultUpdate = await queryShopify(payload)

    return statusReturn(200, addressDefaultUpdate)
  } catch (err) {
    return statusReturn(500, { error: err.message })
  }
}
