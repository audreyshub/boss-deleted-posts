import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

// Components
import { Image } from '../image'

// Styles
const useStyles = makeStyles((theme) => ({
  heroIndex: {
    position: 'relative',
    height: '400px',
    marginBottom: theme.spacing(6),
    backgroundColor: theme.palette.common.black,
    [theme.breakpoints.up('sm')]: {
      height: '560px',
    },
    [theme.breakpoints.up('md')]: {
      height: '635px',
      marginBottom: theme.spacing(20),
    },
  },
  container: {
    position: 'relative',
    display: 'grid',
    gap: theme.spacing(2),
    height: '100%',
    gridTemplateRows: '1fr auto 45px auto',
    color: theme.palette.common.white,
    [theme.breakpoints.up('sm')]: {
      gap: theme.spacing(4),
    },
  },
  title: {
    alignSelf: 'end',
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h1,
    },
  },
  subtitle: {
    lineHeight: 1.4,
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h3,
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '75%',
    },
  },
  button: {
    [theme.breakpoints.up('sm')]: {
      width: 'max-content',
    },
  },
  content: {
    padding: theme.spacing(2, 4),
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 8px 32px rgba(0, 77, 112, 0.06)',
    color: theme.palette.secondary.main,
    textAlign: 'center',
    transform: 'translateY(50%)',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(5, 4),
    },
  },
  slogan: {
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h3,
    },
    [theme.breakpoints.up('md')]: {
      ...theme.typography.h2,
    },
  },
  image: {
    position: 'absolute !important',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    opacity: 0.4,
  },
}))

const HeroIndex = (props) => {
  // console.log('👾 HeroIndex > ', props)

  const classes = useStyles()

  const title = props.title.replace(' | ', '<br/>')

  return (
    <Box className={`${classes.heroIndex} ${props.styles}`} style={{ marginTop: 0 }}>
      <Image wrapperClassName={classes.image} image={props.image} alt={props.image.alt} />

      <Container className={classes.container}>
        <Typography
          className={classes.title}
          variant="h2"
          component="h2"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <Typography className={classes.subtitle} variant="subtitle1" component="p">
          {props.subtitle}
        </Typography>

        <Button
          className={classes.button}
          component={GatsbyLink}
          variant="contained"
          color="primary"
          to={props.link}
        >
          {props.label}
        </Button>

        <Box className={classes.content}>
          <Typography className={classes.slogan} variant="h4" component="p">
            {props.slogan}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default HeroIndex

export const heroIndexFields = graphql`
  fragment heroIndexFields on PrismicHomepageHeroGroupType {
    title
    subtitle
    label
    slogan
    type
    handle
    image {
      alt
      url
      imgixImage {
        gatsbyImageData(width: 1000, imgixParams: { auto: "format, compress" })
      }
    }
  }
`

HeroIndex.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  handle: PropTypes.string,
  slogan: PropTypes.string,
  image: PropTypes.object,
}

HeroIndex.defaultProps = {}
