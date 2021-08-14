import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SvgIcon from '@material-ui/core/SvgIcon'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

// Styles
const useStyles = makeStyles((theme) => ({
  arrow: {
    padding: 0,
    border: 'none',
    position: 'absolute',
    top: '50%',
    cursor: 'pointer',
    zIndex: 2,
    width: '64px',
    height: '64px',
    minWidth: 'auto',
    borderRadius: '50%',
    boxShadow: '0px 0px 40px rgba(0, 77, 112, 0.12)',
    [theme.breakpoints.up('md')]: {
      width: (props) => (props.isFloatingCart ? '48px' : '64px'),
      height: (props) => (props.isFloatingCart ? '48px' : '64px'),
    },
    '& svg': {
      strokeWidth: 3,
      display: 'block',
      height: 'auto',
      width: '1rem',
      stroke: 'currentColor',
      [theme.breakpoints.up('md')]: {
        strokeWidth: 1,
      },
    },
    '&:active, &:focus': {
      outline: 'none',
    },
  },
  arrowLeft: {
    left: '10px',
    transform: 'translateY(-50%) rotate(180deg)',
    [theme.breakpoints.up('md')]: {
      left: (props) => (props.isFloatingCart ? '-20px' : '-30px'),
    },
  },
  arrowRight: {
    right: '10px',
    transform: 'translateY(-50%)',
    [theme.breakpoints.up('md')]: {
      right: (props) => (props.isFloatingCart ? '-20px' : '-30px'),
    },
  },
  disabled: {
    color: theme.palette.grey[500],
  },
}))

const Arrow = (props) => {
  const classes = useStyles()
  const theme = useTheme()
  return (
    <Button
      className={`${classes.arrow} ${props.styles} ${
        props.direction === 'right'
          ? `${classes.arrowRight} arrow arrowRight`
          : `${classes.arrowLeft} arrow arrowLeft`
      } ${props.inactive && classes.disabled}`}
      onClick={props.onClick}
      color="secondary"
      aria-label={props.direction === 'right' ? 'move carousel right' : 'move carousel left'}
    >
      <SvgIcon
        component={props.svgComponent ? props.svgComponent : ArrowForwardIcon}
        viewBox={props.viewbox && props.viewbox}
        color="inherit"
        // viewBox="0 0 49 34"
      />
    </Button>
  )
}

export default Arrow
