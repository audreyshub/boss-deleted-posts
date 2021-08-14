import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { Link as GatsbyLink } from 'gatsby'

// Components
import AddToCart from '../addToCart'

// Utilities
import { useProductHasMultipleVariants, useProductIsAvailable } from '../../hooks/shopifyHooks'

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({}))

const ProductAddToCart = (props) => {
  // console.log('👾 ProductAddToCart', props)
  const classes = useStyles(props)

  const { component, product, showPrice, buttonVariant, buttonColor, styles, linkComponent } = props

  const {
    fields: { shopifyThemePath },
    priceRangeV2: priceRange,
    variants,
  } = product

  const hasMultipleVariants = useProductHasMultipleVariants(variants)
  const isAvailable = useProductIsAvailable(variants)
  const productMinPrice = parseInt(priceRange.minVariantPrice.amount, 10)

  // console.log('👾 ProductAddToCart', props)
  return (
    <>
      {!isAvailable ? (
        <Button className={`${styles}`} variant={buttonVariant} disabled>
          {strings.productUnavailable}
        </Button>
      ) : hasMultipleVariants ? (
        <Button
          className={`${styles}`}
          component={linkComponent === 'link' ? GatsbyLink : 'span'}
          to={linkComponent === 'link' ? shopifyThemePath : null}
          variant={buttonVariant}
          color={buttonColor}
        >
          {strings.viewProduct}
        </Button>
      ) : (
        <AddToCart
          styles={`${styles}`}
          text={strings.addToCart}
          hasVariants={hasMultipleVariants ? true : false}
          storefrontId={variants[0].storefrontId}
          isAvailable
          price={productMinPrice}
          buttonVariant={buttonVariant}
          buttonColor={buttonColor}
          showPrice={showPrice}
          variant={variants[0]}
        />
      )}
    </>
  )
}

export default ProductAddToCart

ProductAddToCart.propTypes = {
  buttonColor: PropTypes.string,
  buttonVariant: PropTypes.string,
  showPrice: PropTypes.bool,
  component: PropTypes.string,
  linkComponent: PropTypes.oneOf(['link', 'span']),
}

ProductAddToCart.defaultProps = {
  buttonColor: 'primary',
  buttonVariant: 'contained',
  showPrice: false,
  component: 'button',
  linkComponent: 'link',
}
