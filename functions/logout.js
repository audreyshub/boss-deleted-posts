const { validateIncomingData, queryShopify, statusReturn, preparePayload, CUSTOMER_LOGOUT_QUERY } = require('./requestConfig')

let data

exports.handler = async (event) => {
  data = validateIncomingData(event)

  const payload = preparePayload(CUSTOMER_LOGOUT_QUERY, {
    customerAccessToken: data.accessToken,
  })
  try {
    logout = await queryShopify(payload)

    return statusReturn(200, logout)
  } catch (err) {
    return statusReturn(500, { error: err[0] })
  }
}
