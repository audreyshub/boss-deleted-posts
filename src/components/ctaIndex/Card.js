import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

// Components
import { Image } from '../image'

// Styles
const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
    display: 'grid',
    gap: theme.spacing(4),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 8px 32px rgba(0, 77, 112, 0.06)',
    textAlign: 'center',
  },
  image: {
    height: 0,
    paddingTop: '256px',
    borderRadius: '8px',
    [theme.breakpoints.up('sm')]: {
      paddingTop: '344px',
    },
    [theme.breakpoints.up('md')]: {
      paddingTop: '250px',
    },
  },
  title: {
    ...theme.typography.h4,
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h3,
    },
  },
}))

const Card = (props) => {
  const classes = useStyles()

  const { image, title } = props

  // console.log('👾 CTA Index Card', props)
  return (
    <Box className={classes.card}>
      <Image wrapperClassName={classes.image} image={image} alt={title} />
      <Typography className={classes.title}>{title}</Typography>
    </Box>
  )
}

export default Card

Card.propTypes = {}
Card.defaultProps = {}
