const Sentry = require('@sentry/serverless')

Sentry.AWSLambda.init({
  dsn: 'https://61008d1c94214191906e826296729ad4@o562907.ingest.sentry.io/5702100',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

const {
  validateIncomingData,
  queryShopify,
  statusReturn,
  preparePayload,
  CUSTOMER_QUERY,
  CUSTOMER_TOKEN_QUERY,
} = require('./requestConfig')

let token
let accessToken
let customer

exports.handler = Sentry.AWSLambda.wrapHandler(
  async (event, context) => {
    data = validateIncomingData(event)

    const payload = preparePayload(CUSTOMER_TOKEN_QUERY, {
      input: {
        email: data.email,
        password: data.password,
      },
    })

    try {
      token = await queryShopify(payload)
      if (token.data.customerAccessTokenCreate.customerUserErrors.length > 0) {
        throw token.data.customerAccessTokenCreate.customerUserErrors
      } else {
        accessToken = token.data.customerAccessTokenCreate.customerAccessToken.accessToken
      }
    } catch (err) {
      Sentry.captureMessage(err)
      return statusReturn(200, { error: 'Problem with email or password' })
    }

    const payloadCustomer = preparePayload(CUSTOMER_QUERY, {
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
  },
  {
    captureTimeoutWarning: false,
  }
)
