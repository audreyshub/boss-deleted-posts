import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import queryString from 'query-string'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

// Components
import ProductPrice from '../productPrice'
import ProductAddToCart from '../productAddToCart'
import { Image } from '../image'

// Utilities
import { getMetafieldValue } from '../../utilities/metafields'

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  productCard: {
    display: 'grid',
    gap: theme.spacing(2),
    gridTemplateRows: 'auto 1fr',
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 8px 32px rgba(0, 77, 112, 0.06)',
    overflow: 'hidden',
  },
  inner: {
    display: 'grid',
    gap: theme.spacing(2),
  },
  image: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  title: {
    lineHeight: 1.4,
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h3,
      lineHeight: 1.4,
    },
  },
  button: {
    width: '100%',
  },
  buttonBundle: {
    backgroundColor: theme.palette.primary.lighter,
  },
}))

const ProductCardOuter = (props) => {
  const { children, shopifyThemePath } = props

  return (
    <Link
      component={GatsbyLink}
      to={`${shopifyThemePath}${
        props.collectionTitle && props.collectionPath
          ? '?' +
            queryString.stringify({
              collection: props.collectionTitle,
              path: props.collectionPath,
            })
          : ''
      }`}
      color="inherit"
      underline="none"
    >
      {children}
    </Link>
  )
}

const ProductCardBundleOuter = (props) => {
  const { children } = props

  return <Box component="span">{children}</Box>
}

const ProductCardLayout = (props) => {
  const assets = useStaticQuery(graphql`
    {
      allFile(filter: { relativeDirectory: { eq: "productCard/assets" } }) {
        nodes {
          childImageSharp {
            gatsbyImageData(width: 352, aspectRatio: 1.3)
          }
        }
      }
    }
  `)

  const classes = useStyles(props)

  const { buttonColor, buttonVariant, type, product, handleAddVariantToBundle } = props

  const { featuredImage, fields, metafields, priceRangeV2, reviews, tags, title, variants } =
    product

  const [selectedVariant, setSelectedVariant] = useState({
    productVariant: variants[0],
    productTitle: title,
  })
  const [variantPrice, setVariantPrice] = useState()
  const [bundleAdded, setBundleAdded] = useState(false)
  const { shopifyThemePath } = fields

  const productImage = featuredImage && featuredImage

  const productMinPrice = parseFloat(priceRangeV2.minVariantPrice.amount, 10)

  useEffect(() => {
    if (variants.length === 0) setVariantPrice(productMinPrice)
    setVariantPrice(selectedVariant.price)
  }, [selectedVariant])

  const handleVariantChange = (e) => {
    setSelectedVariant({
      productVariant: variants.filter((variant) => {
        return e.target.value === variant.title
      })[0],
      productTitle: title,
    })
    // console.log('selected variant', selectedVariant)
  }

  // console.log('PRODUCT CARD LAYOUT', props)
  return (
    <Box className={classes.productCard}>
      <Image
        wrapperClassName={classes.image}
        image={productImage}
        alt={'temp'}
        width={360}
        aspectRatio={1.3}
      />

      <Box className={classes.inner}>
        <Typography className={classes.title} variant="h4" component="h4">
          {title}
        </Typography>
        <Typography variant="h3" component="span">
          <ProductPrice
            amount={type !== 'bundleItem' || variants.length === 1 ? productMinPrice : variantPrice}
          />
        </Typography>

        {type === 'bundleItem' && variants.length > 1 && (
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel className="visuallyHidden" id="product-variants-label">
              Variants
            </InputLabel>
            <Select
              labelId="product-variants-label"
              id="product-variants"
              value={variants[0].title}
              onChange={handleVariantChange}
              label="Variants"
              notched={false}
            >
              {variants.map((variant, i) => {
                return (
                  <MenuItem key={i} value={variant.title} data-index={i}>
                    {variant.title}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        )}

        {type === 'bundleItem' ? (
          <Button
            className={classes.buttonBundle}
            variant="outlined"
            color="primary"
            onClick={() => {
              handleAddVariantToBundle(selectedVariant)
              setBundleAdded(true)
              setTimeout(() => {
                setBundleAdded(false)
              }, 2000)
            }}
          >
            {bundleAdded ? strings.bundleAdded : strings.addToBundle}
          </Button>
        ) : (
          <ProductAddToCart
            styles={classes.button}
            product={product}
            linkComponent="span"
            buttonColor={buttonColor}
            buttonVariant={buttonVariant}
          />
        )}
      </Box>
    </Box>
  )
}

const ProductCard = (props) => {
  const { product, type } = props
  const { fields } = product
  const { shopifyThemePath } = fields

  // console.log('PRODUCT CARD', props)
  return (
    <>
      {type === 'bundleItem' ? (
        <ProductCardBundleOuter>
          <ProductCardLayout {...props} />
        </ProductCardBundleOuter>
      ) : (
        <ProductCardOuter shopifyThemePath={shopifyThemePath}>
          <ProductCardLayout {...props} />
        </ProductCardOuter>
      )}
    </>
  )
}

export default ProductCard

ProductCard.propTypes = {
  id: PropTypes.number,
  link: PropTypes.string,
  image: PropTypes.string,
  title: PropTypes.string,
  price: PropTypes.number,
  buttonColor: PropTypes.string,
  buttonVariant: PropTypes.string,
}

ProductCard.defaultProps = {
  buttonColor: 'primary',
  buttonVariant: 'contained',
}
