import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { RichText } from 'prismic-reactjs'
import Container from '@material-ui/core/Container'

// Components
import PostBreadcrumbs from '../../components/breadcrumbs/postBreadcrumbs'
import HeroArticle from '../../components/heroArticle'
import Share from '../../components/share'
import RelatedPosts from '../../components/relatedPosts'
import NewsletterPrimary from '../../components/newsletterPrimary'

// Strings
import strings from './strings'

// Styles
const useStyles = makeStyles((theme) => ({
  newsletter: {
    marginTop: theme.spacing(8),
    [theme.breakpoints.only('xs')]: {
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2),
    },
  },
  content: {
    '& img': {
      maxWidth: '100%',
    },
  },
}))

const PostPage = (props) => {
  // console.log('👾 PostPage > ', props)

  const { title, image, content } = props.data.post.nodes[0].data

  const hero = {
    title: title,
    image: image,
    date: props.data.post.nodes[0].first_publication_date,
    duration: 5,
  }

  const related = props.data.related.nodes

  const classes = useStyles()

  return (
    <>
      <PostBreadcrumbs postTitle={title} />
      <Container>
        <HeroArticle {...hero} />
      </Container>
      <Container className={classes.content} maxWidth="md">
        <RichText render={content.raw} />
        <Share title={strings.shareTitle} link={props.location.href} />
      </Container>
      <Container>
        <RelatedPosts title={strings.relatedPostsTitle} posts={related} />
        <NewsletterPrimary styles={classes.newsletter} />
      </Container>
    </>
  )
}

export default PostPage

PostPage.propTypes = {}
PostPage.defaultProps = {}
