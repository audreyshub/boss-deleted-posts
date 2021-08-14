/**
 * Component for showing formatted chosen variants on the cart page and
 * floating cart
 *
 * Props:
 * - format ['box', 'comma', 'slash']
 * - variant [lineItem.variant]
 *
 */

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

// Styles
const useStyles = makeStyles((theme) => ({
  formattedVariants: { gridArea: 'variants' },
  variantBox: {
    backgroundColor: 'lightblue',
    padding: theme.spacing(0.5, 1),
    borderRadius: '4px',
  },
}))

// Variant formats -> commas, slashes, boxes
const formatVariants = (classes, options, format) => {
  const separator = (format, index) => {
    switch (format) {
      case 'comma':
        return (
          <Typography key={`comma-${index}`} component="span">
            ,{' '}
          </Typography>
        )
      case 'slash':
        return (
          <Typography key={`slash-${index}`} component="span">
            {' '}
            /{' '}
          </Typography>
        )
      case 'box':
        return (
          <Typography key={`box-${index}`} component="span">
            {' '}
          </Typography>
        )
      default:
    }
  }

  const formattedVariants = options.map((option, index) => {
    if (format === 'box') {
      return (
        <Box key={index} className={classes.variantBox} component="span">
          {option.value}
        </Box>
      )
    }
    return (
      <Typography key={index} component="span">
        {option.value}
      </Typography>
    )
  })

  let variants = []
  formattedVariants.forEach((item, index) => {
    variants.push(item)
    if (index + 1 < formattedVariants.length) variants.push(separator(format, index))
  })
  return variants
}

const FormattedVariants = (props) => {
  const classes = useStyles()
  const [showVariants, setShowVariants] = useState()
  const [options, setOptions] = useState()
  const { selectedOptions } = props.variant

  useEffect(() => {
    setOptions(selectedOptions)
    setShowVariants(
      selectedOptions.length > 0 &&
        selectedOptions[0].name !== 'Title' &&
        selectedOptions[0].values !== 'Default Title'
    )
  }, [selectedOptions])

  return (
    <>
      {showVariants && (
        <Box className={`${props.styles} ${classes.formattedVariants}`}>
          {formatVariants(classes, options, props.format)}
        </Box>
      )}
    </>
  )
}

export default FormattedVariants

FormattedVariants.propTypes = {}
FormattedVariants.defaultProps = {}
