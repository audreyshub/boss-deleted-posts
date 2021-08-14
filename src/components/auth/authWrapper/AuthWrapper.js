import { navigate } from 'gatsby'
import cookie from 'js-cookie'
import React, { useEffect, useState } from 'react'

const AuthWrapper = (props) => {
  const { component: Component, path, ...rest } = props
  const [ready, setReady] = useState(false)

  // console.log('AUTH WRAPPER (Function)', ready)
  useEffect(() => {
    if (!cookie.get('customer_token') || !cookie.get('customer_email')) navigate('/account/login', { replace: true })
    setTimeout(() => {
      setReady(true)
    }, 0)
  }, [0])

  return <>{ready && <Component path={path} {...rest} />}</>
}

export default AuthWrapper
