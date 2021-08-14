import React, { useEffect, useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import cookie from 'js-cookie'
import { useLoads } from 'react-loads'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import ErrorHandling from '../../error'
import Hidden from '@material-ui/core/Hidden'
import ContentLoader from 'react-content-loader'

// Components
import Order from './order'

// Context
import { useStoreCheckout } from '../../../context/StoreCheckoutContext'

// Strings
import strings from './strings.json'

// Skellys
const Skelly = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={160}
    // viewBox="0 0 400 160"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="45" />
    <rect x="0" y="60" rx="3" ry="3" width="100%" height="15" />
    <rect x="0" y="90" rx="3" ry="3" width="100%" height="15" />
    <rect x="0" y="120" rx="3" ry="3" width="100%" height="15" />
  </ContentLoader>
)

// Styles
const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '1.5rem',
    padding: theme.spacing(3, 0),
  },
  headings: {
    border: 'none !important',
    fontWeight: 600,
  },
  order: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
}))

const Orders = (props) => {
  const classes = useStyles()
  const { customerToken } = useStoreCheckout()
  const [orders, setOrders] = useState([])
  const handleOrders = useCallback(
    (token) =>
      fetch(`/.netlify/functions/orders`, {
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
            if (res.customer.orders.edges) {
              setOrders(res.customer.orders.edges)
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
    'handleOrders',
    handleOrders,
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

  // console.log('ORDERS', props)
  return (
    <>
      <Typography className={classes.title} component="h2" variant="h2">
        {strings.title}
      </Typography>
      <Box>
        {/* <MyLoader /> */}
        {/* {isResolved && <span>Done!</span>} */}
        {isRejected && <ErrorHandling error={error} />}

        {(isPending || isReloading) && <Skelly />}

        {orders.length === 0 ? (
          isResolved && (
            <Typography component="p" variant="body1">
              {strings.noOrders}
            </Typography>
          )
        ) : (
          <Box>
            <Hidden xsDown>
              <Order
                styles={classes.headings}
                headings={true}
                financialStatus={strings.financialStatus}
                fulfillmentStatus={strings.fulfillmentStatus}
                name={strings.name}
                processedAt={strings.processedAt}
                totalPrice={strings.totalPrice}
              />
            </Hidden>
            {orders.map((order) => (
              <Order
                styles={classes.order}
                {...order.node}
                key={order.node.orderNumber}
                currency={props.currency}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  )
}

export default Orders
