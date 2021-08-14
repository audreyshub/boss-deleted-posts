import React, { useEffect, useCallback, useState } from 'react'
import cookie from 'js-cookie'
import { useDeferredLoads } from 'react-loads'
import _ from 'lodash'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'
import { Link as GatsbyLink, navigate } from 'gatsby'
import ContentLoader from 'react-content-loader'

// Components
import ErrorHandling from '../../error'
import Address from './address'
import AddressCreate from './addressCreate'

// Context
import { useLoyaltyLion } from '../../../context/LoyaltyLionContext'
import { SetCustomerInState, useStoreCheckout } from '../../../context/StoreCheckoutContext'

// Language
import strings from './strings'

// Skellys
const Skelly = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={360}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="100%" />
  </ContentLoader>
)

// Styles
const useStyles = makeStyles((theme) => ({
  page: {
    paddingBottom: theme.spacing(10),
  },
  addresses: {
    display: 'grid',
    gridGap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  },
  newAddress: {
    display: 'block',
  },
  titleWrapper: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  linksWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    '& a': {
      display: 'inline-block',
      '&:last-of-type': {
        marginLeft: theme.spacing(2),
      },
    },
  },
  backToAccountLink: {
    marginTop: theme.spacing(3),
    display: 'block',
    fontWeight: 600,
  },
  logoutLink: {
    marginTop: theme.spacing(3),
    display: 'block',
    fontWeight: 600,
  },
}))

const Addresses = (props) => {
  const classes = useStyles()
  const { isResolved: resolvedUpdateCustomerInState, load: updateCustomerInState } =
    SetCustomerInState()
  const { customerToken } = useStoreCheckout()
  const [addresses, setAddresses] = useState([])
  // const [addressCreateOpen, setAddressCreateOpen] = useState(false)

  const handleGetAddresses = useCallback(
    (token) =>
      fetch(`/.netlify/functions/addresses`, {
        method: 'POST',
        body: JSON.stringify({
          token,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          const defaultAddress = res.defaultAddress
          if (res.addresses) {
            const allAddresses = res.addresses.edges.map((edge, i) => {
              let address
              if (_.isEqual(edge.node, defaultAddress)) {
                address = { ...edge.node, isDefault: true }
              } else {
                address = edge.node
              }
              return address
            })
            setAddresses(allAddresses)
          }
          return Promise.resolve(res)
        })
        .catch((error) => {
          throw new Error(error.message)
        }),
    []
  )

  const { error, isRejected, isPending, isReloading, isResolved, load } = useDeferredLoads(
    'handleGetAddresses',
    handleGetAddresses
  )

  const {
    isPending: isPendingNoSkelly,
    isReloading: isReloadingNoSkelly,
    isResolved: isResolvedNoSkelly,
    load: loadNoSkelly,
  } = useDeferredLoads('handleGetAddresses', handleGetAddresses)

  const reloadAddresses = () => {
    const token = customerToken || cookie.get('customer_token')
    if (token) {
      loadNoSkelly(token)
    }
  }

  const handleLogout = (e) => {
    e.preventDefault()
    logout(updateCustomerInState)
    if (!authenticated) return
    setAuthenticated(false)
  }

  useEffect(() => {
    let isMounted = true // note this flag denote mount status
    const token = customerToken || cookie.get('customer_token')
    if (token) {
      if (isMounted) load(token)
    }
    return () => {
      isMounted = false
    } // use effect cleanup to set flag false, if unmounted
  }, [])

  // console.log('ADDRESSES (auth)', isPendingNoSkelly)
  return (
    <Container className={classes.page}>
      <Box className={classes.titleWrapper}>
        <Typography component="h1" variant="h2">
          {strings.title}
        </Typography>
      </Box>

      {/* {(isPending || isReloading) && <span>Loading (addresses)</span>} */}
      {/* {isResolved && <span>Done! (addresses)</span>} */}

      <Box className={classes.addresses}>
        {isRejected && <ErrorHandling error={error} />}

        {(isPending || isReloading) && <Skelly />}

        {addresses.length > 0 ? (
          <>
            {addresses.map((address, i) => {
              return (
                <Address
                  key={i}
                  address={address}
                  reloadAddresses={reloadAddresses}
                  isResolved={isResolvedNoSkelly}
                />
              )
            })}
          </>
        ) : (
          !isPending && !isReloading && <Typography component="p">{strings.noAddresses}</Typography>
        )}
      </Box>
      <AddressCreate reloadAddresses={reloadAddresses} />
      <Link
        className={classes.backToAccountLink}
        component={GatsbyLink}
        to="/account"
        aria-label={strings.backToAccount}
      >
        {strings.backToAccount}
      </Link>
      <Link
        className={classes.logoutLink}
        href="#logout"
        aria-label={strings.ariaLogout}
        onClick={(e) => logout(e, updateCustomerInState)}
      >
        Logout
      </Link>
    </Container>
  )
}

export default Addresses
