import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

// Components
import { Image } from '../image'
import ProductRating from '../../components/productRating'

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  hero: {
    position: 'relative',
    minHeight: '400px',
    backgroundColor: theme.palette.common.black,
    [theme.breakpoints.up('sm')]: {
      minHeight: '560px',
    },
    [theme.breakpoints.up('md')]: {
      minHeight: '635px',
    },
    '& .rating': {
      color: theme.palette.common.white,
    },
  },
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: theme.spacing(2),
    minHeight: '400px',
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    color: theme.palette.common.white,
    [theme.breakpoints.up('sm')]: {
      gap: theme.spacing(4),
      minHeight: '560px',
    },
    [theme.breakpoints.up('md')]: {
      minHeight: '635px',
    },
  },
  overline: {
    width: 'max-content',
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h1,
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '70%',
    },
  },
  subtitle: {
    fontWeight: 600,
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h3,
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '50%',
    },
  },
  content: {
    [theme.breakpoints.up('md')]: {
      maxWidth: '60ch',
    },
  },
  buttonWrapper: {
    display: 'grid',
    gap: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto auto auto',
      justifyContent: 'start',
    },
  },
  button: {
    [theme.breakpoints.up('sm')]: {
      width: 'max-content',
    },
  },
  loginButton: {
    borderColor: theme.palette.common.white,
    color: theme.palette.common.white,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    opacity: 0.4,
  },
}))

const Hero = (props) => {
  // console.log('👾 Hero > ', props)

  const classes = useStyles()

  const {
    content,
    image,
    imageAlt,
    overline,
    subtitle,
    label,
    link,
    reviews,
    register,
    login,
    styles,
  } = props
  let { title } = props

  title = title.replace(' | ', '<br />')

  return (
    <Box className={`${styles} ${classes.hero} hero`}>
      <Image
        wrapperStyle={{ position: 'absolute' }}
        wrapperClassName={classes.image}
        image={image}
        alt={imageAlt ? imageAlt : 'temp alt text'}
      />

      <Container className={classes.container}>
        {overline && (
          <Typography className={classes.overline} color="secondary">
            {overline}
          </Typography>
        )}
        {title && (
          <Typography
            className={classes.title}
            variant="h2"
            component="h2"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {subtitle && (
          <Typography className={classes.subtitle} variant="subtitle1" component="p">
            {subtitle}
          </Typography>
        )}

        {reviews && <ProductRating reviews={reviews} showCount />}

        {content && <Typography className={classes.content}>{content}</Typography>}

        {link || register || login ? (
          <Box className={classes.buttonWrapper}>
            {label && (
              <Button
                className={classes.button}
                component={GatsbyLink}
                variant="contained"
                color="primary"
                to={link}
              >
                {label}
              </Button>
            )}
            {register && (
              <Button
                className={classes.button}
                component={GatsbyLink}
                variant="contained"
                color="primary"
                to="/account/register"
              >
                {strings.registerLabel}
              </Button>
            )}
            {login && (
              <Button
                className={classes.loginButton}
                component={GatsbyLink}
                variant="outlined"
                to="/account/login"
              >
                {strings.loginLabel}
              </Button>
            )}
          </Box>
        ) : null}
      </Container>
    </Box>
  )
}

export default Hero

Hero.propTypes = {
  image: PropTypes.object,
  overline: PropTypes.string,
  title: PropTypes.string.isRequired,
  reviews: PropTypes.array,
  subtitle: PropTypes.string,
  content: PropTypes.string,
  label: PropTypes.string,
  link: PropTypes.string,
  login: PropTypes.bool,
  register: PropTypes.bool,
}
Hero.defaultProps = {
  login: false,
  register: false,
  overline: null,
}
