import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { useDeferredLoads } from 'react-loads'
import ContentLoader from 'react-content-loader'
import Typography from '@material-ui/core/Typography'

// Components
import ProductGridCarousel from '../productGridCarousel'
import ProductCard from '../productCard'
import ErrorHandling from '../error'

// API
import { rebuy } from '../../queries/rebuyRest'
import { endpoints } from '../../queries/rebuyEndpoints'
const { PRODUCTS_RECOMMENDED } = endpoints

// L18n
import strings from './strings.json'

// Skellys
// const Skelly = (props) => (
//   <ContentLoader
//     speed={2}
//     width="100%"
//     height={450}
//     // viewBox="0 0 400 160"
//     backgroundColor="#f3f3f3"
//     foregroundColor="#ecebeb"
//     style={{ marginTop: '40px' }}
//     {...props}
//   >
//     <rect x="0" y="4" rx="3" ry="3" width="30%" height="100%" />
//     <rect x="30%" y="4" rx="3" ry="3" width="30%" height="100%" />
//     <rect x="60%" y="4" rx="3" ry="3" width="30%" height="100%" />
//   </ContentLoader>
// )

// Styles
const useStyles = makeStyles((theme) => ({
  rebuyCart: {
    marginTop: theme.spacing(5),
  },
  heading: {
    textAlign: 'center',
  },
}))

const RebuyCart = (props) => {
  // console.log('👾 RebuyCart', props)
  const classes = useStyles(props)
  const [products, setProducts] = useState()

  const { className, lineItemIds, ...other } = props

  const getData = useCallback(async () => {
    const data = rebuy('get', PRODUCTS_RECOMMENDED, {
      shopify_product_ids: lineItemIds,
      limit: 4,
      format: 'pretty',
    })
    data.then((res) => setProducts(res))
  })

  useEffect(() => {
    load()
  }, [])

  const { error, isRejected, isPending, isReloading, load } = useDeferredLoads('getData', getData)

  // console.log('👾 RebuyCart', products)
  return (
    <>
      {products ? (
        <Box className={clsx(className, classes.rebuyCart, 'rebuyCart')} {...other}>
          <Typography className={classes.heading} component="h2" variant="h2" gutterBottom>
            Recommended
          </Typography>
          <ProductGridCarousel>
            {products.map((product, i) => (
              <ProductCard product={product} key={i} buttonVariant="outlined" />
            ))}
          </ProductGridCarousel>
        </Box>
      ) : null}
    </>
  )
}

export default RebuyCart

RebuyCart.propTypes = {}

//export const query = graphql`
// fragment RebuyCart on <node type here> {

// }
// `
