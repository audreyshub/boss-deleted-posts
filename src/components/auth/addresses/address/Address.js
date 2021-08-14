import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

// Componenents
import FormattedAddress from '../formattedAddress'
import AddressUpdate from '../addressUpdate'
import AddressDelete from '../addressDelete'
import AddressDefaultUpdate from '../addressDefaultUpdate'

// Language
import strings from './strings'

// Styles
const useStyles = makeStyles((theme) => ({
  address: {
    boxShadow: theme.boxShadow2,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(8),
    position: 'relative',
  },
  defaultAddress: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
  },
  addressControls: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  deleteAddress: {
    display: 'inline-block',
    marginLeft: theme.spacing(2),
  },
  updateAddress: {
    display: 'inline-block',
  },
}))

const Address = (props) => {
  const classes = useStyles()
  const [isDefault, setIsDefault] = useState(false)

  useEffect(() => {
    for (const key in props.address) {
      if (key === 'isDefault') {
        setIsDefault(true)
      } else {
        setIsDefault(false)
      }
    }
  }, [props.address])

  // console.log('ADDRESS (component)', props)
  return (
    <Box className={classes.address}>
      <FormattedAddress address={props.address} />
      {isDefault ? (
        <Typography
          className={classes.defaultAddress}
          component="p"
          variant="body1"
          display="block"
        >
          {strings.defaultAddress}
        </Typography>
      ) : (
        <AddressDefaultUpdate
          styles={classes.defaultAddress}
          address={props.address}
          reloadAddresses={props.reloadAddresses}
          isResolved={props.isResolved}
        />
      )}
      <Box className={classes.addressControls}>
        <AddressUpdate
          styles={classes.updateAddress}
          address={props.address}
          reloadAddresses={props.reloadAddresses}
        />
        <AddressDelete
          styles={classes.deleteAddress}
          address={props.address}
          reloadAddresses={props.reloadAddresses}
        />
      </Box>
    </Box>
  )
}

export default Address

Address.propTypes = {}
Address.defaultProps = {}
