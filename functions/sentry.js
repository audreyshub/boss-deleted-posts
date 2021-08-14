require('dotenv').config()
const Sentry = require('@sentry/serverless')

const { SENTRY_DSN } = process.env

let sentryInitialized = false
const initSentry = () => {
  if (SENTRY_DSN) {
    Sentry.AWSLambda.init({ dsn: SENTRY_DSN })
    sentryInitialized = true
  }
}
module.exports = { Sentry, initSentry, sentryInitialized }
