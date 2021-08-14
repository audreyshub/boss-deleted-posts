import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

// Components
import CollectionCard from '../collectionCard'

// Styles
const useStyles = makeStyles((theme) => ({
  featuredCollections: {
    display: 'grid',
    gap: theme.spacing(3),
    // paddingTop: theme.spacing(5),
    // paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('md')]: {
      gap: theme.spacing(5),
      gridTemplateColumns: '1fr 1fr',
      // paddingTop: theme.spacing(10),
      // paddingBottom: theme.spacing(15),
    },
    [theme.breakpoints.up('lg')]: {
      // paddingTop: theme.spacing(15),
    },
  },
}))

const FeaturedCollections = (props) => {
  const classes = useStyles()

  return (
    <Container className={`${props.styles} ${classes.featuredCollections}`}>
      {props.items.map((item, i) => (
        <CollectionCard key={i} {...item} />
      ))}
    </Container>
  )
}

export default FeaturedCollections

export const featuredCollectionsFields = graphql`
  fragment featuredCollectionsFields on PrismicHomepageFeaturedCollectionsGroupType {
    title
    content
    handle
    image {
      alt
      url
      imgixImage {
        gatsbyImageData(width: 225, imgixParams: { auto: "format, compress" })
      }
    }
  }
`

FeaturedCollections.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      title: PropTypes.string,
      content: PropTypes.string,
      handle: PropTypes.string,
    })
  ),
}
