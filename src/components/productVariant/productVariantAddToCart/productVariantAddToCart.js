import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

// Components
import AddToCart from '../../addToCart'

// Context
import { useCurrentVariantContext } from '../../../context/CurrentVariantContext'

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  productVariantAddToCart: {},
}))

const ProductVariantAddToCart = (props) => {
  const classes = useStyles(props)
  const { currentVariant } = useCurrentVariantContext()
  const [isAvailable, setIsAvailable] = useState(true)

  const { quantity, styles } = props

  useEffect(() => {
    if (currentVariant && currentVariant.hasOwnProperty('availableForSale')) {
      currentVariant.availableForSale ? setIsAvailable(true) : setIsAvailable(false)
    }
    return function cleanup() {
      setIsAvailable(false)
    }
  }, [currentVariant])

  // console.log('PRODUCT VARIANT ADD TO CART', currentVariant)
  return (
    <AddToCart
      styles={`${styles} ${classes.productVariantAddToCart}`}
      text={strings.addToCart}
      storefrontId={currentVariant && currentVariant.storefrontId}
      isAvailable={isAvailable}
      quantity={quantity}
      price={currentVariant && currentVariant.price}
      variant={currentVariant && currentVariant}
    />
  )
}

export default ProductVariantAddToCart
