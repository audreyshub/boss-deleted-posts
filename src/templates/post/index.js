import React from 'react'
import { graphql } from 'gatsby'

// Components
import PostPage from './PostPage'

const PostIndex = (props) => {
  // console.log('👾 index > ', props)

  return <PostPage {...props} />
}

export default PostIndex

export const postQuery = graphql`
  query PostQuery($uid: String, $relatedPosts: [String]) {
    ...SiteConfig
    post: allPrismicPost(filter: { uid: { eq: $uid } }) {
      nodes {
        data {
          title
          content {
            raw
          }
          image {
            alt
            imgixImage {
              gatsbyImageData(width: 1280, imgixParams: { auto: "format, compress" })
            }
          }
        }
        first_publication_date
        uid
      }
    }
    related: allPrismicPost(filter: { uid: { in: $relatedPosts } }) {
      nodes {
        data {
          title
          content {
            text
          }
          content {
            raw
          }
          image {
            alt
            imgixImage {
              gatsbyImageData(width: 1280, imgixParams: { auto: "format, compress" })
            }
          }
        }
        first_publication_date
        uid
      }
    }
  }
`
