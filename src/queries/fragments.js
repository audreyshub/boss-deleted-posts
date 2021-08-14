import { graphql } from 'gatsby'

export const productQuery = graphql`
  fragment Product on ShopifyProduct {
    collections {
      handle
    }
    createdAt
    description
    descriptionHtml
    fields {
      shopifyThemePath
    }
    handle
    hasOnlyDefaultVariant
    metafields {
      value
      namespace
      key
    }
    priceRangeV2 {
      maxVariantPrice {
        amount
      }
      minVariantPrice {
        amount
      }
    }
    options {
      name
      values
      position
      id
    }
    productType
    publishedAt
    seo {
      title
      description
    }
    shopifyId
    status
    storefrontId
    tags
    title
    totalInventory
    tracksInventory
    vendor
  }
`
/**
 * ============================================================================
 * Product Variant
 *
 * inventoryPolicy
 *  - CONTINUE -> Continue selling a product variant when it is out of stock.
 *  - DENY -> Stop selling a product variant when it is out of stock.
 *
 * ============================================================================
 */
export const variantsQuery = graphql`
  fragment Variants on ShopifyProduct {
    variants {
      availableForSale
      compareAtPrice
      inventoryQuantity
      inventoryPolicy
      position
      price
      productId
      storefrontId
      shopifyId
      sku
      taxable
      title
      weight
      weightUnit
      updatedAt
      displayName
      createdAt
      product {
        shopifyId
        storefrontId
        title
        handle
      }
      selectedOptions {
        name
        value
      }
    }
  }
`

export const productReviewsQuery = graphql`
  fragment ProductReviews on ShopifyProduct {
    reviews {
      author
      avatar
      images {
        altText
        imgixImage {
          gatsbyImageData(imgixParams: { auto: "format, compress" })
        }
      }
      location
      reviewMessage
      reviewRating
      reviewTitle
      reviewUserPhotos
      reviewDate
    }
  }
`

export const allReviewsQuery = graphql`
  fragment AllProductReviews on Query {
    allStampedProductReview {
      nodes {
        author
        avatar
        images {
          altText
          imgixImage {
            gatsbyImageData(imgixParams: { auto: "format, compress" })
          }
        }
        location
        reviewMessage
        reviewRating
        reviewTitle
        reviewUserPhotos
        reviewDate
      }
    }
  }
`

export const collectionQuery = graphql`
  fragment Collection on ShopifyCollection {
    description
    descriptionHtml
    fields {
      shopifyThemePath
    }
    handle
    metafields {
      value
      namespace
      key
    }
    productsCount
    seo {
      title
      description
    }
    shopifyId
    sortOrder
    storefrontId
    title
    updatedAt
  }
`

export const siteConfigQuery = graphql`
  fragment SiteConfig on Query {
    site {
      siteMetadata {
        title
        description
        gsConfig {
          storeName
          useImgix
          locales
          currency
          googleAnalyticsId
          postsPerBlogPage
          productsPerCollectionPage
          socialNetworks
          storeDescription
        }
      }
    }
  }
`
