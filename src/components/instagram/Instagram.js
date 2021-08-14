import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

// Components
import Carousel from '../carousel'
import { Image } from '../image'

// Styles
const useStyles = makeStyles((theme) => ({
  instagram: {
    paddingTop: theme.spacing(7),
    paddingBottom: theme.spacing(9),
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(12),
      paddingTop: theme.spacing(14),
    },
  },
  overline: {
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h3,
    },
  },
  title: {
    marginBottom: theme.spacing(6),
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h2,
      marginBottom: theme.spacing(8),
    },
  },
  image: {
    height: 0,
    paddingTop: '256px',
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('sm')]: {
      paddingTop: '312px',
    },
  },
  button: {
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(8),
    },
  },
}))

const Instagram = (props) => {
  // console.log('👾 Instagram > ', props)
  const classes = useStyles()

  const { styles, overline, title, items, label, link } = props

  return (
    <Box className={`${styles} ${classes.instagram}`}>
      <Typography className={classes.overline} component="p" variant="h4">
        {overline}
      </Typography>
      <Typography className={classes.title} component="h4" variant="h3">
        {title}
      </Typography>
      <Carousel
        initialSlide={3}
        useArrows={false}
        centeredSlides={true}
        containerMaxWidth="100%"
        activateCarouselWidth="1126"
        xsSlideWidth="256px"
        mdSlideWidth="312px"
        freeMode={false}
        propsByBreakpoint={{ spaceBetween: { 0: 14, 960: 24 } }}
        loop={true}
      >
        {items.map((item, i) => (
          <Image key={i} wrapperClassName={classes.image} image={item.image} alt={title} />
        ))}
      </Carousel>
      {label && link && (
        <Button className={classes.button} href={link} variant="contained" color="primary">
          {label}
        </Button>
      )}
    </Box>
  )
}

export default Instagram

export const instagramFields = graphql`
  fragment instagramFields on PrismicHomepageInstagramGroupType {
    label
    overline
    title
  }
`

export const instagramItemsFields = graphql`
  fragment instagramItemsFields on PrismicHomepageInstagramItemsGroupType {
    image {
      url
      imgixImage {
        gatsbyImageData(width: 312, height: 312, imgixParams: { auto: "format, compress" })
      }
      alt
    }
  }
`

Instagram.propTypes = {
  overline: PropTypes.string,
  title: PropTypes.string,
  images: PropTypes.array,
  label: PropTypes.string,
  link: PropTypes.string,
}
