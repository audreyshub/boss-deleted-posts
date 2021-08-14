import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

// Constants - payment/fulfillment status
import {
  FULFILLED,
  IN_PROGRESS,
  OPEN,
  PARTIALLY_FULFILLED,
  PENDING_FULFILLMENT,
  RESTOCKED,
  SCHEDULED,
  UNFULFILLED,
  AUTHORIZED,
  PAID,
  PARTIALLY_PAID,
  PARTIALLY_REFUNDED,
  PENDING,
  REFUNDED,
  VOIDED,
} from './constants'

// Styles
const useStyles = makeStyles((theme) => ({
  statusWrapper: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
    gridGap: theme.spacing(1),
  },
  circle: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transform: 'translateY(1px)',
  },
  status: {
    textTransform: 'capitalize',
  },
}))

const Status = (props) => {
  const { status } = props
  const theme = useTheme()
  const classes = useStyles(props)
  let color

  switch (status) {
    case PENDING:
    case IN_PROGRESS:
    case OPEN:
    case PARTIALLY_FULFILLED:
    case PENDING_FULFILLMENT:
    case SCHEDULED:
    case AUTHORIZED:
    case PARTIALLY_PAID:
      color = theme.palette.pending.main
      break
    case REFUNDED:
    case UNFULFILLED:
    case RESTOCKED:
    case PARTIALLY_REFUNDED:
    case VOIDED:
      color = theme.palette.error.main
      break
    case PAID:
    case FULFILLED:
      color = theme.palette.primary.main
      break
    default:
      break
  }

  const formatText = (text) => {
    return text.replace('_', ' ').toLowerCase()
  }

  // console.log('PAYMENT/FULFILLMENT STATUS (component)', color)
  return (
    <Box className={classes.statusWrapper}>
      <Box className={classes.circle} style={{ backgroundColor: color }}></Box>
      <Typography className={classes.status} variant="body1">
        {formatText(status)}
      </Typography>
    </Box>
  )
}

export default Status

Status.propTypes = {}
Status.defaultProps = {}
