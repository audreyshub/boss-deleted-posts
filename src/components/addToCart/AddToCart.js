import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

// Components
import ProductPrice from '../productPrice'

// Icons
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined'

// Context
import { useAddItemToCart } from '../../context/StoreCheckoutContext'

// L18n
import strings from './strings'

// Styles
const useStyles = makeStyles((theme) => ({
  buttonText: {},
}))

const AddToCart = (props) => {
  // console.log('👾 AddToCart', props)
  const classes = useStyles(props)
  const buttonRef = useRef()
  const [added, setAdded] = useState(false)
  const {
    buttonVariant,
    buttonColor,
    isAvailable,
    price,
    quantity,
    showPrice,
    storefrontId,
    styles,
    text,
    variant,
  } = props

  const { load, isPending, isReloading } = useAddItemToCart()

  const addToCart = async (id, quantity, attributes) => {
    try {
      await load(variant, id, quantity, attributes)
      setAdded(true)
      setTimeout(() => {
        setAdded(false)
      }, 2000)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddToCart = (e, id, quantity) => {
    if (buttonRef.current && typeof buttonRef.current.closest('a') !== 'undefined') {
      e.preventDefault()
    }
    const attributes = []
    addToCart(id, quantity, attributes)
  }

  const buttonText = () => {
    if (isPending || isReloading) {
      return (
        <Typography className={classes.buttonText} component="span" variant="inherit">
          <span>{strings.isAdding}</span>
        </Typography>
      )
    } else if (added) {
      return (
        <Typography className={classes.buttonText} component="span" variant="inherit">
          <span>{strings.isAdded}</span>
        </Typography>
      )
    } else {
      return (
        <Typography className={classes.buttonText} component="span" variant="inherit">
          <span>{text}</span>
          {showPrice && ' • '}
          {showPrice && (
            <span>
              <ProductPrice amount={price} />
            </span>
          )}
        </Typography>
      )
    }
  }

  // console.log('👾 AddToCart', props)
  return (
    <>
      {isAvailable ? (
        <Button
          ref={buttonRef}
          className={styles}
          variant={buttonVariant}
          color={buttonColor}
          aria-label={text ? text : strings.addToCart}
          onClick={(e) => handleAddToCart(e, storefrontId, quantity)}
          onKeyDown={(e) => handleAddToCart(e, storefrontId, quantity)}
          startIcon={<ShoppingCartOutlinedIcon />}
        >
          {buttonText()}
        </Button>
      ) : (
        <Button className={styles} variant={buttonVariant} disabled>
          {strings.productUnavailable}
        </Button>
      )}
    </>
  )
}

export default AddToCart

AddToCart.propTypes = {
  buttonColor: PropTypes.string,
  buttonVariant: PropTypes.string,
  showPrice: PropTypes.bool,
  mini: PropTypes.bool,
  quantity: PropTypes.number,
}

AddToCart.defaultProps = {
  buttonColor: 'primary',
  buttonVariant: 'contained',
  showPrice: false,
  mini: false,
  quantity: 1,
}
