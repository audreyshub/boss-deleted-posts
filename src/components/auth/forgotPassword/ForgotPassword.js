import React, { useState, useCallback } from 'react'
import Helmet from 'react-helmet'
import fetch from 'unfetch'
import { Link as GatsbyLink, navigate } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import Input from '@material-ui/core/Input'
import { FormControl } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import { validateEmail } from '../../../utilities/validation'
import { useLoads } from 'react-loads'

import ErrorHandling from '../../error'

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
  inputWrapper: {
    position: 'relative',
    '& input': {
      paddingRight: theme.spacing(20),
    },
  },
  input: {
    display: 'block',
    marginBottom: theme.spacing(2),
  },
  error: {
    border: `1px solid ${theme.palette.error.main}`,
  },
  button: {
    transition: 'width .3s',
    display: 'block',
    marginBottom: theme.spacing(2),
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
  },
  forgetLink: {},
}))

const ForgotPassword = ({ path }) => {
  const classes = useStyles()
  const [validEmail, setValidEmail] = useState(true)
  const form = React.createRef()

  const handleForgot = useCallback(
    (email) =>
      fetch(`/.netlify/functions/forgotPassword`, {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            throw new Error(res.error)
          } else {
            return Promise.resolve(res)
          }
        }),

    []
  )

  const { error, isRejected, isPending, isReloading, isResolved, load } = useLoads(
    'handleForgot',
    handleForgot,
    {
      defer: true,
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form) {
      return
    }
    const { email } = form.current.elements

    // Setters run async, so store new value in variable for immediate use
    const emailIsValid = validateEmail(email.value)
    setValidEmail(emailIsValid)

    if (!emailIsValid) {
      return
    }

    load(email.value)
  }

  // Remove error class on focus using the setter, which represents the useState set function
  const handleOnFocus = (e, setter) => {
    if (e.target.parentElement.className.includes('error')) {
      setter(true)
    }
  }

  const submitText = () => {
    if (isPending || isReloading) {
      return strings.buttonIsPending
    } else if (isResolved) {
      return strings.requestSent
    } else {
      return strings.button
    }
  }

  return (
    <>
      <Helmet title="forgot password" />
      <Box className={classes.formWrapper}>
        <form onSubmit={(e) => handleSubmit(e)} ref={form} noValidate>
          <Typography component="h1" gutterBottom={true}>
            {strings.title}
          </Typography>

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

          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
            aria-label={strings.button}
            role="button"
          >
            {submitText()}
          </Button>

          {isRejected && <ErrorHandling error={error.message} />}

          <Typography component="p">
            {strings.rememberYourPassword} <GatsbyLink to="/account/login">Login</GatsbyLink>
          </Typography>
        </form>
      </Box>
    </>
  )
}

export default ForgotPassword
