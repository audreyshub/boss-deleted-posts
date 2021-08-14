import React, { useEffect, useCallback, useState } from 'react'
import cookie from 'js-cookie'
import { useLoads } from 'react-loads'
import ErrorHandling from '../../error'
import { Link as GatsbyLink, navigate } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import _ from 'lodash'
import FormattedAddress from '../addresses/formattedAddress'
import ContentLoader from 'react-content-loader'

// Context
import { useStoreCheckout, useCustomer } from '../../../context/StoreCheckoutContext'

// Language
import strings from './strings'

// Skellys
const Skelly = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={160}
    // viewBox="0 0 400 160"
    backgroundColor="#4388A8"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="15" />
    <rect x="0" y="30" rx="3" ry="3" width="100%" height="15" />
    <rect x="0" y="60" rx="3" ry="3" width="100%" height="15" />
    <rect x="0" y="90" rx="3" ry="3" width="100%" height="15" />
  </ContentLoader>
)

// Styles
const useStyles = makeStyles((theme) => ({
  customerDetails: {
    marginBottom: theme.spacing(3),
  },
  manageAddresses: {
    marginTop: theme.spacing(3),
    display: 'block',
    fontWeight: 600,
  },
}))

const DefaultAddress = (props) => {
  const classes = useStyles()
  const { customerToken, customerName, customerLastName, customerEmail } = useStoreCheckout()
  const [defaultAddress, setDefaultAddress] = useState({})
  const [numberOfAddresses, setNumberOfAddresses] = useState(null)
  const handleAddresses = useCallback(
    (token) =>
      fetch(`/.netlify/functions/addresses`, {
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
            if (res.defaultAddress) {
              setNumberOfAddresses(res.addresses.edges.length)
              setDefaultAddress(res.defaultAddress)
            }
            return Promise.resolve(res)
          }
        })
        .catch((error) => {
          throw new Error(error.message)
        }),
    []
  )

  const { error, isRejected, isPending, isReloading, isResolved, load } = useLoads(
    'handleAddresses',
    handleAddresses,
    {
      defer: true,
    }
  )

  useEffect(() => {
    const token = customerToken || cookie.get('customer_token')
    if (token) {
      load(token)
    }
  }, [])

  const getCustomerDetails = () => {
    let customerDetails = []
    let lastName = customerLastName || cookie.get('customer_lastName') || ''

    customerDetails.push(`${customerName} ${lastName}`)
    customerDetails.push(customerEmail)

    return customerDetails.map((field, i) => (
      <Typography
        className={classes.addressLine}
        component={i === 0 ? 'h3' : 'span'}
        variant={i === 0 ? 'h4' : 'body1'}
        gutterBottom={true}
        key={i}
      >
        {field}
      </Typography>
    ))
  }

  // console.log('AUTH - DEFAULT ADDRESS', defaultAddress)
  return (
    <>
      <Box className={props.styles}>
        {/* {isResolved && <span>Done!</span>} */}

        <Typography component="h2" variant="h2" className="visuallyHidden">
          {strings.title}
        </Typography>

        <Box className={classes.customerDetails}>{getCustomerDetails()}</Box>
        <Box className={classes.address}>
          <Typography component="h3" variant="h4" gutterBottom={true}>
            {strings.addressTitle}
          </Typography>

          {(isPending || isReloading) && <Skelly />}

          {_.isEmpty(defaultAddress) ? (
            isResolved && <Typography component="p">{strings.noAddresses}</Typography>
          ) : (
            <>
              <Box>
                <FormattedAddress address={defaultAddress} />
              </Box>
              <Link
                className={classes.manageAddresses}
                component={GatsbyLink}
                to="/account/addresses"
              >
                {strings.manageAddressesLink} ({numberOfAddresses})
              </Link>
            </>
          )}
        </Box>

        {isRejected && <ErrorHandling error={error} />}
      </Box>
    </>
  )
}

export default DefaultAddress
