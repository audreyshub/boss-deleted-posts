import React, { useState, useCallback } from 'react'
import Helmet from 'react-helmet'
import fetch from 'unfetch'
import { encode } from 'shopify-gid'
import { useDeferredLoads } from 'react-loads'
import { Link as GatsbyLink, navigate } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import { FormControl } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import Container from '@material-ui/core/Container'
import { FormHelperText } from '@material-ui/core'
import Link from '@material-ui/core/Link'

// Components
import ErrorHandling from '../../error'

// Utilities
import { comparePasswords, validatePassword } from '../../../utilities/validation'
import { updateCustomer } from '../../../utilities/updateCustomer'

// Language
import strings from './strings'

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
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
}))

const Activate = (props) => {
  const classes = useStyles()
  const [validPassword, setValidPassword] = useState(true)
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [formSuccess, setFormSucces] = useState(false)
  const form = React.createRef()

  const handleReset = useCallback(async (password) => {
    await fetch(`/.netlify/functions/activate`, {
      method: 'POST',
      body: JSON.stringify({
        id: encode('Customer', props.id),
        input: {
          activationToken: props.token,
          password,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          throw new Error(res.error)
        } else {
          setFormSucces(true)
          updateCustomer(res, res.customer.email)
          setTimeout(() => {
            navigate('/')
          }, 400)
        }
      })
  }, [])

  const { error, isRejected, isPending, isReloading, load } = useDeferredLoads(
    'handleReset',
    handleReset
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const { password1, password2 } = form.current.elements

    // Setters run async, so store new value in variable for immediate use
    const passwordIsValid = validatePassword(password1.value)
    const passwordsMatch = comparePasswords(password1.value, password2.value)
    setValidPassword(passwordIsValid)
    setPasswordsMatch(passwordsMatch)

    if (!passwordIsValid || !passwordsMatch) {
      return
    }

    load(password1.value)
  }

  // Remove error class on focus using the setter, which represents the useState set function
  const handleOnFocus = (e, setter) => {
    if (e.target.parentElement.className.includes('error')) {
      setter(true)
    }
  }

  // console.log('RESET PASSWORD PAGE (auth)', props)
  return (
    <>
      <Helmet title="reset" />
      <Container maxWidth="lg">
        <Typography component="h1" variant="h1">
          {strings.title}
        </Typography>

        {/* {(isPending || isReloading) && <span>Loading</span>} */}

        <Box className={classes.formWrapper}>
          <form onSubmit={(e) => handleSubmit(e)} ref={form} noValidate>
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
              {isPending || isReloading ? strings.acceptPending : strings.accept}
            </Button>

            <Link
              component={GatsbyLink}
              to="/"
              className={classes.button}
              variant="contained"
              aria-label={strings.decline}
              role="button"
            >
              {strings.decline}
            </Link>

            {formSuccess && (
              <Typography component="p" variant="body1">
                {strings.success}
              </Typography>
            )}

            {isRejected && <ErrorHandling error={error.message} />}
          </form>
        </Box>
      </Container>
    </>
  )
}

export default Activate
