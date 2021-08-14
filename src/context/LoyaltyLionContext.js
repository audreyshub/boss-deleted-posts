import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useDeferredLoads } from 'react-loads'
import cookie from 'js-cookie'
import jsSHA from 'jssha'
import { decode } from 'shopify-gid'

// Context
import { useStoreCheckout } from './StoreCheckoutContext'
const LoyaltyLion = React.createContext()
LoyaltyLion.displayName = 'LoyaltyLion'

// Hooks
import useScript from '../hooks/useHooks/useScript'

const useInitializeLoyaltyLion = () => {
  const status = useScript('/loyaltyLionSDK.js')
  const { customerId, customerName, customerEmail } = useStoreCheckout()
  const [initialized, setInitialized] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  const dateIso = () => {
    const date = new Date()
    return date.toISOString()
  }

  const sha1Hash = (id) => {
    const timeStamp = dateIso()
    const shaObj = new jsSHA('SHA-1', 'TEXT', { encoding: 'UTF8' })

    shaObj.update(`${id}${timeStamp}${customerEmail}${process.env.GATSBY_LOYALTY_LION_SECRET}`)

    return shaObj.getHash('HEX')
  }

  const authObject = () => {
    const timeStamp = dateIso()
    const decodedCustomerId = decode(customerId)
    const Sha1AuthToken = sha1Hash(decodedCustomerId.id)

    return {
      customer: {
        id: decodedCustomerId.id,
        email: customerEmail,
        // name: customerName,
      },
      auth: {
        date: timeStamp,
        token: Sha1AuthToken,
      },
    }
  }

  // const initialize = () => {
  //   const userAuth = authObject()
  //   loyaltylion.init({
  //     token: process.env.GATSBY_LOYALTY_LION_TOKEN,
  //     ...userAuth,
  //   })
  //   setInitialized(true)
  // }

  const authenticate = () => {
    const userAuth = authObject()
    if (authenticated) return
    loyaltylion.authenticateCustomer(userAuth)
    setAuthenticated(true)
  }

  useEffect(() => {
    let llObjectExists = false
    if (typeof window !== 'undefined') {
      if (typeof window.loyaltylion !== 'undefined') {
        if (!Array.isArray(window.loyaltylion)) {
          llObjectExists = true
          setInitialized(llObjectExists)
        }
      }
    }
    if (initialized || llObjectExists) return
    if (status !== 'ready') return
    // console.log('Initializing in without customer ID')
    window.loyaltylion.init({ token: process.env.GATSBY_LOYALTY_LION_TOKEN })
    setInitialized(true)
  }, [status])

  useEffect(() => {
    if (!initialized) return
    if (status !== 'ready') return
    if (customerId) {
      // console.log('Authenticating in with customer ID')
      authenticate()
    }
  }, [initialized, customerId])

  // console.log('👾 useInitializeLoyaltyLion', customerId)
  return { initialized, authenticated, setAuthenticated }
}

export function LoyaltyLionProvider(props) {
  if (props.path !== '/rewards' && props.path !== '/account/*') {
    const initialized = false
    const authenticated = false
    const setAuthenticated = null
    return (
      <LoyaltyLion.Provider value={[initialized, authenticated, setAuthenticated]}>
        {props.children}
      </LoyaltyLion.Provider>
    )
  }

  const { initialized, authenticated, setAuthenticated } = useInitializeLoyaltyLion()

  // console.log('LOYALTY LION PROVIDER', initialized)
  return (
    <LoyaltyLion.Provider value={[initialized, authenticated, setAuthenticated]}>
      {props.children}
    </LoyaltyLion.Provider>
  )
}

export function useLoyaltyLion(props) {
  const [initialized, authenticated, setAuthenticated] = useContext(LoyaltyLion)

  return {
    initialized,
    authenticated,
    setAuthenticated,
  }
}
