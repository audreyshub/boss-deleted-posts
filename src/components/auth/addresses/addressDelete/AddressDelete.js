import React, { useEffect, useCallback, useState } from 'react'
import cookie from 'js-cookie'
import { useDeferredLoads } from 'react-loads'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import ErrorHandling from '../../../error'

import { useStoreCheckout } from '../../../../context/StoreCheckoutContext'

import strings from './strings'

// Styles
const useStyles = makeStyles((theme) => ({
  addressLine: {
    display: 'block',
  },
}))

const AddressDelete = (props) => {
  const classes = useStyles()
  const { customerToken } = useStoreCheckout()

  const handleAddressDelete = useCallback(
    (token, address) =>
      fetch(`/.netlify/functions/addressDelete`, {
        method: 'POST',
        body: JSON.stringify({
          token,
          id: address.id,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errors) {
            throw new Error('Oops! Something went wrong')
          } else {
            props.reloadAddresses()
            return Promise.resolve(res)
          }
        })
        .catch((error) => {
          throw new Error('Oops! Something went wrong')
        }),
    []
  )

  const { error, isRejected, isPending, isReloading, isResolved, load } = useDeferredLoads(
    'handleAddressDelete',
    handleAddressDelete
  )

  const handleClick = () => {
    const token = customerToken || cookie.get('customer_token')
    if (token) {
      load(token, props.address)
    }
  }

  // console.log('AUTH - ADDRESSES', props)
  return (
    <>
      <Link className={props.styles} onClick={handleClick}>
        {strings.delete}
      </Link>
      {/* {(isPending || isReloading) && <span>Loading</span>}
      {isResolved && <span>Done!</span>}
      {isRejected && <ErrorHandling error={error} />} */}
    </>
  )
}

export default AddressDelete
