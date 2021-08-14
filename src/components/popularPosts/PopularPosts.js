import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

// Components
import Carousel from '../../components/carousel'
import PostCard from '../../components/postCard'

// Utilities
import linkResolver from '../../utilities/linkResolver'

// Strings
import strings from './strings'

// Styles
const useStyles = makeStyles((theme) => ({
  popularPosts: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(4),
  },
}))

const PopularPosts = (props) => {
  const classes = useStyles()

  return (
    <>
      <Container className={classes.popularPosts}>
        <Typography variant="h2">{strings.title}</Typography>
      </Container>
      <Carousel
        initialSlide={3}
        useArrows={false}
        centeredSlides={true}
        containerMaxWidth="100%"
        activateCarouselWidth="1126"
        xsSlideWidth="280px"
        mdSlideWidth="456px"
        freeMode={false}
        propsByBreakpoint={{ spaceBetween: { 0: 14, 960: 24 } }}
        loop={true}
      >
        {props.posts.map((post, i) => {
          const card = {
            image: post.data.image,
            title: post.data.title,
            label: strings.label,
            link: linkResolver({ uid: post.uid, type: post.type }),
            excerpt: post.data.excerpt,
            content: post.data.content.text,
          }
          return <PostCard key={i} {...card} />
        })}
      </Carousel>
    </>
  )
}

export default PopularPosts

PopularPosts.propTypes = {}
