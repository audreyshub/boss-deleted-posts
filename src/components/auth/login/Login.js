import React, { useCallback, useEffect, useState } from 'react'
import fetch from 'unfetch'
import cookie from 'js-cookie'
import Helmet from 'react-helmet'
import { Link as GatsbyLink, navigate } from 'gatsby'
import { useDeferredLoads } from 'react-loads'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Container from '@material-ui/core/Container'
import { Multipass } from 'multipass-js'

// Components
import ErrorHandling from '../../error'

// Context
import { SetCustomerInState } from '../../../context/StoreCheckoutContext'

// Utilities
import { validateEmail, validateNotEmpty } from '../../../utilities/validation'
import { updateCustomer } from '../../../utilities/updateCustomer'

// Language
import strings from './strings.json'

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
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  footer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forgetLink: {
    color: theme.palette.secondary.main,
    textDecoration: 'underline',
  },
  signup: {
    marginBottom: theme.spacing(3),
  },
}))

const Login = (props) => {
  const classes = useStyles()
  const { isResolved: resolvedUpdateCustomerInState, load: updateCustomerInState } =
    SetCustomerInState()
  const form = React.createRef()
  const [email, setEmail] = useState()
  const [validEmail, setValidEmail] = useState(true)
  const [validPassword, setValidPassword] = useState(true)

  const { checkoutUrl } = props

  const multipass = (email) => {
    const multipass = new Multipass(process.env.GATSBY_SHOPIFY_STORE_MULTIPASS_SECRET)
    const customerData = {
      email: email,
    }
    const url = multipass
      .withCustomerData(customerData)
      .withDomain('boss-personal-planner.myshopify.com')
      .withRedirect(checkoutUrl)
      .url()

    window.location.href = url
  }

  const handleLogin = useCallback(
    (email, password) =>
      fetch(`/.netlify/functions/login`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            throw new Error(res.error)
          } else {
            setEmail(email)
            updateCustomer(res, email)
            setTimeout(() => {
              updateCustomerInState()
            }, 400)
            return null
          }
        }),
    []
  )

  useEffect(() => {
    if (!resolvedUpdateCustomerInState) return
    if (checkoutUrl) {
      multipass(email)
      return
    }
    navigate('/account')
  }, [resolvedUpdateCustomerInState])

  const { error, isRejected, isPending, isReloading, load } = useDeferredLoads(
    'handleLogin',
    handleLogin
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const { email, password } = form.current.elements

    // Setters run async, so store new value in variable for immediate use
    const emailIsValid = validateEmail(email.value)
    const passwordIsValid = validateNotEmpty(password.value)
    setValidEmail(emailIsValid)
    setValidPassword(passwordIsValid)

    if (!emailIsValid || !passwordIsValid) {
      return
    }

    load(email.value, password.value)
  }

  // Remove error class on focus using the setter, which represents the useState set function
  const handleOnFocus = (e, setter) => {
    if (e.target.parentElement.className.includes('error')) {
      setter(true)
    }
  }

  useEffect(() => {
    if (cookie.get('customer_token') || cookie.get('customer_email'))
      navigate('/account', { replace: true })
  }, [0])

  return (
    <Container maxWidth="lg">
      <Helmet title="login" />
      <Box className={classes.contentWrapper}>
        <form onSubmit={(e) => handleSubmit(e)} ref={form} noValidate>
          <Box>
            <Typography component="h1" variant="h2" gutterBottom={true}>
              Log In
            </Typography>
            <Typography className={classes.signup} component="p">
              Don't have one?{' '}
              <Link component={GatsbyLink} to="/account/register">
                {strings.signUp}
              </Link>{' '}
              to keep going.
            </Typography>
            <Box className={classes.formWrapper}>
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
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  className={`${classes.input} ${validPassword ? null : classes.error}`}
                  type="password"
                  name="password"
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
              <Box className={classes.footer}>
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
                {isRejected && <ErrorHandling error={error.message} />}
                <Link
                  component={GatsbyLink}
                  className={classes.forgetLink}
                  to="/account/forgot_password"
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </Box>
        </form>
      </Box>
    </Container>
  )
}

export default Login
