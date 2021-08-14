import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import CurrencyFormat from 'react-currency-format'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: theme.palette.primary.light,
    borderRadius: '16px',
    color: theme.palette.primary.main,
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h2,
      marginBottom: theme.spacing(3),
    },
  },

  amount: {
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h1,
    },
  },
}))

const CharityCallout = (props) => {
  const classes = useStyles(props)

  return (
    <Box className={`${props.styles} ${classes.root}`}>
      <Typography className={classes.title} variant="h4" component="h4">
        {props.title}
      </Typography>
      <Typography className={classes.amount} variant="h2" component="p">
        <CurrencyFormat value={props.amount} displayType="text" thousandSeparator={true} prefix="$" />
      </Typography>
    </Box>
  )
}

export default CharityCallout

CharityCallout.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
}
