import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import SvgIcon from '@material-ui/core/SvgIcon'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

// Components

// Data
import { data } from './data'

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  goals: {
    backgroundColor: theme.palette.secondary.light,
    padding: theme.spacing(5, 0),
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(10, 0),
    },
  },
  container: {},
  heading: {
    marginBottom: theme.spacing(5),
    width: '740px',
    maxWidth: '100%',
    margin: '0 auto',
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(7),
    },
  },
  cards: {
    [theme.breakpoints.up('sm')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gridGap: theme.spacing(5),
    },
  },
  card: {
    borderRadius: '8px',
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    textAlign: 'center',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      marginBottom: 0,
    },
    '& h3': {
      marginBottom: theme.spacing(2),
      lineHeight: '2rem',
    },
  },
  iconWrapper: {
    backgroundColor: 'white',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: theme.spacing(3),
  },
  icon: {
    width: '40px',
    height: '40px',
  },
}))

const Goals = (props) => {
  const theme = useTheme()
  const classes = useStyles(props)

  const { cards, heading } = data

  // console.log('Goals', props)
  return (
    <Box className={`${props.styles} ${classes.goals}`}>
      <Container className={classes.container} maxWidth="lg">
        <Typography className={classes.heading} component="h2" variant="h2">
          {heading}
        </Typography>
        <Box className={classes.cards}>
          {cards &&
            cards.length > 0 &&
            cards.map((card, i) => {
              return (
                <Box className={classes.card} key={i}>
                  <Box className={classes.iconWrapper}>
                    <SvgIcon className={classes.icon} component={card.icon} color="secondary" />
                  </Box>
                  <Typography component="h3" variant="h3">
                    {card.title}
                  </Typography>
                  <Typography>{card.subtitle}</Typography>
                </Box>
              )
            })}
        </Box>
      </Container>
    </Box>
  )
}

export default Goals

Goals.propTypes = {}

//export const query = graphql`
// fragment Goals on <node type here> {

// }
// `
