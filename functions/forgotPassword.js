const {
  validateIncomingData,
  queryShopify,
  statusReturn,
  preparePayload,
  CUSTOMER_RECOVERY_QUERY,
} = require('./requestConfig')

let data
let customer

exports.handler = async (event) => {
  data = validateIncomingData(event)

  const payload = preparePayload(CUSTOMER_RECOVERY_QUERY, {
    email: data.email,
  })

  try {
    customer = await queryShopify(payload)
    const { data, userErrors, errors } = customer
    const { customerRecover } = data

    if (customerRecover && customerRecover.userErrors.length > 0) {
      throw customerRecover.userErrors
    } else if (userErrors && userErrors.length > 0) {
      throw userErrors
    } else if (errors && errors.length > 0) {
      throw errors
    } else {
      return statusReturn(200, { customerRecover })
    }
  } catch (err) {
    return statusReturn(500, { error: err[0].message })
  }
}
