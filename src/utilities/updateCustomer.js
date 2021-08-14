import cookie from 'js-cookie'

export const updateCustomer = (res, email) => {
  // console.log('UPDATE CUSTOMER (utility)', res, email)

  cookie.set('customer_token', res.token, { expires: 25 })
  cookie.set('customer_id', res.customer.id, { expires: 25 })
  cookie.set('customer_firstName', res.customer.firstName, {
    expires: 25,
  })
  cookie.set('customer_lastName', res.customer.lastName, {
    expires: 25,
  })
  cookie.set('customer_email', email, { expires: 25 })
}
