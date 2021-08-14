import React from 'react'
import PropTypes from 'prop-types'
import { Date } from 'prismic-reactjs'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

// Components
import { Image } from '../image'

//L18n
import strings from './data/strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  heroArticle: {
    position: 'relative',
    display: 'grid',
    gridTemplateRows: '1fr auto',
    gap: theme.spacing(1),
    minHeight: '384px',
    marginBottom: theme.spacing(4),
		padding: theme.spacing(3),
    backgroundColor: theme.palette.common.black,
    borderRadius: '16px',
    color: theme.palette.common.white,
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      minHeight: '632px',
      padding: theme.spacing(3),
    },
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  title: {
    position: 'relative',
    alignSelf: 'end',
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h2,
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '48ch',
    },
  },
  meta: {
    position: 'relative',
  },
}))

const HeroArticle = (props) => {
  const classes = useStyles()

	const date = Date(props.date)
	const formattedDate = Intl.DateTimeFormat('en-US',{
		year: 'numeric',
		month: 'long',
		day: '2-digit' }).format(date)

  return (
    <Container className={classes.heroArticle}>
      <Image wrapperStyle={{ position: 'absolute' }} wrapperClassName={classes.image} image={props.image} alt={props.title} />

      <Typography className={classes.title} variant="h3" component="h1">
        {props.title}
      </Typography>
      <Typography className={classes.meta}>
        {formattedDate} • {props.duration} {strings.duration}
      </Typography>
    </Container>
  )
}

export default HeroArticle

HeroArticle.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
}
