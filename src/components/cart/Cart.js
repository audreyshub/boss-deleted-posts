import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import SvgIcon from '@material-ui/core/SvgIcon'
import Hidden from '@material-ui/core/Hidden'
import ContentLoader from 'react-content-loader'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import { Link as GatsbyLink, navigate } from 'gatsby'
import Link from '@material-ui/core/Link'
// import { Multipass } from 'multipass-js'

// Icons
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined'

// Components
import LineItem from '../lineItem'
import ProductPrice from '../productPrice'
// import FreeShippingCalculator from '../freeShippingCalculator'

// Context
import {
  useStoreCheckout,
  useToggleCart,
  useCartItems,
  useCartTotals,
  useCartCount,
  useCheckoutUrl,
} from '../../context/StoreCheckoutContext'

// Language
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
  drawer: {
    '& .MuiDrawer-paper': {
      width: 'clamp(320px, 100%, 480px)',
      height: '100vh',
      padding: theme.spacing(3, 0),
    },
  },
  count: {
    ...theme.typography.body3,
    paddingLeft: theme.spacing(1),
    position: 'relative',
    marginRight: theme.spacing(3),
  },
  number: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translate(110%, -50%)',
  },
  icon: {
    width: 'auto',
  },
  closeIcon: {
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 5.5, 3),
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
  },
  title: {
    textTransform: 'Capitalize',
  },
  emptyCart: {
    marginTop: theme.spacing(2),
  },
  lineItem: {
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    },
  },
  footer: {
    padding: theme.spacing(0, 3),
  },
  subtotalWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    padding: theme.spacing(3, 0),
    marginBottom: theme.spacing(3),
    '&$noTopBorder': {
      borderTop: 'none',
    },
  },
  noTopBorder: {},
  subtotalBeforeDiscount: {
    textDecoration: 'line-through',
    color: theme.palette.grey[500],
  },
  discountWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: `1px solid ${theme.palette.grey[200]}`,
    paddingTop: theme.spacing(3),
  },
  subtotalLabel: {
    fontWeight: 600,
  },
  discountLabel: {
    fontWeight: 600,
  },
  subtotal: {
    fontWeight: 600,
  },
  discount: {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  freeShippingCalculator: {
    paddingBottom: theme.spacing(2),
  },
  button: {
    cursor: (props) => (props.path.includes('/cart') ? 'default' : 'pointer'),
  },
  overline: {
    textTransform: 'capitalize',
    fontStyle: 'italic',
    textAlign: 'center',
    display: 'block',
  },
  footerButton: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}))

const Cart = (props) => {
  const classes = useStyles(props)
  let { cartIsOpen } = useStoreCheckout()
  const lineItems = useCartItems()
  const { total: subtotal, subtotalBeforeDiscount } = useCartTotals()
  const checkoutUrl = useCheckoutUrl()
  const { toggleCart, closeCart } = useToggleCart()
  const cartCount = useCartCount()
  const [hasCheckout, setHasCheckout] = useState(null)
  const [discount, setDiscount] = useState()

  const handleToggleCart = (e) => {
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return
    }
    toggleCart()
  }

  const handleNavigateToCartPage = (e) => {
    e.preventDefault()
    closeCart()
    navigate('/cart')
  }

  const handleCheckoutLink = () => {
    if (!hasCheckout) return
    if (!checkoutUrl) return
    closeCart()
    window.location.href = checkoutUrl
  }

  useEffect(() => {
    setHasCheckout(lineItems ? true : false)
    if (subtotalBeforeDiscount - subtotal > 0) {
      setDiscount(subtotalBeforeDiscount - subtotal)
    }
  }, [lineItems])

  // useEffect(() => {
  //   const multipass = new Multipass(process.env.GATSBY_SHOPIFY_STORE_MULTIPASS_SECRET)
  //   const customerData = {
  //     email: 'rmarlow04@gmail.com',
  //   }
  //   const url = multipass
  //     .withCustomerData(customerData)
  //     .withDomain('boss-personal-planner.shopify.com')
  //     // .withRedirect("checkout")
  //     .url()
  // }, [])

  // console.log('👾 Cart multipass url', url)
  return (
    <>
      <IconButton
        className={classes.root}
        color="inherit"
        aria-label={strings.cartTitle}
        role="button"
        onClick={!props.path.includes('/cart') ? (e) => handleToggleCart(e) : null}
      >
        <Badge color="primary" badgeContent={cartCount ? cartCount : null}>
          <ShoppingCartOutlinedIcon />
        </Badge>
      </IconButton>
      <Drawer
        className={classes.drawer}
        anchor="right"
        open={cartIsOpen}
        onClose={(e) => handleToggleCart(e)}
      >
        <Box className={classes.header}>
          <Typography className={classes.title} variant="h3">
            {strings.cartTitle}
          </Typography>
          <CloseIcon className={classes.closeIcon} onClick={(e) => handleToggleCart(e)} />
        </Box>
        <Box className={classes.cart}>
          {hasCheckout ? (
            !lineItems.length > 0 ? (
              <Typography className={classes.emptyCart} variant="body1">
                {strings.emptyCart}
              </Typography>
            ) : (
              lineItems.map((lineItem, i) => (
                <LineItem
                  styles={classes.lineItem}
                  key={`${lineItem.id}-${i}`}
                  lineItem={lineItem}
                  location="floatingCart"
                />
              ))
            )
          ) : (
            <Skelly />
          )}
        </Box>

        {hasCheckout && lineItems.length > 0 && (
          <Box className={classes.footer}>
            {discount && (
              <Box className={classes.discountWrapper}>
                <Typography className={classes.discountLabel} variant="body1" component="span">
                  {strings.cartDiscountLabel}
                </Typography>
                <Typography className={classes.discount} variant="body1" component="span">
                  -(
                  <ProductPrice amount={discount} />)
                </Typography>
              </Box>
            )}
            <Box className={`${classes.subtotalWrapper} ${discount && classes.noTopBorder}`}>
              <Typography className={`${classes.subtotalLabel}`} variant="body1" component="span">
                {strings.cartSubtotalLabel}
              </Typography>
              <Typography className={classes.subtotal} variant="body1" component="span">
                <ProductPrice amount={subtotal} />
                {discount && (
                  <>
                    {' '}
                    <ProductPrice
                      styles={classes.subtotalBeforeDiscount}
                      amount={subtotalBeforeDiscount}
                    />
                  </>
                )}
              </Typography>
            </Box>
            {/* <FreeShippingCalculator styles={classes.freeShippingCalculator} subtotal={subtotal} /> */}
            <Typography className={classes.overline} variant="overline">
              {strings.checkoutStrapline}
            </Typography>
            <Button
              className={classes.footerButton}
              component={GatsbyLink}
              to="/cart"
              variant="outlined"
              color="secondary"
              onClick={handleNavigateToCartPage}
            >
              {strings.viewCartButton}
            </Button>
            <Button
              className={classes.footerButton}
              variant="contained"
              color="primary"
              style={{ opacity: hasCheckout ? 1 : 0.7 }}
              disabled={hasCheckout ? false : true}
              onClick={handleCheckoutLink}
            >
              {strings.cartCheckoutButton}
            </Button>
          </Box>
        )}
      </Drawer>
    </>
  )
}

export default React.memo(Cart)

Cart.propTypes = {}
Cart.defaultProps = {}
