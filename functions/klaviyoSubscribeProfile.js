const { validateIncomingData, klaviyoSubscribeProfile, statusReturn } = require('./requestConfig')

let responseSubscribeProfile
let subscribeProfilePayload

exports.handler = async (event) => {
  data = validateIncomingData(event)

  const { values, listId, subscriberType } = data

  subscribeProfilePayload = {
    profiles: [{ email: values.email, subscriber_type: subscriberType }],
  }

  try {
    responseSubscribeProfile = await klaviyoSubscribeProfile(subscribeProfilePayload, listId)

    return statusReturn(200, {
      responseSubscribeProfile,
    })
  } catch (err) {
    return statusReturn(500, { error: err.message })
  }
}
