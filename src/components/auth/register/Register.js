import React, { useState, useCallback } from 'react'
import Helmet from 'react-helmet'
import fetch from 'unfetch'
import { Link as GatsbyLink, navigate } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Input from '@material-ui/core/Input'
import { FormControl } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import { useLoads } from 'react-loads'
import { FormHelperText } from '@material-ui/core'
import Container from '@material-ui/core/Container'

// Components
import ErrorHandling from '../../error'

// Context
import { SetCustomerInState } from '../../../context/StoreCheckoutContext'

// Utilities
import {
  validateEmail,
  validateNotEmpty,
  validatePassword,
  comparePasswords,
} from '../../../utilities/validation'
import { updateCustomer } from '../../../utilities/updateCustomer'

// Language
import strings from './strings'

// Styles
const useStyles = makeStyles((theme) => ({
  contentWrapper: {
    width: '100%',
    maxWidth: '520px',
    margin: '0 auto',
    padding: theme.spacing(5),
    borderRadius: '16px',
    marginTop: theme.spacing(5),
    boxShadow: theme.boxShadow,
    border: `1px solid ${theme.palette.grey[200]}`,
    marginBottom: theme.spacing(10),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
    },
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  message: {
    marginBottom: theme.spacing(3),
  },
  returningCustomer: {
    marginBottom: theme.spacing(3),
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
  passwordErrorVerbose: {
    display: 'block',
  },
  button: {
    transition: 'width .3s',
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formWrapper: {
    width: '430px',
    maxWidth: '100%',
  },
  formControl: {
    width: '100%',
    position: 'relative',
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
  forgetLink: {},
}))

const Register = (props) => {
  const classes = useStyles()
  const { isResolved: resolvedUpdateCustomerInState, load: updateCustomerInState } =
    SetCustomerInState()
  const [validFirstName, setValidFirstName] = useState(true)
  const [validLastName, setValidLastName] = useState(true)
  const [validEmail, setValidEmail] = useState(true)
  const [validPassword, setValidPassword] = useState(true)
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const form = React.createRef()

  const handleRegister = useCallback(
    (email, password, firstName, lastName) =>
      fetch(`/.netlify/functions/register`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            throw new Error(res.error)
          } else {
            updateCustomer(res, email)
            setTimeout(() => {
              updateCustomerInState()
              navigate('/account')
            }, 300)
            return null
          }
        }),
    []
  )

  // const handleRegister = useCallback(async (email, password, firstName, lastName) => {
  //   const res = await fetch(`/.netlify/functions/register`, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       email,
  //       password,
  //       firstName,
  //       lastName,
  //     }),
  //   })
  //   try {
  //     const customer = await res.json()
  //     if (customer.error) {
  //       throw new Error(customer.error)
  //     } else {
  //       updateCustomer(customer, email)
  //       updateCustomerInState()
  //       setTimeout(() => {
  //         navigate('/account')
  //       }, 300)
  //     }
  //   } catch (err) {
  //     throw err.message
  //   }
  // }, [])

  const { error, isRejected, isPending, isReloading, load } = useLoads(
    'handleRegister',
    handleRegister,
    {
      defer: true,
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const { email, password1, password2, firstName, lastName } = form.current.elements

    // Setters run async, so store new value in variable for immediate use
    const firstNameIsValid = validateNotEmpty(firstName.value)
    const lastNameIsValid = validateNotEmpty(lastName.value)
    const emailIsValid = validateEmail(email.value)
    const passwordIsValid = validatePassword(password1.value)
    const passwordsMatch = comparePasswords(password1.value, password2.value)
    setValidFirstName(firstNameIsValid)
    setValidLastName(lastNameIsValid)
    setValidEmail(emailIsValid)
    setValidPassword(passwordIsValid)
    setPasswordsMatch(passwordsMatch)

    if (
      !firstNameIsValid ||
      !lastNameIsValid ||
      !emailIsValid ||
      !passwordIsValid ||
      !passwordsMatch
    ) {
      return
    }

    load(email.value, password1.value, firstName.value, lastName.value)
  }

  // Remove error class on focus using the setter, which represents the useState set function
  const handleOnFocus = (e, setter) => {
    if (e.target.parentElement.className.includes('error')) {
      setter(true)
    }
  }

  return (
    <Container maxWidth="lg">
      <Helmet title="create account" />
      <Box className={classes.contentWrapper}>
        <Typography component="h1" variant="h2" gutterBottom={true}>
          {strings.title}
        </Typography>
        <Typography className={classes.returningCustomer} component="p">
          Already have an account?{' '}
          <Link component={GatsbyLink} to="/account/login">
            {strings.returningCustomer}
          </Link>{' '}
          to log in.
        </Typography>
        <Box className={classes.formWrapper}>
          <form onSubmit={(e) => handleSubmit(e)} ref={form} noValidate>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="firstName">First Name</InputLabel>
              <Input
                id="firstName"
                className={`${classes.input} ${validFirstName ? null : classes.error}`}
                type="text"
                name="firstName"
                required={true}
                placeholder={strings.firstNamePlaceholder}
                onFocus={(e) => handleOnFocus(e, setValidFirstName)}
              />
              {!validFirstName && (
                <ErrorHandling
                  styles={classes.inputError}
                  error={strings.invalidName}
                  position="right"
                />
              )}
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="lastName">Last Name</InputLabel>
              <Input
                id="lastName"
                className={`${classes.input} ${validLastName ? null : classes.error}`}
                type="text"
                name="lastName"
                required={true}
                placeholder={strings.lastNamePlaceholder}
                onFocus={(e) => handleOnFocus(e, setValidLastName)}
              />
              {!validLastName && (
                <ErrorHandling
                  styles={classes.inputError}
                  error={strings.invalidName}
                  position="right"
                />
              )}
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                className={`${classes.input} ${validEmail ? null : classes.error}`}
                type="email"
                name="email"
                required={true}
                placeholder={strings.emailPlaceholder}
                onFocus={(e) => handleOnFocus(e, setValidEmail)}
              />
              {!validEmail && (
                <ErrorHandling
                  styles={classes.inputError}
                  error={strings.invalidEmail}
                  position="right"
                />
              )}
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="password1">Password</InputLabel>
              <Input
                id="password1"
                className={`${classes.input} ${validPassword ? null : classes.error}`}
                type="password"
                name="password1"
                required={true}
                placeholder={strings.passwordPlaceholder}
                onFocus={(e) => handleOnFocus(e, setValidPassword)}
              />
              {!validPassword && (
                <ErrorHandling
                  styles={classes.inputError}
                  error={strings.invalidPassword}
                  position="right"
                />
              )}
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="password2">Repeat Password</InputLabel>
              <Input
                id="password2"
                className={`${classes.input} ${passwordsMatch ? null : classes.error}`}
                type="password"
                name="password2"
                required={true}
                placeholder={strings.repeatPasswordPlaceholder}
                onFocus={(e) => handleOnFocus(e, setPasswordsMatch)}
                aria-describedby="password2-helper-text"
              />
              {!passwordsMatch && (
                <ErrorHandling
                  styles={classes.inputError}
                  error={strings.errorPasswordsDoNotMatch}
                  position="right"
                />
              )}
            </FormControl>
            <FormHelperText id="password2-helper-text">
              {strings.invalidPasswordVerbose}
            </FormHelperText>
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="primary"
              aria-label={strings.submitButton}
              role="button"
            >
              {isPending || isReloading ? strings.submitButtonIsPending : strings.submitButton}
            </Button>
            {isRejected && <ErrorHandling error={error} />}
          </form>
        </Box>
      </Box>
    </Container>
  )
}

export default Register
