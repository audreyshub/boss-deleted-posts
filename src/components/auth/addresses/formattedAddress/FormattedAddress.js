import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

// Styles
const useStyles = makeStyles((theme) => ({
  addressLine: {
    display: 'block',
  },
}))

const FormattedAddress = (props) => {
  const classes = useStyles()

  const formatAddress = (address) => {
    let firstAndLastName = ''
    let addressFormatted = []

    // Combine first and last name into one field
    for (const key in address) {
      if (key === 'firstName' || key === 'lastName') {
        firstAndLastName += `${address[key]} `
      }
    }

    addressFormatted.push(firstAndLastName)

    // Gather the physical address
    for (const key in address) {
      if (!address[key]) continue
      if (
        key !== 'firstName' &&
        key !== 'firstName' &&
        key !== 'lastName' &&
        key !== 'id' &&
        key !== 'isDefault' &&
        address[key].length > 0
      )
        addressFormatted.push(address[key])
    }

    return addressFormatted.map((field, i) => (
      <Typography className={classes.addressLine} component="span" gutterBottom={true} key={i}>
        {field}
      </Typography>
    ))
  }

  // console.log('FORMATTED ADDRESS', props)
  return <>{formatAddress(props.address)}</>
}

export default FormattedAddress
