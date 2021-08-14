import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import SvgIcon from '@material-ui/core/SvgIcon'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import FormLabel from '@material-ui/core/FormLabel'

// Language
import strings from './strings.json'

const useStyles = makeStyles((theme) => ({
  productCounter: {
    border: `1px solid ${theme.palette.secondary.main}`,
    display: 'flex',
    width: '150px',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '8px',
    padding: theme.spacing(1),
  },
  change: {
    padding: '0.25rem',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    '&:active, &:focus': {
      outline: 'none',
    },
  },
  number: {
    textAlign: 'center',
    fontWeight: 600,
  },
  label: {
    fontWeight: 600,
  },
}))

const ProductCounter = (props) => {
  const classes = useStyles()

  return (
    <>
      {props.label && (
        <FormLabel className={classes.label} aria-label={strings.label} component="legend">
          {strings.label}
        </FormLabel>
      )}
      <Box className={`${props.styles} ${classes.productCounter}`}>
        <SvgIcon
          className={classes.change}
          component={RemoveIcon}
          aria-label={strings.ariaDecreaseButton}
          onClick={props.decreaseQuantity}
        />
        <Box className={classes.number} component="span">
          {props.currentQuantity}
        </Box>
        <SvgIcon
          className={classes.change}
          component={AddIcon}
          aria-label={strings.ariaIncreaseButton}
          onClick={props.increaseQuantity}
        />
      </Box>
    </>
  )
}

export default ProductCounter
