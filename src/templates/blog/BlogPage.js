import React from 'react'
import PropTypes from 'prop-types'
import Container from '@material-ui/core/Container'

// Components
import Hero from '../../components/hero'
import PopularPosts from '../../components/popularPosts'
import PostGrid from '../../components/postGrid'
import Pagination from '../../components/pagination'

// Utilities
import linkResolver from '../../utilities/linkResolver'

// L18n
import strings from './strings.json'

const BlogPage = (props) => {
  // console.log('👾 BlogPage > ', props)

  const data = props.data.hero.nodes[0]
  const hero = {
    image: data.data.image,
    overline: strings.overline,
    title: data.data.title,
    label: strings.label,
    link: linkResolver({ uid: data.uid, type: data.type }),
  }
  const popularPosts = props.data.popular.nodes
  const allPosts = props.data.posts.nodes

  return (
    <>
      <Hero {...hero} />
      <PopularPosts posts={popularPosts} />
      <PostGrid posts={allPosts} />
      <Container>
        <Pagination
          shopifyThemePath="/blog"
          numPages={props.pageContext.numPages}
          currentPage={props.pageContext.currentPage}
        />
      </Container>
    </>
  )
}

export default BlogPage

BlogPage.propTypes = {}
BlogPage.defaultProps = {}
