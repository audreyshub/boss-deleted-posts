import React, { useState, useReducer, useCallback } from 'react'
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

// Components
import ErrorHandling from '../error'

// Utilities
import { validateEmail, validateNotEmpty } from '../../utilities/validation'

// Language
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  button: {},
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
  formWrapper: {
    marginTop: theme.spacing(4),
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

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

// FEATURE Add reCAPTCHA v2 or v3
const ContactForm = (props) => {
  const classes = useStyles()
  const [validName, setValidName] = useState(true)
  const [validSubject, setValidSubject] = useState(true)
  const [validMessage, setValidMessage] = useState(true)
  const [validEmail, setValidEmail] = useState(true)
  const form = React.createRef()

  const submitForm = useCallback(async (data) => {
    // console.log('FORM DATA ENCODED', encode(data))
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode(data),
    })
    try {
      const response = await res.status
      Promise.resolve(response)
    } catch (err) {
      console.log(err.message)
      throw err.message
    }
  }, [])

  const { error, isRejected, isPending, isReloading, isResolved, load } = useDeferredLoads(
    'submitForm',
    submitForm
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, email, subject, message, honeypot } = form.current.elements
    const formName = form.current.getAttribute('name')

    // Setters run async, so store new value in variable for immediate use
    const nameIsValid = validateNotEmpty(name.value)
    const subjectIsValid = validateNotEmpty(subject.value)
    const messageIsValid = validateNotEmpty(message.value)
    const emailIsValid = validateEmail(email.value)
    setValidName(nameIsValid)
    setValidSubject(subjectIsValid)
    setValidMessage(messageIsValid)
    setValidEmail(emailIsValid)

    if (!nameIsValid || !subjectIsValid || !messageIsValid || !emailIsValid) {
      return
    }

    load({
      'form-name': formName,
      honeypot: honeypot.value,
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value,
    })
  }

  // Remove error class on focus using the setter, which represents the useState set function
  const handleOnFocus = (e, setter) => {
    if (e.target.parentElement.className.includes('error')) {
      setter(true)
    }
  }

  // console.log('CONTACT FORM (component)', formInput)
  return (
    <Box className={`${props.styles} ${classes.formWrapper}`}>
      <form
        onSubmit={(e) => handleSubmit(e)}
        name="contact"
        id="contact-form"
        autoComplete="off"
        netlify-honeypot="bot-field"
        data-netlify="true"
        action="/thank-you"
        ref={form}
        noValidate
      >
        <input type="hidden" name="form-name" value="contact" />
        <p style={{ display: 'none' }}>
          <label>
            Don’t fill this out if you’re human: <input id="honeypot" name="honeypot" />
          </label>
        </p>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            id="name"
            className={`${classes.input} ${validName ? null : classes.error}`}
            type="text"
            name="name"
            required={true}
            placeholder={strings.namePlaceholder}
            onFocus={(e) => handleOnFocus(e, setValidName)}
          />
          {!validName && (
            <ErrorHandling
              styles={classes.inputError}
              error={strings.invalidBlank}
              position="right"
            />
          )}
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            className={`${classes.input} ${validEmail ? null : classes.error}`}
            type="text"
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
          <InputLabel htmlFor="subject">Subject</InputLabel>
          <Input
            id="subject"
            className={`${classes.input} ${validSubject ? null : classes.error}`}
            type="text"
            name="subject"
            required={true}
            placeholder={strings.subjectPlaceholder}
            onFocus={(e) => handleOnFocus(e, setValidSubject)}
          />
          {!validSubject && (
            <ErrorHandling
              styles={classes.inputError}
              error={strings.invalidBlank}
              position="right"
            />
          )}
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="message">Message</InputLabel>
          <Input
            id="message"
            className={`${classes.input} ${validMessage ? null : classes.error}`}
            type="text"
            name="message"
            multiline={true}
            required={true}
            rows={6}
            placeholder={strings.messagePlaceholder}
            onFocus={(e) => handleOnFocus(e, setValidMessage)}
          />
          {!validMessage && (
            <ErrorHandling
              styles={classes.inputError}
              error={strings.invalidBlank}
              position="right"
            />
          )}
        </FormControl>
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
          aria-label={strings.submitButton}
          role="button"
        >
          {isPending || isReloading
            ? strings.submitButtonIsPending
            : isResolved
            ? strings.submitButtonSuccess
            : strings.submitButton}
        </Button>
        {isRejected && <ErrorHandling error={error.message} />}
      </form>
    </Box>
  )
}

export default ContactForm
