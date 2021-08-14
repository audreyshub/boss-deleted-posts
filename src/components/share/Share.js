import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

// Icons
import PinterestIcon from '@material-ui/icons/Pinterest'
import TwitterIcon from '@material-ui/icons/Twitter'
import FacebookIcon from '@material-ui/icons/Facebook'

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
		gap: theme.spacing(2),
		paddingTop: theme.spacing(4),
  },
  inner: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  button: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}))

const Share = (props) => {
  const classes = useStyles()

  return (
    <Box className={`${props.styles} ${classes.root}`}>
      <Typography variant="h4" component="p">
        {strings.title}
      </Typography>
      <Box className={classes.inner}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          href={`https://pinterest.com/pin/create/button/?url=${props.link}&media=&description=`}
        >
          <PinterestIcon />
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          href={`https://twitter.com/intent/tweet?url=${props.link}&text=`}
        >
          <TwitterIcon />
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          href={`https://www.facebook.com/sharer/sharer.php?u=${props.link}`}
        >
          <FacebookIcon />
        </Button>
      </Box>
    </Box>
  )
}

export default Share

Share.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
}
