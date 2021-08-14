import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

// Components
import { Image } from '../image'

// Data
import data from './data.js'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gap: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 8px 32px rgba(0, 77, 112, 0.06)',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      gap: theme.spacing(5),
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: '1fr 640px',
    },
  },
  inner: {
    display: 'grid',
    gap: theme.spacing(2),
    padding: theme.spacing(0, 2, 2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 6, 6),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 6),
    },
  },
  imageWrapper: {
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
  },
  image: {
    height: 0,
    paddingTop: '256px',
    [theme.breakpoints.up('sm')]: {
      paddingTop: '320px',
    },
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h2,
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '22ch',
    },
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: theme.palette.error.light,
    color: theme.palette.common.white,
    padding: theme.spacing(2, 7),
    borderRadius: '8px',
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.only('xs')]: {
      left: 0,
      width: '100%',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    [theme.breakpoints.up('sm')]: {
      left: theme.spacing(6),
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      left: theme.spacing(3),
    },
  },
  button: {
    [theme.breakpoints.up('sm')]: {
      width: 'max-content',
    },
  },
}))

const BundleCard = (props) => {
  const images = useStaticQuery(graphql`
    {
      allFile(filter: { relativeDirectory: { eq: "bundleCard/images" } }) {
        nodes {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
    }
  `)

  const classes = useStyles()

  const {
    badge_label,
    button_label,
    button_link: { uid: pageHandle },
    content,
    image,
    title,
  } = props.data

  // console.log('👾 BundleCard', props)
  return (
    <Box className={props.styles}>
      <Container>
        <Box className={classes.root}>
          <Box className={classes.imageWrapper}>
            <Image wrapperClassName={classes.image} image={image} alt="Bundle" />
            {badge_label && <Box className={classes.badge}>{badge_label}</Box>}
          </Box>
          <Box className={classes.inner}>
            <Typography className={classes.title} variant="h4" component="h4">
              {title}
            </Typography>

            {content && <Box className={classes.content}>{content}</Box>}

            <Button
              className={classes.button}
              component={GatsbyLink}
              to={`/${pageHandle}`}
              variant="contained"
              color="primary"
            >
              {button_label}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default BundleCard

BundleCard.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  content: PropTypes.string,
  badge: PropTypes.string,
}

export const bundleCard = graphql`
  fragment bundleCard on PrismicProductBundleCalloutGroupType {
    badge_label
    button_label
    title
    button_link {
      uid
      type
    }
    content
    image {
      imgixImage {
        gatsbyImageData(width: 620, imgixParams: { auto: "format, compress" })
      }
    }
  }
`
