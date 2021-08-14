const {
  validateIncomingData,
  statusReturn,
  preparePayload,
  queryShopify,
  CUSTOMER_TOKEN_QUERY,
  CUSTOMER_RESET_QUERY,
} = require('./requestConfig')

let data
let customer

exports.handler = async (event) => {
  data = validateIncomingData(event)

  const payload = preparePayload(CUSTOMER_RESET_QUERY, {
    id: data.id,
    input: data.input,
  })

  try {
    customer = await queryShopify(payload)

    // console.log('CUSTOMER', JSON.stringify(customer, null, 2))

    if (customer.data.customerReset.userErrors.length > 0) {
      throw customer.data.customerReset.userErrors
    } else {
      customer = customer.data.customerReset.customer
    }
  } catch (err) {
    return statusReturn(500, { error: err[0].message })
  }

  const loginPayload = preparePayload(CUSTOMER_TOKEN_QUERY, {
    input: {
      email: customer.email,
      password: data.input.password,
    },
  })

  try {
    let token = await queryShopify(loginPayload)

    // console.log('TOKEN', JSON.stringify(token, null, 2))

    if (token.data.customerAccessTokenCreate.customerUserErrors.length > 0) {
      throw token.data.customerAccessTokenCreate.customerUserErrors
    } else {
      token = token.data.customerAccessTokenCreate.customerAccessToken.accessToken
      return statusReturn(200, {
        token,
        customer,
      })
    }
  } catch (err) {
    return statusReturn(500, { error: err.message })
  }
}
