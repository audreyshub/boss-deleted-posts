const {
  validateIncomingData,
  queryShopify,
  statusReturn,
  preparePayload,
  CUSTOMER_CREATE_QUERY,
  CUSTOMER_TOKEN_QUERY,
} = require('./requestConfig')

let token
let loginPayload
let customer
let customerId

exports.handler = async (event) => {
  data = validateIncomingData(event)

  const payload = preparePayload(CUSTOMER_CREATE_QUERY, {
    input: {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  })

  try {
    customer = await queryShopify(payload)

    const { customerCreate } = customer.data
    customerId = customerCreate.customer.id
    // This will happen if API limit is exceeded
    if (customer.errors) throw customer.errors[0]
    // This will happen if there's a problem with the API call
    if (customerCreate.userErrors.length > 0) throw customerCreate.userErrors[0]

    // If that was successful lets log our new user in
    loginPayload = preparePayload(CUSTOMER_TOKEN_QUERY, {
      input: {
        email: data.email,
        password: data.password,
      },
    })

    try {
      token = await queryShopify(loginPayload)

      const { customerAccessTokenCreate } = token.data
      if (customerAccessTokenCreate.customerUserErrors.length > 0) {
        throw customerAccessTokenCreate.userErrors
      } else {
        token = customerAccessTokenCreate.customerAccessToken.accessToken
        // Manipulate the response and send some customer info back down that we can use later
        return statusReturn(200, {
          token,
          customer: {
            firstName: data.firstName,
            lastName: data.lastName,
            id: customerId,
          },
        })
      }
    } catch (err) {
      return statusReturn(500, { error: err.message })
    }
  } catch (err) {
    return statusReturn(500, { error: err.message })
  }
}
