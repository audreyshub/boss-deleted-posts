import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import scrollTo from 'gatsby-plugin-smoothscroll'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

// Components
import Card from './Card'

// Styles
const useStyles = makeStyles((theme) => ({
  ctaIndex: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    backgroundColor: 'hsla(195, 73%, 96%, 1)',
  },
  container: {
    display: 'grid',
    gap: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      gap: theme.spacing(5),
    },
  },
  title: {
    ...theme.typography.h3,
    [theme.breakpoints.up('md')]: {
      ...theme.typography.h2,
    },
  },
  grid: {
    position: 'relative',
    display: 'grid',
    gap: theme.spacing(3),
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '50%',
      width: '1px',
      border: `1px dashed ${theme.palette.secondary.main}`,
      [theme.breakpoints.up('md')]: {
        top: '50%',
        bottom: 'initial',
        left: 0,
        height: '1px',
        width: '100%',
      },
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  },
  button: {
    [theme.breakpoints.up('sm')]: {
      justifySelf: 'center',
      width: '400px',
    },
  },
}))

const CtaIndex = (props) => {
  // console.log('👾 CtaIndex > ', props)
  const classes = useStyles()

  const { styles, title, items, link, label, metafields } = props

  return (
    <Box className={`${styles} ${classes.ctaIndex}`}>
      <Container className={classes.container}>
        <Typography className={classes.title} component="h3">
          {title}
        </Typography>
        <Box className={classes.grid}>
          {items && items.map((item, i) => <Card key={i} {...item} />)}
        </Box>
        {link && label && (
          <Button
            onClick={() => scrollTo(link)}
            className={classes.button}
            variant="outlined"
            color="secondary"
          >
            {label}
          </Button>
        )}
      </Container>
    </Box>
  )
}

export default CtaIndex

export const ctaFields = graphql`
  fragment ctaFields on PrismicHomepageCtaGroupType {
    label
    title
  }
`

export const ctaItemsFields = graphql`
  fragment ctaItemsFields on PrismicHomepageCtaItemsGroupType {
    title
    image {
      alt
      url
      imgixImage {
        gatsbyImageData(width: 350, imgixParams: { auto: "format, compress" })
      }
    }
  }
`

CtaIndex.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  link: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
}
