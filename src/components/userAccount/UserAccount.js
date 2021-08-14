import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { Link as GatsbyLink } from 'gatsby'

// Icons
import PersonOutlineIcon from '@material-ui/icons/PersonOutline'

// L18n
import strings from './strings.json'

const UserAccount = () => {
  return (
    <IconButton
      component={GatsbyLink}
      to="/account"
      color="inherit"
      aria-label={strings.ariaAccountLoginInLabel}
      role="button"
    >
      <PersonOutlineIcon />
    </IconButton>
  )
}

export default UserAccount
