import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

// Styles
const useStyles = makeStyles((theme) => ({
  labelImage: {
    display: 'inline-block',
    backgroundColor: theme.palette.error.main,
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  error: {
    color: theme.palette.error.main,
    fontSize: '.6rem',
    lineHeight: 1,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
}))

const ErrorHandling = (props) => {
  // console.log('👾 ErrorHandling > ', props)

  const { error, position = 'left', styles, bullet = true, uppercase = true } = props
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Box className={props.styles}>
      {position === 'left' && bullet === true && (
        <Typography className={classes.labelImage} component="span" aria-label="error"></Typography>
      )}
      <Typography
        style={
          position === 'left' && bullet === true
            ? { marginLeft: theme.spacing(0.5) }
            : { marginRight: theme.spacing(0.5) }
        }
        className={`${classes.error} ${uppercase ? classes.uppercase : null}`}
        component="span"
      >
        {error}
      </Typography>
      {position === 'right' && bullet === true && (
        <Typography className={classes.labelImage} component="span" aria-label="error"></Typography>
      )}
    </Box>
  )
}

export default ErrorHandling
