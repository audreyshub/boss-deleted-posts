import React from 'react'
import { graphql } from 'gatsby'

// Components
import BlogPage from './BlogPage'

const BlogIndex = (props) => {
  // console.log('👾 index > ', props)

  return <BlogPage {...props} />
}

export default BlogIndex

export const blogQuery = graphql`
  query BlogQuery($skip: Int, $limit: Int, $popularIds: [String], $heroId: String) {
    ...SiteConfig
    prismicBlog {
      data {
        share_image {
          imgixImage {
            gatsbyImageData(width: 640)
          }
        }
      }
    }
    hero: allPrismicPost(filter: { uid: { eq: $heroId } }) {
      nodes {
        type
        uid
        first_publication_date
        data {
          title
          content {
            text
          }
          image {
            alt
            imgixImage {
              gatsbyImageData(width: 1440, imgixParams: { auto: "format, compress" })
            }
          }
        }
      }
    }
    popular: allPrismicPost(filter: { uid: { in: $popularIds } }) {
      nodes {
        type
        uid
        first_publication_date
        data {
          title
          excerpt
          content {
            text
          }
          image {
            alt
            imgixImage {
              gatsbyImageData(width: 304, imgixParams: { auto: "format, compress" })
            }
          }
        }
      }
    }
    posts: allPrismicPost(limit: $limit, skip: $skip) {
      nodes {
        type
        uid
        first_publication_date
        data {
          title
          excerpt
          content {
            text
          }
          image {
            alt
            imgixImage {
              gatsbyImageData(width: 304, imgixParams: { auto: "format, compress" })
            }
          }
        }
      }
    }
  }
`
