const {
  validateIncomingData,
  statusReturn,
  preparePayload,
  queryShopify,
  CUSTOMER_QUERY,
  CUSTOMER_ACTIVATE_QUERY,
} = require('./requestConfig')

let data
let payload
let token
let accessToken
let payloadCustomer

exports.handler = async (event) => {
  data = validateIncomingData(event)

  payload = preparePayload(CUSTOMER_ACTIVATE_QUERY, {
    id: data.id,
    input: data.input,
  })

  try {
    token = await queryShopify(payload)

    if (token.data.customerActivate.customerUserErrors.length > 0) {
      throw token.data.customerActivate.customerUserErrors
    } else {
      accessToken = token.data.customerActivate.customerAccessToken.accessToken
    }
  } catch (err) {
    return statusReturn(200, { error: err[0].message })
  }

  payloadCustomer = preparePayload(CUSTOMER_QUERY, {
    customerAccessToken: accessToken,
  })

  try {
    customer = await queryShopify(payloadCustomer)
    customer = customer.data.customer
    return statusReturn(200, {
      token: accessToken,
      customer,
    })
  } catch (err) {
    return statusReturn(500, { error: err.message })
  }
}
