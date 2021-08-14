import React from 'react'
import PropTypes from 'prop-types'
import { SwiperSlide } from 'swiper/react'

// Fallback slides in case of invalid children
export const fallbackSlides = (numberOfSlides, slideWidth = 350, slideHeight = 450) => {
  const slidesArr = []
  for (let i = 0; i < numberOfSlides; i += 1) {
    slidesArr.push(
      <SwiperSlide style={{ borderRadius: '8px', overflow: 'hidden' }} key={`slide-${i}`}>
        <img
          src={`https://fakeimg.pl/${slideWidth}x${slideHeight}/?text=Placeholder%0AImage&font=lobster&font_size=32`}
          style={{ borderRadius: '1rem' }}
          alt={`Placeholder slide ${i}`}
          key={i}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </SwiperSlide>
    )
  }
  return { slidesArr, numberOfSlides }
}

// Make all slide elements the same height
export const equalizeHeights = (s) => {
  let maxHeight = 0
  s.slides.forEach((slide) => {
    if (slide.offsetHeight > maxHeight) {
      maxHeight = slide.offsetHeight
    }
  })
  s.slides.forEach((slide) => {
    slide.style.height = `${maxHeight}px`
  })
}

/**
 * ============================================================================
 * Breakpoint-based props
 *
 * Example:
 *
 * breakpointsByProp={{
 *   centeredSlides: { 0: true, 600: false },
 *   spaceBetween: { 0: 15, 600: 23 },
 * }}
 * ============================================================================
 */
export const breakpointProps = (object) => {
  if (!object) return
  const breakpointProps = object
    ? Object.entries(object).reduce((acc, [innerKey, obj]) => {
        Object.entries(obj).forEach(([outerKey, val]) => {
          acc[outerKey] = acc[outerKey] || {} // grab the object already stored at the `outerKey` or create a new one.
          acc[outerKey][innerKey] = val
        })
        return acc
      }, {})
    : {}
  return breakpointProps
}

/**
 * ============================================================================
 * Carousel "at edge" detector for adding disabled styling to arrows
 *  when the carousel has reached the edge.
 *
 * Example:
 *
 * // Control state in Carousel component
 * const [atEdge, setAtEdge] = useState({ beginning: true, end: false })
 *
 * <Swiper onSlideChange={(s) => atEdgeHandler(s)}>
 *   {slides}
 * </Swiper>
 *
 * <Arrow inactive={atEdge.end && classes.disabled} />
 * ============================================================================
 */
export const atEdgeHandler = (swiper, setAtEdge) => {
  if (swiper.isBeginning) {
    setAtEdge({ beginning: true, end: false })
  } else if (swiper.isEnd) {
    setAtEdge({ beginning: false, end: true })
  } else {
    setAtEdge({ beginning: false, end: false })
  }
}
