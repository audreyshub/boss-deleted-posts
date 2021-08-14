import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDeferredLoads } from 'react-loads'
import cookie from 'js-cookie'
import jsSHA from 'jssha'
import { decode } from 'shopify-gid'

// Context
import { useLoyaltyLion } from '../../context/LoyaltyLionContext'
import { useStoreCheckout } from '../../context/StoreCheckoutContext'

// Hooks
import useScript from '../../hooks/useHooks/useScript'

const Init = (props) => {
  const { customerId, customerName, customerEmail } = props
  if (!customerId) return null

  const status = useScript('/loyaltyLionSDK.js')
  const { initialized, setInitialized, authenticated, setAuthenticated } = useLoyaltyLion()

  const dateIso = () => {
    const date = new Date()
    return date.toISOString()
  }

  const sha1Hash = (customerId, customerEmail) => {
    const timeStamp = dateIso()
    const shaObj = new jsSHA('SHA-1', 'TEXT', { encoding: 'UTF8' })

    shaObj.update(
      `${customerId}${timeStamp}${customerEmail}${process.env.GATSBY_LOYALTY_LION_SECRET}`
    )

    return shaObj.getHash('HEX')
  }

  const initializeLoyaltyLion = (customerId, customerEmail) => {
    if (initialized) return
    const timeStamp = dateIso()
    const decodedCustomerId = decode(customerId)
    const Sha1AuthToken = sha1Hash(decodedCustomerId.id, customerEmail)

    loyaltylion.init({
      token: process.env.GATSBY_LOYALTY_LION_TOKEN,
      customer: {
        id: decodedCustomerId.id,
        email: customerEmail,
        name: customerName,
      },
      auth: {
        date: timeStamp,
        token: Sha1AuthToken,
      },
    })

    // console.log('Loyalty Lion is initialized', loyaltylion._initData)
    setInitialized(true)
  }

  useEffect(() => {
    if (status === 'ready') {
      initializeLoyaltyLion(customerId, customerEmail)
    }
  }, [status])

  return null
}

const LoyaltyLion = (props) => {
  const [customerId, setCustomerId] = useState()
  const { customerToken, customerName, customerEmail } = useStoreCheckout()

  // const authenticateLoyaltyLion = (customerId, customerEmail) => {
  //   if (authenticated) return
  //   const timeStamp = dateIso()
  //   const decodedCustomerId = decode(customerId)
  //   const Sha1AuthToken = sha1Hash(decodedCustomerId.id, customerEmail)

  //   loyaltylion.authenticateCustomer({
  //     customer: {
  //       id: decodedCustomerId.id,
  //       email: customerEmail,
  //     },
  //     auth: {
  //       date: timeStamp,
  //       token: Sha1AuthToken,
  //     },
  //   })

  //   console.log('Loyalty Lion is authenticated', loyaltylion._initData)
  //   setAuthenticated(true)
  // }

  const getCustomerId = useCallback(
    (token) =>
      fetch(`/.netlify/functions/customer`, {
        method: 'POST',
        body: JSON.stringify({
          token,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            throw new Error(res.error.message)
          } else {
            if (res.customerId) {
              setCustomerId(res.customerId)
            }
            return Promise.resolve(res)
          }
        })
        .catch((error) => {
          throw new Error(error.message)
        }),
    []
  )

  const { error, isRejected, isPending, isReloading, isResolved, load } = useDeferredLoads(
    'getCustomerId',
    getCustomerId
  )

  // useEffect(() => {
  //   if (!initialized || authenticated) return
  //   authenticateLoyaltyLion(customerId, customerEmail)
  // }, [initialized])

  useEffect(() => {
    const token = customerToken || cookie.get('customer_token')
    if (token) {
      load(token)
    }

    // if (authenticated) {
    //   return
    // }
    // if (initialized) {
    //   return
    // }
    // if (!initialized) console.log('Loyalty Lion is not initialized')
  }, [customerToken, customerId])

  // console.log('LOYALTY LION', initialized)
  return (
    <>
      {isResolved && (
        <Init customerId={customerId} customerName={customerName} customerEmail={customerEmail} />
      )}
    </>
  )
}

export default LoyaltyLion

LoyaltyLion.propTypes = {}
