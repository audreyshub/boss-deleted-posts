import React, { useCallback, useState } from 'react'
import { useDeferredLoads } from 'react-loads'
import cookie from 'js-cookie'
import Button from '@material-ui/core/Button'

// Components
import ErrorHandling from '../../../error'
import AddressForm from '../addressForm'
import SpringModal from '../../../modal'

//Context
import { useStoreCheckout } from '../../../../context/StoreCheckoutContext'

// Language
import strings from './strings.json'

const AddressCreate = (props) => {
  const [modalOpen, setModalOpen] = useState(false)
  let { customerToken } = useStoreCheckout()

  const handleSubmit = (e, newAddress) => {
    e.preventDefault()
    const newAddressCountryAdjusted = { ...newAddress, country: newAddress.country[0] }
    load(customerToken || cookie.get('customer_token'), newAddressCountryAdjusted)
  }

  const handleSubmitNewAddress = useCallback(
    (customerToken, address) =>
      fetch(`/.netlify/functions/addressCreate`, {
        method: 'POST',
        body: JSON.stringify({
          token: customerToken,
          address,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          props.reloadAddresses()
          setModalOpen(false)
          // return Promise.resolve(res)
          return
        })
        .catch((error) => {
          throw new Error(error.message)
        }),
    []
  )

  const { error, isRejected, isPending, isReloading, isResolved, load } = useDeferredLoads(
    'handleSubmitNewAddress',
    handleSubmitNewAddress
  )

  const handleModalOpen = () => {
    setModalOpen(true)
  }
  const handleModalClose = () => {
    setModalOpen(false)
  }

  return (
    <>
      <SpringModal
        modalOpen={modalOpen}
        handleModalOpen={handleModalOpen}
        handleModalClose={handleModalClose}
        triggerElement={
          <Button
            className={props.styles}
            variant="contained"
            color="primary"
            aria-label={strings.newAddress}
            role="button"
            onClick={handleModalOpen}
          >
            {strings.newAddress}
          </Button>
        }
      >
        <AddressForm
          handleSubmit={handleSubmit}
          defaultCountry="United States"
          isPending={isPending}
          isReloading={isReloading}
        />
      </SpringModal>
      {isRejected && <ErrorHandling error={error} />}
      {(isPending || isReloading) && <span>Loading (addressCreate)</span>}
      {isResolved && <span>Done!</span>}
    </>
  )
}

export default AddressCreate
