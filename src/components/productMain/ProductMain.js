import React from 'react'
import PropTypes from 'prop-types'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'

// Components
import ProductCarousel from '../productCarousel'
import ProductInfo from '../productInfo'

// Context
import { CurrentVariantContextProvider } from '../../context/CurrentVariantContext'

// Styles
const useStyles = makeStyles((theme) => ({
  productMain: {
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      alignItems: 'start',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      gridGap: theme.spacing(5),
    },
  },
  productCarousel: {
    width: '660px',
    maxWidth: '100%',
    margin: '0 auto',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(0),
    },
  },
  productInfo: {
    marginTop: 0,
  },
}))

const ProductMain = (props) => {
  const classes = useStyles(props)
  const {
    data: {
      product: { images },
    },
    styles,
  } = props

  // console.log('PRODUCT MAIN (component)', props)
  return (
    <Container className={`${styles} ${classes.productMain}`} maxWidth="lg">
      <CurrentVariantContextProvider>
        <ProductCarousel styles={classes.productCarousel} images={images} />
        <ProductInfo {...props} styles={classes.productInfo} />
      </CurrentVariantContextProvider>
    </Container>
  )
}

export default ProductMain

ProductMain.propTypes = {}
ProductMain.defaultProps = {}
