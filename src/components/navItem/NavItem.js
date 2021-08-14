import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink } from 'gatsby'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

// Components
import linkResolver from '../../utilities/linkResolver'

const NavItem = (props) => {
  // console.log('👾 NavItem > ', props)
  if (!props.type) return

  switch (props.type) {
    case 'label':
      return (
        <Typography variant={props.variant} color="inherit">
          {props.label}
        </Typography>
      )

    case 'page':
      return (
        <Link
          component={GatsbyLink}
          to={linkResolver({ type: props.type, uid: props.link.uid })}
          variant={props.variant}
          color="inherit"
          underline="none"
        >
          {props.label}
        </Link>
      )

    case 'product':
    case 'collection':
      return (
        <Link
          component={GatsbyLink}
          to={linkResolver({ type: props.type, uid: props.handle })}
          variant={props.variant}
          color="inherit"
          underline="none"
        >
          {props.label}
        </Link>
      )

    case 'external':
      return (
        <Link href={props.link.url} variant={props.variant} color="inherit" underline="none">
          {props.label}
        </Link>
      )
  }
}

export default NavItem

NavItem.propTypes = {}
NavItem.defaultProps = {}
