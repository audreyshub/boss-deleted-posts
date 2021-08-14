import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

// Components
import NavItem from '../navItem'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  social: {
    '& a': {
      padding: theme.spacing(0.5, 2, 0.5, 0),
    },
    '& svg': {
      height: '12px',
      width: '12px',
    },
  },
}))

const NavList = (props) => {
  // console.log('👾 NavList > ', props)

  const classes = useStyles()

  return (
    <Box className={`${props.styles} ${classes.root}`} component="nav">
      <Typography className="visuallyHidden" component="h2">
        Footer
      </Typography>
      <Typography className={classes.title} variant="h5" component="h3">
        {props.primary.label}
      </Typography>

      <List dense={true}>
        {props.items.map((item, i) => {
          return (
            <ListItem key={i} disableGutters={true}>
              <NavItem {...item} />
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}

export default NavList

NavList.propTypes = {}
