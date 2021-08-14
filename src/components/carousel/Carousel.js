/**
 * ============================================================================
 * Carousel -> Has the following features
 *
 * - Can switch between being a carousel and a flexbox grid based on when it needs to
 * - Custom arrows that can exist and be positioned outside of the Swiper component
 * - Custom arrows can be disabled when the Carousel has reached the edge in either direction
 * - Using the `propsByBreakpoint` prop, other props can be assied to specific breakpoints
 * - If the Carousel's children are invalid, placeholder slides are rendered instead
 * - Has a separate grid container for both the Carousl and the arrows (if needed)
 * - All standard Swiper props and other stuff can work if the logic is added here
 *
 * How to use:
 *
 * <Carousel
 *   useArrows={true}
 *   freeMode={false}
 *   propsByBreakpoint={{
 *     centeredSlides: { 0: true, 600: false },
 *     spaceBetween: { 0: 15, 600: 23 },
 *   }}
 * >
 *   {props.children}
 * </Carousel>
 * ============================================================================
 */
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import SwiperCore, { A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Components
import { fallbackSlides, equalizeHeights, breakpointProps, atEdgeHandler } from './functions'
import Arrow from './Arrow'

// Utilities
import toCss from '../../utilities/toCss'

// Styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/scrollbar/scrollbar.scss'
const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: (props) =>
      props.containerMaxWidth ? toCss(props.containerMaxWidth) : theme.breakpoints.values.lg,
    paddingLeft: 0,
    paddingRight: 0,
    position: 'relative',
  },
  // For when the components are not in non-carousel form
  gallery: {
    display: 'flex',
    '& > div': {
      marginRight: '23px',
    },
  },
  // maxWidth container for the arrows if needed
  arrowContainer: {
    maxWidth: (props) =>
      props.containerMaxWidth ? toCss(props.containerMaxWidth) : toCss(props.activateCarouselWidth),
    margin: '0 auto',
  },
  // maxWidth container for the carousel
  carouselContainer: {
    margin: '0 auto',
    '& .swiper-slide': {
      width: (props) => props.xsSlideWidth && toCss(props.xsSlideWidth),
      [theme.breakpoints.up('sm')]: {
        width: (props) => props.smSlideWidth && toCss(props.smSlideWidth),
      },
      [theme.breakpoints.up('md')]: {
        width: (props) => props.mdSlideWidth && toCss(props.mdSlideWidth),
      },
      [theme.breakpoints.up('lg')]: {
        width: (props) => props.lgSlideWidth && toCss(props.lgSlideWidth),
      },
    },
  },
}))

SwiperCore.use([A11y])

const Carousel = (props) => {
  const {
    useArrows,
    children,
    activateCarouselWidth = '1024',
    initialSlide = 0,
    loop = false,
    numberOfSlidesBeforeTriggering = 3,
  } = props
  const theme = useTheme()
  const classes = useStyles(props)
  const [customArrows, setCustomArrows] = useState(false)
  const [atEdge, setAtEdge] = useState({ beginning: true, end: false })
  const [triggerCarousel, setTriggerCarousel] = useState(false)

  // The point at which a grid becomes a carousel when its width exceeds its container
  const isCarouselTriggerWidth = useMediaQuery(
    `(max-width: calc(${toCss(activateCarouselWidth)} + ${parseInt(theme.spacing(8), 10)}px))`
  )

  // Determine the number of slides which will be conmpared to the number (fixed manuallly,
  // based on the design) of slides before it needs to turn into a carousel
  const { slidesArr: fallbackSlidesArr, numberOfSlides: fallbackNumberOfSlides } = fallbackSlides(6)
  const numberOfSlides = children ? children.length : fallbackNumberOfSlides

  // Wrap props.children with SwiperSlide
  const slides = useMemo(() => {
    if (!children) return
    return children.map((child, i) => {
      return <SwiperSlide key={`slide-${i}`}>{child}</SwiperSlide>
    })
  }, [children])

  // Trigger carousel init/destroy based on width of section content
  useEffect(() => {
    if (activateCarouselWidth === '100%') {
      setTriggerCarousel(true)
    } else {
      setTriggerCarousel(isCarouselTriggerWidth)
    }
  }, [isCarouselTriggerWidth])

  // Handle visibility of custom arrows
  const useCustomArrowsHandler = (swiper, destroyed) => {
    if (destroyed) {
      setCustomArrows({ visible: false, swiper: swiper })
    } else {
      setCustomArrows({ visible: true, swiper: swiper })
    }
  }

  // console.log('CAROUSEL', props)
  return (
    <Container className={`${props.styles} ${classes.container}`}>
      <div className={classes.arrowContainer}>
        <div className={classes.carouselContainer}>
          {useArrows && customArrows.visible && (
            <Arrow
              styles={`${classes.arrowLeft}`}
              arrow={props.arrow}
              viewbox={props.arrowViewbox}
              svgComponent={props.arrowSvg ? props.arrowSvg : null}
              direction="left"
              inactive={atEdge.beginning}
              onClick={() => customArrows.swiper.slidePrev()}
            />
          )}
          {triggerCarousel || numberOfSlides > numberOfSlidesBeforeTriggering ? (
            <Swiper
              breakpoints={props.propsByBreakpoint && breakpointProps(props.propsByBreakpoint)}
              centeredSlides={props.centeredSlides !== undefined && props.centeredSlides}
              className={classes.carousel}
              freeMode={props.freeMode !== undefined ? props.freeMode : true}
              initialSlide={props.initialSlide && initialSlide}
              loop={loop}
              navigation={false}
              // onImagesReady={(s) => equalizeHeights(s)}
              onDestroy={(s) => useCustomArrowsHandler(s, true)}
              onSlideChange={(s) => atEdgeHandler(s, setAtEdge)}
              onSwiper={(s) => useCustomArrowsHandler(s, false)}
              preloadImages={true}
              simulateTouch={true}
              slidesPerView={props.slidesPerView ? props.slidesPerView : 'auto'}
              spaceBetween={props.spaceBetween && props.spaceBetween}
              updateOnImagesReady={true}
            >
              {slides ? slides : fallbackSlidesArr}
            </Swiper>
          ) : (
            <div className={classes.gallery}>{children ? slides : fallbackSlidesArr}</div>
          )}
          {useArrows && customArrows.visible && (
            <Arrow
              styles={`${classes.arrowRight}`}
              arrow={props.arrow}
              viewbox={props.arrowViewbox}
              svgComponent={props.arrowSvg ? props.arrowSvg : null}
              direction="right"
              inactive={atEdge.end}
              onClick={() => {
                return customArrows.swiper.slideNext()
              }}
            />
          )}
        </div>
      </div>
    </Container>
  )
}

export default Carousel
