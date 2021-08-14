import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

// Components
import { Image } from '../image'

// Utilities
import linkResolver from '../../utilities/linkResolver'

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  collectionCard: {
    display: 'grid',
    gap: theme.spacing(3),
    padding: theme.spacing(4),
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 8px 32px rgba(0, 77, 112, 0.06)',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing(8),
    },
  },
  image: {
    [theme.breakpoints.up('sm')]: {
      order: 1,
    },
  },
  inner: {
    display: 'grid',
    gap: theme.spacing(3),
    gridTemplateRows: 'auto auto 56px',
  },
  title: {
    lineHeight: 1,
    [theme.breakpoints.up('sm')]: {
      alignSelf: 'end',
    },
  },
  button: {
    [theme.breakpoints.up('sm')]: {
      width: 'max-content',
    },
  },
}))

const CollectionCard = (props) => {
  const classes = useStyles()

  return (
    <Box className={classes.collectionCard}>
      <Image wrapperClassName={classes.image} image={props.image} alt={props.image.alt} />

      <Box className={classes.inner}>
        <Typography className={classes.title} variant="h3">
          {props.title}
        </Typography>
        <Typography variant="h5" component="p">
          {props.content}
        </Typography>
        <Button
          className={classes.button}
          component={GatsbyLink}
          to={linkResolver({ uid: props.handle, type: 'collection' })}
          variant="contained"
          color="primary"
        >
          {props.label}
        </Button>
      </Box>
    </Box>
  )
}

export default CollectionCard

CollectionCard.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  content: PropTypes.string,
  label: PropTypes.string,
  handle: PropTypes.string,
}

CollectionCard.defaultProps = {
  label: strings.label,
}
