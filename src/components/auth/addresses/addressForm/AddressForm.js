import React, { useState, useEffect } from 'react'
import { CountryRegionData } from 'react-country-region-selector'
import MenuItem from '@material-ui/core/MenuItem'
import { Input } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

// Components
import ErrorHandling from '../../../error'

// Utilities
import { validateNotEmpty, validateNotEmptyMuiSelect } from '../../../../utilities/validation'

// Language
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(3),
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: '1.1',
  },
  message: {
    marginBottom: theme.spacing(3),
  },
  addressForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateAreas:
        '"firstName lastName" "address1 address1" "address2 address2" "company phone" "city province" "zip country" "button ."',
      gridColumnGap: theme.spacing(2),
    },
  },
  firstName: {
    gridArea: 'firstName',
  },
  lastName: {
    gridArea: 'lastName',
  },
  address1: {
    gridArea: 'address1',
  },
  address2: {
    gridArea: 'address2',
  },
  company: {
    gridArea: 'company',
  },
  phone: {
    gridArea: 'phone',
  },
  city: {
    gridArea: 'city',
  },
  counrty: {
    gridArea: 'counrty',
  },
  province: {
    gridArea: 'province',
  },
  zip: {
    gridArea: 'zip',
  },
  inputWrapper: {
    position: 'relative',
    '& input': {
      paddingRight: theme.spacing(20),
    },
  },
  input: {
    display: 'block',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  error: {
    border: `1px solid ${theme.palette.error.main}`,
  },
  errorProvince: {
    border: 'none',
    '& > div': {
      border: `1px solid ${theme.palette.error.main}`,
    },
  },
  button: {
    transition: 'width .3s',
    display: 'block',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    gridArea: 'button',
  },
  formWrapper: {
    width: '430px',
    maxWidth: '100%',
  },
  formControl: {
    width: '100%',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(0),
    },
  },
  inputError: {
    position: 'absolute',
    right: theme.spacing(1),
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  provinceTextField: {
    '& .MuiInputBase-root': {
      width: '100%',
    },
    '&$[]': {},
  },
  countryTextField: {
    '& .MuiInputBase-root': {
      width: '100%',
    },
  },
  forgetLink: {},
}))

const getRegions = (country) => {
  if (!country) {
    return []
  }
  return country[2].split('|').map((regionPair) => {
    let [regionName, regionShortCode = null] = regionPair.split('~')
    return regionName
  })
}

const checkForStateVsProvince = (country) => {
  const conditions = ['United States', 'Australia']
  return conditions.some((el) => country.includes(el))
}

const AddressForm = (props) => {
  const classes = useStyles()
  const [address, setAddress] = useState({
    firstName: props.address && props.address.firstName ? props.address.firstName : '',
    lastName: props.address && props.address.lastName ? props.address.lastName : '',
    address1: props.address && props.address.address1 ? props.address.address1 : '',
    address2: props.address && props.address.address2 ? props.address.address2 : '',
    company: props.address && props.address.company ? props.address.company : '',
    phone: props.address && props.address.phone ? props.address.phone : '',
    city: props.address && props.address.city ? props.address.city : '',
    country: props.address && props.address.country ? props.address.country : '',
    province: props.address && props.address.province ? props.address.province : '',
    zip: props.address && props.address.zip ? props.address.zip : '',
  })
  const [validFirstName, setValidFirstName] = useState(true)
  const [validLastName, setValidLastName] = useState(true)
  const [validAddress1, setValidAddress1] = useState(true)
  const [validCity, setValidCity] = useState(true)
  const [validProvince, setValidProvince] = useState(true)
  const form = React.createRef()

  // Set default country (based on either a prop for a new address, or the existing data from an existing address)
  useEffect(() => {
    // console.log('STARTING ADDRESS FORM', address)
    if (props.defaultCountry) {
      const defaultCountryData = CountryRegionData.filter(
        (option) => option[0] === props.defaultCountry
      )
      // console.log('DEFAULT COUNTRY', defaultCountryData[0])
      setAddress({ ...address, country: defaultCountryData[0] })
      return
    }
    if (address.country) {
      const defaultCountryData = CountryRegionData.filter((option) => option[0] === address.country)
      // console.log('DEFAULT COUNTRY', defaultCountryData[0])
      setAddress({ ...address, country: defaultCountryData[0] })
    }
  }, [])

  const submitButtonText = () => {
    if (props.isPending || props.isReloading) {
      return strings.submitButtonIsPending
    } else {
      return strings.submitButton
    }
  }

  const handleSubmit = (e, address) => {
    e.preventDefault()
    const { firstName, lastName, address1, city } = form.current.elements

    // Setters run async, so store new value in variable for immediate use
    const firstNameIsValid = validateNotEmpty(firstName.value)
    const lastNameIsValid = validateNotEmpty(lastName.value)
    const address1IsValid = validateNotEmpty(address1.value)
    const cityIsValid = validateNotEmpty(city.value)
    const provinceIsValid = validateNotEmptyMuiSelect(address.province)
    setValidFirstName(firstNameIsValid)
    setValidLastName(lastNameIsValid)
    setValidAddress1(address1IsValid)
    setValidCity(cityIsValid)
    setValidProvince(provinceIsValid)

    if (
      !firstNameIsValid ||
      !lastNameIsValid ||
      !address1IsValid ||
      !cityIsValid ||
      !provinceIsValid
    ) {
      return
    }

    props.handleSubmit(e, address)
  }

  // Remove error class on focus using the setter, which represents the useState set function
  const handleOnFocus = (e, setter) => {
    if (e.target.parentElement.className.includes('error')) {
      setter(true)
    }
  }

  // console.log('ADDRESS FORM', form)
  return (
    <form
      className={classes.addressForm}
      ref={form}
      id="address-create"
      autoComplete="off"
      onSubmit={(e) => handleSubmit(e, address)}
      noValidate
    >
      <FormControl className={`${classes.formControl} ${classes.firstName}`}>
        <InputLabel htmlFor="firstName">First Name</InputLabel>
        <Input
          className={`${classes.input} ${validFirstName ? null : classes.error}`}
          id="firstName"
          variant="outlined"
          value={address.firstName}
          placeholder="First name"
          onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
          required={true}
          onFocus={(e) => handleOnFocus(e, setValidFirstName)}
        />
        {!validFirstName && (
          <ErrorHandling
            styles={classes.inputError}
            error={strings.invalidBlank}
            position="right"
          />
        )}
      </FormControl>
      <FormControl className={`${classes.formControl} ${classes.lastName}`}>
        <InputLabel htmlFor="lastName">Last Name</InputLabel>
        <Input
          className={`${classes.input} ${validLastName ? null : classes.error}`}
          id="lastName"
          variant="outlined"
          value={address.lastName}
          placeholder="Last name"
          onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
          required={true}
          onFocus={(e) => handleOnFocus(e, setValidLastName)}
        />
        {!validLastName && (
          <ErrorHandling
            styles={classes.inputError}
            error={strings.invalidBlank}
            position="right"
          />
        )}
      </FormControl>
      <FormControl className={`${classes.formControl} ${classes.address1}`}>
        <InputLabel htmlFor="address1">Address</InputLabel>
        <Input
          className={`${classes.input} ${validAddress1 ? null : classes.error}`}
          id="address1"
          variant="outlined"
          value={address.address1}
          placeholder="Address"
          onChange={(e) => setAddress({ ...address, address1: e.target.value })}
          required={true}
          onFocus={(e) => handleOnFocus(e, setValidAddress1)}
        />
        {!validAddress1 && (
          <ErrorHandling
            styles={classes.inputError}
            error={strings.invalidBlank}
            position="right"
          />
        )}
      </FormControl>
      <FormControl className={`${classes.formControl} ${classes.address2}`}>
        <InputLabel htmlFor="address2">Address 2</InputLabel>
        <Input
          className={classes.input}
          id="address2"
          variant="outlined"
          value={address.address2}
          placeholder="Address line 2"
          onChange={(e) => setAddress({ ...address, address2: e.target.value })}
        />
      </FormControl>
      <FormControl className={`${classes.formControl} ${classes.company}`}>
        <InputLabel htmlFor="company">Company</InputLabel>
        <Input
          className={classes.input}
          id="company"
          variant="outlined"
          value={address.company}
          placeholder="Company"
          onChange={(e) => setAddress({ ...address, company: e.target.value })}
        />
      </FormControl>
      <FormControl className={`${classes.formControl} ${classes.phone}`}>
        <InputLabel htmlFor="phone">Phone</InputLabel>
        <Input
          className={classes.input}
          id="phone"
          type="tel"
          variant="outlined"
          value={address.phone}
          placeholder="Phone number"
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
          helperText='Country code ("+1") and numbers only'
        />
      </FormControl>
      <FormControl className={`${classes.formControl} ${classes.city}`}>
        <InputLabel htmlFor="city">City</InputLabel>
        <Input
          className={`${classes.input} ${validCity ? null : classes.error}`}
          id="city"
          variant="outlined"
          value={address.city}
          placeholder="City"
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          required={true}
          onFocus={(e) => handleOnFocus(e, setValidCity)}
        />
        {!validCity && (
          <ErrorHandling
            styles={classes.inputError}
            error={strings.invalidBlank}
            position="right"
          />
        )}
      </FormControl>
      <FormControl className={`${classes.formControl} ${classes.country}`}>
        <InputLabel htmlFor="country">Country</InputLabel>
        <TextField
          className={`${classes.countryTextField} ${classes.input}`}
          id="country"
          value={address.country}
          select
          required={true}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
        >
          {CountryRegionData.map((option, i) => (
            <MenuItem key={option[0]} value={option}>
              {option[0]}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
      <FormControl className={`${classes.formControl} ${classes.province}`}>
        <InputLabel htmlFor="province">
          {checkForStateVsProvince(address.country) ? 'State' : 'Region'}
        </InputLabel>
        <TextField
          className={`${classes.provinceTextField} ${classes.input} ${
            validProvince ? null : `${classes.error} ${classes.errorProvince}`
          }`}
          id="province"
          value={address.province}
          select
          required={true}
          onChange={(e) => setAddress({ ...address, province: e.target.value })}
          onClick={(e) => setValidProvince(true)}
        >
          {getRegions(address.country).map((option, i) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {!validProvince && (
          <ErrorHandling
            styles={classes.inputError}
            error={strings.invalidBlank}
            position="right"
          />
        )}
      </FormControl>
      <FormControl className={`${classes.formControl} ${classes.zip}`}>
        <InputLabel htmlFor="zip">Zipcode</InputLabel>
        <Input
          className={classes.input}
          id="zip"
          type="text"
          variant="outlined"
          value={address.zip}
          placeholder="Zipcode"
          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
          required={true}
          helperText="Please enter numbers only"
        />
      </FormControl>
      <Button
        className={classes.button}
        type="submit"
        variant="contained"
        color="primary"
        aria-label={strings.submitButton}
        role="button"
      >
        {submitButtonText()}
      </Button>
    </form>
  )
}

export default AddressForm
