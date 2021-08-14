import React, { useCallback, useState } from 'react'
import { useDeferredLoads } from 'react-loads'
import cookie from 'js-cookie'

// Components
import Link from '@material-ui/core/Link'
import AddressForm from '../addressForm'
import SpringModal from '../../../modal'

// Context
import { useStoreCheckout } from '../../../../context/StoreCheckoutContext'

// Language
import strings from './strings.json'

const AddressUpdate = (props) => {
  const { customerToken } = useStoreCheckout()
  const [modalOpen, setModalOpen] = useState(false)

  const handleSubmit = (e, newAddress) => {
    e.preventDefault()
    const newAddressCountryAdjusted = { ...newAddress, country: newAddress.country[0] }
    // console.log(newAddressCountryAdjusted)
    load(customerToken || cookie.get('customer_token'), props.address, newAddressCountryAdjusted)
  }

  const handleAddressUpdate = useCallback(
    (token, address, newAddress) =>
      fetch(`/.netlify/functions/addressUpdate`, {
        method: 'POST',
        body: JSON.stringify({
          token,
          id: address.id,
          address: newAddress,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          props.reloadAddresses()
          setModalOpen(false)
          return Promise.resolve(res)
        })
        .catch((error) => {
          throw new Error(error.message)
        }),
    []
  )

  const { error, isRejected, isPending, isReloading, isResolved, load } = useDeferredLoads(
    'handleAddressUpdate',
    handleAddressUpdate,
    {
      defer: true,
    }
  )

  const handleModalOpen = () => {
    setModalOpen(true)
  }
  const handleModalClose = () => {
    setModalOpen(false)
  }

  // console.log('ADDRESS UPDATE (auth)', props)
  return (
    <>
      <SpringModal
        modalOpen={modalOpen}
        handleModalOpen={handleModalOpen}
        handleModalClose={handleModalClose}
        triggerElement={
          <Link className={props.styles} onClick={handleModalOpen}>
            {strings.update}
          </Link>
        }
      >
        <AddressForm
          handleSubmit={handleSubmit}
          address={props.address}
          isPending={isPending}
          isReloading={isReloading}
        />
      </SpringModal>
      {/* isPending, isReloading, and isResolved states are added into <AddressForm>} */}
      {/* {isResolved && <span>Done!</span>} */}
      {/* {isRejected && <ErrorHandling error={error} />} */}
    </>
  )
}

export default AddressUpdate
