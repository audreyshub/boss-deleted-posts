import React from 'react'
import Button from '@material-ui/core/Button'
import { useFormikContext } from 'formik'
import { makeStyles } from '@material-ui/core/styles'

// Styles
const useStyles = makeStyles((theme) => ({
  button: {
    cursor: 'pointer',
  },
}))

const SubmitButton = (props) => {
  const classes = useStyles(props)
  const { children, ...otherProps } = props
  const { submitForm } = useFormikContext()

  const handleSubmit = () => {
    submitForm()
  }

  const configButton = {
    variant: 'contained',
    color: 'primary',
    fullWidth: true,
    onClick: handleSubmit,
    ...otherProps,
  }

  return (
    <Button className={classes.button} {...configButton}>
      {children}
    </Button>
  )
}

export default SubmitButton
