import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

const FreeShippingCalculator = (props) => {
  const { subtotal } = props
  const freeShippingTarget = 500 // CMS

  return (
    <Typography className={props.styles} variant="body1">
      {parseInt(subtotal, 0) <= freeShippingTarget
        ? `You're ${(freeShippingTarget - parseFloat(subtotal)).toFixed(
            2
          )} away from free shipping!`
        : `Your order qualifies for Free Shipping!`}
    </Typography>
  )
}

export default FreeShippingCalculator

FreeShippingCalculator.propTypes = {}
FreeShippingCalculator.defaultProps = {}
