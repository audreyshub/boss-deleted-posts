import React from 'react'
import { graphql } from 'gatsby'

// Components
import HomePage from './HomePage'

const HomePageIndex = (props) => {
  return <HomePage {...props} />
}

export default HomePageIndex

export const query = graphql`
  query ($handles: [String]) {
    prismicHomepage {
      data {
        hero {
          ...heroIndexFields
        }
        featured_collections {
          ...featuredCollectionsFields
        }
        cta {
          ...ctaFields
        }
        cta_items {
          ...ctaItemsFields
        }
        featured_products {
          handle
        }
        callout {
          ...contentCalloutFields
        }
        how_it_works {
          ...contentWithVideoFields
        }
        instagram {
          ...instagramFields
        }
        instagram_items {
          ...instagramItemsFields
        }
        newsletter {
          ...newsletterIndexFields
        }
        testimonial_title
        testimonial_items {
          name
          content {
            text
          }
        }
      }
    }
    FeaturedProducts: allShopifyProduct(filter: { handle: { in: $handles } }) {
      nodes {
        ...Product
        ...Variants
        ...ProductReviews
        featuredImage {
          alt: altText
          imgixImage {
            gatsbyImageData(height: 620, width: 620, imgixParams: { auto: "format, compress" })
          }
        }
      }
    }
    prismicSiteSettings {
      data {
        instagram {
          url
        }
      }
    }
  }
`
