import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Typography from '@material-ui/core/Typography'
import { useDeferredLoads } from 'react-loads'
import clsx from 'clsx'

// Components
import TextInput from './TextInput'
import SubmitButton from './SubmitButton'

// Svgs

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  goodForm: {},
  input: {
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: theme.shape.borderRadius,
    outline: '1px solid transparent',
    color: theme.palette.secondary.main,
  },
  thankYou: {
    fontWeight: '600 !important',
    color: theme.palette.primary.main,
  },
}))

const INITIAL_FORM_STATE = {
  email: '',
}

const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
})

const GoodForm = (props) => {
  const classes = useStyles(props)

  const { className, subscriberType, listId, triggerSampleDownload } = props

  const handleSubmit = useCallback(
    (values, listId, subscriberType) =>
      fetch(`/.netlify/functions/klaviyoSubscribeProfile`, {
        method: 'POST',
        body: JSON.stringify({
          values,
          listId,
          subscriberType,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          triggerSampleDownload(subscriberType)
          Promise.resolve(res)
        })
        .catch((error) => {
          throw new Error(error.message)
        }),
    []
  )

  const { isPending, isReloading, isResolved, load } = useDeferredLoads(
    'handleSubmit',
    handleSubmit
  )

  // console.log('Form', props)
  return (
    <Box className={clsx(className, classes.goodForm, 'goodForm')}>
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
        }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values) => {
          load(values, listId, subscriberType)
        }}
      >
        {isResolved ? (
          <Typography className={classes.thankYou}>{strings.thankYou}</Typography>
        ) : (
          <Form>
            <TextInput className={`${classes.input} input`} name="email" label="Email*" />
            <SubmitButton>
              {isPending || isReloading
                ? strings.submitButtonSubmitting
                : isResolved
                ? strings.thankYou
                : strings.submitButton}
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default GoodForm

GoodForm.propTypes = {}
