const { validateIncomingData, queryShopify, statusReturn, preparePayload, CUSTOMER_ADDRESS_UPDATE } = require('./requestConfig')

let data
let addressUpdate

exports.handler = async (event) => {
  data = validateIncomingData(event)

  const payload = preparePayload(CUSTOMER_ADDRESS_UPDATE, {
    customerAccessToken: data.token,
    id: data.id,
    address: data.address,
  })

  try {
    addressUpdate = await queryShopify(payload)

    return statusReturn(200, addressUpdate)
  } catch (err) {
    return statusReturn(500, { error: err.message })
  }
}
