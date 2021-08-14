import cookie from 'js-cookie'
import { navigate } from 'gatsby'

export const logout = (updateCustomerInState, baseUrl) => {
  const customerToken = cookie.get('customer_token')
  fetch(`/.netlify/functions/logout`, {
    method: 'POST',
    body: JSON.stringify({
      accessToken: customerToken,
    }),
  }).then(() => {
    cookie.remove('customer_token')
    cookie.remove('customer_email')
    cookie.remove('customer_firstName')
    cookie.remove('customer_lastName')
    cookie.remove('customer_id')
    localStorage.removeItem('loyaltylion_persistent_data')
    sessionStorage.removeItem('loyaltylion_temporary_data')
    if (typeof window.loyaltylion !== 'undefined') window.loyaltylion = undefined
    location.href = baseUrl
    setTimeout(() => {
      updateCustomerInState()
    }, 300)
  })
}
