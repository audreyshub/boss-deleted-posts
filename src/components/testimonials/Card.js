import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gap: theme.spacing(2),
    padding: theme.spacing(4, 3),
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4, 3),
    },
  },
}))

const Card = (props) => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Typography>{props.content}</Typography>
      <Typography variant="h4" component="p">
        {props.name}
      </Typography>
    </Box>
  )
}

export default Card

Card.propTypes = {
  name: PropTypes.string,
  content: PropTypes.string,
}
