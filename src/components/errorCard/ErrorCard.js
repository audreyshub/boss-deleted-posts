import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

// Icons
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

// Styles
const useStyles = makeStyles((theme) => ({
  errorCard: {
    display: 'grid',
    gap: theme.spacing(3),
    maxWidth: '792px',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
		backgroundColor: theme.palette.common.white,
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'center',
      border: `1px solid ${theme.palette.grey[200]}`,
      borderRadius: '24px',
      boxShadow: '0px 8px 32px rgba(0, 77, 112, 0.06)',
    },
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h1,
    },
  },
  code: {
    fontSize: '112px',
    lineHeight: 1,
    [theme.breakpoints.up('sm')]: {
      fontSize: '208px',
    },
  },
  button: {
    [theme.breakpoints.up('sm')]: {
      justifySelf: 'center',
      width: 'max-content',
    },
  },
}))

const ErrorCard = (props) => {
  const classes = useStyles()

  return (
    <Container className={`${props.styles} ${classes.errorCard}`}>
      <Typography className={classes.code} variant="h1" component="span">
        {props.code}
      </Typography>
      <Typography className={classes.title} variant="h2" component="h2">
        {props.title}
      </Typography>
      <Typography variant="h4" component="p">
        {props.message}
      </Typography>

      {props.label && props.link && (
        <Button
          className={classes.button}
          component={GatsbyLink}
          variant="outlined"
          color="secondary"
          to={props.link}
          startIcon={<ArrowBackIcon />}
        >
          {props.label}
        </Button>
      )}
    </Container>
  )
}

export default ErrorCard

ErrorCard.propTypes = {
  code: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  label: PropTypes.string,
  link: PropTypes.string,
}
