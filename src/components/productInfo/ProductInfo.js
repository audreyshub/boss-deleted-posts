import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { Link as GatsbyLink } from 'gatsby'

// Components
import ProductRating from '../productRating'
import ProductCounter from '../productCounter'
import ProductVariantPrice from '../productVariant/productVariantPrice'
import ProductVariantSelector from '../productVariant/productVariantSelector'
import ProductVariantAddToCart from '../productVariant/productVariantAddToCart'
import DigitalFreeSample from './DigitalFreeSample'

// Langues
import strings from './strings'

const { productQuantityLabel, vendorLabel, productTypeLabel } = strings

// ========== Styles ==========
const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '1.5rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '2rem',
    },
  },
  rating: {
    justifyContent: 'flex-start !important',
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
  },
  variantPrice: {
    fontSize: '1.5rem',
  },
  divider: {
    margin: theme.spacing(4, 0),
  },
  buildBundleButton: {
    backgroundColor: theme.palette.secondary.light,
  },
  buttonWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    [theme.breakpoints.up('sm')]: {},
    '& > *': {
      width: '100%',
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        width: 'auto',
        marginBottom: theme.spacing(0),
        '&:last-child': {
          marginLeft: theme.spacing(3),
        },
      },
    },
  },
  digitalFreeSample: {
    marginTop: theme.spacing(2),
  },
}))

const ProductInfo = (props) => {
  const classes = useStyles(props)
  const [showQuantitySelector, setShowQuantitySelector] = useState(false)
  const [currentQuantity, setCurrentQuantity] = useState(1)

  const { product } = props.data

  const { title, description, options, variants, reviews, productType } = product

  const { collection } = props.data || {}
  const { fields } = collection || {}

  const { cartUrl } = props.pageContext

  function increaseQuantityHandler() {
    setCurrentQuantity((a) => a + 1)
  }
  function decreaseQuantityHandler() {
    setCurrentQuantity((a) => (a <= 1 ? 1 : a - 1))
  }

  useEffect(() => {
    const productTypeLower = productType.toLowerCase()
    if (!productTypeLower.includes('digital')) {
      setShowQuantitySelector(true)
      return
    }
  }, [])

  // console.log('👾 ProductInfo', props)
  return (
    <Box className={`${props.styles}`}>
      <Typography className={classes.title} variant="h2" component="h1" gutterBottom>
        {title}
      </Typography>

      {reviews && reviews.length > 0 && (
        <ProductRating styles={classes.rating} reviews={reviews} showCount={true} />
      )}

      <ProductVariantPrice styles={classes.variantPrice} initialDisplayPrice={variants[0].price} />
      <Divider className={classes.divider} />
      <ProductVariantSelector
        variants={variants}
        options={options}
        pageContext={props.pageContext}
      />
      {showQuantitySelector && (
        <ProductCounter
          styles={classes.productCounter}
          decreaseQuantity={decreaseQuantityHandler}
          increaseQuantity={increaseQuantityHandler}
          currentQuantity={currentQuantity}
        />
      )}
      <Divider className={classes.divider} />
      <Box className={classes.buttonWrapper}>
        <ProductVariantAddToCart quantity={currentQuantity} cartUrl={cartUrl} />
        <Button
          className={classes.buildBundleButton}
          component={GatsbyLink}
          to="/bundle"
          variant="outlined"
          color="primary"
        >
          Build Bundle
        </Button>
      </Box>

      <DigitalFreeSample styles={classes.digitalFreeSample} product={product} />
    </Box>
  )
}

export default ProductInfo

ProductInfo.propTypes = {
  message: PropTypes.string,
}

ProductInfo.defaultProps = {
  message: 'hi',
}
