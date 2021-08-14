import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { graphql, useStaticQuery } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import { GatsbyImage } from 'gatsby-plugin-image'

// Components
import ImageWrapper from './ImageWrapper'

// Hooks
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
// import { getImgixData } from './imgixUrl'

// Check if url is hosted somewhere
// TODO possibly use this instead https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
const urlIsHosted = (url) => {
  return url.includes('http') || url.includes('//cdn')
}

/**
 * ============================================================================
 * Allow the use of Material UI breakpoint functions
 *
 * Example:
 *
 * Normally sizes={`${theme.breakpoints.down('md')} 100vw, 500px`} would become
 * `sizes="@media (max-width:1127.95px) 100vw, 500px"`
 *
 * However wrapper in this function it becomes
 * `sizes="(max-width:1127.95px) 100vw, 500px"`
 * ============================================================================
 */
const formatSizes = (muiMq) => {
  return muiMq.replace('@media ', '')
}

/**
 * ============================================================================
 * Standard Image -
 *
 * To be used for local imported files. No lazy loading, thumbs, or srcset.
 * ============================================================================
 */

// Styles
const useStandardImageStyles = makeStyles((theme) => ({
  img: {},
}))

export const StandardImage = (props) => {
  const classes = useStandardImageStyles(props)

  const {
    alt,
    aspectRatio,
    height,
    imgClassName,
    imgStyle,
    wrapperClassName,
    objectFit,
    objectPosition,
    role,
    src,
    styles,
    width,
    wrapperStyle,
  } = props

  // console.log('STANDARD IMAGE', props)
  return (
    <ImageWrapper
      alt={alt}
      aspectRatio={aspectRatio}
      height={height}
      objectFit={objectFit}
      objectPosition={objectPosition}
      role={role}
      wrapperClassName={wrapperClassName}
      wrapperStyle={wrapperStyle}
      styles={`${styles}`}
      width={width}
    >
      <img
        alt={role === 'presentation' ? '' : alt}
        className={`${classes.img} ${imgClassName} standardImage`}
        draggable="false"
        height={height}
        src={src}
        width={width}
        style={imgStyle}
      />
    </ImageWrapper>
  )
}

StandardImage.propTypes = {
  styles: PropTypes.string,
  src: PropTypes.string,
  image: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  alt: PropTypes.string.isRequired,
  role: PropTypes.string,
}

StandardImage.defaultProps = {
  alt: 'Fallback description',
  role: 'img',
}

/**
 * ============================================================================
 * Imgix Image
 * ============================================================================
 */

// Styles
const useImgixImageStyles = makeStyles((theme) => ({
  full: {
    transition: 'opacity 400ms ease 0ms',
  },
  thumb: {
    filter: 'blur(20px)',
    transform: 'scale(1.1)',
    transition: 'visibility 0ms ease 400ms',
  },
}))

const ImgixImage = (props) => {
  const classes = useImgixImageStyles(props)
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [imgixData, setImgixData] = useState()

  const {
    alt,
    aspectRatio,
    height,
    imgClassName,
    wrapperClassName,
    imgStyle,
    wrapperStyle,
    objectFit,
    objectPosition,
    role,
    src,
    styles,
    width,
    sizes,
  } = props

  // https://bit.ly/3czhwau
  useIntersectionObserver({
    target: ref,
    onIntersect: ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        setIsVisible(true)
        observerElement.unobserve(ref.current)
      }
    },
  })

  // Canceling a promise to avoid the "unmounted component" error (https://bit.ly/3gQ2XBW)
  useEffect(() => {
    let isSubscribed = true
    const imageData = getImgixData(src)
    imageData.then((res) => {
      if (isSubscribed) {
        setImgixData(res)
      }
    })
    return () => {
      isSubscribed = false
    }
  }, [src])

  // console.log('IMGIX IMAGE', imgixData ? imgixData : null)
  return (
    <ImageWrapper
      wrapperClassName={`${styles} ${wrapperClassName} imageWrapper`}
      childRef={ref}
      objectFit={objectFit}
      objectPosition={objectPosition}
      alt={alt}
      width={width}
      height={height}
      wrapperStyle={wrapperStyle}
      aspectRatio={aspectRatio ? aspectRatio : imgixData ? imgixData.aspectRatio : null}
    >
      {imgixData && isVisible && (
        <>
          <img
            className={`${imgClassName} image`}
            src={imgixData.placeholderSrc}
            alt=""
            style={({ visibility: isLoaded ? 'hidden' : 'visible' }, imgStyle)}
            width={width}
            height={imgixData.aspectRatio ? 100 / imgixData.aspectRatio : 'auto'}
          />
          <img
            className={`${classes.full} ${imgClassName}`}
            src={imgixData.src}
            srcSet={imgixData.srcset}
            width={width}
            height={height}
            alt={role === 'presentation' ? '' : alt}
            sizes={formatSizes(sizes)}
            style={{ opacity: isLoaded ? 1 : 0 }}
            role={role}
            draggable="false"
            onLoad={() => {
              setIsLoaded(true)
            }}
          />
        </>
      )}
    </ImageWrapper>
  )
}

ImgixImage.propTypes = {
  styles: PropTypes.string,
  src: PropTypes.string,
  image: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  alt: PropTypes.string.isRequired,
  role: PropTypes.string,
  sizes: PropTypes.string.isRequired,
}

ImgixImage.defaultProps = {
  alt: 'Fallback description',
  role: 'img',
  sizes: '100vw',
}

/**
 * ==================================================================
 * Image
 *
 * Returns <ImgixImage>, <StandardImage>, or <GatsbyImage>
 * ==================================================================
 */

const getDataSource = (image) => {
  if (typeof image.imgixImage !== 'undefined') {
    return image.imgixImage.gatsbyImageData
  }
  if (typeof image.localFile !== 'undefined') {
    return image.localFile.childImageSharp.gatsbyImageData
  }
  if (typeof image.imgixImage === 'undefined' && typeof image.localFile === 'undefined') {
    return image
  }
  throw new Error('Image object does not contain gatsbyImageData')
}

const getImageSource = (src, image) => {
  if (typeof image !== 'undefined') {
    return getDataSource(image)
  }
  if (typeof src !== 'undefined') {
    return src
  }
  throw new Error('image or src is required in Image component')
}

const getImageType = (source) => {
  if (typeof source !== 'string') return 'gatsbyImage'
  // if (typeof source === 'string' && urlIsHosted(source)) return 'imgix'
  return 'standard'
}

export const Image = (props) => {
  // TODO get this imgix toggle in without using a hook
  // const data = useStaticQuery(graphql`
  //   {
  //     site {
  //       siteMetadata {
  //         gsConfig {
  //           useImgix
  //         }
  //       }
  //     }
  //   }
  // `)

  const {
    aspectRatio,
    src,
    image,
    alt,
    gBackgroundColor,
    gLoading,
    gAs,
    imgClassName,
    wrapperClassName,
    wrapperStyle,
    imgStyle,
    objectFit,
    objectPosition,
    role,
    width,
    height,
    styles,
    sizes,
  } = props
  const imageSource = getImageSource(src, image)
  const imageType = getImageType(imageSource)

  const commonProps = {}

  // console.log('IMAGE', imageSource)
  return (
    <>
      {imageType === 'gatsbyImage' && (
        <GatsbyImage
          image={imageSource}
          style={wrapperStyle}
          imgStyle={imgStyle}
          className={`${wrapperClassName} imageWrapper`}
          imgClassName={`${imgClassName} image`}
          backgroundColor={gBackgroundColor}
          loading={gLoading}
          as={gAs}
          objectFit={objectFit}
          objectPosition={objectPosition}
          alt={role === 'presentation' ? '' : alt ? alt : 'Fallback description of image'}
          draggable="false"
        />
      )}
      {imageType === 'imgix' && (
        <ImgixImage
          aspectRatio={aspectRatio}
          src={imageSource}
          styles={styles}
          width={width}
          height={height}
          imgStyle={imgStyle}
          wrapperClassName={wrapperClassName}
          wrapperStyle={wrapperStyle}
          imgClassName={imgClassName}
          objectFit={objectFit}
          objectPosition={objectPosition}
          alt={role === 'presentation' ? '' : alt ? alt : 'Fallback description of image'}
          role={role}
          sizes={sizes}
        />
      )}
      {imageType === 'standard' && (
        <StandardImage
          aspectRatio={aspectRatio}
          src={imageSource}
          styles={styles}
          width={width}
          height={height}
          imgClassName={imgClassName}
          imgStyle={imgStyle}
          wrapperClassName={wrapperClassName}
          wrapperStyle={wrapperStyle}
          objectFit={objectFit}
          objectPosition={objectPosition}
          alt={role === 'presentation' ? '' : alt ? alt : 'Fallback description of image'}
          role={role}
        />
      )}
    </>
  )
}

Image.propTypes = {
  alt: PropTypes.string,
  aspectRatio: PropTypes.number,
  gAs: PropTypes.string, // GatsbyImage only -> The HTML element used for the outer wrapper.
  gBackgroundColor: PropTypes.string, // GatsbyImage only -> Background color applied to the wrapper.
  gLoading: PropTypes.oneOf(['eager', 'lazy']), // GatsbyImage only -> Loading behavior for the image. You should set this to "eager" for above-the-fold images to ensure they start loading before React hydration.
  imgClassName: PropTypes.string, // All images -> CSS class applied to the <img> element.
  wrapperClassName: PropTypes.string, // All images -> CSS class applied to the outer wrapper.
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  objectPosition: PropTypes.string, // Guide (https://bit.ly/3pFzXQ6)
  width: PropTypes.number,
  height: PropTypes.number,
  role: PropTypes.oneOf(['img', 'presentation']),
  sizes: PropTypes.string,
  imgStyle: PropTypes.object, // All images -> Inline styles applied to the <img> element.
  wrapperStyle: PropTypes.object, // All images -> Inline styles applied to the outer wrapper.
  objectFit: PropTypes.string,
  sizes: PropTypes.string,
  src: (props, propName, componentName) => {
    if (props.src && props.image)
      return new Error(
        `Either src or image must be pass as a prop to ${componentName}, but not both`
      )
    if (!props.src && !props.image)
      return new Error(`Either src or image must be pass as a prop to ${componentName}`)
    if (!props.image && typeof props[propName] !== 'string')
      return new Error(
        `Hey, you should pass a string for ${propName} in ${componentName} but you passed a ${typeof props[
          propName
        ]} ya dummy`
      )
  },
  image: (props, propName, componentName) => {
    if (!props.src && !props.image)
      return new Error(`Either src or image must be pass as a prop to ${componentName}`)
    if (!props.src && typeof props[propName] !== 'string' && typeof props[propName] !== 'object')
      return new Error(
        `Hey, you should pass a string or an object for ${propName} in ${componentName} but you passed a ${typeof props[
          propName
        ]} ya dummy`
      )
  },
}

Image.defaultProps = {
  aspectRatio: null,
  gAs: 'div',
  imgStyle: {},
  wrapperStyle: {},
  gBackgroundColor: 'transparent',
  gLoading: 'lazy',
  imgClassName: '',
  wrapperClassName: '',
  objectFit: 'cover',
  objectPosition: '50% 50%',
  width: null,
  height: null,
  role: 'img',
  sizes: '100vw',
  alt: 'Fallback description of image',
  role: 'img',
}
