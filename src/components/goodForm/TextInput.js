import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { useField } from 'formik'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

// Styles
const useStyles = makeStyles((theme) => ({
  textField: {
    position: 'relative',
    '& .MuiFormHelperText-root': {
      backgroundColor: theme.palette.primary.main,
      border: `1px solid black`,
      padding: theme.spacing(0.5, 1),
      borderRadius: '3px',
      position: 'relative',
      width: 'fit-content',
      position: 'absolute',
      left: '5px',
      bottom: 0,
      transform: 'translateY(85%)',
      color: 'black',
      zIndex: 2,
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: '9px',
        bottom: '100%',
        width: '0',
        height: '0',
        border: '10px solid transparent',
        borderBottomColor: 'black',
      },
      '&:after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: '9px',
        bottom: '99%',
        width: '0',
        height: '0',
        border: '10px solid transparent',
        borderBottomColor: theme.palette.primary.main,
      },
    },
  },
}))

const TextInput = (props) => {
  const classes = useStyles(props)
  const { name, label, className, ...otherProps } = props
  const [field, mata] = useField(name)

  const configTextfield = {
    ...field,
    ...otherProps,
    placeholder: label,
    fullWidth: true,
  }

  if (mata && mata.touched && mata.error) {
    configTextfield.error = true
    configTextfield.helperText = mata.error
  }

  return (
    <TextField className={clsx(className, classes.textField, 'textField')} {...configTextfield} />
  )
}

export default TextInput

TextInput.propTypes = {}
