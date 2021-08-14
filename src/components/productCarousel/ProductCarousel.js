import React, { useMemo, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import SwiperCore, { Thumbs, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import Box from '@material-ui/core/Box'

// Components
import { Image } from '../image'

// Context
import { useCurrentVariantContext } from '../../context/CurrentVariantContext'

// Styles
import 'swiper/swiper.scss'
import 'swiper/components/a11y/a11y.scss'
import 'swiper/components/thumbs/thumbs.scss'
const useStyles = makeStyles((theme) => ({
  carouselWrapper: {},
  mainCarousel: {
    width: '100%',
    // '& .swiper-slide': { width: '100%' },
  },
  thumbsCarousel: {
    marginTop: theme.spacing(1),
  },
  swiperSlide: {},
  slideImage: {
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    height: '100%',
  },
}))

SwiperCore.use([Thumbs, A11y])

const ProductCarousel = (props) => {
  const classes = useStyles(props)
  const theme = useTheme()
  const swiperRef = useRef(null)
  const { currentVariant } = useCurrentVariantContext()
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  const { images } = props

  const slides = useMemo(() => {
    if (!images) return
    return images.map((image, i) => {
      const { altText } = image

      return (
        <SwiperSlide className={classes.swiperSlide} key={`slide-${i}`} image-id={image.shopifyId}>
          <Image
            wrapperClassName={classes.slideImage}
            image={image}
            alt={altText ? altText : 'Product image'}
          />
        </SwiperSlide>
      )
    })
  }, [images])

  useEffect(() => {
    if (!currentVariant || !currentVariant.image) return
    const currentVariantImageId = currentVariant.image.id
    const slides = swiperRef.current.children[0].children
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].getAttribute('image-id') === currentVariantImageId) {
        swiperRef.current.swiper.slideTo(i)
        break
      }
    }
  }, [currentVariant])

  // console.log('PRODUCT CAROUSEL (component)', currentVariant)
  return (
    <Box className={`${props.styles} ${classes.carouselWrapper}`}>
      <Swiper
        ref={swiperRef}
        thumbs={{ swiper: thumbsSwiper }}
        // breakpoints={props.propsByBreakpoint && breakpointProps(props.propsByBreakpoint)}
        // centeredSlides={props.centeredSlides !== undefined && props.centeredSlides}
        className={classes.mainCarousel}
        // freeMode={props.freeMode !== undefined ? props.freeMode : true}
        // initialSlide={props.initialSlide && initialSlide}
        // loop={loop}
        navigation={false}
        slidesPerView={1}
        // onImagesReady={(s) => equalizeHeights(s)}
        // onDestroy={(s) => useCustomArrowsHandler(s, true)}
        // onSlideChange={(s) => atEdgeHandler(s, setAtEdge)}
        // onSwiper={(s) => useCustomArrowsHandler(s, false)}
        preloadImages={true}
        simulateTouch={true}
        updateOnImagesReady={true}
        updateOnWindowResize={true}
      >
        {slides}
      </Swiper>
      <Swiper
        className={classes.thumbsCarousel}
        onSwiper={setThumbsSwiper}
        slidesPerView={5}
        spaceBetween={8}
        watchSlidesVisibility
        watchSlidesProgress
        breakpoints={{
          960: {
            slidesPerView: 7,
          },
        }}
      >
        {slides}
      </Swiper>
    </Box>
  )
}

export default ProductCarousel

ProductCarousel.propTypes = {}
ProductCarousel.defaultProps = {}
