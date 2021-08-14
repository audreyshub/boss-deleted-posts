import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Carousel from '../carousel'
import Box from '@material-ui/core/Box'

// Images
import IconArrow from './assets/arrow.inline.svg'

// Styles
const useStyles = makeStyles((theme) => ({
  productGridCarousel: {},
}))

// CMS connect to product handles
const ProductGridCarousel = (props) => {
  const classes = useStyles()

  // console.log('PRODUCT GRID CAROUSEL (component)', props)
  return (
    <Box className={props.styles}>
      <Carousel
        className={classes.productGridCarousel}
        useArrows={true}
        // arrowSvg={IconArrow}
        activateCarouselWidth="1280"
        xsSlideWidth="276px"
        mdSlideWidth="360px"
        lgSlideWidth="400px"
        freeMode={false}
        arrowPaddingFromContainer={45}
        propsByBreakpoint={{
          centeredSlides: { 0: true, 600: false },
          spaceBetween: { 0: 15, 600: 23 },
        }}
      >
        {props.children}
      </Carousel>
    </Box>
  )
}

export default ProductGridCarousel

ProductGridCarousel.propTypes = {
  numberOfProducts: PropTypes.number,
  useArrows: PropTypes.bool,
}

ProductGridCarousel.defaultProps = {
  numberOfProducts: 3,
  useArrows: true,
}
