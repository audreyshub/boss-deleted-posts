import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useStaticQuery, graphql } from 'gatsby'
import Box from '@material-ui/core/Box'

// Components
import ProductPrice from '../../productPrice'

// Context
import { useCurrentVariantContext } from '../../../context/CurrentVariantContext'
import strings from './strings.json'

// ========== Styles ==========
const useStyles = makeStyles((theme) => ({
  price: {
    marginBottom: '1rem',
    fontWeight: 700,
  },
  compareAtPrice: {
    color: theme.palette.grey[500],
    fontWeight: 600,
    '& > span': {
      textDecoration: 'line-through',
    },
  },
}))

const ProductVariantPrice = (props) => {
  const classes = useStyles()
  const { initialDisplayPrice = 0 } = props
  const { currentVariant } = useCurrentVariantContext()
  const [displayPrice, setDisplayPrice] = useState(<ProductPrice amount={initialDisplayPrice} />)
  const [compareAtPrice, setCompareAtPrice] = useState()

  // ========== Logic ==========
  useEffect(() => {
    if (currentVariant && currentVariant.hasOwnProperty('price')) {
      currentVariant.price
        ? setDisplayPrice(<ProductPrice amount={currentVariant.price} />)
        : setDisplayPrice(<ProductPrice amount={initialDisplayPrice} />)

      currentVariant.compareAtPrice
        ? setCompareAtPrice(<ProductPrice amount={currentVariant.compareAtPrice} />)
        : setCompareAtPrice(false)
    }
  }, [currentVariant, initialDisplayPrice])

  // console.log('PRODUCT VARIANT PRICE (component)', compareAtPrice)
  return (
    <Box className={props.styles}>
      <Box component="span" className={classes.price}>
        {strings.productPriceLabel}: {displayPrice}
      </Box>
      {currentVariant && currentVariant.compareAtPrice > 0 && (
        <Box component="span" ml={1} className={classes.compareAtPrice}>
          <span>{compareAtPrice}</span>
        </Box>
      )}
    </Box>
  )
}

export default ProductVariantPrice
