/**
 * ============================================================================
 * Image wrapper for two components
 *
 *  - StaticImage
 *  - ImgixImage
 * ============================================================================
 */

import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

// Light-weight data uri to hold dimensions before lazy loading in -> https://css-tricks.com/preventing-content-reflow-from-lazy-loaded-images/
const getPlaceholderDataUri = (w, h) =>
  `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"%3E%3C/svg%3E`

// Styles
const useStyles = makeStyles((theme) => ({
  imageWrapper: {
    display: 'inline-block',
    overflow: 'hidden',
    position: 'relative',
    '& img': {
      bottom: '0',
      height: '100%',
      left: '0',
      margin: '0',
      maxWidth: 'none',
      padding: '0',
      position: 'absolute',
      right: '0',
      top: '0',
      width: '100%',
      objectFit: (props) => (props.objectFit ? props.objectFit : 'cover'),
      objectPosition: (props) => (props.objectPosition ? props.objectPosition : 'cover'),
    },
  },
}))

const ImageWrapper = (props) => {
  const {
    styles,
    childRef,
    role,
    alt,
    children,
    wrapperClassName,
    width,
    height,
    aspectRatio,
    wrapperStyle,
  } = props

  // If height prop exists, use the height. Otherwise, calculate it from the
  // aspect ratio and the width
  const calculatePlaceholderHeight = () => {
    if (height) return height
    if (aspectRatio) {
      return width / aspectRatio
    }
  }

  const classes = useStyles(props)

  // console.log('IMAGE WRAPPER', calculatePlaceholderHeight())
  return (
    <div
      gs-image-wrapper=""
      className={`${classes.imageWrapper} ${wrapperClassName} imageWrapper`}
      ref={childRef}
      role={role}
      aria-label={alt}
      style={wrapperStyle}
    >
      <div style={{ maxWidth: width, display: 'block' }}>
        <img
          alt=""
          role="presentation"
          aria-hidden="true"
          src={getPlaceholderDataUri(width, calculatePlaceholderHeight())}
          style={{ maxWidth: '100%', display: 'block', position: 'static' }}
        />
      </div>
      {children}
    </div>
  )
}

export default ImageWrapper

ImageWrapper.propTypes = {
  childRef: PropTypes.object,
  styles: PropTypes.string,
  objectFit: PropTypes.string,
  role: PropTypes.string,
  alt: PropTypes.string.isRequired,
}

ImageWrapper.defaultProps = {
  childRef: null,
  objectFit: 'cover',
  role: 'img',
  alt: 'Fallback description',
}
