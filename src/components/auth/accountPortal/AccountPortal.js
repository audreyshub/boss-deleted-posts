import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'
import { Link as GatsbyLink } from 'gatsby'
import Button from '@material-ui/core/Button'

// Components
import Orders from '../orders'
import DefaultAddress from '../defaultAddress'

// Context
// import { useLoyaltyLion } from '../../../context/LoyaltyLionContext'
import { SetCustomerInState, useStoreCheckout } from '../../../context/StoreCheckoutContext'
import { useLoyaltyLion } from '../../../context/LoyaltyLionContext.js'

// Utilities
import { logout } from '../util/logout'

// Language
import strings from './strings'

// Styles
const useStyles = makeStyles((theme) => ({
  portalWrapper: {
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '25% 1fr',
      gap: theme.spacing(5),
    },
  },
  accountDetails: {
    gridColumn: '1/2',
  },
  customer: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
  },
  title: {
    padding: theme.spacing(3),
    fontSize: '1.5rem',
    borderBottom: '1px solid #4388A8',
    [theme.breakpoints.up('md')]: {
      gridArea: 'title',
    },
  },
  defaultAddress: {
    padding: theme.spacing(3),
  },
  address: {
    [theme.breakpoints.up('md')]: {
      gridArea: 'address',
    },
  },
  orders: {
    [theme.breakpoints.up('md')]: {
      gridColumn: '2/3',
    },
  },
  logout: {
    display: 'flex',
    alignItems: 'flex-end',
    fontWeight: 600,
    '& a': {
      display: 'inline-block',
    },
    marginTop: theme.spacing(3),
  },
  rewardsLink: {
    display: 'flex',
    alignItems: 'flex-end',
    fontWeight: 600,
    '& a': {
      display: 'inline-block',
    },
    marginTop: theme.spacing(3),
  },
}))

const AccountPortal = (props) => {
  const classes = useStyles()
  const { isResolved: resolvedUpdateCustomerInState, load: updateCustomerInState } =
    SetCustomerInState()
  const { customerToken } = useStoreCheckout()
  const { authenticated } = useLoyaltyLion()

  const handleLogout = (e) => {
    e.preventDefault()
    logout(updateCustomerInState, props.location.origin)
    // if (!authenticated) return
    // setAuthenticated(false)
  }

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     if (window.loyaltylion !== undefined && window.loyaltylion.api.authPacket !== null) {
  //       setLoyaltyAuthenticated(true)
  //     }
  //   }
  // },[])

  // console.log('👾 AccountPortal', props)
  return (
    <Container maxWidth="lg">
      <Box className={classes.portalWrapper}>
        {customerToken &&<Box className={classes.accountDetails}>
          <Box className={classes.customer}>
            <Box className={classes.address}>
              <Typography className={classes.title} component="h1" variant="h2">
                {strings.title}
              </Typography>
              <DefaultAddress styles={classes.defaultAddress} />
            </Box>
          </Box>
          {authenticated && (
            <Box className={classes.rewardsLink}>
              <Button
                component={GatsbyLink}
                aria-label={strings.ariaLogout}
                to="/rewards"
                variant="contained"
                color="primary"
              >
                View my rewards
              </Button>
            </Box>
          )}
          <Box className={classes.logout}>
            <Link href="#logout" aria-label={strings.ariaLogout} onClick={handleLogout}>
              Logout
            </Link>
          </Box>
        </Box>}
        <Box className={classes.orders}>
          {customerToken && <Orders currency={props.currency} />}
        </Box>
      </Box>
    </Container>
  )
}

export default AccountPortal
