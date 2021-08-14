const { validateIncomingData, queryShopify, statusReturn, preparePayload, CUSTOMER_ADDRESS_CREATE } = require('./requestConfig')

let data
let newAddress

exports.handler = async (event) => {
  data = validateIncomingData(event)

  const payload = preparePayload(CUSTOMER_ADDRESS_CREATE, {
    customerAccessToken: data.token,
    address: data.address,
  })

  try {
    newAddress = await queryShopify(payload)

    return statusReturn(200, {
      token: data.token,
      newAddress,
    })
  } catch (err) {
    return statusReturn(500, { error: err.message })
  }
}
