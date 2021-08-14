import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import SvgIcon from '@material-ui/core/SvgIcon'
import Hidden from '@material-ui/core/Hidden'

// Assets
import Icon from './assets/icon.inline.svg'
import Title from './assets/title.inline.svg'

//L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  icon: {
    height: '48px',
    width: '48px',
    marginRight: theme.spacing(2),
  },
  title: {
    height: '48px',
    width: '234px',
    marginRight: theme.spacing(2),
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline-block',
    },
  },
}))

const Branding = React.forwardRef((props, ref) => {
  const classes = useStyles()

  return (
    <Box ref={ref} className={`${props.styles} ${classes.root}`}>
      <Link component={GatsbyLink} to="/">
        <Typography component="h1">
          <SvgIcon component={Icon} className={classes.icon} viewBox="0 0 1024 1024" />
          <SvgIcon component={Title} className={classes.title} viewBox="0 0 234 48" />
          <Typography variant="srOnly">{props.siteTitle}</Typography>
        </Typography>
      </Link>
    </Box>
  )
})

export default Branding

Branding.propTypes = {
  siteTitle: PropTypes.string.isRequired,
}
Branding.defaultProps = {
  siteTitle: strings.siteTitle,
}
