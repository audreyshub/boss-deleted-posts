import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { useDeferredLoads } from 'react-loads'
import ContentLoader from 'react-content-loader'
import { decode, encode } from 'shopify-gid'

// Components
import ProductGridCarousel from '../productGridCarousel'
import ProductCard from '../productCard'

// L18n
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
  productRelatedProducts: {},
}))

const ProductRelatedProducts = (props) => {
  // console.log('👾 ProductRelatedProducts', props)
  const theme = useTheme()
  const classes = useStyles(props)
  const [products, setProducts] = useState()

  const { className, product, ...other } = props

  const getProducts = useCallback(
    (productId) =>
      fetch(`/.netlify/functions/getRecommendedProducts`, {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          limit: 4,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          const products = res.products
          const adjustedProducts = products.map((product) => {
            const fields = { shopifyThemePath: `/products/${product.handle}` }
            const featuredImage = product.featured_image
            const priceRangeV2 = {
              minVariantPrice: {
                amount:
                  product.variants.length === 1
                    ? product.variants[0].price / 100
                    : product.variants.reduce((prev, curr) => {
                        return parseInt(prev.price, 10) < parseInt(curr.price, 10)
                          ? prev.price / 100
                          : curr.price / 100
                      }),
              },
            }
            product.variants = product.variants.map((variant) => {
              return {
                availableForSale: variant.available,
                storefrontId: encode('ProductVariant', variant.id),
                ...variant,
              }
            })
            return {
              fields,
              featuredImage,
              priceRangeV2,
              ...product,
            }
          })

          setProducts(adjustedProducts)
          return Promise.resolve(res)
        })
        .catch((error) => {
          throw new Error(error.message)
        }),
    []
  )

  useEffect(() => {
    const productDecoded = decode(product.storefrontId)
    load(productDecoded.id)
  }, [])

  const { error, isRejected, isPending, isReloading, load } = useDeferredLoads(
    'getProducts',
    getProducts
  )

  // console.log('👾 ProductRelatedProducts', products)
  return (
    <Box
      className={clsx(className, classes.productRelatedProducts, 'productRelatedProducts')}
      {...other}
    >
      {products && (
        <ProductGridCarousel styles={classes.section}>
          {products.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </ProductGridCarousel>
      )}
    </Box>
  )
}

export default ProductRelatedProducts

ProductRelatedProducts.propTypes = {}

//export const query = graphql`
// fragment ProductRelatedProducts on <node type here> {

// }
// `
