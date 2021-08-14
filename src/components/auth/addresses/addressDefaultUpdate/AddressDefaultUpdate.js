import React, { useCallback, useState, useEffect, useRef } from 'react'
import cookie from 'js-cookie'
import { useDeferredLoads } from 'react-loads'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import ContentLoader from 'react-content-loader'

// Components
import ErrorHandling from '../../../error'

// Context
import { useStoreCheckout } from '../../../../context/StoreCheckoutContext'

// Language
import strings from './strings'

// Skellys
const Skelly = (props) => (
  <ContentLoader
    speed={2}
    width="100"
    height={20}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="100%" />
  </ContentLoader>
)

const AddressDefaultUpdate = (props) => {
  const { customerToken } = useStoreCheckout()
  const isLoading = useRef(false)

  const handleAddressDefaultUpdate = useCallback(
    (token, address) =>
      fetch(`/.netlify/functions/addressDefaultUpdate`, {
        method: 'POST',
        body: JSON.stringify({
          token,
          id: address.id,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          props.reloadAddresses()
          return
        })
        .catch((error) => {
          throw new Error(error.message)
        }),
    []
  )

  const { error, isRejected, isPending, isReloading, isResolved, load } = useDeferredLoads(
    'handleAddressDefaultUpdate',
    handleAddressDefaultUpdate
  )

  const handleClick = () => {
    const token = customerToken || cookie.get('customer_token')
    if (token) {
      load(token, props.address)
      isLoading.current = true
    }
  }

  useEffect(() => {
    if (props.isResolved) {
      isLoading.current = false
    }
  }, [props.isResolved])

  // console.log('ADDRESS DEFAULT UPDATE (auth)', isLoading.current)
  return (
    <>
      {/* {(isPending || isReloading) && <span>Loading (updateDefaultAddress)</span>}
        {isResolved && <span>Done! (updateDefaultAddress)</span>} */}
      {isRejected && <ErrorHandling error={error} />}

      <Link className={props.styles} onClick={handleClick}>
        <Typography component="p" variant="body1" display="block">
          {isLoading.current ? <Skelly /> : strings.makeDefault}
        </Typography>
      </Link>
    </>
  )
}

export default AddressDefaultUpdate
