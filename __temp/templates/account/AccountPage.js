import React, { useState, useEffect } from 'react'
import { Router } from '@reach/router'
import Box from '@material-ui/core/Box'
import qs from 'qs'

// Components
import SEO from '../../components/seo'
import AuthWrapper from '../../components/auth/authWrapper'
import Login from '../../components/auth/login'
import Register from '../../../__temp/components/auth/register'
import AccountPortal from '../../components/auth/accountPortal'
import Addresses from '../../components/auth/addresses'
import ForgotPassword from '../../components/auth/forgotPassword'
import ResetPassword from '../../components/auth/resetPassword'
import Activate from '../../components/auth/activate'

// Strings
import strings from './strings'

const AccountPage = (props) => {
  const { currency } = props.data.site.siteMetadata.gsConfig
  const { shopifyThemePath } = props.pageContext
  const [checkoutUrl, setCheckoutUrl] = useState()

  const { location } = props

  useEffect(() => {
    if (!location.search.includes('checkout_url')) return
    const checkoutUrlObject = qs.parse(location.search, { ignoreQueryPrefix: true })
    setCheckoutUrl(checkoutUrlObject.checkout_url)
  }, [])

  // console.log('ACCOUNT PAGE (template)', props)
  return (
    <>
      <SEO title={strings.seoTitle} shopifyThemePath={shopifyThemePath} />
      <Router basepath="/account">
        <AuthWrapper path="/" component={AccountPortal} currency={currency} />
        <AuthWrapper path="/addresses" component={Addresses} />
        <ResetPassword path="/reset/:id/:token" />
        <Login path="/login" checkoutUrl={checkoutUrl} />
        <Activate path="/activate/:id/:token" />
        {/* <InvalidToken path="/invalid_token" /> */}
        <Register path="/register" />
        <ForgotPassword path="/forgot_password" />
      </Router>
    </>
  )
}

export default AccountPage
